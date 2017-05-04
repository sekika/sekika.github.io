---
layout: katex
title: 指数と対数関数の微分
tag: math
---
指数と対数の微分をする。

## ネイピア数 ##

<blockquote>
[[ e = \\lim_{n \\to \\inf}(1+\\frac{1}{n})^n ]]
</blockquote>

この公式を証明する。この式の左辺は

[[ \\bigl\\\{ f(x)g(x) \bigr\\\}^{\\prime} =  \\lim_{h \\to 0}\\frac{f(x+h)g(x+h)-f(x)g(x)}{h} ]]

一方、右辺は

[[ \\begin{array}{rl} f^{\\prime}(x)g(x)+f(x)g^{\\prime}(x) &=& \\lim_{h \\to 0}\\frac{ \\bigl\\\{ f(x+h)-f(x) \\bigr\\\} g(x+h)}{h} + \\lim_{h \\to 0}\\frac{f(x) \\bigr\\\{ g(x+h)-g(x) \\bigr\\\} }{h} \\cr\\cr &=& \\lim_{h \\to 0}\\frac{f(x+h)g(x+h)-f(x)g(x+h)+f(x)g(x+h)-f(x)g(x)}{h} \\cr\\cr &=& \\lim_{h \\to 0}\\frac{f(x+h)g(x+h)-f(x)g(x)}{h} \\end{array} ]]

すなわち、左辺と右辺が一致するため、積の微分公式が証明された。

## 商の微分公式(1) ##

<blockquote>
[[ \biggl\{ \frac{1}{g(x)} \biggr\}^{\prime} = -\frac{g^{\prime}(x)}{ \bigl\{ g(x) \bigr\}^2} ]]
</blockquote>

この式を証明する。

[[ \\begin{array}{rl} \\biggl\\\{ \\frac{1}{g(x)} \\biggr\\\}^{\\prime} &=& \\lim_{h \\to 0}\\frac{\\frac{1}{g(x+h)}-\\frac{1}{g(x)}}{h} \\cr\\cr &=& \\lim_{h \\to 0}\\frac{g(x)-g(x+h)}{g(x) g(x+h) h} \\cr\\cr  &=& -\\frac{1}{ \\bigl\\\{ g(x) \\bigr\\\}^2} \\lim_{h \\to 0}\\frac{g(x+h)-g(x)}{h} \\cr\\cr &=& -\\frac{g^{\\prime}(x)}{ \\bigl\\\{g(x) \\bigr\\\}^2} \end{array} ]]

以上で証明された。

## 商の微分公式(2) ##

<blockquote>
[[ \biggl\{ \frac{f(x)}{g(x)} \biggr\}^{\prime} = \frac{f^{\prime}(x)g(x)-f(x)g^{\prime}(x)}{ \bigl\{ g(x) \bigr\}^2} ]]
</blockquote>

$ \frac{f(x)}{g(x)} = f(x) \cdot \frac{1}{g(x)} $より、積の微分公式を適用する。

[[ \\begin{array}{rl} \\biggl\\\{\frac{f(x)}{g(x)} \biggr\\\}^{\\prime} &=&  f^{\\prime}(x) \\biggl\\\{ \\frac{1}{g(x)} \\biggr\\\} + f(x)\\biggl\\\{ \\frac{1}{g(x)} \\biggr\\\}^{\\prime} \\cr\\cr &=& \\frac{f^{\\prime}(x)}{g(x)} + f(x)\\biggl[ -\\frac{g^{\\prime}(x)}{ \\bigl\\\{ g(x) \\bigr\\\}^2} \\biggr]  \\cr\\cr &=& \frac{f^{\\prime}(x)g(x)-f(x)g^{\\prime}(x)}{ \\bigl\\\{ g(x) \\bigr\\\}^2} \\end{array} ]]

以上で証明された。
