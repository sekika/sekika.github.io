---
layout: post
title: Terminal からファイルを開く
tag: mac linux
---
Terminal からファイルを開くには、Mac では open コマンドを使う。

> open Readme.txt

とすると、Readme.txt に関連付けられているアプリケーションで Readme.txt が開かれる。

> open http://google.com

とすれば、ブラウザで Google を開くことができる。また、ディレクトリを指定すると

> open .

とすれば、Finder でカレントディレクトリが開かれる。Linux では、同様のコマンドは ```xdg-open``` がある。

- [FinderとTerminalの連携を考える](http://news.mynavi.jp/column/osxhack/109/)
{% gist 63b5987deb3baca8f546 %}

## Linux の場合
- [LinuxでコマンドラインからURLやファイルを開けるxdg-open/gnome-openのメモ](http://blog.browncat.org/2010/01/linux_xdg-open_gnome-open.html)

> なんだかコマンドがダサいと思われる方は.bashrcでinteractiveか判定した後に
>
> alias open=xdg-open
>
> 等としておけばいいかもしれません。

## Windows の場合

start コマンドを使う。

- [意外に知らないstartコマンドの使い方](http://orangeclover.hatenablog.com/entry/20090814/1250261637)
- [別ウィンドウでコマンドを実行(START)](http://www.adminweb.jp/command/command/index1.html)

