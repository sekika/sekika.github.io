---
layout: katex
title: 指数と対数関数の微分
date: 2017-05-06 02:49:32 +0000
tag: math
---
指数と対数関数の微分をする。

$e^x$ を微分すれば $e^x$ で、$\log x$ を微分すれば $1/x$ であるということは、とても単純で覚えやすいため「なぜそうなるか」はあまり理解されずに公式として覚えられていることが多いのではなかろうか。ここでは、$e$の意味を確認するとともに、指数と対数関数の微分を計算する。高校の[数学III](https://ja.wikipedia.org/wiki/%E6%95%B0%E5%AD%A6III)で学習する極限、導関数の定義、合成関数の微分が理解できていれば読めるずである。

## 自然対数の底 $e$ ##

まずは[ネイピア数](https://ja.wikipedia.org/wiki/%E3%83%8D%E3%82%A4%E3%83%94%E3%82%A2%E6%95%B0) (Napier's constant) すなわち自然対数の底$e$について記す。これは、円周率$\pi$のような数学定数の一つであり、$ e = 2.71828 18284 59045 \ldots $ と続く無理数である。この定数は単に$e$と呼ばれたり「自然対数の底」と呼ばれることが多く、オイラー数 (Euler's number) と呼ばれることもあるが、[オイラーの定数](https://ja.wikipedia.org/wiki/%E3%82%AA%E3%82%A4%E3%83%A9%E3%83%BC%E3%81%AE%E5%AE%9A%E6%95%B0) (Euler's constant) と紛らわしい。この数字は、1618年のネイピアの本にはじめて出たとされるが、その本には定数そのものの記載はなく、ベルヌーイが1683年に次の式の右辺の極限を求めようとしたことがこの定数の初出だとされる。その収束する値が$e$の定義であるとして、$e$の定義を記す（$e$の定義には他の方法もあるが、このページではそのようにする）。

<blockquote>
[[ e = \lim_{n \to \infty}\left( 1 + \frac{1}{n} \right)^n ]]
</blockquote>

この式が「なぜ収束するか」についてはこの記事では触れずに「そういうものだ」として扱うが、この式の極限が収束する様子を少し計算してみる。

| $n$ | 1 | 2 | 5 | 10 | 100 | 1000 | 10000 | 100000 | 1000000 |
| $\left( 1 + \frac{1}{n} \right)^n$ | 2	 | 2.25 | 2.48832 | 2.59374 | 2.70481 | 2.71692 | 2.71815 | 2.71827 | 2.71828 |

さて、$e$の定義式で$h=1/n$とすると$n \to \infty$で$h \to 0$なので、

[[ e = \\lim_{h \\to 0}\\left( 1 + h \\right)^{1/h} ]]

となる。ここで、この式が成り立つためには$e$の定義式の極限が$n \to -\infty$の極限でも一致することを確認する必要があるが（そうでなければ、$h \to +0$ と $h \to -0$ が一致しないため $h \to 0$ が収束しない）、実際にそれが一致することは、最後に「付録」で証明する。さて、上の式から

[[ \\begin{array}{rl} \\lim_{h \\to 0}\\left( \\frac{e^h-1}{h} \\right) &=& \\lim_{h \\to 0}\\left[ \\frac{\\left\\\{ (1+h)^{1/h} \\right\\\}^{h}-1}{h} \\right] \\cr\\cr &=& 1 \\end{array} ]]

となる。この式を、次の指数関数の微分で使う。

## 指数関数 $e^x$ の微分 ##

微分の定義から

[[ \\begin{array}{rl} \\frac{d}{dx}e^x &=& \\lim_{h \\to 0}\\left( \\frac{e^{x+h}-e^x}{h} \\right) \\cr\\cr &=& e^x \\lim_{h \\to 0}\\left( \\frac{e^{h}-1}{h} \\right) \\cr\\cr &=& e^x \\end{array} ]]

となる。すなわち、指数関数 $e^x$ は微分して自分自身になる関数である。

## 対数関数 $\log x$ の微分 ##

[[ y = \log x ]]

とする。ここで、log は自然対数であり、自然対数の底$e$が省略して書かれている。このページで底が省略されている対数関数は、すべて自然対数である。すなわち$ y = \log_e x $であるから

[[ x = e^y ]]

となり、この式の両辺を $y$ で微分して

[[ \frac{dx}{dy} = \frac{d}{dy}e^y = e^y = x ]]

となる。したがって、対数関数$y=\log x$の微分$\frac{dy}{dx}$は

[[ \frac{dy}{dx} = \frac{1}{\frac{dx}{dy}} = \frac{1}{x} ]]

となる。ここで、$\frac{dx}{dy}$ の逆数が $\frac{dy}{dx}$ であるとしているが、そのような計算をして良いのかという疑問が生じる。微分記号の $dx$ は$x$ の微小変化、$dy$はそれにともなう$y$の微小変化であり、$dx$と$dy$はそれぞれ「ある数」であって、その数がともに0へ収束する極限 ($dx \to 0$ かつ $dy \to 0$) を考えているのであるから、$\frac{dx}{dy}$ の逆数が $\frac{dy}{dx}$ であることは素直に納得できる。

## 指数関数 $a^x$ の微分 ##

[[ y = a^x ]]

の導関数を計算する。両辺の自然対数を取る。

[[ \\log y = \\log (a^x) = x \\log a ]]

両辺を $x$ で微分する。

[[ \frac{d}{dx} (\\log y) = \\log a ]]

この式の左辺は、$u = \\log y$ として合成関数の微分を使うと

[[ \frac{du}{dx} = \frac{du}{dy} \frac{dy}{dx} = \frac{1}{y} \frac{dy}{dx} ]]

となるため、

[[ \frac{1}{y} \frac{dy}{dx} = \\log a ]]

すなわち、$y = a^x$ の導関数は

[[ \frac{dy}{dx} = (\\log a)y = (\\log a)a^x ]]

である。

## 対数関数 $\log_a x$ の微分 ##

[[ \frac{d}{dx}(\log_a x) = \frac{d}{dx}\left(\frac{\log x}{\log a}\right) = \frac{1}{(\log a)x} ]]

となる。

## 付録 ##

[[ \lim_{n \to \infty}\left( 1 + \frac{1}{n} \right)^n ]]

が収束することがわかっているときに、その収束する値が、$n \to -\infty$ の極限でも一致することを示す。

[[ \\begin{array}{rl}  \lim_{n \to -\infty}\left( 1 + \frac{1}{n} \right)^n &=& \lim_{n \to \infty}\left( 1 - \frac{1}{n} \right)^{-n}  \\cr\\cr &=& \lim_{n \to \infty}\left( \frac{n-1}{n} \right)^{-n}  \\cr\\cr &=& \lim_{n \to \infty}\left( \frac{n}{n-1} \right)^{n}  \\cr\\cr &=& \lim_{n \to \infty}\left( 1+\frac{1}{n-1} \right)^{n}  \\cr\\cr &=& \lim_{n \to \infty}\left( 1+\frac{1}{n} \cdot \frac{n}{n-1} \right)^{n}  \\cr\\cr &=& \lim_{n \to \infty}\left( 1+\frac{1}{n} \cdot \frac{1}{1-1/n} \right)^{n}  \\cr\\cr &=&  \lim_{n \to \infty}\left( 1 + \frac{1}{n} \right)^n \\end{array} ]]

以上で証明された。
