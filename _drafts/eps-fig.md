---
layout: post
title: EPSファイルの作成方法
tag: tex
---
Excel や PowerPoint で作成した図を EPS ファイルにする方法。

## PDF からの変換

まずは、EPS に変換したい画像が含まれる PDF ファイルを作成する。

次に、作成したPDFファイルを適宜トリミングして、ちょうどいい大きさの PDF ファイルにする。Mac であれば、プレビューで PDF ファイルを開いて[選択ツールで長方形の範囲選択](https://support.apple.com/ja-jp/HT201740)をしてコピーし、「クリップボードから新規作成」でトリミングされたPDFファイルを作成できる。

次に、PDFファイルを pdftops コマンドで EPS ファイルに変換する。[Xpdf](http://www.foolabs.com/xpdf/) または、Xpdf を元に開発されている [poppler](http://poppler.freedesktop.org/) をインストールすると、[pdftops]( http://linuxcommand.org/man_pages/pdftops1.html) を使えるようになる。Mac ならば、```brew install poppler``` でOK。そして、

> pdftops -eps filename.pdf 

とすることで、filename.eps が作成される。

## WMF からの変換

Window メタファイル (WMF) から直接 EPS ファイルを作りたくなるときもある。その場合には、[Metafile to EPS Converter](http://wiki.lyx.org/Windows/MetafileToEPSConverter) を使う。

- [TeXを便利に使うツール類](http://c.nagaokaut.ac.jp/index.php?TeX%A4%F2%CA%D8%CD%F8%A4%CB%BB%C8%A4%A6%A5%C4%A1%BC%A5%EB%CE%E0)

[WMF2EPS](http://www.wolf-s.homepage.t-online.de/wmf2eps/index.htm) もあるけれど、最新版の Windows だと動かないようだ。

- [wmf2eps - PowerPoint等の図をEPS形式に変換](http://www.ise.chuo-u.ac.jp/ise-labs/kubota-lab/kniwa/tex03.html)
- [TeXに張り付けるEPS形式の図をWindows上で作成する方法](http://www.mtl.t.u-tokyo.ac.jp/~iizuka/nt/eps/)

