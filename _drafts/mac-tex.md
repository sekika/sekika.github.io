---
layout: post
title: Mac で TeX / LaTeX
tags:
- mac
- tex
---
`Mac OS X` で `TeX` / `LaTeX` を使えるようにするための手順を記す。MacTeX はあえて使わずに、`TeX Live` を直接入れる。詳しくは[参考サイト](#ref)参照。

## インストール

- `El Capitan` で `/usr/local` ディレクトリが存在しない場合には、[あらかじめ作成しておく]({% post_url 2015-11-26-el-capitan-homebrew %})必要がある。 
- [TeX Live](http://www.tug.org/texlive/) から [install-tl-unx.tar.gz](http://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz) をダウンロード、展開して `install-tl-yyyymmdd` ディレクトリ内で ```sudo ./install-tl``` を実行。
- パスを通すために、```~/.bash_profile``` にこの行を追記。インストールする Tex Live の年次によって、2015 のところは変わるはず。

~~~
export PATH=$PATH:/usr/local/texlive/2015/bin/x86_64-darwin
~~~

- [tlmgr](http://www.fugenji.org/~thomas/texlive-guide/tlmgr.html) の設定

~~~
sudo tlmgr option repository http://mirror.ctan.org/systems/texlive/tlnet
~~~

- [pdffonts](http://ototorosama.hatenablog.com/entry/2013/02/14/055355) を使えるようにするために（要 [Homebrew](http://brew.sh/index_ja.html))

~~~
brew install poppler
~~~

## ヒラギノフォントの埋め込み設定

(1) OS X 10.10 / Yosemite 以前の場合には

~~~
sudo mkdir -p /usr/local/texlive/texmf-local/fonts/opentype/public/hiragino/
cd /usr/local/texlive/texmf-local/fonts/opentype/public/hiragino/
sudo ln -s "/Library/Fonts/ヒラギノ明朝 Pro W3.otf" ./HiraMinPro-W3.otf
sudo ln -s "/Library/Fonts/ヒラギノ明朝 Pro W6.otf" ./HiraMinPro-W6.otf
sudo ln -s "/Library/Fonts/ヒラギノ丸ゴ Pro W4.otf" ./HiraMaruPro-W4.otf
sudo ln -s "/Library/Fonts/ヒラギノ角ゴ Pro W3.otf" ./HiraKakuPro-W3.otf
sudo ln -s "/Library/Fonts/ヒラギノ角ゴ Pro W6.otf" ./HiraKakuPro-W6.otf
sudo ln -s "/Library/Fonts/ヒラギノ角ゴ Std W8.otf" ./HiraKakuStd-W8.otf
sudo mktexlsr
sudo kanji-config-updmap-sys hiragino
~~~

* [ターミナルで日本語入力ができない時の設定]({% post_url 2015-11-23-mac-terminal-japanese %})

(2) OS X 10.11 / El Capitan の場合には

~~~
cd /usr/local/texlive/2015/texmf-dist/scripts/cjk-gs-integrate
sudo perl cjk-gs-integrate.pl --link-texmf --force
sudo mktexlsr
sudo kanji-config-updmap-sys hiragino-elcapitan-pron
~~~

* 最初の行の `2015` については、インストールされている Tex Live の年次にあわせて変える。
* [JIS X 0213](https://ja.wikipedia.org/wiki/JIS_X_0213)に対応したヒラギノの [N シリーズ](http://fontnavi.jp/zakkuri/205-N_fonts.aspx)を埋め込む。
* 未検証。

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

TeX Live のバージョン（年次）のメジャーアップグレードについては、[TeX Live のページ](http://www.tug.org/texlive/upgrade.html)ではインストールを最初からやり直すことを勧める、としている。しかし、そもそもは[tlmgr のリポジトリを CTAN mirror に設定していれば、勝手にメジャーアップグレードされる](http://qiita.com/munepi/items/f2127a1dca13d775735f)という話もあり、インストールした時の年次のままで tlmgr でパッケージの更新を続けていれば、わざわざインストールをやり直す必要はなさそう。

ちなみに、私の場合は次のような ```update``` というスクリプトを書いて、TeX Live, Homebrew, pip のアップデートをまとめてしている。ここで、```pip-review``` の実行には ```pip install pip-review``` が必要。

~~~
#!/bin/sh
sudo tlmgr update --self --all
brew update
brew upgrade
pip-review --auto
~~~

## <a name="ref">参考サイト</a>
- [TeX Live を使おう──Linux ユーザと Mac OS X ユーザのために──](http://fugenji.org/~thomas/texlive-guide/index.html) (Tamotsu Thomas UEDA, 2015)
- [TeX Wiki](http://oku.edu.mie-u.ac.jp/~okumura/texwiki/) (奥村晴彦) - [TeX Live/Mac](https://oku.edu.mie-u.ac.jp/~okumura/texwiki/?TeX%20Live%2FMac)
- [TeX界の El Capitan 迎撃戦記](http://doratex.hatenablog.jp/entry/20151008/1444310306) (TeX Alchemist Online, 2015/10/8)
- [Mac OS Xのヒラギノフォントは商用利用可能です。](http://www.macotakara.jp/blog/support/entry-665.html) (MACお宝鑑定団 blog（羅針盤）, 2008/7/30)
