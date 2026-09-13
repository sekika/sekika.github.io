import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFArray, PDFDict, PDFDocument, PDFName } from "pdf-lib";
import { Resvg } from "@resvg/resvg-js";
import { H, Q, box, color, h1, image, inlineMath, math, mdFile, minitype, p, page, physical, ratio, rgb, sub, sup, url } from "@minitype/minitype";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const postsDirectory = path.join(root, "_posts");
const outputDirectory = path.join(root, "pdf");
const fontDir = path.join(here, "node_modules/@minitype/minitype/fonts");
const siteUrl = "https://sekika.github.io";
const serifFont = {
  default: { font: "SourceHanSerifJP-Regular" },
  latin: { font: "NOTONOTO35HS-Regular" },
};
const sansFont = {
  default: { font: "SourceHanSansJP-Regular" },
  latin: { font: "NOTONOTO35HS-Regular" },
};

const documentStyle = {
  size: "A4", writingMode: "horizontal", padding: physical(20, 18, 24, 18),
  block: {
    paragraph: { font: serifFont, size: Q(10), lineHeight: H(18), firstIndent: Q(10) },
    h1: { font: "SourceHanSerifJP-Bold", size: Q(20), lineHeight: H(28) },
    h2: { font: "SourceHanSerifJP-Bold", size: Q(15), lineHeight: H(22) },
    code: { font: sansFont, size: Q(9), lineHeight: H(13), highlight: "atom-one-light" },
    image: { align: "center", width: ratio(0.78) }, table: { textStyle: { size: Q(8) } },
  },
  gaps: [["fallback", "fallback", 3], ["paragraph", "h2", 8], ["h2", "paragraph", 4], ["image", "image", 5]],
};

const interactiveTags = new Set(["applet", "button", "canvas", "embed", "form", "iframe", "input", "object", "script", "select", "textarea"]);
const executableLayouts = new Set(["javascript", "javascript-en", "post-js", "post-js-en", "pyodide"]);
const link = (href, body) => color(url(href, typeof body === "string" ? replaceInlineHtmlString(body) : body), rgb(0, 82, 155));
const imagePath = (src) => {
  const resolved = path.resolve(root, src.replace(/^\//, ""));
  if (!resolved.startsWith(`${root}${path.sep}`)) throw new Error(`Image is outside the repository: ${src}`);
  return resolved;
};

function pdfImage(src) {
  const source = imagePath(src);
  if (path.extname(source).toLowerCase() !== ".svg") return image(source);
  const name = createHash("sha256").update(source).digest("hex").slice(0, 16);
  const rasterized = path.join(root, "tmp", "pdfs", "rasterized-svg", `${name}.png`);
  if (!existsSync(rasterized)) {
    mkdirSync(path.dirname(rasterized), { recursive: true });
    const png = new Resvg(readFileSync(source), { fitTo: { mode: "width", value: 1600 } }).render().asPng();
    writeFileSync(rasterized, png);
  }
  return image(rasterized);
}

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

function stripUnsupportedControlCharacters(source) {
  return source.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

function expandCodeTabs(source, tabWidth = 4) {
  let fence;
  let inHighlight = false;
  return source.split(/(\r?\n)/).map((part) => {
    if (/^{%\s*highlight\b/i.test(part)) inHighlight = true;
    if (/^{%\s*endhighlight\s*%}/i.test(part)) inHighlight = false;
    const fenceMatch = part.match(/^\s*(`{3,}|~{3,})/);
    const inCode = Boolean(fence) || inHighlight || /^\t/.test(part);
    const expanded = inCode
      ? part.replace(/\t/g, (_tab, index) => " ".repeat(tabWidth - (index % tabWidth)))
      : part;
    if (fenceMatch) {
      if (fence && fenceMatch[1][0] === fence) fence = undefined;
      else if (!fence) fence = fenceMatch[1][0];
    }
    return expanded;
  }).join("");
}

function htmlAttribute(attributes, name) {
  const match = attributes.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>\\x60]+))`, "i"));
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? "";
}

function isRepositoryImage(src) {
  if (!src || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(src)) return false;
  const resolved = path.resolve(root, src.replace(/^\//, ""));
  return resolved.startsWith(`${root}${path.sep}`);
}

function markdownLinkLabel(text) {
  return text.trim().replace(/[\\[\\]\\\\]/g, "\\\\$&");
}

function markdownLinkTarget(href) {
  return href.trim().replace(/[()\\]/g, "\\\\$&");
}

function htmlInlineMarker(tag, text) {
  return `@@MINITYPE${tag.toUpperCase()}${Buffer.from(text.replace(/<[^>]*>/g, ""), "utf8").toString("base64url")}@@`;
}

function replaceInlineHtmlString(value) {
  return value.split(/@@MINITYPE(SUB|SUP)([A-Za-z0-9_-]+)@@/).flatMap((part, index, parts) => {
    if (index % 3 === 0) return part ? [part] : [];
    if (index % 3 === 1) return [];
    const text = Buffer.from(part, "base64url").toString("utf8");
    return [parts[index - 1] === "SUB" ? sub(text) : sup(text)];
  });
}

function replaceSupportedHtmlOutsideExamples(source) {
  let fence;
  let inHighlight = false;
  return source.split(/(\r?\n)/).map((part) => {
    if (/^{%\s*highlight\b/i.test(part)) inHighlight = true;
    if (/^{%\s*endhighlight\s*%}/i.test(part)) inHighlight = false;
    const fenceMatch = part.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      if (fence && fenceMatch[1][0] === fence) fence = undefined;
      else if (!fence) fence = fenceMatch[1][0];
      return part;
    }
    if (fence || inHighlight) return part;
    const images = part.replace(/<img\b([^>]*)\/?\s*>/gi, (tag, attributes) => {
      const src = htmlAttribute(attributes, "src");
      if (!isRepositoryImage(src)) return tag;
      const alt = htmlAttribute(attributes, "alt").replace(/[\[\]\\]/g, "\\$&");
      return `![${alt}](${src})`;
    });
    return images
      .replace(/<(sub|sup)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi, (_tag, name, text) => htmlInlineMarker(name, text))
      .replace(/<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi, (tag, attributes, text) => {
      const href = htmlAttribute(attributes, "href");
      if (!href || /\s*javascript:/i.test(href)) return tag;
      return `[${markdownLinkLabel(text)}](${markdownLinkTarget(href)})`;
      });
  }).join("");
}

function separateMarkdownImagesOutsideExamples(source) {
  let fence;
  let inHighlight = false;
  let previousWasImage = false;
  const output = [];
  for (const line of source.split(/\r?\n/)) {
    if (/^{%\s*highlight\b/i.test(line)) inHighlight = true;
    if (/^{%\s*endhighlight\s*%}/i.test(line)) inHighlight = false;
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      if (fence && fenceMatch[1][0] === fence) fence = undefined;
      else if (!fence) fence = fenceMatch[1][0];
    }
    const imageMatch = !fence && !inHighlight
      ? line.match(/^(\s*)!\[([^\]]*)\]\(([^\s)]+)(\s+"[^"]*")?\)\s*$/)
      : null;
    const isImage = Boolean(imageMatch);
    if (previousWasImage && !isImage && line.trim() && !fence && !inHighlight) output.push("");
    if (isImage && previousWasImage) output.push("");
    if (imageMatch && !imageMatch[2]) {
      const filename = path.basename(imageMatch[3].split(/[?#]/)[0], path.extname(imageMatch[3]));
      output.push(`${imageMatch[1]}![${filename}](${imageMatch[3]}${imageMatch[4] ?? ""})`);
    } else {
      output.push(line);
    }
    previousWasImage = isImage;
  }
  return output.join("\n");
}

function replaceMathOutsideExamples(source) {
  const displayMath = [];
  const inlineMath = [];
  const normalizeLatex = (latex) => latex.trim().replace(/\\{2,}(?!\r?\n)/g, String.fromCharCode(92));
  const displayMarker = (latex) => {
    const index = displayMath.push(normalizeLatex(latex)) - 1;
    return `@@MINITYPEDISPLAY${index}@@`;
  };
  const inlineMarker = (latex) => {
    const index = inlineMath.push(normalizeLatex(latex)) - 1;
    return `@@MINITYPEINLINE${index}@@`;
  };
  const replaceInline = (line) => line.split(/(`[^`]*`)/).map((part, index) => {
    if (index % 2) return part;
    return part
      .replace(/(?<!\\)\$\$([^$\n]+?)(?<!\\)\$\$/g, (_match, latex) => inlineMarker(latex))
      .replace(/(?<![\\$])\$(?!\$)([^$\n]+?)(?<!\\)\$(?!\$)/g, (_match, latex) => inlineMarker(latex));
  }).join("");

  let fence;
  let inHighlight = false;
  let display;
  const result = [];
  for (const line of source.split(/\r?\n/)) {
    if (display) {
      const end = display.type === "dollars" ? line.trim() === "$$" : line.indexOf("]]" );
      if (end !== false && end !== -1) {
        if (display.type === "brackets") display.lines.push(line.slice(0, end));
        result.push("", displayMarker(display.lines.join("\n")), "");
        display = undefined;
      } else {
        display.lines.push(line);
      }
      continue;
    }
    if (/^{%\s*highlight\b/i.test(line)) inHighlight = true;
    if (/^{%\s*endhighlight\s*%}/i.test(line)) inHighlight = false;
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      if (fence && fenceMatch[1][0] === fence) fence = undefined;
      else if (!fence) fence = fenceMatch[1][0];
      result.push(line);
      continue;
    }
    if (fence || inHighlight || /^(?: {4}|\t)/.test(line)) {
      result.push(line);
      continue;
    }
    if (line.trim() === "$$") {
      display = { type: "dollars", lines: [] };
      continue;
    }
    const bracket = line.match(/^\s*\[\[\s*(.*)$/);
    if (bracket) {
      const end = bracket[1].indexOf("]]" );
      if (end !== -1 && /^\s*$/.test(bracket[1].slice(end + 2))) {
        result.push("", displayMarker(bracket[1].slice(0, end)), "");
      } else {
        display = { type: "brackets", lines: [bracket[1]] };
      }
      continue;
    }
    result.push(replaceInline(line));
  }
  if (display) result.push(...display.lines);
  return { source: result.join("\n"), displayMath, inlineMath };
}

function replaceDisplayMathBlocks(blocks, displayMath) {
  return blocks.flatMap((block) => {
    const marker = block.type === "text" && block.textType === "paragraph" && block.lines.length === 1 && block.lines[0].length === 1 && typeof block.lines[0][0] === "string"
      ? block.lines[0][0].match(/^@@MINITYPEDISPLAY(\d+)@@$/)
      : null;
    if (!marker) return [block];
    const latex = displayMath[Number(marker[1])];
    return [math(latex.split(/\r?\n/), { size: Q(10) })];
  });
}

function replaceInlineMathBlocks(value, inlineFormulae) {
  if (Array.isArray(value)) {
    value.forEach((item) => replaceInlineMathBlocks(item, inlineFormulae));
    return;
  }
  if (!value || typeof value !== "object") return;
  if (value.type === "code") return;
  if ((value.type === "text" || value.type === "list") && Array.isArray(value.lines)) {
    value.lines = value.lines.map((line) => line.flatMap((item) => {
      if (typeof item !== "string") return [item];
      return item.split(/@@MINITYPEINLINE(\d+)@@/).flatMap((part, index) => {
        if (index % 2) return [inlineFormulae[Number(part)] ? inlineMath(inlineFormulae[Number(part)]) : part];
        return part ? [part] : [];
      });
    }));
  }
  Object.values(value).forEach((child) => replaceInlineMathBlocks(child, inlineFormulae));
}

function replaceInlineHtmlBlocks(value) {
  if (Array.isArray(value)) {
    value.forEach(replaceInlineHtmlBlocks);
    return;
  }
  if (!value || typeof value !== "object" || value.type === "code") return;
  if ((value.type === "text" || value.type === "list") && Array.isArray(value.lines)) {
    value.lines = value.lines.map((line) => line.flatMap((item) => {
      if (typeof item !== "string") return [item];
      return replaceInlineHtmlString(item);
    }));
  }
  Object.values(value).forEach(replaceInlineHtmlBlocks);
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
  const mathEnabled = metadata.get("layout") === "katex" || metadata.get("layout") === "math";
  const sourceWithExpandedCodeTabs = expandCodeTabs(stripUnsupportedControlCharacters(source));
  const preparedMath = mathEnabled
    ? replaceMathOutsideExamples(sourceWithExpandedCodeTabs)
    : { source: sourceWithExpandedCodeTabs, displayMath: [], inlineMath: [] };
  const normalized = normalizedMarkdown(separateMarkdownImagesOutsideExamples(replaceSupportedHtmlOutsideExamples(preparedMath.source)));
  const markdownFile = normalized === source ? file : path.join(root, "tmp", "pdfs", "normalized", path.basename(file));
  if (markdownFile !== file) {
    await mkdir(path.dirname(markdownFile), { recursive: true });
    await writeFile(markdownFile, normalized);
  }
  const article = await mdFile(markdownFile, { image: (src) => pdfImage(src), link: (href, text) => link(href, text) });
  article.blocks = replaceDisplayMathBlocks(article.blocks, preparedMath.displayMath);
  replaceInlineMathBlocks(article.blocks, preparedMath.inlineMath);
  replaceInlineHtmlBlocks(article.blocks);
  const publication = english
    ? ["Katsutoshi Seki | Published: ", dateLabel(identity, true), " | Source: ", link(sourceUrl, sourceUrl)]
    : ["著者：関 勝寿　公開日：", dateLabel(identity, false), "　ソース：", link(sourceUrl, sourceUrl)];
  const document = minitype([{ body: [
    h1(title, { align: "center", unnumbered: true }),
    p([publication], { align: "right", font: sansFont, size: Q(9), firstIndent: 0 }),
    box(article.blocks, { columns: 2, columnGap: 7, splitable: true }),
    { type: "flow", position: "page", blockOffset: 283, inlineSize: 210, blocks: [p([[page]], { align: "center", firstIndent: 0, font: sansFont, size: Q(9) })] },
  ] }], structuredClone(documentStyle), { fontDir, outline: false, metadata: { title, author: "Katsutoshi Seki" } });
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
const rebuildAll = arguments_.includes("--all");
const reportExclusions = arguments_.includes("--list-excluded");
const requested = new Set(arguments_.filter((argument) => !["--all", "--missing", "--list-excluded"].includes(argument)).map((file) => path.resolve(root, file)));
if (!includeMissing && !rebuildAll && !reportExclusions && requested.size === 0) {
  console.error("Usage: node generate-pdfs.mjs --all | --missing [post-file ...]");
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
  if (!(rebuildAll || requested.has(file) || (includeMissing && missing))) continue;
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
