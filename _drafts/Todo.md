---
layout: post
title: To Do リスト
tag: jekyll
---
これから書く記事や、サイト管理に関する To Do リストです。永遠に [_drafts](https://github.com/sekika/sekika.github.io/tree/master/_drafts) の中です。[公開ページ](http://sekika.github.io)と[チートシート](http://sekika.github.io/2015/10/12/cheetsheet/)。

## 記事 ##

### Linuxbrew ###

- [Linuxbrew](https://github.com/Homebrew/linuxbrew)

32 bit では動かない

uname -a でi686, i686, i386と表示された場合は、32bitカーネル、X86_64やamd64と表示された場合は、64bitカーネル。

### 最終更新日 ###

YAML に Update: フィールドがある記事のみ、最終更新日を表示する。[更新履歴](https://github.com/sekika/sekika.github.io/commits/master/_posts/2015-10-27-open-command.md)へのリンクも表示する。

[Get today's date in Jekyll with Liquid markup](http://stackoverflow.com/questions/12464656/get-todays-date-in-jekyll-with-liquid-markup) の方法だと、レイアウトを更新した時にも日時が変わってしまうか？

[How to show the modification date of a file in Jekyll?](http://stackoverflow.com/questions/14978474/how-to-show-the-modification-date-of-a-file-in-jekyll) に書かれている [pre-commit フック](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%9E%E3%82%A4%E3%82%BA-Git-%E3%83%95%E3%83%83%E3%82%AF) を ```.git/hooks/pre-commit``` に置いて、Update フィールドを直接編集してしまう。sed の[address range](http://sed.sourceforge.net/sedfaq3.html) で、フロントマターの範囲を指定して置換する。

```git diff --cached --name-status``` で、
　
~~~~
M       _posts/2015-11-12-filename.md
~~~~

のように表示されるファイルに対して実行。

### Windows 10 ###
Windows 7 と Ubuntu のデュアルブートから、Windows 10 へのアップグレード
１回目失敗、Windows 7 に戻った
高速スタートアップの無効化
BIOSメニュー
管理者パスワードの設定
成功

Grub のメニュー

http://ubiqlog.com/archives/5164

/boot/grub/grub.cfg は、編集不可
/etc/grub.d/30_os-prober を編集すればいい？
http://askubuntu.com/questions/666317/grub2-shows-windows-7-instead-of-windows-10

/usr/lib/os-probes/mounted/20microsoft の編集
os-prober
update-grub
まだ、メニューは変わらず


### 土壌の物理性「古典を読む」
- Allison
- 大村さん

### Todo管理
- Toodledo
- トドうち

### HTML Slidy
- [Slidyでスライド作成](http://d.hatena.ne.jp/haradago/20070919/p1)
- [プレゼンを作るときに便利なHTML Slidy](http://blueskis.wktk.so/blog/2012/05/html-slidy/#.Vixm_67hDaZ)
- [HTML Slidy: Slide Shows in HTML and XHTML](http://www.w3.org/Talks/Tools/Slidy2/)

### 紀要
マルチスケール法紹介

## サイト管理 ##
- http://sekika.github.io/tags/ に、タグの description をひろうか？ひろえるか？

