---
layout: post
title: apache 2.2 から 2.4 にアップグレードするときのバーチャルホスト設定
tag: linux
---
Debian のサーバーを wheezy から jessy にアップグレードしたときに、apache のバージョンが 2.2 から 2.4 に上がって、バーチャルホストが見えなくなりました。そのときに、なぜ見えなくなったのかを調べてこちらに書かれている方法で解決したのでメモしておきます。

- [Updating Virtual Host Settings from Apache 2.2 to Apache 2.4](https://www.linode.com/docs/security/upgrading/updating-virtual-host-settings-from-apache-2-2-to-apache-2-4)

簡潔には、このようにまとめられます。

- Ubuntu と Debian: ```sites-available``` ディレクトリの下のバーチャルホスト設定ファイルに、 ```.conf``` の拡張子をつける必要がある。
- バーチャルホスト設定ファイルの ```Require all granted``` 適切な ```Directory``` ブロックの中に ```Require all granted``` を入れる必要がある。
~~~~
<Directory /path/to/public/website/>
   Require all granted
</Directory>
~~~~
	