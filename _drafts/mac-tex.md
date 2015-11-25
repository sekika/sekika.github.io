---
layout: post
title: Mac で TeX / LaTeX
tags:
- mac
- tex
---
Mac OS X で TeX / LaTeX を使えるようにするための手順。詳しくは参考サイト参照。

## インストール

- [TeX Live](http://www.tug.org/texlive/) から [install-tl-unx.tar.gz](http://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz) をダウンロード、展開して install-tl-yyyymmdd ディレクトリ内で ```sudo ./install-tl``` を実行。
- path を通すために、```~/.bash_profile``` にこの行を追記。インストールする Tex Live の年次によって、2015 のところは変わるはず。

~~~
export PATH=$PATH:/usr/local/texlive/2015/bin/x86_64-darwin
~~~

- tlmgr の設定

~~~
sudo tlmgr option repository http://mirror.ctan.org/systems/texlive/tlnet
~~~

- ```pdffonts``` を使えるようにするために（要 [Homebrew](http://brew.sh/index_ja.html))

~~~
brew install poppler
~~~

## ヒラギノフォントの設定

(1) Yosemite 以前の場合には

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
sudo kanji-config-updmap-sys hiragino
~~~

[ターミナルで日本語入力ができない時の設定]({% post_url 2015-11-23-mac-terminal-japanese %})

(2) [El Capitan の場合](http://abenori.blogspot.jp/2015/10/el-capitantexplatex-dvipdfmxpdflatexmac.html)には（未検証）

~~~
cd /usr/local/texlive/2015/texmf-dist/scripts/cjk-gs-integrate
sudo perl cjk-gs-integrate.pl --link-texmf --force
sudo mktexlsr
sudo kanji-config-updmap-sys hiragino-elcapitan-pron
~~~

## 確認

[サンプル TeX ファイル](https://gist.github.com/sekika/34cad1547e92a62a4a1b)のコンパイル、生成されたPDFファイルの確認とフォントのチェック。[このように](https://gist.github.com/sekika/e36726eed3a9a7c3b27d) ```emb``` の欄がすべて ```yes``` になっていれば、フォント埋め込みOK。

~~~
curl -sO https://gist.githubusercontent.com/sekika/34cad1547e92a62a4a1b/raw/sample.tex
platex sample.tex
dvipdfmx sample.dvi
open sample.pdf &
pdffonts sample.pdf
~~~

確認後、```rm sample.*```  でファイルを消せる。

## メンテナンス

パッケージの更新

~~~
sudo tlmgr update --self --all
~~~

TeX Live のバージョン（年次）のメジャーアップグレードについては、[TeX Live のページ](http://www.tug.org/texlive/upgrade.html)ではインストールを最初からやり直すことを進めるとして、簡易な方法も書かれている。しかし、そもそもは[tlmgr のリポジトリを CTAN mirror に設定していれば、勝手にメジャーアップグレードされる](http://qiita.com/munepi/items/f2127a1dca13d775735f)という話もあり、インストールした時の年次のままで使っていれば問題なさそう。

## 参考サイト
- [TeX Live を使おう──Linux ユーザと Mac OS X ユーザのために──](http://fugenji.org/~thomas/texlive-guide/index.html) (Tamotsu Thomas UEDA, 2015)
- [TeX Wiki](http://oku.edu.mie-u.ac.jp/~okumura/texwiki/) (奥村晴彦) - [TeX Live/Mac](https://oku.edu.mie-u.ac.jp/~okumura/texwiki/?TeX%20Live%2FMac)
- [pdfにフォントが埋め込まれてるか確認するコマンドpdffonts](http://ototorosama.hatenablog.com/entry/2013/02/14/055355) (ととろぐ！臨時増刊号, 2013/2/14)
- [Mac OS Xのヒラギノフォントは商用利用可能です。](http://www.macotakara.jp/blog/support/entry-665.html) (MACお宝鑑定団 blog（羅針盤）, 2008/7/30)
