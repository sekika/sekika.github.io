---
layout: post
title: Terminal からファイルを開く
tag: mac linux windows
---
Terminal からファイルを開く方法について、Mac, Linux, Windows それぞれの方法をメモ。

## Mac の場合
Mac では ```open``` コマンドを使う。

~~~
open Readme.txt
~~~

とすると、Readme.txt に関連付けられているアプリケーションで Readme.txt が開かれる。

~~~
open http://google.com
~~~

とすれば、ブラウザで Google を開くことができる。また、ディレクトリを指定すると

~~~
open .
~~~

とすれば、Finder でカレントディレクトリが開かれる。Linux では、同様のコマンドは ```xdg-open``` がある。

関連付けられているアプリケーションとは異なるアプリケーションを使いたいことがある。たとえば、html ファイルをエディタで編集したい時など。そのときには、```open```コマンドの```-a```オプションを使う。```-a アプリケーション```で、起動するアプリケーションを指定できる。

CotEditor で指定したファイルを開くコマンド ```cot``` を作るには、

~~~
#!/bin/sh
open $1 -a /Applications/CotEditor.app
~~~

といったシェルスクリプトを作っておき、```cot```コマンドとしてパスが通る場所に置いておく。

```
cot filename
```

として、使うことができる。

他にも、Finder と Terminal の連携をするための技がこの記事に解説されている。

- [FinderとTerminalの連携を考える](http://news.mynavi.jp/column/osxhack/109/)

## Linux の場合

xdg-open または gnome-open コマンドを使う。

- [LinuxでコマンドラインからURLやファイルを開けるxdg-open/gnome-openのメモ](http://blog.browncat.org/2010/01/linux_xdg-open_gnome-open.html)

> なんだかコマンドがダサいと思われる方は.bashrcでinteractiveか判定した後に
>
> alias open=xdg-open
>
> 等としておけばいいかもしれません。

## Windows の場合

コマンドプロンプトから start コマンドを使う。

- [意外に知らないstartコマンドの使い方](http://orangeclover.hatenablog.com/entry/20090814/1250261637)
- [別ウィンドウでコマンドを実行(START)](http://www.adminweb.jp/command/command/index1.html)

