---
layout: post
title: 自分専用 Git リポジトリの作成
date: 2015-10-13 18:52:31 +0000
tag: git
---
[無料でGithubライクな共同開発環境を「さくらインターネット」で実現する](http://www.happyquality.com/2011/09/22/1322.htm)を参考に、リポジトリを作成した。
「共同開発」はしていないのだけど、自分専用の非公開リジポトリを持っておくのは便利。

すでに、さくらには git がインストールされているので、インストールは不要。とても簡単にできた。ついでに、$HOME/git の下に CreateRepository.sh というシェルスクリプトを作成した。これで、

~~~
cd git
./CreateRepository repository
~~~

で簡単にリポジトリを作成して ssh でアクセスできるように設定できるようになった。

これが CreateRepository.sh で、3行目の ```host=hostname.example.com``` をリポジトリを作成するホストのホスト名に変えて使う。

{% gist 2206f77e1302c6e4f13c %}

ついでに、[.git を見えなくする .htaccess ファイルの書き方](http://stackoverflow.com/questions/6142437/make-git-directory-web-inaccessible) についてメモしておく。

~~~~
RedirectMatch 404 /\.git
~~~~
