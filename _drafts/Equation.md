---
layout: post
title: LaTeX の数式を Word に貼り付ける方法
tags: 
- tex
- word
---
Word で原稿を提出する必要があり、しかもその数式がそのまま印刷版となってしまうため、Word の数式エディタのクオリティでは不満で数式だけ LaTex で作成したい、ということがままあるようになってきた。そこで、LaTeX の数式を Word に貼り付ける方法についてまとめる。

基本は、[TeX の数式を DTP ソフトに](https://texwiki.texjp.org/?TeX%E3%81%AE%E6%95%B0%E5%BC%8F%E3%82%92DTP%E3%82%BD%E3%83%95%E3%83%88%E3%81%AB)に書かれているように、LaTeX で数式を作成して eps ファイルにして、それを開いてクリップボードにコピーして、Word に貼り付ける。そこに紹介されている[TeX2img](http://island.geocities.jp/loveinequality/)を使うと、比較的楽だ。

数式の作成時には[リアルタイムプレビュー](http://genkuroki.web.fc2.com/MathJax/LivePreviewMathJax-jquery.html)を使うと便利。

なお、Word の MathML を使って直接 Word を使う方法について[書かれている](http://tex.stackexchange.com/a/115065)ので、参考までに記しておく。なお、この方法だと Word によって数式が作成されるため、LaTeX で数式を作成する方が出力はきれいだと思う。

# [リアルタイムプレビュー](http://genkuroki.web.fc2.com/MathJax/LivePreviewMathJax-jquery.html)で式を作成して、生成された式を右クリックして、Show MathML as / MathML Code を選択
# コードをテキストエディタに貼り付けて、そのコードの先頭に <?xml version="1.0"?> という行を追加
# まるごと Word にコピーペースト
