---
layout: post
title: 記事の下書き
date: 2015-11-07 09:28:24 +0000
tag: jekyll
---
Jekyll で記事を公開する前に下書きを作成して保存する方法には、いくつかの流儀があって、好みで使い分けられているようだ。

1. [_drafts フォルダを使う方法](http://jekyllrb.com/docs/drafts/)
2. [YAML フロントマター](http://jekyllrb.com/docs/frontmatter/) に ```published: false``` を設定する方法
3. [未来の時間を設定する方法](http://tqclarkson.com/2012/08/22/jekyll-drafts/)
4. [下書き用のブランチを作成する方法](http://qrohlf.com/posts/jekyll-drafts-workflow/)

この中で、私は1の方法を採用することにした。現在作業中のファイルが1つのフォルダの下にまとまっているのは分かりやすいと感じるためである。スクリプトを作成して、下書きのプレビューと公開を、それぞれ ```_drafts``` フォルダの下でコマンド一発でできるようにした。このスクリプトを使うと、[コミットログ](https://github.com/sekika/sekika.github.io/commits/master/_posts/2015-10-19-office-open-xml-git.md)がきれいになる。また、公開時に自動的にファイル名が付与されるので、下書きの時点でファイル名に日付を入れる必要がない。

## 下書きのプレビュー

[_drafts/Makefile](https://github.com/sekika/sekika.github.io/blob/master/_drafts/Makefile) を作成した。

~~~
UNAME = ${shell uname}

all:
	git add -A
	- git commit -m draft
	make preview

push:
	git add -A
	- git commit -m draft
	git push origin master
	make preview

preview:
	if [ $(UNAME) = "Darwin" ]; then open http://localhost:4000/; fi
	if [ $(UNAME) = "Linux" ]; then xdg-open http://localhost:4000/; fi
	cd ..; bundle exec jekyll serve --drafts --host localhost
~~~

これで、```_drafts``` フォルダで ```make``` とすると、

- git への commit
- 下書き記事入りでサイトのプレビュー (Mac または Linux の場合）
- サイト構築と localhost でのサーバー起動

を、まとめてする。git については、push まではしないので、push もいっしょにしたい時には ```make push``` とする。プレビューをサイト構築の前にしているので、最初はプレビューが表示されないが、ブラウザによっては、サイトが構築されると自動的に再読み込みして表示をしてくれる。自動的にしてくれない場合には、自分で更新ボタンを押す。

## 下書きの公開

シェルスクリプト [_drafts/pub](https://github.com/sekika/sekika.github.io/blob/master/_drafts/pub) を作成した。```_drafts``` フォルダの下で、```filename``` というファイルを公開したい時には、

~~~
./pub filename
~~~

とすることで、以下の作業をまとめてできる。```git mv``` を使う場合と比べると、下書き時点のコミットログが見えなくなるのでコミットログがきれいになる。

1. ```filename``` を ```../_posts/YY-MM-DD-Filename``` にコピーする。このときに YAML フロントマターに ```date: ``` フィールドを作成して追加するので、下書きには ```date: ``` フィールドを入れない。
2. 公開するポストを、```Published on [permalink]``` というコミットメッセージで git レポジトリにコミットする。
3. マスターブランチに push する。
4. 下書きのファイルを git レポジトリから削除する。

なお、コミットメッセージのパーマリンクは pretty 形式となっているので、他の形式にするためには、スクリプトの次の箇所を直接編集する必要がある。

~~~
Permalink=$Site_URL`date -u +/%Y/%m/%d/``echo $Filename | sed -e 's/\..*$/\//'`
~~~

また、サイトの URL は ```_config.yml``` の ```url:``` 行から読んでいる。
