---
layout: post
title: To Do リスト
tag: jekyll
---
これから書く記事や、サイト管理に関する To Do リストです。永遠に [_drafts](https://github.com/sekika/sekika.github.io/tree/master/_drafts) の中です。[公開ページ](http://sekika.github.io)と[チートシート](http://sekika.github.io/2015/10/12/cheetsheet/)。

## 記事 ##

### 一太郎 ###

[オフィスソフトの比較](http://localhost:4000/2015/11/12/office-soft/) に追記

（Update フィールド埋め込み処理）

純国産ワープロソフトの一太郎は、かつては国内最大のシェアを持っていたが、Microsoft Office の Word にシェアを奪われてしまった。独自形式のファイルを使うが、Word 形式や ```ODF``` 形式にも対応している。表計算とプレゼンテーションソフトを備えるオフィス製品が、法人向け、官公庁向け、警察機関向けに用意されている。日本の役所が作る書類は無駄に罫線が多く、罫線が多い文書の作成は Word よりも一太郎の方が使いやすいとの定評がある。私は罫線が多い書類を作成するのが嫌いである。

- [一太郎Web](http://www.ichitaro.com/)
- [JUST Office](http://www.justsystems.com/jp/products/justoffice/)
- [一太郎](http://dic.nicovideo.jp/a/%E4%B8%80%E5%A4%AA%E9%83%8E) (ニコニコ大百科)
- [一太郎と官公庁](http://openblog.meblog.biz/article/4178623.html) (Open ブログ, 2011/2/18)
- [官公庁のワープロソフトも一太郎からwordへ](http://saiunlaw.blog40.fc2.com/blog-entry-248.html) (弁護士ZEKE（ジーク）の法律問題etc.ブログ, 2012/2/5)

### Linuxbrew ###

- [Linuxbrew](https://github.com/Homebrew/linuxbrew)

32 bit では動かない

uname -a でi686, i686, i386と表示された場合は、32bitカーネル、X86_64やamd64と表示された場合は、64bitカーネル。

### 最終更新日 ###

YAML に Update: フィールドがある記事のみ、最終更新日を表示する。[更新履歴](https://github.com/sekika/sekika.github.io/commits/master/_posts/2015-10-27-open-command.md)へのリンクも表示する。

[Get today's date in Jekyll with Liquid markup](http://stackoverflow.com/questions/12464656/get-todays-date-in-jekyll-with-liquid-markup) の方法だと、レイアウトを更新した時にも日時が変わってしまうか？

[How to show the modification date of a file in Jekyll?](http://stackoverflow.com/questions/14978474/how-to-show-the-modification-date-of-a-file-in-jekyll) に書かれている [pre-commit フック](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%9E%E3%82%A4%E3%82%BA-Git-%E3%83%95%E3%83%83%E3%82%AF) を ```.git/hooks/pre-commit``` に置いて、Update フィールドを直接編集してしまう。sed の[address range](http://sed.sourceforge.net/sedfaq3.html) で、フロントマターの範囲を指定して置換する。

```git diff --cached --name-status``` で、```M       _posts/2015-11-12-filename.md``` のように表示されるファイルに対して実行。

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

