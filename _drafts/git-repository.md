---
layout: post
title: 自分専用 Git リポジトリの作成
tag: git
---
[無料でGithubライクな共同開発環境を「さくらインターネット」で実現する](http://www.happyquality.com/2011/09/22/1322.htm)を参考に、リポジトリを作成した。

すでに、さくらには git がインストールされているので、インストールは不要。とても簡単にできた。ついでに、$HOME/git の下に CreateRepository.sh というシェルスクリプトを作成した。これで、

```
cd git
./CreateRepository repository
```

で簡単にリポジトリが作成できるようになった。

{% gist 2206f77e1302c6e4f13c %}

