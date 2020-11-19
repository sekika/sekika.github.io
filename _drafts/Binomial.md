---
layout: katex
title: 二項分布のポアソン分布による近似
tags:
- math
- javascript
---
二項分布がポアソン分布によって近似される様子をグラフで確認するプログラムを作成した。

試行回数 n 確率 p の[二項分布](https://ja.wikipedia.org/wiki/%E4%BA%8C%E9%A0%85%E5%88%86%E5%B8%83)の確率質量関数

[[ P(X=x) = {}_n \mathrm{C}_x p^x(1-p)^{n-x} ]]

は、np = m を一定として n → ∞, p → 0 の極限を取ると、すなわち n が非常に大きくて p が非常に小さいときに、np = m として期待値 m 分散 m の[ポアソン分布](https://ja.wikipedia.org/wiki/%E3%83%9D%E3%82%A2%E3%82%BD%E3%83%B3%E5%88%86%E5%B8%83)の確率質量関数

[[ P(X=x) = \frac{m^x e^{-m}}{x!} ]]

に近似される。このページでは、その様子をグラフで確認する。

m と n の値をテキストボックスに直接入力（mは小数の入力可能）する。ボタンで1ずつ増減できる。p は計算される。

<ul>
<li>m = <input name="m" id="m" type="text" value="2" size="7" onkeyup="update()">
<input type="button" value="-" onclick="decM();">
<input type="button" value="+" onclick="incM();">
<li>n = <input name="n" id="n" type="text" value="10" size="7" onkeyup="update()">
<input type="button" value="-" onclick="decN();">
<input type="button" value="+" onclick="incN();">
<li><div id="p">p = 0.3</div>
</ul>

<!-- -------------------------------------------------------------------------------------------- -->
<canvas id="canvas" width="600" height="600"
  style="max-width: 100%; height: auto; max-height: 100%">
このブラウザはHTML5のCanvas要素に対応していないためグラフを表示できません。
</canvas>
<script src="/js/graph.js"></script>
<script>
'use strict';
const maxM = 300;
const maxN = 1000000;
update();

function decN() {
    var n = document.getElementById("n").value;
    n = parseInt(n, 10) - 1;
    var m = document.getElementById("m").value;
    m = parseInt(m, 10);
    if (n < m+1 || isNaN(n)) {
        n = m+1;
    }
    if (n > maxN) {
        n = maxN;
    }
    document.getElementById("n").value = n;
    update();
}

function incN() {
    var n = document.getElementById("n").value;
    n = parseInt(n, 10) + 1;
    if (isNaN(n)) {
        n = m+1;
    }
    if (n > maxN) {
        n = maxN;
    }
    document.getElementById("n").value = n;
    update();
}

function decM() {
    var m = document.getElementById("m").value;
    m = parseInt(m, 10) - 1;
    if (m < 1 || isNaN(m)) {
        m = 1;
    }
    if (m > maxM) {
        m = maxM;
    }
    document.getElementById("m").value = m;
    update();
}

function incM() {
    var m = document.getElementById("m").value;
    m = parseInt(m, 10) + 1;
    if (isNaN(m)) {
        m = 1;
    }
    if (m > maxM) {
        m = maxM;
    }
    document.getElementById("m").value = m;
    update();
}

function update() {
    // Initialize canvas
    var c, ctx, textM, textN, m, n, maxX, maxNorm, pZero, legendX, legendY;
    c = document.getElementById('canvas');
    ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = "20px serif"; // Font of the text
    ctx.lineWidth = 1; // Line width

    // Get parameter
    textN = document.getElementById("n").value;
    n = Math.round(Number(textN));
    if (n > 0) {
        document.getElementById("n").value = n;
    }
    textM = document.getElementById("m").value;
    m = Number(textM);

    // Check range of m
    if (m > maxM) {
        m = NaN;
        ctx.fillStyle = "red";
        ctx.fillText("このプログラムでは m ≦ " + maxM + " としてください", 80, 300);
    }
    if (m <= 0) {
        m = NaN;
        ctx.fillStyle = "red";
        ctx.fillText("m > 0 でなければなりません", 150, 300);
    }

    // Check range of n
    if (n > maxN) {
        n = NaN;
        ctx.fillStyle = "red";
        ctx.fillText("このプログラムでは n ≦ " + maxN + " としてください", 80, 300);
    }
    if (n <= m) {
        n = NaN;
        ctx.fillStyle = "red";
        ctx.fillText("n > m でなければなりません", 150, 300);
    }
    
    // Set p
    var p = m / n;
    var round = Math.pow(10,8);
    document.getElementById("p").innerHTML = "p = " + Math.round(p * round) / round;

    // Set Cartesian coodinate system for the graph (GC)
    // Origin of GC with respect to canvas coordinate = (ctx.originX, ctx.originY)
    ctx.originX = 50;
    ctx.originY = 570;
    // Unit vector of GC with respect to canvas coordinate = (ctx.unitX, ctx.unitY)
    maxX = Math.min(Math.max(m * 3, 20), n);
    ctx.unitX = Math.floor(500 / maxX);
    if (ctx.unitX < 1) {
        ctx.unitX = 1;
    }
    // maxNorm = 1 / Math.sqrt(2 * Math.PI * m);
    var logP = logcomb(n, m) + m * Math.log(p) + (n-m) * Math.log(1-p);
    maxNorm = Math.pow(Math.E, logP);
    pZero = Math.pow(Math.E, -m);
    ctx.unitY = -Math.floor(500 / Math.max(maxNorm, pZero));

    // Draw graphs
    if (m > 0) {
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        drawAxis(ctx);
        ctx.scaleX = Math.pow(10, Math.floor(2.6 - Math.log10(ctx.unitX)));
        drawScaleX(ctx);
        ctx.scaleY = 1 / Math.pow(10, Math.floor(Math.log10(-ctx.unitY) - 1.5));
        ctx.offsetScaleY = 50;
        drawScaleY(ctx);
        ctx.strokeStyle = "blue";
        ctx.fillStyle = "blue";
        plotInt(ctx, poisson, m);
        ctx.strokeStyle = "red";
        ctx.fillStyle = "red";
        plotInt(ctx, binomial, [n, m]);
        legendX = 360;
        legendY = 120; // Location of the legend
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(legendX + 15, legendY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText("二項分布", legendX + 40, legendY + 5);
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(legendX + 15, legendY + 40, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText("ポアソン分布", legendX + 40, legendY + 45);
    }
}

// Mathematical functions
function binomial(k, nm) {
    var n = nm[0];
    var m = nm[1];
    var p = m / n;
    if (n < 100) {
         return comb(n, k) * Math.pow(p, k) * Math.pow(1-p, n-k);
    }
    var logP = logcomb(n, k) + k * Math.log(p) + (n-k) * Math.log(1-p);
    return Math.pow(Math.E, logP);
}

function poisson(k, m) {
    if (k < 100) {
        return Math.pow(m, k) * Math.pow(Math.E, -m) / factorial(k);
    }
    var logP = k * Math.log(m) - m - logfact(k);
    return Math.pow(Math.E, logP);
}

function normDist(x, m) {
    return Math.pow(Math.E, -(x - m) * (x - m) / (2 * m)) / Math.sqrt(2 * Math.PI *
        m);
}

function comb(n, k) {
    return factorial(n) / (factorial(k) * factorial(n-k));
}

function logcomb(n, k) {
    return logfact(n) - logfact(k) - logfact(n-k);
}

function factorial(n) {
    if (n < 2) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

function logfact(n) {
    var ret = 0;
    for (var i = 1; i <= n; i++) {
        ret += Math.log(i);
    }
    return ret;
}
</script>
<!-- -------------------------------------------------------------------------------------------- -->
