---
layout: post
title: El Capitan とHomebrew
date: 2015-11-26 09:57:09 +0000
tags:
- mac
---
[El Capitan & Homebrew](https://github.com/Homebrew/homebrew/blob/master/share/doc/homebrew/El_Capitan_and_Homebrew.md) には、OS X 10.11/El Capitan 以降で[Homebrew](http://brew.sh/index_ja.html) をインストールするために、 `/usr/local` ディレクトリを作成して所有者を一般ユーザーとする方法について、このように解説されている。

OS X 10.11/El Capitan では、[System Integrity Protection](https://en.wikipedia.org/wiki/System_Integrity_Protection) (SIP, rootless) というセキュリティの機能により、`/usr`, `/System` と `/bin` ディレクトリの下は、root であっても書き込みができなくなった。ただし、`/usr/local` の下は書き込みができる。ところが、`/usr/local` ディレクトリがない場合、あるいは消してしまった場合には、`/usr` ディレクトリの下が書き込みできないため、`/usr/local` ディレクトリを簡単に作成できない。その時には、このようにする。

## /usr/local がすでに存在する場合

~~~
sudo chown -R $(whoami):admin /usr/local
~~~

## /usr/local が存在しない場合

まずは、通常の方法で `/usr/local` の作成を試みる。

~~~
sudo mkdir /usr/local && sudo chflags norestricted /usr/local && sudo chown -R $(whoami):admin /usr/local
~~~

SIP のためにこの方法で `/usr/local` の作成ができなかったときには、このようにする。

* Command + R キーを押しながら再起動して、[復元システム](https://support.apple.com/ja-jp/HT201314)を起動する。
* ターミナルを起動して、このコマンドを実行する。
    `csrutil disable`
* 通常の方法で再起動する。
* ターミナルを起動して、このコマンドを実行する。

~~~
sudo mkdir /usr/local && sudo chflags norestricted /usr/local && sudo chown -R $(whoami):admin /usr/local
~~~

* Command + R キーを押しながら再起動して、復元システムを起動する。
* ターミナルを起動して、このコマンドを実行する。
  `csrutil enable`
* 通常の方法で再起動する。これで、`/usr/local` に一般ユーザー権限で書き込み可能となり、Homebrew のインストールが可能となる。
