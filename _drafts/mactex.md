---
layout: post
title: MacTeX
tags:
- mac
- tex
---
Mac OS X で LaTeX を使えるようにするための手順。Yosemite で検証済み。

- [MacTeX](http://tug.org/mactex/) のダウンロードとインストール
- [TeXShop](http://darkwing.uoregon.edu/~koch/texshop/texshop.html) のダウンロードとインストール
- TeXShop を起動。設定の書類タブでエンコードをutf8に。内部設定タブのTeX+dvips+distillerのTexは ```~/Library/TeXShop/bin/ptex2pdf-utf8``` に。Latexは ```~/Library/TeXShop/bin/platex2pdf-utf8``` に。
- ```pdffonts``` を使えるようにするために
~~~
brew install Caskroom/cask/xquartz homebrew/x11/xpdf
~~~
- サンプル TeX ファイルのコンパイルとフォントのチェック
~~~
~/Library/TeXShop/bin/platex2pdf-utf8 sample.tex
pdffonts sample.pdf
~~~



## 参考サイト
- [TeX/Mac OS X](http://mizupc8.bio.mie-u.ac.jp/pukiwiki/index.php?TeX%2FMac%20OS%20X)
- [MacBook Air(Lion)にTex環境を導入した](http://d.hatena.ne.jp/takc923/20111103/1320284492)
- [教授でもできるMac OS XへのLaTeXとTeXShopのインストレーション](http://osksn2.hep.sci.osaka-u.ac.jp/~taku/osx/install_ptex.html)

