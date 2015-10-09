---
layout: post
title:  "GitHub Page の Jekyll でカテゴリ / タグの作成"
date:   2015-10-09 20:00:00
tag: jekyll
---
Jekyll には様々なプラグインがあり、プラグインを使うとカテゴリやタグを管理できる。
しかし、GitHub Pages では、プラグインを使えないので、ローカルで jekyll を動かしてアップする、というちょっと面倒なことをする必要があるとのこと。
ところが、<a href="http://christianspecht.de/2014/10/25/separate-pages-per-tag-category-with-jekyll-without-plugins/">このページ</a> によれば、プラグインを使わなくてもカテゴリやタグを使うことができるらしい。
というわけで、タグが使えるか試してみる。

タグが使えるようになったようだ。タグを入れる前に、Bootstrap と Flatly のテーマを入れてみた。それから、<a href="https://github.com/sekika/sekika.github.io/blob/master/_layouts/tagpage.html">_layouts/tagpage.html</a>, <a href="https://github.com/sekika/sekika.github.io/blob/master/tags/jekyll/index.html">tags/jekyll/index.html</a>を上記のページの通りに書いて、<a href="https://github.com/sekika/sekika.github.io/blob/master/tags/index.html">tags/index.html</a>を書いたら動いた。
