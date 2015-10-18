---
layout: post
title: Office Open XML の git ファイル管理
tag: git
---
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

