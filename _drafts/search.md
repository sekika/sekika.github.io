---
layout: post
title: 全文検索
tag: jekyll
---
[JavaScriptにBlogの全文検索をやらせてみるテスト](http://la.ma.la/search.html)というページが、きびきびと動いていいので「検索」メニューに入れてみた。

おおまかな手順は

* [トップページのスクリプト](http://la.ma.la/search.html)を[検索ページ](http://sekika.github.io/search/)に入れる。[search.md](https://github.com/sekika/sekika.github.io/blob/master/search.md)では[検索ページ用のレイアウト](https://github.com/sekika/sekika.github.io/blob/master/_layouts/search.html)を指定して、[検索ページ用のヘッダーファイル](https://github.com/sekika/sekika.github.io/blob/master/_includes/head-search.html)で[スタイルシート](https://github.com/sekika/sekika.github.io/blob/master/css/search.css)とJavaScript ([index.js](https://github.com/sekika/sekika.github.io/blob/master/js/index.js), [roma.js](https://github.com/sekika/sekika.github.io/blob/master/js/roma.js)) を指定する。
* `index.js` を作成する。

ということになる。`index.js` の作成には、python スクリプト[index.py](https://github.com/sekika/sekika.github.io/blob/master/setup/index.py)を書いた。[最終更新日の表示]({% post_url 2015-11-18-last-update %})によって

~~~
date: 2015-11-12 03:01:50 +0000
update: 2015-11-17 06:38:29 +0000
~~~

のような形で作成日と更新日が記録されている（されていない場合もある）という前提となっている。


