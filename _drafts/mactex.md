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
- [Xpdf](http://www.foolabs.com/xpdf/download.html) から [xpdf-japanese.tar.gz](ftp://ftp.foolabs.com/pub/xpdf/xpdf-japanese.tar.gz) をダウンロードして ```/usr/local/share/xpdf/japanese``` の下に展開
- [日本語フォントのセットアップ](http://fugenji.org/~thomas/texlive-guide/font_setup.html) で、ヒラギノフォントのセットアップ。最後には
~~~
sudo mktexlsr
~~~
- /.xpdfrc に以下を書く
~~~
name                                 type              emb sub uni object ID
------------------------------------ ----------------- --- --- --- ---------
Ryumin-Light-Identity-H              CID Type 0        no  no  no       5  0
GothicBBB-Medium-Identity-H          CID Type 0        no  no  no       8  0
~~~

- ```pdffonts``` を使えるようにするために（要 [Homebrew](http://brew.sh/index_ja.html))

~~~
brew install Caskroom/cask/xquartz homebrew/x11/xpdf
~~~
- [hiragino-embed.map](https://gist.github.com/nagae/1354092) をダウンロード。
- サンプル TeX ファイルのコンパイルとフォントのチェック。

~~~
~/Library/TeXShop/bin/platex2pdf-utf8 sample.tex
dvipdfmx -f hiragino-embed.map sample.dvi
pdffonts sample.pdf
~~~



## 参考サイト
- [pdfにフォントが埋め込まれてるか確認するコマンドpdffonts](http://ototorosama.hatenablog.com/entry/2013/02/14/055355)
- [TeX/Mac OS X](http://mizupc8.bio.mie-u.ac.jp/pukiwiki/index.php?TeX%2FMac%20OS%20X)
- [MacBook Air(Lion)にTex環境を導入した](http://d.hatena.ne.jp/takc923/20111103/1320284492)
- [教授でもできるMac OS XへのLaTeXとTeXShopのインストレーション](http://osksn2.hep.sci.osaka-u.ac.jp/~taku/osx/install_ptex.html)
- [使ってはいけない LaTeX のコマンド・パッケージ・作法](http://ichiro-maruta.blogspot.jp/2013/03/latex.html)
