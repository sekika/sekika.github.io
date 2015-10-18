---
layout: post
title: To Do リスト
tag: jekyll
---
これから書く記事や、サイト管理に関する To Do リストです。永遠に [_drafts](https://github.com/sekika/sekika.github.io/tree/master/_drafts) の中です。[公開ページ](http://sekika.github.io)

## 記事 ##
- [チートシート](https://raw.githubusercontent.com/sekika/sekika.github.io/master/_drafts/cheetsheet.md)
- Todo管理 トドうち

### Office Open XML の git ファイル管理

[git diff で Office ファイルの差分を見る](http://qiita.com/shuhei/items/6a18d968051378d7ac1a) に書かれている Apache Tika を使う方法で、docx, xmlx, pptx ファイルを差分管理できる。やってみたところ、たしかに ```git log -p``` で差分が表示された。これは便利。

Mac の場合の手順について、そこに書かれている通りのことをこちらにもメモ。

> brew install tika

以下のようなスクリプト `unopnexml` を置く。

```
#!/bin/sh
tika -t "$1
```

```~/.gitconfig``` を編集
```
[diff "openxml"]
  textconv = unopenxml # フルパスで書く
```

レポジトリに ```.gitattributes``` を追加。
```
*.pptx diff=openxml
*.docx diff=openxml
*.xlsx diff=openxml
```

### Word 編集履歴
- 作成者を消す

### 土壌の物理性「古典を読む」
- Allison
- 大村さん

### open コマンド
- [FinderとTerminalの連携を考える](http://news.mynavi.jp/column/osxhack/109/)
{% gist 63b5987deb3baca8f546 %}

### Drafts 管理
- pub スクリプト

## サイト管理 ##
- 関連キーワード
- http://sekika.github.io/tags/ に、タグの description をひろうか？ひろえるか？

