---
layout: post
title: Apache 2.2 から 2.4 にアップグレードするときのバーチャルホスト設定の更新
date: 2015-10-22 09:32:09 +0000
tag: linux
---
Debian のサーバーを wheezy から jessy にアップグレードしたときに、apache のバージョンが 2.2 から 2.4 に上がって、バーチャルホストが見えなくなりました。そのときに、なぜ見えなくなったのかを調べて、以下のサイトに書かれている方法で解決したのでメモしておきます。

- [Updating Virtual Host Settings from Apache 2.2 to Apache 2.4](https://www.linode.com/docs/security/upgrading/updating-virtual-host-settings-from-apache-2-2-to-apache-2-4)

簡単にまとめると、このようになります。詳しくは、上記サイトを参照してください。

- Ubuntu と Debian: ```sites-available``` ディレクトリの下のバーチャルホスト設定ファイルに、 ```.conf``` の拡張子をつける必要がある。
- すべてのディストリビューション: バーチャルホスト設定ファイルの ```Directory``` ブロックの中に、このように ```Require all granted``` を入れる必要がある。

~~~ html
<Directory /path/to/public/website/>
   Require all granted
</Directory>
~~~
	
