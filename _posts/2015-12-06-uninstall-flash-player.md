---
layout: post
title: Flash Player のアンインストール
date: 2015-12-06 07:36:58 +0000
tag: security
---
[アドビ自らFlashに白旗宣言…。HTML5への移行を推奨](http://www.gizmodo.jp/2015/12/flashhtml5must.html)という記事が出ている。[Adobe のブログ記事](http://blogs.adobe.com/conversations/2015/11/flash-html5-and-open-web-standards.html)には "while continuing to support the creation of Flash content" とあり、サポートは続けるとしているものの、Flash はそろそろ「過去の技術」となりつつある。

Flash Player をインストールしておく利益（Flash サイトを閲覧できる）とリスク（`Flash Player の脆弱性を利用したウィルス・マルウェアに感染する`）を比較した時に、リスクが上回ると判断して、Flash Player はアンインストールすることとした。PCでニコニコ動画の閲覧ができなくなるが、どうしても閲覧したい動画があるときには iPad のアプリを使うことにする。

* [Ｆｌａｓｈ脆弱性、対策しにくい「ゼロデイ攻撃」とは](http://www.yomiuri.co.jp/science/goshinjyutsu/20151016-OYT8T50148.html) (読売新聞, 2015/10/16)
* [Adobe Flashの新たなゼロデイ脆弱性を確認、不正広告に利用](http://blog.trendmicro.co.jp/archives/10837) (トレンドマイクロ, 2015/2/2)

## Flash Player アンインストールの方法

以下のサイトにしたがって、Flash Player をアンインストールすることができる。

* [Flash Player をアンインストールする方法](https://helpx.adobe.com/jp/flash-player/kb/230810.html)

ただし、これだけでは Google Chrome の Adobe Flash Player プラグインは削除されない。Chrome のプラグインを無効にするためには、[Chrome でプラグインを追加、削除、管理する](https://support.google.com/chrome/answer/142064?hl=ja)に書かれている通り、このようにする。

~~~
1. パソコンで Chrome を開きます。
2. 上部のアドレスバーに「chrome://plugins/」と入力し、Enter キーを押します。
3. 有効または無効にするプラグインの横にある [有効にする] または [無効にする] をクリックします。
~~~
