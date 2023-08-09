---
layout: post
title: PDFの図を1ページにまとめる
tag: python
---
複数のPDF画像ファイルを1ページの画像にまとめるPythonスクリプトを作成した。論文で複数のグラフを1枚の図としてまとめるときに便利である。

たとえば[この論文](https://doi.org/10.2478/johh-2022-0039)のFig. 6では

<img src="/img/20230809-concatepdf.png" width="400px">

このように複数のグラフが1枚の図としてまとめられている。この図は、4つのPDFファイルを縦横2個ずつ並べたものである（それぞれのPDFファイルに2つのグラフがあるため、合計8個のグラフがある）。元のPDFファイルは20個あり、4個ずつを1つの図としてまとめて、合計5個の図を作成している。このような作業を簡単に実行することを目的としてスクリプトを作成した。

複数のPDFファイルを1つのファイルにまとめるコマンドには pdfunite のようなものがあるが、通常はページが連結されるだけであり、同じページ内に複数のPDFをまとめて配置することができない。そこで作成したのがこのスクリプトである。

## インストール
PyPDF3ライブラリを次のコマンドによってインストールする。

```shell
python3 -m pip install PyPDF3
```

その後、 以下のコマンドにより[このスクリプト](https://gist.github.com/sekika/1e8811868cebeca6c3443c69849929db)をダウンロードして concatpdf という名前に変更し、実行可能にする。

```shell
curl -o concatepdf https://gist.githubusercontent.com/sekika/1e8811868cebeca6c3443c69849929db/raw/8ae6aa7abeab13dac7a62d50458a16a22a2ec011/concatepdf.py
chmod +x concatepdf
```

必要に応じて、1行目の[シバン](https://ja.wikipedia.org/wiki/%E3%82%B7%E3%83%90%E3%83%B3_(Unix))

```shell
#!/usr/bin/env python3
```

を書き換える。

これで`./concatepdf`で実行可能となり、システムのPATHに配置すると、`concatepdf`で実行可能となる。以下の例では`concatepdf`で実行する。

## 実行方法
例えば、カレントディレクトリに複数のPDF画像ファイルがある場合、次のコマンドを実行する。

```shell
concatpdf -i *.pdf -o output/output.pdf -c 2 -r 3
```

この例では、画像ファイルが output/output.pdf に連結され、各ページに横に2つ、縦に3つの画像が配置され、ページごとに6つの画像が生成される。

利用可能なコマンドラインオプションを表示するには、次のコマンドを実行する。

```shell
concatpdf -h
```

すると、次のように表示される。

<pre>
usage: concatepdf [-h] -i INPUT [INPUT ...] -o OUTPUT [-c COLUMNS] [-r ROWS]

Arrange multiple PDF images both horizontally and vertically within a single
page, resulting in multiple pages

options:
  -h, --help            show this help message and exit
  -i INPUT [INPUT ...], --input INPUT [INPUT ...]
                        Input files
  -o OUTPUT, --output OUTPUT
                        Output file
  -c COLUMNS, --columns COLUMNS
                        Numbers of columns in a page
  -r ROWS, --rows ROWS  Numbers of rows in a page
</pre>

別のPythonスクリプト内でこのスクリプトを使用したい場合は、スクリプト内の`concat_pdf_pages` 関数を利用することができる。
