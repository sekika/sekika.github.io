---
layout: katex
title:  "KaTeX による数式の表示"
tags:
- math
- jekyll
---
[Jekyll 上での数式の表示](http://sekika.github.io/2015/10/10/equation-on-jekyll/)では、MathJax による数式表示の設定を記した。最近は[KaTeX](https://khan.github.io/KaTeX/)という数式組版ライブラリが表示が速くて良いという話を聞くので、ためしてみることとした。

生の KaTeX では、数式表示のために

 katex.render("c = \\pm\\sqrt{a^2 + b^2}", element);

のような記法が必要となり、少し面倒。そこで、[はてなブログで KaTeX を使う](http://kivantium.hateblo.jp/entry/2016/11/18/142840)を参考に、jQueryを使って ```$$``` で囲まれた部分は display モード（独立した行で中央揃え）、```$```で囲まれた部分は非displayモード（行内の数式）で表示をするように設定することとする。もともと Bootstrap の JavaScript プラグインのために jQuery を読み込んでいる。

やるべきことは、ヘッダ内に

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/contrib/auto-render.min.js"></script>
  <script>$(document).ready(function(){renderMathInElement(document.body,{delimiters: [{left: "$$", right: "$$", display: true},{left: "$", right: "$", display: false}]})});</script>

を記述すれば良い。KaTeX を読み込ませるための[レイアウト katex](https://github.com/sekika/sekika.github.io/blob/master/_layouts/katex.html)を用意して、数式を使う記事には ```layout: katex``` と指定することで、必要な時にだけ KaTeX を読み込ませるようにした。設定はこれだけで、プラグインを使う必要はないので、GitHub Pages 上で数式の表示をすることができた。

LaTeX 書式の数式が KaTeX でどのように表示されるかをリアルタイムで確認するためには [KaTeX プレビュアー](http://sixthform.info/katex/examples/demo.html) を使うと便利である。

[リチャーズ式](https://ja.wikipedia.org/wiki/%E3%83%AA%E3%83%81%E3%83%A3%E3%83%BC%E3%82%BA%E5%BC%8F)を表示してみる。

$$\frac{\partial \theta}{\partial t}= \frac{\partial}{\partial z} 
\left[ K(\theta) \left (\frac{\partial \psi}{\partial z} + 1 \right) \right]\ $$

この数式のソースコードは

{% highlight tex %}
$$\frac{\partial \theta}{\partial t}= \frac{\partial}{\partial z}
\left[ K(\theta) \left (\frac{\partial \psi}{\partial z} + 1 \right) \right]\$$
{% endhighlight %}

となっている。

インラインでの表示は ```$``` と ```$``` で囲む。たとえば、

半径 $ r $ の円の面積は $ \pi r^2 $ であり、球の体積は $ \frac{4}{3}\pi r^3 $ である。

と表示するためには、

    半径 $ r $ の円の面積は $ \pi r^2 $ であり、球の体積は $ \frac{4}{3}\pi r^3 $ である。

と書く。
