---
layout: post-en
title: Making blog posts available as PDFs with minitype
ja: /2026/09/13/minitype-pdf/
tags:
- english
- jekyll
- javascript
---
Blog posts on this site can now also be read as PDFs. Selecting “View PDF” in an article header opens an A4, two-column version of the post in a new tab.

PDFs are useful for printing, saving an article for later, and reading it in a stable layout that does not depend on screen width or browser zoom. Links in the PDF are preserved as blue hyperlinks, so readers can still open the source article and its references.

Not every post is converted. Pages whose main purpose is browser interaction, such as the 15 puzzle, Pyodide, and Canvas-based pages, would lose their essential behavior in a PDF and therefore do not show a PDF link. Ordinary explanatory posts are converted in both Japanese and English.

## Using minitype

PDFs are produced with [minitype](https://typeset.jp/), a headless typesetting engine available as a TypeScript library. It provides layout features including Japanese line-breaking rules, vertical writing, ruby text, and multi-column layouts.

Since the posts in this blog are written in Markdown, the [minitype Markdown plugin](https://typeset.jp/plugin/markdown/) reads each post file and converts headings, paragraphs, lists, code blocks, tables, images, and links into minitype layout elements. This blog also treats local `img` tags as Markdown images. Node.js runs the PDF-generation step.

This is not a screenshot-like conversion of the published HTML page. Instead, the Markdown source is typeset again for a PDF page. Browser buttons and JavaScript results are therefore not copied to the PDF; the aim is a readable version of the article itself.

## Typesetting for this blog

The generation program is [generate-pdfs.mjs](https://github.com/sekika/sekika.github.io/blob/master/tools/minitype-pdf/generate-pdfs.mjs). It uses A4 portrait pages in horizontal writing, sets page margins, and places the article body in two columns. Titles are centered; the author, publication date, and source URL are right-aligned; and page numbers sit near the foot of each page without reducing the body’s bottom margin.

Markdown links become PDF link annotations and are colored blue. Some PDF viewers display minitype’s square annotations as red boxes or selected objects, so the generation program removes those square annotations after output while preserving normal hyperlink annotations.

Article PDFs are normally written to a path corresponding to the article URL:

```text
/pdf/YYYY/MM/DD/slug.pdf
```

For example, the PDF for `/2024/05/12/Bootstrap5/` is stored at `/pdf/2024/05/12/Bootstrap5.pdf`. The [Japanese](https://github.com/sekika/sekika.github.io/blob/master/_includes/post-header.html) and [English](https://github.com/sekika/sekika.github.io/blob/master/_includes/post-header-en.html) article headers construct this URL automatically, so each post does not need to specify a link destination.

## Deciding which posts are not converted

Ordinary posts are PDF targets by default. A post can be excluded explicitly with this front matter:

```yaml
pdf: false
```

As a safeguard, the generator also examines article content. It excludes posts that contain executable or interactive HTML outside code examples, including `script`, `canvas`, `form`, `input`, `textarea`, `select`, `button`, and `iframe`. It ignores code fences, inline code, and Jekyll highlight blocks during this check, so an article that merely explains JavaScript remains eligible for PDF output.

This distinguishes an interactive article such as the 15 puzzle or a browser-based Pyodide environment from an ordinary explanatory article about JavaScript or Pyodide.

## Keeping PDFs current with pre-commit

Creating PDFs manually would make it easy for a PDF to become outdated after its article changes. To prevent that, the Git [pre-commit hook](https://github.com/sekika/sekika.github.io/blob/master/setup/pre-commit) generates PDFs when posts are committed.

Install the Node.js packages and register the hook once:

```sh
cd tools/minitype-pdf
npm install
cd ../..
make -C setup install-hook
```

When a post in `_posts/` is added or changed, the hook first updates `js/index.js` for site search. It then creates every missing PDF and regenerates the PDF for the post in the commit. Generated files are staged automatically. The draft-publication [pub script](https://github.com/sekika/sekika.github.io/blob/master/_drafts/pub) performs the same PDF-generation step for a newly published draft.

To generate all currently missing PDFs manually, run this command from the repository root:

```sh
node tools/minitype-pdf/generate-pdfs.mjs --missing
```

Further setup details and the exclusion rules are documented in [setup/Readme.md](https://github.com/sekika/sekika.github.io/blob/master/setup/Readme.md).

## The role of GitHub Pages

The standard Jekyll build on GitHub Pages publishes static files already present in the repository, including HTML, CSS, JavaScript, images, and PDFs. PDF generation with minitype, on the other hand, requires Node.js and is not part of that Jekyll build.

This site generates PDFs locally through the pre-commit hook and commits them with their corresponding articles. GitHub Pages then serves the PDFs like any other static file. This separation keeps the GitHub Pages configuration simple while maintaining each article and its PDF in the same Git history.

The next step is to review PDFs for posts containing substantial mathematics, complex tables, or many images, and refine the typesetting where needed.
