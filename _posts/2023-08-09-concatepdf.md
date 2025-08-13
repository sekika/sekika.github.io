---
layout: post
title: pdfgridcat - PDFの図を1ページにまとめる
date: 2023-08-09 14:50:39 +0000
update: 2025-08-13 06:38:53 +0000
tag: python
---
複数のPDF画像ファイルを1ページの画像にまとめるPythonパッケージ[pdfgridcat](https://pypi.org/project/pdfgridcat/) を作成した。

`poppler` に含まれる `pdfunite` はページを単純に連結するだけで、`pdf-nupper` は余白ができるのに対し、**pdfgridcat** は余白なしで複数の PDF を 1 ページに配置できる。

たとえば[この論文](https://doi.org/10.2478/johh-2022-0039)のFig. 6では

<img src="/img/20230809-concatepdf.png" width="400px">

このように複数のグラフが1枚の図としてまとめられている。この図は、4つのPDFファイルを縦横2個ずつ並べたものである（それぞれのPDFファイルに2つのグラフがあるため、合計8個のグラフがある）。元のPDFファイルは20個あり、4個ずつを1つの図としてまとめて、合計5個の図を作成している。

なお、当初は1ファイルスクリプトとしていたが2025年8月13日にPythonパッケージとして公開した。

## インストール
`pdfgridcat`ライブラリを次のコマンドによってインストールする。

```shell
python3 -m pip install pdfgridcat
```

## 実行方法
例えば、カレントディレクトリに複数のPDF画像ファイルがある場合、次のコマンドを実行する。

```shell
pdfgridcat -i *.pdf -o output.pdf -c 2 -r 3
```

この例では、画像ファイルが output/output.pdf に連結され、各ページに横に2つ、縦に3つの画像が配置され、ページごとに6つの画像が生成される。

利用可能なコマンドラインオプションを表示するには、次のコマンドを実行する。

```shell
pdfgridcat -h
```

すると、次のように表示される。

<pre>
usage: pdfgridcat [-h] -i INPUT [INPUT ...] -o OUTPUT [-c COLUMNS] [-r ROWS]

Arrange multiple PDF images both horizontally and vertically within a single
page, resulting in multiple pages

options:
  -h, --help            show this help message and exit
  -i, --input INPUT [INPUT ...]
                        Input PDF files
  -o, --output OUTPUT   Output PDF file
  -c, --columns COLUMNS
                        Number of columns per page
  -r, --rows ROWS       Number of rows per page
</pre>

Pythonプログラムからは次のように使う。

```python
from pdfgridcat import concat_pdf_pages

concat_pdf_pages(
    input_files=["a.pdf", "b.pdf", "c.pdf"],
    output_file="output.pdf",
    col=2,
    row=3
)
```
