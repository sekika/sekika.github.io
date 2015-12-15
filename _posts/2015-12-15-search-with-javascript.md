---
layout: post
title: JavaScript による記事の全文検索
date: 2015-12-15 15:22:23 +0000
tags:
- jekyll
- python
---
[malaさん](http://ma.la/)の[JavaScript による全文検索](http://la.ma.la/search.html)を「検索」メニューに入れてみた。速い！

おおまかな手順は

* [検索ページのスクリプト](http://la.ma.la/search.html)を[検索ページ](http://sekika.github.io/search/)に入れる。[search.md](https://github.com/sekika/sekika.github.io/blob/master/search.md), [_layouts/search.html](https://github.com/sekika/sekika.github.io/blob/master/_layouts/search.html), [_includes/head-search.htm](https://github.com/sekika/sekika.github.io/blob/master/_includes/head-search.html) (css と js ファイルの指定), [_includes/search.html](https://github.com/sekika/sekika.github.io/blob/master/_includes/search.html), [css/search.css](https://github.com/sekika/sekika.github.io/blob/master/css/search.css) といった感じで分割しておく。
* [index.js](https://github.com/sekika/sekika.github.io/blob/master/js/index.js) を作成する。
* [roma.js](http://la.ma.la/roma.js) を入れる。

ということになる。`index.js` の作成には、python スクリプト[index](https://github.com/sekika/sekika.github.io/blob/master/setup/index)を書いた。[最終更新日の表示]({% post_url 2015-11-18-last-update %})によって

~~~
date: 2015-11-12 03:01:50 +0000
update: 2015-11-17 06:38:29 +0000
~~~

のような形で作成日と更新日が記録されている（されていない場合もある）という前提となっている。[下書きの公開スクリプト]({% post_url 2015-11-07-draft-and-publish %})の中で `index` を実行させている。
