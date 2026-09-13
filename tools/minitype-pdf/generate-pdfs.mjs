import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFArray, PDFDict, PDFDocument, PDFName } from "pdf-lib";
import { H, Q, box, color, h1, image, mdFile, minitype, p, page, physical, ratio, rgb, url } from "@minitype/minitype";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const postsDirectory = path.join(root, "_posts");
const outputDirectory = path.join(root, "pdf");
const fontDir = path.join(here, "node_modules/@minitype/minitype/fonts");
const siteUrl = "https://sekika.github.io";

const documentStyle = {
  size: "A4", writingMode: "horizontal", padding: physical(20, 18, 24, 18),
  block: {
    paragraph: { font: "SourceHanSerifJP-Regular", size: Q(10), lineHeight: H(18), firstIndent: Q(10) },
    h1: { font: "SourceHanSerifJP-Bold", size: Q(20), lineHeight: H(28) },
    h2: { font: "SourceHanSerifJP-Bold", size: Q(15), lineHeight: H(22) },
    code: { font: "SourceHanSansJP-Regular", size: Q(9), lineHeight: H(13), highlight: "atom-one-light" },
    image: { align: "center", width: ratio(0.78) }, table: { textStyle: { size: Q(8) } },
  },
  gaps: [["fallback", "fallback", 3], ["paragraph", "h2", 8], ["h2", "paragraph", 4], ["image", "image", 5]],
};

const interactiveTags = new Set(["applet", "button", "canvas", "embed", "form", "iframe", "input", "object", "script", "select", "textarea"]);
const executableLayouts = new Set(["javascript", "javascript-en", "post-js", "post-js-en", "pyodide"]);
const link = (href, body) => color(url(href, body), rgb(0, 82, 155));
const imagePath = (src) => path.join(root, src.replace(/^\//, ""));

function frontMatter(source) {
  const matched = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!matched) throw new Error("YAML front matter is required.");
  const values = new Map();
  let listKey;
  for (const line of matched[1].split(/\r?\n/)) {
    const keyValue = line.match(/^([A-Za-z][\w-]*):\s*(.*?)\s*$/);
    if (!keyValue) {
      const item = listKey && line.match(/^\s*-\s*(.*?)\s*$/);
      if (item) values.set(listKey, `${values.get(listKey)} ${item[1]}`.trim());
      continue;
    }
    const [, key, raw] = keyValue;
    values.set(key, raw.replace(/^(?:"(.*)"|'(.*)')$/, "$1$2"));
    listKey = raw ? undefined : key;
  }
  return { values, body: source.slice(matched[0].length) };
}

function normalizedMarkdown(source) {
  const supported = new Set(["bash", "go", "html", "javascript", "json", "python", "shell", "text"]);
  return source
    .replace(/{%\s*raw\s*%}\r?\n?/gi, "")
    .replace(/{%\s*endraw\s*%}\r?\n?/gi, "")
    .replace(/^(`{3,}|~{3,})([^\s]*)\s*$/gm, (line, fence, language) =>
    language && !supported.has(language.toLowerCase()) ? `${fence}text` : line,
    );
}

function sourceWithoutExamples(body) {
  return body
    .replace(/{%\s*highlight\b[\s\S]*?{%\s*endhighlight\s*%}/gi, "")
    .replace(/(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g, "$1")
    .replace(/`[^`]*`/g, "");
}

function exclusionReason(metadata, body) {
  if (metadata.get("pdf") === "false") return "front matter sets pdf: false";
  if (executableLayouts.has(metadata.get("layout"))) return `layout: ${metadata.get("layout")}`;
  const inspected = sourceWithoutExamples(body);
  for (const match of inspected.matchAll(/<\s*([A-Za-z][\w:-]*)\b[^>]*>/g)) {
    const [, name] = match;
    if (interactiveTags.has(name.toLowerCase())) return `<${name}> outside a code example`;
    if (/\son[a-z]+\s*=/i.test(match[0])) return `event handler in ${match[0]}`;
    if (/\s(?:href|src)\s*=\s*["']?\s*javascript:/i.test(match[0])) return `javascript: URL in ${match[0]}`;
  }
  return null;
}

function postIdentity(file) {
  const matched = path.basename(file).match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.(?:md|markdown)$/i);
  if (!matched) throw new Error("Post filename must begin with YYYY-MM-DD-.");
  const [, year, month, day, slug] = matched;
  return { year, month, day, slug, urlPath: `/${year}/${month}/${day}/${slug}/` };
}

function isEnglish(metadata) {
  const tags = metadata.get("tags") ?? metadata.get("tag") ?? "";
  return /\benglish\b/i.test(tags) || metadata.get("layout") === "post-en";
}

function dateLabel(identity, english) {
  const date = new Date(`${identity.year}-${identity.month}-${identity.day}T00:00:00Z`);
  return english
    ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date)
    : `${identity.year}年${Number(identity.month)}月${Number(identity.day)}日`;
}

function outputFile(identity, metadata) {
  const configured = metadata.get("pdf");
  if (configured && configured !== "true") return path.join(root, configured.replace(/^\//, ""));
  return path.join(outputDirectory, identity.year, identity.month, identity.day, `${identity.slug}.pdf`);
}

async function removeSquareAnnotations(file) {
  const pdf = await PDFDocument.load(await readFile(file));
  for (const pdfPage of pdf.getPages()) {
    const annotsRef = pdfPage.node.get(PDFName.of("Annots"));
    if (!annotsRef) continue;
    const annots = pdf.context.lookup(annotsRef, PDFArray);
    for (let index = annots.size() - 1; index >= 0; index -= 1) {
      const annotation = pdf.context.lookup(annots.get(index), PDFDict);
      if (annotation.get(PDFName.of("Subtype"))?.asString() === "/Square") annots.remove(index);
    }
  }
  await writeFile(file, await pdf.save());
}

async function generate(file) {
  const source = await readFile(file, "utf8");
  const { values: metadata } = frontMatter(source);
  const identity = postIdentity(file);
  const english = isEnglish(metadata);
  const title = metadata.get("title") || identity.slug;
  const sourceUrl = `${siteUrl}${identity.urlPath}`;
  const pdfFile = outputFile(identity, metadata);
  const normalized = normalizedMarkdown(source);
  const markdownFile = normalized === source ? file : path.join(root, "tmp", "pdfs", "normalized", path.basename(file));
  if (markdownFile !== file) {
    await mkdir(path.dirname(markdownFile), { recursive: true });
    await writeFile(markdownFile, normalized);
  }
  const article = await mdFile(markdownFile, { image: (src) => image(imagePath(src)), link: (href, text) => link(href, text) });
  const publication = english
    ? ["Katsutoshi Seki | Published: ", dateLabel(identity, true), " | Source: ", link(sourceUrl, sourceUrl)]
    : ["著者：関 勝寿　公開日：", dateLabel(identity, false), "　ソース：", link(sourceUrl, sourceUrl)];
  const document = minitype([{ body: [
    h1(title, { align: "center", unnumbered: true }),
    p([publication], { align: "right", font: "SourceHanSansJP-Regular", size: Q(9), firstIndent: 0 }),
    box(article.blocks, { columns: 2, columnGap: 7, splitable: true }),
    { type: "flow", position: "page", blockOffset: 283, inlineSize: 210, blocks: [p([[page]], { align: "center", firstIndent: 0, font: "SourceHanSansJP-Regular", size: Q(9) })] },
  ] }], structuredClone(documentStyle), { fontDir, outline: true, metadata: { title, author: "Katsutoshi Seki" } });
  const errors = (await document.getDiagnostics()).filter((diagnostic) => diagnostic.severity === "error");
  if (errors.length) throw new Error(JSON.stringify(errors, null, 2));
  await mkdir(path.dirname(pdfFile), { recursive: true });
  await document.save(pdfFile);
  await removeSquareAnnotations(pdfFile);
  return path.relative(root, pdfFile);
}

async function postFiles() {
  return (await readdir(postsDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /\.m(?:arkdown|d)$/i.test(entry.name))
    .map((entry) => path.join(postsDirectory, entry.name))
    .sort();
}

const arguments_ = process.argv.slice(2);
const includeMissing = arguments_.includes("--missing");
const reportExclusions = arguments_.includes("--list-excluded");
const requested = new Set(arguments_.filter((argument) => argument !== "--missing" && argument !== "--list-excluded").map((file) => path.resolve(root, file)));
if (!includeMissing && !reportExclusions && requested.size === 0) {
  console.error("Usage: node generate-pdfs.mjs --missing [post-file ...]");
  process.exit(2);
}

const failures = [];
let generated = 0;
let excluded = 0;
for (const file of await postFiles()) {
  const source = await readFile(file, "utf8");
  const { values: metadata, body } = frontMatter(source);
  const reason = exclusionReason(metadata, body);
  if (reason) {
    excluded += 1;
    if (reportExclusions) console.log(`${path.relative(root, file)}: ${reason}`);
    continue;
  }
  if (reportExclusions) continue;
  const pdfFile = outputFile(postIdentity(file), metadata);
  const missing = !(await stat(pdfFile).then(() => true).catch(() => false));
  if (!(requested.has(file) || (includeMissing && missing))) continue;
  try {
    console.log(`Generating ${path.relative(root, file)}`);
    console.log(`  -> ${await generate(file)}`);
    generated += 1;
  } catch (error) {
    failures.push(`${path.relative(root, file)}: ${error.message}`);
  }
}

console.log(`PDF generation: ${generated} generated, ${excluded} excluded.`);
if (failures.length) {
  console.error(`Failed PDFs:\n${failures.join("\n")}`);
  process.exit(1);
}
