---
layout: math
title: マークダウン文法チートシート
date: 2015-10-12 20:29:21 +0000
tag: jekyll
---
マークダウン記法、Kramdown 記法を、このサイトの著者が自分用に簡潔にまとめたものです。[ソースコード](https://raw.githubusercontent.com/sekika/sekika.github.io/master/_drafts/cheetsheet.md)を参照して使います。適宜、アップデートします。

## 基本

- なべ
- やかん

（引用）

> ## ヘッダー
> 
> 1.   1個目
> 2.   2個目
> 
> コードの例
> 
>     return shell_exec("echo $input | $markdown_script");

~~~~~~~~
Here comes some code.
~~~~~~~~

~~~ ruby
def what?
  42
end
~~~

kramdown
: A Markdown-superset converter

Maruku
:     Another Markdown-superset converter

This is some text.[^1]. Other text.[^footnote].

## 表

見栄えは[スタイルシート](https://github.com/sekika/sekika.github.io/blob/master/css/personal.css)で調整。

|---
| デフォルト | 左寄せ | センタリング | 右寄せ
|-|:-|:-:|-:
| First body part | Second cell | Third cell | fourth cell
| Second line |foo | **strong** | baz
| Third line |quux | baz | bar

## 数式

- [Jekyll 上での数式の表示]({% post_url 2015-10-10-equation-on-jekyll %})

$$
\begin{align*}
\frac{\partial \theta}{\partial t}= \frac{\partial}{\partial z}
\left[ K(\theta) \left (\frac{\partial \psi}{\partial z} + 1 \right) \right]\
\end{align*}
$$

## Gist

- [How to embed a Gist on GitHub Pages using Jekyll](https://gist.github.com/benbalter/5555251)

{% gist 63b5987deb3baca8f546 %}

## 特殊文字

&amp; &lt; &gt; &copy;

# 参考サイト

- [Markdown syntax](http://daringfireball.net/projects/markdown/syntax)
- [Kramdown syntax](http://kramdown.gettalong.org/syntax.html)
- [Liquid Documentation](https://github.com/Shopify/liquid/wiki)
- [HTML Entity List](http://www.freeformatter.com/html-entities.html)
