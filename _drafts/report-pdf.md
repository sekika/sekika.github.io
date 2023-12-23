---
layout: post
title: テキストのレポートをPDFにまとめる
tag: python
---
たとえばPythonで自動処理をしてまとめた結果など、テキストファイルで提出しても良いのだけれど、少しだけ見栄えをととのえてPDFにする方法。

色々な方法はあると思うけれど、その中の１つの方法（実際に私がやっている方法）を紹介する。

- 処理結果をマークダウン .md に
- マークダウンをpandocでワードファイル .docx に
- ワードファイルを python-docx で調整
- ワードファイルを PDF に

という方法である。いくつかのツールを組み合わせるので、ここにまとめておく。

## マークダウンから pandoc で Word へ
まずは、処理結果をマークダウンに落とす。ここでは、いったんテキストに落としてからテキストをマークダウンに変換するプログラムを書いても良い。

次に、マークダウンをワードファイルに変換する。そのためには [pandoc](https://pandoc.org/) を使う。まずは pandoc をインストールし、

 pandoc inputfile -o outputfile --reference-doc=template.docx

とする。ここで、inputfile はマークダウンのファイル名、outputfile は出力ファイル名、template.docx はテンプレートファイルで、用紙の余白などを設定しておく。マークダウンの最低限の書式、たとえばリストがワードの形式に変換される。

## Word を python-docx で調整
マークダウンでは、たとえば特定の行を中央寄せしたり右寄せしたり、といった調整は難しい（マークダウン上で指定しても、それを pandoc で変換すると、ワードのファイルでは必ずしもそれが反映されない）。そこで、Python の [python-docx](https://pypi.org/project/python-docx/) パッケージで調整をする。以下は、コマンドライン引数からファイル名を受け取り、その Word ファイルの1行目を中央寄せに、2行目を右寄せに変換して保存するプログラムである。

```
#!/usr/bin/env python3
import sys
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
# コマンドライン引数からファイル名を取得
if len(sys.argv) < 2:
    print("ファイル名を引数として指定してください。")
    sys.exit(1)
file_path = sys.argv[1]
# Word文書を開く
doc = Document(file_path)
# 最初の段落を中央寄せに設定
if len(doc.paragraphs) > 0:
    doc.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
# 次の段落を右寄せに設定
if len(doc.paragraphs) > 1:
    doc.paragraphs[1].alignment = WD_ALIGN_PARAGRAPH.RIGHT
# 文書を保存
doc.save(file_path)
```

## Word を pdf へ
Python の [docx2pdf](https://pypi.org/project/docx2pdf/) ライブラリで変換できる。

## Makefile の記述
以下に、以上の作業をするための Makefile の例を示す。txt2md.py はテキストファイルをマークダウンに変換するプログラムであり、style.py はワードのスタイルを調整するプログラムであり、たとえば上記のようなものである。たとえば report.txt があれば report.txt -> report.md -> report.docx -> report.pdf と変換される。

```
all: report.pdf

%.md: %.txt
	./txt2md.py < $< > $@

%.docx: %.md
	pandoc $< -o $@ --reference-doc=template.docx
	./style.py $@

%.pdf: %.docx
	docx2pdf $<
```
