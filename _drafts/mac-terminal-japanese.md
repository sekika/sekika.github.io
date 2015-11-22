---
layout: post
title: Mac のターミナルで日本語入力
tag: mac
---
Mac OS X のターミナルで日本語入力をするための設定

- Terminal.app のテキストエンコーディングを Unicode (UTF-8) にする。
- ```LANG=ja_JP.UTF-8```
- ```~/.inputrc``` に、以下の設定をする

~~~
set input-meta on 
set output-meta on 
set convert-meta off
~~~
