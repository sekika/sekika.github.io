---
layout: post
title: Github に色々なファイルを入れるためのメモ
tags:
- git
- github
---
GitHub で[1ヶ月7ドルでプライベートリポジトリ無制限](https://github.com/blog/2164-introducing-unlimited-private-repositorie)となったので、いろいろなファイルをプライベートリポジトリに入れる手順のメモ。

## リポジトリの作成
GitHubのページで [New repository] のボタンを押して、レポジトリを作成する。通常はリポジトリを初期化して git clone から始めるが、ここではすでに手元にファイルがあるという前提なので、[Initialize this repository with a README] にはチェックを入れずに

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

- LFS のインストール。Homebrew であれば ```brew install git-lfs```


## レポジトリに追加 

~~~
for i in `find .`; do git add $i; done
~~~
