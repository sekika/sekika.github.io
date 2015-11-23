---
layout: post
title: Mac のターミナルで日本語入力
date: 2015-11-23 03:05:35 +0000
tag: mac
---
Mac OS X のターミナルで日本語入力をするための設定。だいたいはデフォルトでうまくいくようだけど、うまくいかない時の確認用。

- ターミナル＞環境設定＞設定＞詳細＞Control + V で非ASCII入力をエスケープ　のチェックをはずす。
- ターミナル＞環境設定＞設定＞詳細＞テキストエンコーディング　を Unicode (UTF-8) にする。
- 環境変数の設定 ```LANG=ja_JP.UTF-8```
- ```~/.inputrc``` に、以下の設定をする

~~~
set input-meta on 
set output-meta on 
set convert-meta off
~~~

## 参考サイト

- [コマンドラインでの文字化け解決?: '\M-c'とは...](http://rcmdnk.github.io/blog/2013/05/29/computer-bash-screen-linux/) (rcmdnk's blog, 2013/5/29)
- [メタキー/ESCについて: iTermでそれらのキーを送る設定も](http://rcmdnk.github.io/blog/2013/05/30/computer-bash-screen-linux/)  (rcmdnk's blog, 2013/5/30)
- [MacBook Air ターミナルからtelnetした先で日本語入力したら文字化けしちゃう問題が解決したのでメモっとく](http://d.hatena.ne.jp/knaka20blue/20080304/1204630986) (Solr, Python, MacBook Air in Shinagawa Seaside RSSフィード, 2008/3/4)
- [Macでロケール環境変数を設定しようとした話](http://pla0net.blogspot.jp/2015/01/mac.html) (綴点, 2015/1/13)
