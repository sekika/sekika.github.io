---
layout: post
title: 記事を PDF でも読めるようにした
date: 2026-09-13 08:49:00 +0000
tags:
- jekyll
- javascript
---
このブログの記事に、ブラウザで読む本文とは別に、PDFで表示するリンクを付けた。記事のヘッダにある「PDFで表示」を選ぶと、A4縦・二段組のPDFを新しいタブで開ける。

PDFは印刷したいときや、あとで手元に保存して読みたいときに便利である。画面幅やブラウザの表示倍率に左右されず、見出し、本文、画像、表を一定の版面で読めるのもよい点である。PDF内のWebリンクも青字のリンクとして残してあるので、参考資料や元の記事へ移動できる。

すべての記事を無条件にPDF化しているわけではない。ブラウザで操作することが本体である15パズル、Pyodide、Canvasを使うページなどはPDFにしても意味が変わってしまうため、PDFリンクを表示しない。通常の解説記事は、日本語・英語を問わずPDF化する。

## minitype を使う

PDFの作成には [minitype](https://typeset.jp/) を使った。minitypeは、TypeScriptライブラリとして利用するヘッドレス組版エンジンである。日本語の段組、禁則処理、縦組、ルビなどの組版機能を持つ。

このブログの記事はMarkdownで書いているので、minitypeの[Markdownプラグイン](https://typeset.jp/plugin/markdown/)で記事ファイルを読み込む。見出し、段落、リスト、コードブロック、表、画像、リンクなどをminitypeの組版要素に変換できる。このブログでは、リポジトリ内の画像を参照する `img` タグもMarkdown画像として扱う。PDFを書き出す処理はNode.jsで実行する。

この方式は、公開済みのHTMLを画面キャプチャのようにPDF化するものではない。Markdownを読み、PDF用の版面として改めて組版する。そのため、WebページのボタンやJavaScriptの実行結果をPDFに写すのではなく、記事本文を読みやすい文書にすることを目的としている。

## このブログの組版設定

生成処理は [generate-pdfs.mjs](https://github.com/sekika/sekika.github.io/blob/master/tools/minitype-pdf/generate-pdfs.mjs) に置いた。用紙はA4縦、横組で、上下左右の余白を指定し、本文を二段組にしている。タイトルはページ中央、著者・公開日・ソースURLは右寄せとし、ページ番号は本文の下余白を保ったままページ下部に置く。

Markdown中のリンクにはPDFのリンク注釈を付け、文字色も青にしている。minitypeが生成する四角い注釈はPDFビューアによっては赤枠や選択状態として見えるため、出力後にその注釈だけを取り除き、通常のリンク注釈は残すようにした。

記事のPDFは、原則として記事URLに対応する次の場所に保存する。

```text
/pdf/YYYY/MM/DD/slug.pdf
```

たとえば `/2024/05/12/Bootstrap5/` のPDFは `/pdf/2024/05/12/Bootstrap5.pdf` となる。記事ヘッダは[日本語用](https://github.com/sekika/sekika.github.io/blob/master/_includes/post-header.html)と[英語用](https://github.com/sekika/sekika.github.io/blob/master/_includes/post-header-en.html)でこの規則からPDFのURLを組み立てるため、記事ごとにリンク先を書く必要はない。英語記事ではリンクの文言を `View PDF` に切り替えている。

## PDF化しない記事の判定

通常の記事はデフォルトでPDF生成対象である。明示的に除外したいときは、フロントマターに次のように書く。

```yaml
pdf: false
```

現在の実行型ページには、この指定を付けている。生成スクリプトも念のため記事本文を調べ、コード例の外にある `script`、`canvas`、`form`、`input`、`textarea`、`select`、`button`、`iframe` などを検出した記事を除外する。JavaScriptのコードを解説としてコードブロックに掲載しているだけなら、PDF化の対象のままである。

この判定により、15パズルのようにCanvasとボタンを使う記事や、ブラウザ内でPythonを実行するPyodideの記事はPDFを作らない。一方、JavaScriptやPyodideについて説明する通常の記事は、本文を読むためのPDFを作れる。

## pre-commit で更新する

PDFを手作業で作ると、記事本文を更新した後にPDFだけ古くなる。そこで、記事をコミットするときに動くGitの[pre-commitフック](https://github.com/sekika/sekika.github.io/blob/master/setup/pre-commit)へPDF生成を組み込んだ。

初回だけ、PDF生成に必要なNode.jsパッケージをインストールし、フックを登録する。

```sh
cd tools/minitype-pdf
npm install
cd ../..
make -C setup install-hook
```

`_posts/` 内の記事を追加・変更してコミットすると、フックは検索用の `js/index.js` を更新した後、未生成のPDFを一括生成する。コミット対象の記事に対応するPDFがすでにある場合も、本文とPDFが食い違わないよう再生成する。最後に生成物を自動でステージするため、通常は `pdf/` を個別に `git add` しなくてよい。

手動で未生成PDFを作る場合は、リポジトリのルートで次を実行する。

```sh
node tools/minitype-pdf/generate-pdfs.mjs --missing
```

詳細な前提条件と対象外判定は [setup/Readme.md](https://github.com/sekika/sekika.github.io/blob/master/setup/Readme.md) にまとめた。

## GitHub Pages との役割分担

GitHub Pagesの標準的なJekyllビルドは、リポジトリにあるHTML、CSS、JavaScript、画像、PDFなどの静的ファイルを公開する。一方、minitypeのPDF生成にはNode.jsの実行が必要であり、GitHub PagesのJekyllビルドの中で行うものではない。

このブログでは、ローカルのpre-commitフックでPDFを作り、生成したPDFを記事と同じGitコミットに含める。GitHub Pagesは、そのPDFをほかの静的ファイルと同じように配信するだけである。この分担により、GitHub Pagesの設定を複雑にせず、記事と対応するPDFを同じ履歴で管理できる。

今後は、数式や複雑な表、画像を多く含む記事についても、PDFでの見やすさを確認しながら組版を調整していく予定である。
