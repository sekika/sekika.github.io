---
layout: post
title: Git コマンドチートシート
date: 2017-05-07 03:24:52 +0000
tag: git
---
個人的にたまに使うけれど忘れてしまいがちな Git コマンドをまとめておく。

## 参考サイト ##

まずは Git 全般に関する参考サイトから

- [Pro Git book 日本語](https://git-scm.com/book/ja/)
- [Git ユーザマニュアル](http://www.thekyo.jp/manual/git/)
- [git(1) Manual Page](https://git.github.io/htmldocs/git.html)
- [Git User Manual](https://git.github.io/htmldocs/user-manual.html)
- [Reference](https://git-scm.com/docs)

Git コマンド全般のチートシート

- [Git Cheat Sheat (PDF)](https://services.github.com/on-demand/downloads/github-git-cheat-sheet.pdf)
- [Visual Git Cheat Sheet](http://ndpsoftware.com/git-cheatsheet.html)

## コンフリクトの解消 ##

- [とりあえずのGitメモ](http://qiita.com/izcomaco/items/78030cb1bb269234cf6f) コンフリクトした時
- [git checkout で error: Your local changes to the following files would be overwritten by checkoutと言われる解決方法](http://qiita.com/pugiemonn/items/6f3adef98d279a5aac98)

~~~
git stash save -u
git stash list
git pull
git stash pop
~~~

stash を戻さずに消すなら

~~~
git stash drop
~~~

&lt;file&gt; を直前のコミットの状態に戻すには

~~~
get checkout -- <file>
~~~

## コミットの整理 ##

- [rebase -i でコミットをまとめる](http://qiita.com/takke/items/3400b55becfd72769214)
- [Git のさまざまなツール - 歴史の書き換え](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%81%95%E3%81%BE%E3%81%96%E3%81%BE%E3%81%AA%E3%83%84%E3%83%BC%E3%83%AB-%E6%AD%B4%E5%8F%B2%E3%81%AE%E6%9B%B8%E3%81%8D%E6%8F%9B%E3%81%88)

直近の4個を表示する場合

* ```git rebase -i HEAD~4```
* コミットをまとめる
* ```git push -f```

コミットをまとめるときに、vi コマンドで2行目から10行目までの pick を s に一括置換するには、

~~~
:2,10s/pick/s/
~~~

## コミット取り消し ##

- [ワーキングツリー、インデックス、HEADを使いこなす方法](http://qiita.com/shuntaro_tamura/items/db1aef9cf9d78db50ffe)

直前のコミットを取り消し

~~~
git reset --hard HEAD^
~~~

コミット後の変更を全部取り消し

~~~
git reset --hard HEAD
~~~

任意の場所に戻る

~~~
git log
戻りたい場所のハッシュをコピー
git reset --hard ハッシュ値
~~~

リモートに反映

~~~
git push -f
~~~

直前のコミット変更だけなら

~~~
git commit --amend
~~~

## 削除したファイルの復元 ##

- [gitで削除してしまったファイルの復元](http://itochin2.hatenablog.com/entry/2013/06/06/020939)

## ファイルの完全削除 ##

- [Git リポジトリに上がっているファイルを履歴ごと消すには？](http://qiita.com/go_astrayer/items/6e39d3ab16ae8094496c)

## リモートリポジトリ ##

リモートの表示

~~~
git remote -v
~~~

URL を変える

~~~
git remote set-url origin <リポジトリのURL>
~~~

## もろもろ ##
- [git clean](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%81%95%E3%81%BE%E3%81%96%E3%81%BE%E3%81%AA%E3%83%84%E3%83%BC%E3%83%AB-%E4%BD%9C%E6%A5%AD%E3%81%AE%E9%9A%A0%E3%81%97%E3%81%8B%E3%81%9F%E3%81%A8%E6%B6%88%E3%81%97%E3%81%8B%E3%81%9F) -n
- [git grep](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%81%95%E3%81%BE%E3%81%96%E3%81%BE%E3%81%AA%E3%83%84%E3%83%BC%E3%83%AB-%E6%A4%9C%E7%B4%A2)


## 初期設定 ##

~~~
git config --global user.name "Katsutoshi Seki"
git config --global user.email sekika@users.noreply.github.com
~~~

## 他の記事 ##
- [Office Open XML の git ファイル管理](/2015/10/19/office-open-xml-git/)
- [GitHub リポジトリに大量のファイルを一括登録する方法](http://sekika.github.io/2016/06/03/github-many-files/)

