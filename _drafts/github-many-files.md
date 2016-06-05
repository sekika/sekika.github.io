---
layout: post
title: Uploading many files to GitHub repository
date: 2016-06-03 07:16:54 +0000
tags:
- english
- git
- github
---
As [GitHub introduced unlimited private repositories](https://github.com/blog/2164-introducing-unlimited-private-repositorie), I uploaded gigabytes of data for backup. I had some troubles uploading many files to GitHub repository, but finally I manged to do so. Here's how.

## 100MB 以上のファイルと追加料金

GitHub では、100MB 以上のファイルをリポジトリに push しようとするとエラーとなる。[Git Large File Storage (LFS)](https://git-lfs.github.com/)を使うと、100MB 以上のファイルを扱えるようになる。ここで、```Personal Plan では 100MB以下のファイルについては容量無制限だが、100MB以上の LFS 管理のファイルについては 1GB までの容量制限があり、```オーバーするとLFSの容量を追加購入しなければ LFS が使えなくなる。LFSは[容量50GBと帯域 50GB / month を$5/monthで購入可能](https://help.github.com/articles/billing-plans-for-git-large-file-storage/)である。

そこで、100MB以下のファイルだけを git リポジトリに入れる、という使い方と、LFS で全てのファイル（あるいは一部の大容量ファイル）を入れる、という使い方が考えられる。ここでは、両方の使い方に対応して記述する。

## リポジトリの作成

[GitHub](https://github.com/)にサインインして```New reposiroty```ボタンからリポジトリを作成する。通常はリポジトリを初期化して ```git clone``` から始めるが、ここではすでに手元にリポジトリに登録しようとするファイルがあるという状況の話をしているので、```Initialize this repository with a README``` にはチェックを```入れずに```リポジトリを作成する。まず、```REAME.md``` が存在しなければ、仮のファイルを

~~~
echo "# test" >> README.md
~~~

として作成する。続いて、次の一連のコマンドでリポジトリを初期化し、README.md をリポジトリに追加し、初期設定をする（```USER と REP は書き変える```）。

~~~
git init
git add README.md
git commit -m "First commit"
git remote add origin git@github.com:USER/REP.git
git push -u origin master
~~~

## ファイル名からスペースを取り除く

ファイル名にスペースが入っていると色々と面倒なので、このコマンドで、カレントディレクトリ以下のファイル名について、スペースをアンダースコア「_」に一括置換してしまうのが良いと思う（それによって何らかの問題が生じないのであれば）。

~~~
for A in $(find . | grep " " | sed -e s/" "/x3Exe/g) ; do mv "$(echo $A | sed -e s/x3Exe/' '/g)" "$(echo $A | sed -e s/x3Exe/'_'/g)"; done
~~~

ディレクトリ名にもスペースがある場合には、エラーが出ることがある。その時には、エラーが出なくなるまで何回か同じコマンドを繰り返す。

## LFS 管理をするファイルの選択

LFS を使わないのであればここはとばす。LFSを使う場合、まずは、[LFS](https://git-lfs.github.com/) をインストールする。Homebrew であれば

~~~
brew install git-lfs
~~~

である。そして、Git に LFS をセットアップする。

~~~
git lfs install
~~~

次に、100MB 以上のファイルを一覧する。

~~~
find . -size +100M | xargs du -sh
~~~

この中から、LFS管理とするファイルを適宜指定する。例えば、拡張子 .psd のファイルをまとめて指定するには

~~~
git lfs track "*.psd"
~~~

## git で管理しないファイルの設定

LFSを使わない場合、あるいはLFSを一部のファイルのみにしか使わない場合には、git で管理をしないファイルを ```.gitignore``` に設定する。

100MB以上のファイルをすべて ```.gitignore``` ファイルに加えるには

~~~
find . -size +100M | sed -e 's/^\.\///' >> .gitignore
~~~

## バッファサイズの設定

大きいファイルを ```git push``` すると

<blockquote>
packet_write_wait: Connection to 192.30.252.123: Broken pipe<br>
fatal: The remote end hung up unexpectedly<br>
error: failed to push some refs to 'git@github.com:USER/REP.git'
</blockquote>

といったエラーが出やすいので、エラーを出にくくするために[HTTP post バッファサイズを上げる](http://stackoverflow.com/questions/19120120/broken-pipe-when-pushing-to-git-repository)と良い。50MB に上げるには

~~~
git config http.postBuffer 52428800
~~~

## リポジトリに追加 

```git add -A; git commit; git push``` で追加できれば良いのだけれど、何ギガバイトもあるような大量のファイルをリポジトリに追加しようとすると、バッファイサイズを上げても ```fatal: The remote end hung up unexpectedly``` のエラーが出ることがある。そこで、段階的にファイルをリポジトリに追加するスクリプト ```gitadd``` を作成した。

{% gist 570495bd0627acff6c836de18e78f6fd %}

最初に ```git add -A; git commit; git push``` をやってエラーが出ててしまった時には ```git reset HEAD~``` で commit と index を戻してから、このスクリプト ```gitadd``` を実行する。

## 100MB 以上のファイルがあってエラーとなる場合

```Filename``` というファイルが 100MB 以上で、```File Filename is 230.01 MB; this exceeds GitHub's file size limit of 100.00 MB```というようなエラーが出て ```git push``` できないとき、そのファイルを git 管理から除き、履歴から[完全に削除](https://help.github.com/articles/removing-files-from-a-repository-s-history/)する。

~~~
git rm --cached Filename
git commit --amend -CHEAD
git filter-branch --index-filter 'git rm --cached --ignore-unmatch Filename' HEAD
git push origin master
~~~

```git filter-branch --index-filter 'git rm --cached --ignore-unmatch Filename' HEAD``` に対して ```A previous backup already exists in refs/original/``` のようなメッセージが出た時には、

~~~
git update-ref -d refs/original/refs/heads/master
~~~

で refs/original/ を消す。

必要に応じてLFS管理に入れてコミットし直す。

~~~
git lfs track Filename
git add Filename
git commit -m lfs
git push origin master
~~~

## 管理

~~~
git pull; git add -A; git commit -m "commit" && git push
~~~

とすればアップデートされていくので、お好みで crontab に入れる。
