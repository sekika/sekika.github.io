---
layout: post
title: マークダウンと Word による原稿作成
tag: word
---
[マークダウン](https://ja.wikipedia.org/wiki/Markdown)による原稿作成は手軽で便利である。基本は[Markdown+Texの環境構築](https://qiita.com/Kumassy/items/5b6ae6b99df08fb434d9)をして、[pandoc で Markdown から PDF を作成する](https://qiita.com/Kumassy/items/5b6ae6b99df08fb434d9)。その際に、[VS CodeでMarkdownをプレビュー](https://atmarkit.itmedia.co.jp/ait/articles/1804/20/news030.html)して原稿を書くととても快適である。

原稿をPDFで提出できる場合には上記の方法で完璧なのだが、Word ファイルを作成する必要がある時がある。特に、投稿論文では出版社が原稿を元に出版用の編集をするため、LaTeX でなければ Word ファイルでの提出が求められる。共著者とのやりとりも、Word で校正しあうことが多い。このような場合には、最初からWordで原稿を作成するよりも、マークダウンで原稿を執筆し、論文提出時、あるいは共著者への送付時に Word に変換してから仕上げる方が効率的である。ただし、この場合には LaTeX の crossref のような高度な機能は使えない。そのため、マークダウンでの作業とWordでの作業の役割分担が必要となる。そこで、マークダウンで原稿を作成して、Word で仕上げる方法についてまとめておく。

## マークダウンによる原稿執筆

この段階では細かい見栄えは気にせず、文章を書くことに集中する。

- [VS Codeでプレビュー](https://atmarkit.itmedia.co.jp/ait/articles/1804/20/news030.html)しながら原稿を書く。キーボードでは［Ctrl］＋［K］→［V］（Win／Linux）、［Command］＋［K］→［V］（macOS）。
- Wordのテンプレートファイル `template.docx ` を作成しておく。テンプレートファイルでは、用紙サイズ、マージン、本文のフォントや段落などを指定できる。ただし、あまり細かい制御はできないので、細かいところはWordによる仕上げの段階で編集する。
- 章や節の見出しは、`#`、`##`などで作る。
- 数式は LaTex の文法で書く。`$`で囲めばインライン数式、`$$`で囲めばブロック数式となる。式が VS Code で即座にプレビューできるのは便利。式番号は、式の最後に`\tag{1}`のように直接式番号を書くことで VS Code のプレビューには表示されるが、Word に変換した時には式番号は消える。また、連番をつける機能はない。よって、式番号はこの段階ではつけない、あるいはプレビュー用に仮につけるかのどちらかとなる。
- 図の挿入は`![**Fig. 1.** 図のタイトル](図のファイル名)`のようにする。ここでも、図の番号について連番を管理することはできない。また、Word原稿にするためには図の形式はPDFファイルとするのが良い。VS Codeのプレビューでは表示されないが、Wordでは図が添付されるので問題ない。プレビューしたい場合には、`png`や`svg`などのファイルで図を作成する。
- 文献リストは `-` によるリストで列記しておく。

以下の `Makefile` を作成する。
```
all: manuscript.pdf

%.docx: %.md default.yml
	pandoc -d default.yml

%.pdf: %.docx
	docx2pdf $<
```
`default.yml`ファイルは、このようにする。ここで、`number-sections: true`は章の見出しに番号を振る設定である。
```
input-file: manuscript.md
output-file: manuscript.docx
reference-doc: template.docx 
number-sections: true
```
[Pandoc](https://qiita.com/sky_y/items/3c5c46ebd319490907e8) と Python の [docx2pdf](https://pypi.org/project/docx2pdf/) パッケージをインストールする。以上の設定で、原稿のディレクトリで `make` することで、原稿ファイル `manuscript.md` から Word 経由で `manuscript.pdf` が作成される。時々PDFに変換して確認する。

gitリポジトリで管理する場合には、この段階では `.gitignore` に
```
manuscript.docx
manuscript.pdf
```
と書いておく。

なお、GitHub のプライベートリポジトリにコミットすれば、Web 上で直接 `manuscript.md` を読んだり、編集したりすることもできる。タブレットやスマホから確認することもできるので、状況によっては便利である。ただし、数式の表示が VS Code ほどにはうまくいかない場合があるようだ。

## Word による仕上げ

`make manuscript.docx` で Word ファイルを作成して、`.gitignore` からは `manuscript.docx` を削除する。`Makefile` からは、
```
%.docx: %.md default.yml
	pandoc -d default.yml
```
の2行を削除あるいはコメントアウトする。これで、以降は `manuscript.md` の編集は反映されず、`manuscript.docx` で編集を継続することとなる。提出用に書式を整える。

- [式番号を追加](https://sekika.github.io/2023/03/09/WordEquation/)する。
- 文献リストをぶら下げインデントに設定する。
- 式番号や図表番号の対応を整える。今後も編集が継続するようであれば、必要に応じてブックマーク名で管理する。
- タイトル、著者、その他細かい見栄えの調整をする。

原稿を提出したら、`.gitignore` を削除して PDF を git に入れておく。

以上の手順により、原稿執筆中は Word による見栄えの調整という煩わしい作業から開放され、原稿執筆に集中しやすくなった。
