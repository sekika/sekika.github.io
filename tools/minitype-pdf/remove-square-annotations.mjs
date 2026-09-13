import { readFile, writeFile } from "node:fs/promises";
import { PDFArray, PDFDict, PDFDocument, PDFName } from "pdf-lib";

const annotsName = PDFName.of("Annots");
const subtypeName = PDFName.of("Subtype");
const squareName = PDFName.of("Square");

for (const file of process.argv.slice(2)) {
  const pdf = await PDFDocument.load(await readFile(file));
  for (const page of pdf.getPages()) {
    const annotsRef = page.node.get(annotsName);
    if (!annotsRef) continue;
    const annots = pdf.context.lookup(annotsRef, PDFArray);
    for (let index = annots.size() - 1; index >= 0; index -= 1) {
      const annotation = pdf.context.lookup(annots.get(index), PDFDict);
      if (annotation.get(subtypeName)?.asString() === squareName.asString()) {
        annots.remove(index);
      }
    }
  }
  await writeFile(file, await pdf.save());
}
