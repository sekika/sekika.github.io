---
layout: post
title: Git コマンド
tag: git
---
忘れてしまいがちな Git コマンド

[git](https://linux.die.net/man/1/git)

git remote set-url origin git@github.com:sekika/gyafun.jp.git

gitで削除してしまったファイルの復元
http://itochin2.hatenablog.com/entry/2013/06/06/020939
git remote set-url origin git@github.com:sekika/***.git
error: The following untracked working tree files would be overwritten by merge:
と出た時
git reset --hard FETCH_HEAD

git 履歴消去
http://qiita.com/go_astrayer/items/6e39d3ab16ae8094496c


http://qiita.com/takke/items/3400b55becfd72769214

直近の4個を表示する場合

* ```git rebase -i HEAD~5```
* コミットメッセージをまとめる
* ```git push -f```


git rebase -i HEAD~10
vi のコマンド
~~~
:2,10s/pick/s/
ZZ
40ddi
コミットメッセージを書く
ZZ
~~~

git push -f

