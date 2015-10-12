---
layout: post
title: マークダウンチートシート
tag: jekyll
---
マークダウン記法、Kramdown 記法の簡単なまとめです。

# コードブロック

~~~~~~~~
Here comes some code.
~~~~~~~~

## 表

|---
| デフォルト | 左寄せ | センタリング | 右寄せ
|-|:-|:-:|-:
| First body part | Second cell | Third cell | fourth cell
| Second line |foo | **strong** | baz
| Third line |quux | baz | bar

## 数式

[Jekyll 上での数式の表示]({% post_url 2015-10-10-equation-on-jekyll %})

## gist

https://gist.github.com/benbalter/5555251#file-gist-md

{% gist 5555251 %}

# 参考サイト
- [Markdown syntax](http://daringfireball.net/projects/markdown/syntax)
- [Kramdown syntax](http://kramdown.gettalong.org/syntax.html)
