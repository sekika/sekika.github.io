---
layout: post
title: GitHub リポジトリと大きなファイル
tags:
- git
- github
---
GitHub で[1ヶ月7ドルの Personal Plan でプライベートリポジトリ作成無制限](https://github.com/blog/2164-introducing-unlimited-private-repositorie)となったので、いろいろなファイルをバックアップ用にプライベートリポジトリに入れることとした。大きなファイルがある時に、色々と注意することがあるので手順をメモする。

## 100MB 以上のファイルと追加料金

GitHub では、100MB 以上のファイルをリポジトリに push しようとするとエラーとなる。[Git Large File Storage (LFS)](https://git-lfs.github.com/)を使うと、100MB 以上のファイルを扱えるようになる。ここで、```Personal Plan では LFS を使わなければ容量無制限だが、100MB以上の LFS データについては 1GB までの容量制限があり、オーバーするとLFSの容量を追加購入しなければ LFS が使えなくなる。```LFSは[容量50GBと帯域 50GB / month を$5/monthで購入可能](https://help.github.com/articles/billing-plans-for-git-large-file-storage/)である。つまり、100MB以下のファイルであれば容量無制限ではあるが、100MB以上のファイルについては容量無制限ではない、というシステムとなっている。

そこで、大きなファイルは git リポジトリに入れない、という場合と、適宜 LFS で入れる場合が考えられる。その方法を以下に記す。

## リポジトリの作成
[GitHub](https://github.com/)にサインインして```New reposiroty```ボタンからリポジトリを作成する。通常はリポジトリを初期化して ```git clone``` から始めるが、すでに手元にファイルがあるので、```Initialize this repository with a README``` にはチェックを入れずにリポジトリを作成する。リポジトリにアップしようとするディレクトリで（USER と REP は書き変える）

~~~
echo "# test" >> README.md
git init
git add README.md
git commit -m "First commit"
git remote add origin git@github.com:USER/REP.git
git push -u origin master
~~~

## ファイル名からスペースを取り除く

ファイル名にスペースが入っていると色々と面倒なので、このコマンドで、カレントディレクトリ以下のファイル名について、スペースをアンダースコア「_」に一括置換してしまうのが良いと思う。

~~~
for A in $(find . | grep " " | sed -e s/" "/SPACE/g) ; do mv "$(echo $A | sed -e s/SPACE/' '/g)" "$(echo $A | sed -e s/SPACE/'_'/g)"; done
~~~

ディレクトリ名にもスペースがある場合には、エラーが出ることがある。その時には、エラーが出なくなるまで何回か同じコマンドを繰り返す。

## LFS 管理をするファイルの選択

LFS を使わないのであればここはとばす。LFSを使う場合、まずは、LFS をインストールする。Homebrew であれば

~~~
brew install git-lfs
git lfs install
~~~

次に、100MB 以上のファイルを一覧する。

~~~
find . -size +204800 -print | xargs ls -lh
~~~

この中から、LFS管理とするファイルを

~~~
git lfs track "*.psd"
~~~

のように、適宜指定する。

## バッファサイズの設定

大きいファイルを ```git push``` すると ```packet_write_wait: Connection to 192.30.252.123: Broken pipe``` ```fatal: The remote end hung up unexpectedly
```といったエラーが出やすいので、エラーを出にくくするために[HTTP post バッファサイズを上げる](http://stackoverflow.com/questions/19120120/broken-pipe-when-pushing-to-git-repository)と良い。50MB に上げるには

~~~
git config http.postBuffer 52428800
~~~

## リポジトリに追加 

多くのファイルをまとめてリポジトリに追加しようとすると、バッファイサイズを上げても ```fatal: The remote end hung up unexpectedly``` のエラーが出ることがある。そこで、このワンライナーで、まずは100MB 以下のファイルを100個ずつ ```git add``` してから ```git commit; git push``` する。

~~~
find . -type f -size -204800 | grep -v "^./.git" | cat -n | while read a b; do git add $b; if [ `echo $a | grep "00$"` ]; then git commit -m "First commit"; git push origin master; fi; done; git commit -m "First commit"; git push origin master
~~~

次に、100MB 以上のファイルを追加するためには

~~~
for i in `find . -size -204800`; do git add $i; git commit -m "LFS"; git push origin master; done
~~~

## 100MB 以上のファイルがあってエラーとなる場合

```Filename``` というファイルが 100MB 以上で、```File Filename is 230.01 MB; this exceeds GitHub's file size limit of 100.00 MB```というようなエラーが出て ```git push``` できないとき、そのファイルを git 管理から除き、履歴から[完全に削除](https://help.github.com/articles/removing-files-from-a-repository-s-history/)する。

~~~
git rm --cached Filename
git commit --amend -CHEAD
git filter-branch --index-filter 'git rm --cached --ignore-unmatch Filename' HEAD
git push origin master
~~~

必要に応じてLFS管理に入れてコミットし直す。

~~~
git lfs track Filename
git add Filename
git commit -m lfs
git push origin master
~~~

## 自動コミット

場合によっては自動コミットの設定をしておくと良い。

- [Guard で Git コミットを自動で行う](http://qiita.com/a-suenami/items/bd9a669d5779d9910fec)
