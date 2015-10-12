---
layout: post
title: マークダウンチートシート
tag: jekyll
---
マークダウン記法、Kramdown 記法の簡単なまとめです。[ソースコード](https://raw.githubusercontent.com/sekika/sekika.github.io/master/_drafts/cheetsheet.md)参照。

> ## This is a header.
> 
> 1.   This is the first list item.
> 2.   This is the second list item.
> 
> Here's some example code:
> 
>     return shell_exec("echo $input | $markdown_script");

~~~~~~~~
Here comes some code.
~~~~~~~~

## 表

見栄えは[スタイルシート](https://github.com/sekika/sekika.github.io/blob/master/css/personal.css)で調整。

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

{% gist c25d956b1c5cc2490406 %}

# 参考サイト
- [Markdown syntax](http://daringfireball.net/projects/markdown/syntax)
- [Kramdown syntax](http://kramdown.gettalong.org/syntax.html)
- [How to embed a Gist on GitHub Pages using Jekyll](https://gist.github.com/benbalter/5555251)