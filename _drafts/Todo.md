---
layout: post
title: To Do リスト
tag: jekyll
---
これから書く記事や、サイト管理に関する To Do リストです。永遠に [_drafts](https://github.com/sekika/sekika.github.io/tree/master/_drafts) の中です。

## 記事 ##
- Todo管理 トドうち
- Word 編集履歴
- Drafts 管理

### open コマンド
- [FinderとTerminalの連携を考える](http://news.mynavi.jp/column/osxhack/109/)
{% gist 63b5987deb3baca8f546 %}

## Jekyll 管理 ##
- Drafts 内に、公開ページへのリンク記事作成
- 関連キーワード
- タグ一覧ページに description 表示

### Drafts 公開スクリプト pub ###
- Date 自動挿入
- http://d.hatena.ne.jp/rx7/touch/20110310/p1
- Commit message に Published on http://sekika.github.io

### サンプル ###
- [チートシート](https://raw.githubusercontent.com/sekika/sekika.github.io/master/_drafts/cheetsheet.md)

### ヘッダ ###
~~~
---
layout: post
title:
tag:
---
~~~

複数タグ

~~~~
---
layout: post
title:
tags:
- tag1
- tag2
---
~~~~

- layout: post-en
- layout: math
