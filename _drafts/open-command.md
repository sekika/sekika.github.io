---
layout: english
title: Opening files from terminal emulator
tags:
- english
- mac
- linux
- windows
---
This article describes how to open a file from [terminal emulator](https://en.wikipedia.org/wiki/Terminal_emulator) with Mac, Linux, and Windows.

## Mac (macOS)
Use  ```open``` command in [terminal](https://en.wikipedia.org/wiki/Terminal_(macOS)). By running

~~~
open Readme.txt
~~~

Readme.txt opens with an application associated with Readme.txt.

~~~
open http://google.com
~~~

とすれば、ブラウザで Google を開くことができる。また、ディレクトリを指定すると

~~~
open .
~~~

とすれば、Finder でカレントディレクトリが開かれる。

関連付けられているアプリケーションとは異なるアプリケーションを使いたいことがある。たとえば、html ファイルをエディタで編集したい時など。```-t```オプションを使うと、デフォルトのテキストエディタで開くことができる。

~~~
open -t filename
~~~

また、```open```コマンドの```-a```オプションを使って ```-a アプリケーション```で、起動するアプリケーションを指定できる。

CotEditor で指定したファイルを開くコマンド ```cot``` を作るには、

~~~
#!/bin/sh
open $1 -a /Applications/CotEditor.app
~~~

といったシェルスクリプトを作っておき、実行可能にして ```cot```コマンドとしてパスが通る場所に置いておく。

~~~
cot filename
~~~

として、使うことができる。

```open --help``` で次のヘルプが表示される。

<pre>
Usage: open [-e] [-t] [-f] [-W] [-R] [-n] [-g] [-h] [-b &lt;bundle identifier&gt;] [-a &lt;application&gt;] [filenames] [--args arguments]
Help: Open opens files from a shell.
      By default, opens each file using the default application for that file.  
      If the file is in the form of a URL, the file will be opened as a URL.
Options: 
      -a                Opens with the specified application.
      -b                Opens with the specified application bundle identifier.
      -e                Opens with TextEdit.
      -t                Opens with default text editor.
      -f                Reads input from standard input and opens with TextEdit.
      -F  --fresh       Launches the app fresh, that is, without restoring windows. Saved persistent state is lost, excluding Untitled documents.
      -R, --reveal      Selects in the Finder instead of opening.
      -W, --wait-apps   Blocks until the used applications are closed (even if they were already running).
          --args        All remaining arguments are passed in argv to the application's main() function instead of opened.
      -n, --new         Open a new instance of the application even if one is already running.
      -j, --hide        Launches the app hidden.
      -g, --background  Does not bring the application to the foreground.
      -h, --header      Searches header file locations for headers matching the given filenames, and opens them.
</pre>

他にも、Finder と Terminal の連携をするための技がこの記事に解説されている。

- [FinderとTerminalの連携を考える](http://news.mynavi.jp/column/osxhack/109/)

## Linux の場合

```xdg-open``` または ```gnome-open``` コマンドを使う。

- [LinuxでコマンドラインからURLやファイルを開けるxdg-open/gnome-openのメモ](http://blog.browncat.org/2010/01/linux_xdg-open_gnome-open.html)

> なんだかコマンドがダサいと思われる方は.bashrcでinteractiveか判定した後に
>
> alias open=xdg-open
>
> 等としておけばいいかもしれません。

- [xdg-open(1) - Linux man page](http://linux.die.net/man/1/xdg-open)

## Windows の場合

<a href="https://ja.wikipedia.org/wiki/Cmd.exe">コマンドプロンプト</a>から ```start``` コマンドを使う。

- [意外に知らないstartコマンドの使い方](http://orangeclover.hatenablog.com/entry/20090814/1250261637)
- [別ウィンドウでコマンドを実行(START)](http://www.adminweb.jp/command/command/index1.html)

[Japanese version of this post](/2015/10/27/open-command/)
