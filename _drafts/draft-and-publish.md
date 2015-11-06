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
- ドラフトのプレビュー (Mac または Linux の場合）
- ドラフトの作成

を、まとめてできるようになった。プレビューを作成の前にしているので、プレビューが表示された段階では
