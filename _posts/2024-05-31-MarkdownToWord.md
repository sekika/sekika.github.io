---
layout: post
title: マークダウンと Word による論文執筆方法
date: 2024-05-31 09:57:28 +0000
tag: word
---
[マークダウン](https://ja.wikipedia.org/wiki/Markdown)で原稿を執筆して、[Pandoc で PDF に変換して提出する](https://qiita.com/Kumassy/items/5b6ae6b99df08fb434d9)という方法はとても手軽で便利である。ところが、投稿論文では PDF ではなくて Word ファイルの提出が求められるため（LaTeX は別として）、マークダウンで原稿を執筆して、pandoc で Word に変換してから仕上げる方法についてまとめておく。

## マークダウンによる原稿執筆

この段階では細かい見栄えは気にせず、文章を書くことに集中する。原稿ファイルのファイル名を `manuscript.md` として、テキストエディタで編集する。

- テキストエディタに VS Code を使う場合には、[VS Codeでプレビュー](https://atmarkit.itmedia.co.jp/ait/articles/1804/20/news030.html)しながら原稿を書くことができる。キーボードでは［Ctrl］＋［K］→［V］（Win／Linux）、［Command］＋［K］→［V］（macOS）。
- 章や節の見出しは、`#`、`##`などで作る。
- 数式は LaTex の文法で書く。`$`で囲めばインライン数式、`$$`で囲めばブロック数式となる。式が VS Code で即座にプレビューできるのは便利。式番号は、式の最後に`\tag{1}`のように直接式番号を書くことで VS Code のプレビューには表示されるが、Word に変換した時には式番号は消える。また、Word ファイルに変換する場合には [pandoc-crossref](https://lierdakil.github.io/pandoc-crossref/) を使えず、連番をつける機能はない。よって、式番号はこの段階ではつけない、あるいはプレビュー用に仮につけるかのどちらかとなる。
- 図の挿入は`![**Fig. 1.** 図のタイトル](図のファイル名)`のようにする。ここでも、図の番号について連番を管理することはできない。図の形式を`pdf`とすると VS Code のプレビューでは表示されないが、Wordでは図が添付されるので問題ない。VS Code でプレビューしたい場合には、`png`や`svg`などのファイル形式で図を作成する。
- 表は[Markdown表変換ツール](https://boost-tool.com/ja/tools/md_table)などを活用してマークダウンで作成するか、あるいは Word での編集段階で Excel からコピーペーストする。
- 文献リストは `-` によるリストで列記しておく。

以下は、マークダウンファイルから Word ファイル及び PDF ファイルへの変換について記す。Wordのテンプレートファイル `template.docx` を作成する。テンプレートファイルでは、用紙サイズ、マージン、本文のフォントや段落などを指定できる。ただし、あまり細かい制御はできないので、細かいところは Word による仕上げの段階で編集する。

以下の `Makefile` を作成する。ここで、`--number-sections` は章の見出しに番号を振る設定であり、不要であれば消す。
```
all: manuscript.pdf

%.docx: %.md
	pandoc $< -o $@ --reference-doc=template.docx --number-sections

%.pdf: %.docx
	docx2pdf $<
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
%.docx: %.md
	pandoc $< -o $@ --reference-doc=template.docx --number-sections
```
の2行を削除あるいはコメントアウトする。これで、以降は `manuscript.md` の編集は反映されず、`manuscript.docx` で仕上げの編集をすることとなる。

- [式番号を追加](https://sekika.github.io/2023/03/09/WordEquation/)する。
- 文献リストをぶら下げインデントに設定する。
- 式番号や図表番号の対応を整える。今後も編集が継続するようであれば、必要に応じてブックマーク名で管理する。
- タイトル、著者、図表の位置調整、表の罫線設定、その他細かい見栄えの調整をする。

原稿を提出したら、`.gitignore` を削除して PDF を git に入れておく。

以上の手順により、原稿執筆中は Word による見栄えの調整という煩わしい作業から開放され、原稿執筆に集中しやすくなった。
