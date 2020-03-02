---
layout: katex
title:  "KaTeX による数式の表示"
date: 2017-05-01 10:17:54 +0000
update: 2020-03-02 04:22:53 +0000
tags:
- math
- jekyll
---
[Jekyll 上での数式の表示](https://sekika.github.io/2015/10/10/equation-on-jekyll/)では、MathJax による数式表示の設定を記した。最近は[KaTeX](https://khan.github.io/KaTeX/)という数式組版ライブラリが表示が速くて良いという話を聞くので、ためしてみることとした。

生の KaTeX では、数式表示のために

~~~
katex.render("c = \\pm\\sqrt{a^2 + b^2}", element);
~~~

のような記法が必要となり、少し面倒。そこで、[はてなブログで KaTeX を使う](http://kivantium.hateblo.jp/entry/2016/11/18/142840)を参考に、jQueryを使って（もともと Bootstrap の JavaScript プラグインのために jQuery を読み込んでいる）```[[``` と ```]]``` で囲まれた部分は display モード（独立した行で中央揃え）、```$```で囲まれた部分は非displayモード（行内の数式）で表示をするように設定することとする（```$$```だとうまく動かないので変えた）。

やるべきことは、ヘッダ内に

{% highlight html %}
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/{{ site.katex-version }}/katex.min.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/{{ site.katex-version }}/katex.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/{{ site.katex-version }}/contrib/auto-render.min.js"></script>
<script>$(document).ready(function(){renderMathInElement(document.body,{delimiters: [{left: "[[", right: "]]", display: true},{left: "$", right: "$", display: false}]})});</script>
{% endhighlight %}

を記述すれば良い。[KaTeX 用のヘッダー](https://github.com/sekika/sekika.github.io/blob/master/_includes/head-katex.html)を記述して、それを読み込ませるための[レイアウト katex](https://github.com/sekika/sekika.github.io/blob/master/_layouts/katex.html)を用意した。数式を使う記事には ```layout: katex``` と指定することで、必要な時にだけ KaTeX を読み込ませることができる。また、KaTeX のバージョンは katex-version というパラメータとして [_config.yml](https://github.com/sekika/sekika.github.io/blob/master/_config.yml) で指定することとした。これで、GitHub Pages 上で KaTeX で数式を表示することができるようになったため、数式を多用する記事を書いても高速に表示されるはずである。

LaTeX 書式の数式が KaTeX でどのように表示されるかをリアルタイムで確認するためには [KaTeX プレビュアー](http://sixthform.info/katex/examples/demo.html) を使うと便利である。

[リチャーズ式](https://ja.wikipedia.org/wiki/%E3%83%AA%E3%83%81%E3%83%A3%E3%83%BC%E3%82%BA%E5%BC%8F)を表示してみる。

[[ \frac{\partial \theta}{\partial t}= \frac{\partial}{\partial z}
\left[ K(\theta) \left (\frac{\partial \psi}{\partial z} + 1 \right) \right] ]]

この数式のソースコードは

{% highlight tex %}
[[ \frac{\partial \theta}{\partial t}= \frac{\partial}{\partial z}
\left[ K(\theta) \left (\frac{\partial \psi}{\partial z} + 1 \right) \right] ]]
{% endhighlight %}

となっている。

インラインでの表示は ```$``` と ```$``` で囲む。たとえば、

半径 $ r $ の円の面積は $ \pi r^2 $ であり、球の体積は $ \frac{4}{3}\pi r^3 $ である。

と表示するためには、

    半径 $ r $ の円の面積は $ \pi r^2 $ であり、球の体積は $ \frac{4}{3}\pi r^3 $ である。

と書く。

ついでに[このページの数式](https://seki.webmasters.gr.jp/swrc/model-ja.html)を MathJax から KaTeX に変えたところ、表示が若干軽くなった。

（追記）KaTeX のテストがてら[積と商の微分公式](https://sekika.github.io/2017/05/02/derivative/)という記事を書いてみた。たしかに高速に表示される。

[[ \\begin{array}{rl} \\biggl\\\{ \\frac{1}{g(x)} \\biggr\\\}^{\\prime} &=& \\lim_{h \\to 0}\\frac{\\frac{1}{g(x+h)}-\\frac{1}{g(x)}}{h} \\cr\\cr &=& \\lim_{h \\to 0}\\frac{g(x)-g(x+h)}{g(x) g(x+h) h} \\cr\\cr  &=& -\\frac{1}{ \\bigl\\\{ g(x) \\bigr\\\}^2} \\lim_{h \\to 0}\\frac{g(x+h)-g(x)}{h} \\cr\\cr &=& -\\frac{g^{\\prime}(x)}{ \\bigl\\\{g(x) \\bigr\\\}^2} \end{array} ]]

この数式のソースコードは

{% highlight tex %}
[[ \\begin{array}{rl} \\biggl\\\{ \\frac{1}{g(x)} \\biggr\\\}^{\\prime} &=& \\lim_{h \\to 0}\\frac{\\frac{1}{g(x+h)}-\\frac{1}{g(x)}}{h} \\cr\\cr &=& \\lim_{h \\to 0}\\frac{g(x)-g(x+h)}{g(x) g(x+h) h} \\cr\\cr  &=& -\\frac{1}{ \\bigl\\\{ g(x) \\bigr\\\}^2} \\lim_{h \\to 0}\\frac{g(x+h)-g(x)}{h} \\cr\\cr &=& -\\frac{g^{\\prime}(x)}{ \\bigl\\\{g(x) \\bigr\\\}^2} \end{array} ]]
{% endhighlight %}

となっている。

- バックスラッシュは2個重ねる。重ねないでもうまくいくときもあれば、重ねないとだめなときもある。
- array 環境の上下間隔が標準ではつまりすぎるので、```\\cr``` を2個重ねる。


