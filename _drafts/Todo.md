---
layout: post
title: To Do リスト
tag: jekyll
---
これから書く記事や、サイト管理に関する To Do リストです。永遠に [_drafts](https://github.com/sekika/sekika.github.io/tree/master/_drafts) の中です。[公開ページ](http://sekika.github.io)と[チートシート](http://sekika.github.io/2015/10/12/cheetsheet/)。

## 記事 ##

### open コマンド
- [FinderとTerminalの連携を考える](http://news.mynavi.jp/column/osxhack/109/)
{% gist 63b5987deb3baca8f546 %}
- xdg-open

### VirtualBox 仮装ディスクの拡張
http://www.virment.com/extend-virtualbox-disk/

~~~~
VBoxManage modifyhd 拡張したい仮想マシンの仮想ディスクのパス —-resize 拡張後のディスク容量
~~~~

Debian SATA ドライブに Windows のディスクを追加
gparted で Cドライブに相当する /dev/sdb2 を拡大
Debian からは Windows のディスクを削除
Windows として起動
チェックディスクが立ち上がる
再起動、無事にCドライブが拡張された

http://tech.ewdev.info/2014/10/2140/


Windows 7 の場合
システムとセキュリティー
管理ツール
コンピューターの管理
ディスクの管理
Cドライブを右クリックして「ボリュームの拡張」
しかし、ブートボリュームは拡張できない
Linux からいじる

関連：「Windows 10を入手する」アプリは表示されましたか
http://www.atmarkit.co.jp/ait/articles/1506/04/news013.html

### Drafts 管理
- Makefile
- pub スクリプト

### 土壌の物理性「古典を読む」
- Allison
- 大村さん

### Todo管理
- Toodledo
- トドうち

### 紀要
マルチスケール法紹介

## サイト管理 ##
- 関連キーワード
- http://sekika.github.io/tags/ に、タグの description をひろうか？ひろえるか？

