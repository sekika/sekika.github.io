---
layout: post
title: GitHub レポジトリに色々なファイルを入れるためのメモ
tags:
- git
- github
---
GitHub で[1ヶ月7ドルでプライベートリポジトリ無制限](https://github.com/blog/2164-introducing-unlimited-private-repositorie)となったので、いろいろなファイルをプライベートリポジトリに入れようとしたところ、ファイル名のスペースや GitHub の 100MB 制限でちょっと面倒だったので手順をメモ。

## リポジトリの作成
GitHubのページで ```New repository``` のボタンを押して、レポジトリを作成する。通常はリポジトリを初期化して ```git clone``` から始めるが、ここではすでに手元にファイルがあるという前提なので、```Initialize this repository with a README``` にはチェックを入れずに、リポジトリにアップしようとするディレクトリで

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

## 100MB 以上のファイルを LFS で管理する

GitHub では、100MB 以上のファイルを入れようとするとエラーとなる。[Git Large File Storage (LFS)](https://git-lfs.github.com/)を使うと、100MB 以上のファイルを扱えるようになる。

まずは、LFS をインストールする。Homebrew であれば

~~~
brew install git-lfs
git lfs install
~~~

次に、100MB 以上のファイルを一覧する。

~~~
find . -size +204800 -print | xargs ls -lh
~~~

これらのファイルをLFS管理とするように

~~~
git lfs track "*.psd"
~~~

のように、適宜ワイルドカード等を使って 100MB 以上のファイルを指定する。

## レポジトリに追加 

ざっくりとカレントディレクトリ以下をまとめてレポジトリに追加する。

~~~
for i in `find .`; do git add $i; done
git commit -m "First commit"
git push origin master
~~~

## 100MB 以上のファイルがあってエラーとなる場合

```Filename``` というファイルが 100MB 以上で、

~~~
File Filename is 230.01 MB; this exceeds GitHub's file size limit of 100.00 MB
~~~

というようなエラーが出て ```git push``` できないとき、そのファイルを git 管理から除き、履歴から[完全に削除(https://help.github.com/articles/removing-files-from-a-repository-s-history/)して、LFS管理に入れて commit しなおす、という手順となる。

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
