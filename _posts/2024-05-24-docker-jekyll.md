---
layout: post
title: Docker で jekyll
date: 2024-05-24 06:56:54 +0000
tag: jekyll
---
このページの下書きを手元で見る時に、以前は Mac 上で jekyll を動かしていたけれど、最近は Docker 上で動かしている。参考までに設定をまとめておく。

Docker イメージは jekyll もあるようだけれど、個人管理のものだけでオフィシャルイメージはないようなので、[ruby のオフィシャルイメージ](https://hub.docker.com/_/ruby)を使っている。jekyll が動けばいいので軽量の alpine を使い、このような Dockerfile としている。

{% gist ea00060e4c56269b2b4d24ba16fae7c6 %}

entrypoint.sh はこのファイル

{% gist 7ec7dbe520e0381b1f449581ef903880 %}

さらに、[このような Makefile](https://gist.github.com/sekika/a486fb7d07df30ff86e75c960051cfc1)を作っている。冒頭の repo 変数はレポジトリのローカルパスを入れる。`make open` で Docker が起動していなければ起動して（Mac 限定）、`make install` でコンテナを作り `make start` で localhost にサーバーを起動する。ここで、`make start` だけで Docker の起動から一連の処理をしてサーバーが起動される。`make stop` でサーバーが停止して、`make sh` でシェルに入り、`make root` でルートのシェルに入り、`make update` で alpine パッケージと gem をアップデートして、`make clean` でコンテナを消去して、`make reinstall` でコンテナを再インストールする。Ruby や alpine の新しいバージョンのイメージがあれば、これで最新になる。

このような Makefile と Dockerfile の組を使うシステムごとに作成している。さらには、ディレクトリに入るのも面倒なので、起動と停止のためのシェルスクリプトを作っている。

Mac 上で直接 jekyll を動かしていた時と比べると、うまく動かなくて困ることがなくなった。
