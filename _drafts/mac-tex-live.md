---
layout: post
title: Mac で Tex Live
tags:
- mac
- tex
---
Mac OS X で LaTeX を使えるようにするための手順。

- [TeX Live](http://www.tug.org/texlive/) から [install-tl-unx.tar.gz](http://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz) をダウンロード、展開して ``` install-tl``` を実行。
- ヒラギノフォントのセットアップ

~~~
sudo mkdir -p /usr/local/texlive/texmf-local/fonts/opentype/public/hiragino/
cd /usr/local/texlive/texmf-local/fonts/opentype/public/hiragino/
sudo ln -fs "/Library/Fonts/ヒラギノ明朝 Pro W3.otf" ./HiraMinPro-W3.otf 
sudo ln -fs "/Library/Fonts/ヒラギノ明朝 Pro W6.otf" ./HiraMinPro-W6.otf
sudo ln -fs "/Library/Fonts/ヒラギノ丸ゴ Pro W4.otf" ./HiraMaruPro-W4.otf
sudo ln -fs "/Library/Fonts/ヒラギノ角ゴ Pro W3.otf" ./HiraKakuPro-W3.otf
sudo ln -fs "/Library/Fonts/ヒラギノ角ゴ Pro W6.otf" ./HiraKakuPro-W6.otf
sudo ln -fs "/Library/Fonts/ヒラギノ角ゴ Std W8.otf" ./HiraKakuStd-W8.otf
sudo mktexlsr
kanji-config-updmap hiragino
~~~

- ```pdffonts``` を使えるようにするために（要 [Homebrew](http://brew.sh/index_ja.html))

~~~
brew install poppler
~~~

- サンプル TeX ファイルのコンパイルとフォントのチェック。

~~~
~/Library/TeXShop/bin/platex2pdf-utf8 sample.tex
pdffonts sample.pdf
~~~

- このように、```emb``` の欄がすべて ```yes``` になっていれば、フォント埋め込みOK。

~~~
name                                 type              encoding         emb sub uni object ID
------------------------------------ ----------------- ---------------- --- --- --- ---------
STBDIB+HiraMinPro-W3-Identity-H      CID Type 0C       Identity-H       yes yes no       5  0
BQPTJB+CMR12                         Type 1C           Builtin          yes yes no       6  0
LWYZIH+HiraKakuPro-W3-Identity-H     CID Type 0C       Identity-H       yes yes no       8  0
ZYPJGI+CMBX10                        Type 1C           Builtin          yes yes no       9  0
UKCVIO+CMBX12                        Type 1C           Builtin          yes yes no      12  0
DHTEHS+CMR10                         Type 1C           Builtin          yes yes no      13  0
BJCHNL+LCIRCLE10                     Type 1C           Builtin          yes yes no      14  0
~~~

## 参考サイト
- [TeX Live を使おう──Linux ユーザと Mac OS X ユーザのために──](http://fugenji.org/~thomas/texlive-guide/index.html) (Tamotsu Thomas UEDA, 2015)
- [pdfにフォントが埋め込まれてるか確認するコマンドpdffonts](http://ototorosama.hatenablog.com/entry/2013/02/14/055355) (ととろぐ！臨時増刊号, 2013/2/14)
- [使ってはいけない LaTeX のコマンド・パッケージ・作法](http://ichiro-maruta.blogspot.jp/2013/03/latex.html) (丸田一郎, 2013/3/13)
- [[改訂第6版] LaTeX2ε美文書作成入門](http://www.amazon.co.jp/dp/4774160458/) (奥村晴彦, 黒木裕介, 2013/10/23)

