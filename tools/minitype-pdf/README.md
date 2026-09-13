# minitype PDF prototypes

Generate the two trial PDFs from the repository root:

```sh
cd tools/minitype-pdf
npm install
npm run build
```

The command writes `pdf/mac-ls.pdf` (a normal Markdown article) and
`pdf/dice.pdf` (a KaTeX article with minitype math and SVG figures). The
article body is set in two columns; the title and publication metadata span
the page width. Each page has a centered page number below the text area.

The normal article uses minitype's Markdown mapping. The KaTeX article is
explicitly composed because minitype's Markdown mapping does not translate
the site's `$...$` math notation.

The build also removes minitype's red `Square` annotations. It preserves the
standard `Link` annotations used by PDF viewers while rendering every link in
blue.
