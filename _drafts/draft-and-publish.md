---
layout: post
title: 記事の下書き
tag: jekyll
---
Jekyll で記事を公開する前に下書きをする方法には、いくつかの流儀があって、好みで使い分けられているようだ。

1. [_drafts フォルダを使う方法](http://jekyllrb.com/docs/drafts/)
2. YAML ヘッダーに ```published: false``` を加える方法
3. [未来の時間を設定する方法](http://tqclarkson.com/2012/08/22/jekyll-drafts/)
4. [下書き用のブランチを作成する方法](http://qrohlf.com/posts/jekyll-drafts-workflow/)

この中で、私は1の方法を採用することにした。その際に、下書きのプレビューと公開を、それぞれコマンド一発でできるようにした。

## 下書きのプレビュー

[_drafts/Makefile](https://github.com/sekika/sekika.github.io/blob/master/_drafts/Makefile) を作成した。

~~~
UNAME = ${shell uname}

all:
	git add -A
	- git commit -m draft
	git push origin master
	if [ $(UNAME) = "Darwin" ]; then open http://localhost:4000/; fi
	if [ $(UNAME) = "Linux" ]; then xdg-open http://localhost:4000/; fi
	cd ..; jekyll serve --drafts --host localhost
~~~

これで、```_drafts``` フォルダで ```make``` とするだけで、

- git への登録
- ドラフト入りでサイトのプレビュー (Mac または Linux の場合）
- サイト構築と localhost でのサーバー起動

を、まとめてできるようになった。プレビューをサイト構築の前にしているので、最初はプレビューが表示されないが、ブラウザによっては、サイトが構築されると自動的に再読み込みして表示をしてくれる。自動的にしてくれない場合には、自分で更新ボタンを押す。

## 下書きの公開

[_drafts/pub](https://github.com/sekika/sekika.github.io/blob/master/_drafts/pub) スクリプトを作成した。```_drafts``` フォルダの下で、```filename``` というファイルを公開したい時には、

~~~
./pub filename
~~~

とする。これで、以下の作業をすべて自動的にできる。

1. ```filename``` を ```../_posts/YY-MM-DD-Filename``` にコピーする。このときに YAML フロントマターに ```date: ``` フィールドを作成して追加するので、下書きには ```date: ``` フィールドを入れない。
2. 公開されたポストを、```Published on [permalink]``` というコミットメッセージで git レポジトリにコミットする。
3. マスターブランチに push する。
4. 下書きのファイルを git レポジトリから削除する。

なお、コミットメッセージのパーマリンクは pretty 形式となっているので、他の形式にするためには、スクリプトの次の箇所を直接編集する必要がある。また、サイトの URL は ```_condig.yml``` の ```url:``` 行から読んでいる。

~~~
Permalink=$Site_URL`date -u +/%Y/%m/%d/``echo $Filename | sed -e 's/\..*$/\//'`
~~~
