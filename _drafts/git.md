---
layout: post
title: GitHub リポジトリに大きなファイルを入れる
tags:
- git
- github
---
GitHub で[1ヶ月7ドルの Personal Plan でプライベートリポジトリ作成無制限](https://github.com/blog/2164-introducing-unlimited-private-repositorie)となったので、いろいろなファイルをバックアップ用にプライベートリポジトリに入れることとした。大きなファイルを GitHub リポジトリに入れるために、いくつかの注意することがあるのでメモする。

## 100MB 以上のファイルと追加料金

GitHub では、100MB 以上のファイルをリポジトリに push しようとするとエラーとなる。[Git Large File Storage (LFS)](https://git-lfs.github.com/)を使うと、100MB 以上のファイルを扱えるようになる。ここで、Personal Plan では LFS を使わなければ容量無制限だが、LFS のデータについては 1GB までとなっていて、オーバーすると LFS が使えなくなる。1月50GBを$4.83で購入可能である。つまり、容量無制限とは言いながら、大きなファイルをどんどん入れるためには追加料金を払う必要がある、というシステムとなっている。

そこで、大きなファイルは git リポジトリに入れない、という場合や、適宜選択して入れる場合などが考えられる。その方法を以下に記す。

## リポジトリの作成
[GitHub](https://github.com/)にサインインして```New reposiroty```ボタンからリポジトリを作成する。通常はリポジトリを初期化して ```git clone``` から始めるが、すでに手元にファイルがあるので、```Initialize this repository with a README``` にはチェックを入れずにリポジトリを作成する。リポジトリにアップしようとするディレクトリで（USER と REP は書き変える）

~~~
echo "# test" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin git@github.com:USER/REP.git
git push -u origin master
~~~

## ファイル名からスペースを取り除く

ファイル名にスペースが入っていると色々と面倒なので、このコマンドでアンダースコア「_」に置換する。

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

大きいファイルを ```git push``` すると ```fatal: The remote end hung up unexpectedly
```といったエラーが出やすいので、エラーを出にくくするために[HTTP post バッファサイズを上げる](http://stackoverflow.com/questions/19120120/broken-pipe-when-pushing-to-git-repository)と良い。50MB に上げるには

~~~
git config http.postBuffer 52428800
~~~

## リポジトリに追加 

ざっくりとカレントディレクトリ以下をまとめてリポジトリに追加する。ファイル名にスペースが入っているとエラーになるので、すでにスペースは取り除いてある。

~~~
for i in `find .`; do git add $i; done
~~~

100MB以下のファイルのみを追加する場合には

~~~
for i in `find . -size -204800 -print`;  do git add $i; done
~~~

とする。そして、コミット。

~~~
git commit -m "First commit"
git push origin master
~~~

## 100MB 以上のファイルがあってエラーとなる場合

```Filename``` というファイルが 100MB 以上で、```File Filename is 230.01 MB; this exceeds GitHub's file size limit of 100.00 MB```というようなエラーが出て ```git push``` できないとき、そのファイルを git 管理から除き、履歴から[完全に削除](https://help.github.com/articles/removing-files-from-a-repository-s-history/)して、LFS管理に入れて commit しなおす、という手順となる。

~~~
git rm --cached Filename
git commit --amend -CHEAD
git filter-branch --index-filter 'git rm --cached --ignore-unmatch Filename' HEAD
git push origin master
git lfs track Filename
git add Filename
git commit -m lfs
git push origin master
~~~

## 自動コミット

場合によっては自動コミットの設定をしておくと良い。

- [Guard で Git コミットを自動で行う](http://qiita.com/a-suenami/items/bd9a669d5779d9910fec)
