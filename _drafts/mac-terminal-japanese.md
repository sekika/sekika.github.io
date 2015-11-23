---
layout: post
title: Mac のターミナルで日本語入力
tag: mac
---
Mac OS X のターミナルで日本語入力をするための設定。

- Terminal.app のテキストエンコーディングを Unicode (UTF-8) にする。
- ```LANG=ja_JP.UTF-8```
- ```~/.inputrc``` に、以下の設定をする

~~~
set input-meta on 
set output-meta on 
set convert-meta off
~~~

## 参考サイト

- [コマンドラインでの文字化け解決?: '\M-c'とは...](http://rcmdnk.github.io/blog/2013/05/29/computer-bash-screen-linux/) (rcmdnk's blog, 2013/5/29)
- [メタキー/ESCについて: iTermでそれらのキーを送る設定も](http://rcmdnk.github.io/blog/2013/05/30/computer-bash-screen-linux/)  (rcmdnk's blog, 2013/5/30)
