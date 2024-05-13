---
layout: math
title:  "Jekyll 上での数式の表示"
update: 2024-05-13 17:56:03 +0000
tags:
- math
- jekyll
---
[Jekyll のドキュメント](http://jekyllrb.com/docs/extras/)によれば、Kramdown は[MathJax](http://www.mathjax.org/)による数式表示をサポートしている、とのこと。MathJax を使うためには、HTML に
```
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
```
と記述して、MathJax を読み込ませる必要がある。MathJax を読み込ませるための[レイアウト math](https://github.com/sekika/sekika.github.io/blob/master/_layouts/math.html)を用意して、数式を使う記事には ```layout: math``` と指定することで、必要な時にだけ MathJax を読み込ませるようにした。設定はこれだけで、プラグインを使う必要はないので、GitHub Pages 上で数式の表示をすることができた。

LaTeX 書式の数式が MathJax でどのように表示されるかをリアルタイムで確認するためには [MathJax checker](http://gyafun.jp/ln/MathJax.html) を使うと便利である。

[Kramdown のドキュメント](http://kramdown.gettalong.org/syntax.html#math-blocks)に書かれている方法を使って、[リチャーズ式](https://ja.wikipedia.org/wiki/%E3%83%AA%E3%83%81%E3%83%A3%E3%83%BC%E3%82%BA%E5%BC%8F)を表示してみる。

$$
\begin{align*}
\frac{\partial \theta}{\partial t}= \frac{\partial}{\partial z} 
\left[ K(\theta) \left (\frac{\partial \psi}{\partial z} + 1 \right) \right]\ 
\end{align*}
$$

この数式のソースコードは

{% highlight tex %}
$$
\begin{align*}
\frac{\partial \theta}{\partial t}= \frac{\partial}{\partial z}
\left[ K(\theta) \left (\frac{\partial \psi}{\partial z} + 1 \right) \right]\
\end{align*}
$$
{% endhighlight %}

となっている。すなわち、

{% highlight tex %}
$$
\begin{align*}
{% endhighlight %}

と

{% highlight tex %}
\end{align*}
$$
{% endhighlight %}

の間に、LaTeX で数式を記述すれば良い。

インラインでの表示は ```$$``` と ```$$``` で囲む。たとえば、

半径 $$ r $$ の円の面積は $$ \pi r^2 $$ であり、球の体積は $$ \frac{4}{3}\pi r^3 $$ である。

と表示するためには、

    半径 $$ r $$ の円の面積は $$ \pi r^2 $$ であり、球の体積は $$ \frac{4}{3}\pi r^3
 $$ である。

と書く。

```2017年5月1日更新```：[KaTeX による数式の表示](https://sekika.github.io/2017/05/01/katex-equation/)について記した。
