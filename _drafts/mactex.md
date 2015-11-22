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
- ヒラギノフォントのセットアップ。

~~~
sudo mkdir -p /usr/local/texlive/texmf-local/fonts/opentype/public/hiragino/
sudo chown `whoami` /usr/local/texlive/texmf-local/fonts/opentype/public/hiragino
cd /usr/local/texlive/texmf-local/fonts/opentype/public/hiragino/
ln -fs "/Library/Fonts/ヒラギノ明朝 Pro W3.otf" ./HiraMinPro-W3.otf 
ln -fs "/Library/Fonts/ヒラギノ明朝 Pro W6.otf" ./HiraMinPro-W6.otf
ln -fs "/Library/Fonts/ヒラギノ丸ゴ Pro W4.otf" ./HiraMaruPro-W4.otf
ln -fs "/Library/Fonts/ヒラギノ角ゴ Pro W3.otf" ./HiraKakuPro-W3.otf
ln -fs "/Library/Fonts/ヒラギノ角ゴ Pro W6.otf" ./HiraKakuPro-W6.otf
ln -fs "/Library/Fonts/ヒラギノ角ゴ Std W8.otf" ./HiraKakuStd-W8.otf
sudo mktexlsr
kanji-config-updmap hiragino
~~~

- ```pdffonts``` を使えるようにするために（要 [Homebrew](http://brew.sh/index_ja.html))

~~~
brew install Caskroom/cask/xquartz homebrew/x11/xpdf
~~~

- サンプル TeX ファイルのコンパイルとフォントのチェック。

~~~
~/Library/TeXShop/bin/platex2pdf-utf8 sample.tex
dvipdfmx -f hiragino-embed.map sample.dvi
pdffonts sample.pdf
~~~

## TeXShop の設定
- 設定の書類タブでエンコードをutf8に。
- 内部設定タブのTeX+dvips+distillerのTexは ```~/Library/TeXShop/bin/ptex2pdf-utf8``` に。
- Latexは ```~/Library/TeXShop/bin/platex2pdf-utf8``` に。

## 参考サイト
- [TeX Live を使おう──Linux ユーザと Mac OS X ユーザのために──](http://fugenji.org/~thomas/texlive-guide/index.html) (Tamotsu Thomas UEDA, 2015)
- [pdfにフォントが埋め込まれてるか確認するコマンドpdffonts](http://ototorosama.hatenablog.com/entry/2013/02/14/055355) (ととろぐ！臨時増刊号, 2013/2/14)
- [教授でもできるMac OS XへのLaTeXとTeXShopのインストレーション](http://osksn2.hep.sci.osaka-u.ac.jp/~taku/osx/install_ptex.html) (山中卓, 2014/11/22)
- [使ってはいけない LaTeX のコマンド・パッケージ・作法](http://ichiro-maruta.blogspot.jp/2013/03/latex.html) (丸田一郎, 2013/3/13)
- [TeX/Mac OS X](http://mizupc8.bio.mie-u.ac.jp/pukiwiki/index.php?TeX%2FMac%20OS%20X) (Ryoei ITO)
- [MacBook Air(Lion)にTex環境を導入した](http://d.hatena.ne.jp/takc923/20111103/1320284492) (ただのらくがき帳。, 2011/11/3)
