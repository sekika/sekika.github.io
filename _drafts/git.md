---
layout: post
title: Git コマンドチートシート
tag: git
---
忘れてしまいがちな Git コマンドをまとめておく。

Git の勉強はこのあたりで

- [git(1) Manual Page](https://git.github.io/htmldocs/git.html)
- [Git User Manual](https://git.github.io/htmldocs/user-manual.html)
- [Git ユーザマニュアル](http://www.thekyo.jp/manual/git/)
- [Reference](https://git-scm.com/docs)

Git コマンド全般のチートシートは

- [Git Cheat Sheat (PDF)](https://services.github.com/on-demand/downloads/github-git-cheat-sheet.pdf)
- [Visual Git Cheat Sheet](http://ndpsoftware.com/git-cheatsheet.html)

以下は、個人的にしばしば使うけれど忘れてしまいがちなコマンドをまとめる。

## コミットの整理 ##

- [base -i でコミットをまとめる](http://qiita.com/takke/items/3400b55becfd72769214)

直近の4個を表示する場合

* ```git rebase -i HEAD~4```
* コミットをまとめる
* ```git push -f```

コミットをまとめるときに、vi コマンドで2行目から10行目までの pick を s に一括置換するには、

~~~
:2,10s/pick/s/
~~~

## コミット取り消し ##

~~~
git log
戻りたい場所のハッシュをコピー
git reset --hard ハッシュ値
git push -f
~~~

## コンフリクトを無視してチェックアウトする ##

git pull したときにコンフリクトが生じて、手元の変更はすべて破棄して強制的に git pull したいとき

## 削除したファイルの復元 ##

- [gitで削除してしまったファイルの復元](http://itochin2.hatenablog.com/entry/2013/06/06/020939)

## ファイルの完全削除 ##

- [Git リポジトリに上がっているファイルを履歴ごと消すには？](http://qiita.com/go_astrayer/items/6e39d3ab16ae8094496c)

## origin の URL を変える ##

~~~
git remote set-url origin <リポジトリのURL>
~~~

## 他の記事 ##
- [Office Open XML の git ファイル管理](/2015/10/19/office-open-xml-git/)
- [GitHub リポジトリに大量のファイルを一括登録する方法](http://sekika.github.io/2016/06/03/github-many-files/)

