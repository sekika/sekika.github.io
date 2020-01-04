---
layout: katex
title: ポアソン分布の正規分布による近似
tags:
- math
- javascript
---
ポアソン分布の平均mが大きくなると正規分布に近似される様子をグラフで確認するプログラムを作成した。

期待値 m 分散 m の[ポアソン分布](https://ja.wikipedia.org/wiki/%E3%83%9D%E3%82%A2%E3%82%BD%E3%83%B3%E5%88%86%E5%B8%83)の確率質量関数

[[ P(X=x)=\frac{m^x e^{-m}}{x!} ]]

は、mが大きくなると期待値 m 分散 m の[正規分布](https://ja.wikipedia.org/wiki/%E6%AD%A3%E8%A6%8F%E5%88%86%E5%B8%83)の確率密度関数

[[ f(x)=\frac{1}{\sqrt{2\pi m}} \exp \left( -\frac{(x-m)^2}{2 m} \right) ]]

に近似される。このページでは、その様子をグラフで確認する。

mの値をテキストボックスに直接入力（小数の入力可能）する。ボタンで1ずつ増減できる。

m = <input name="m" id="m" type="text" value="3" size="4" onkeyup="update()">
<input type="button" value="-" onclick="decM();">
<input type="button" value="+" onclick="incM();">

<!-- -------------------------------------------------------------------------------------------- -->
<canvas id="canvas" width="600" height="600">
このブラウザはHTML5のCanvas要素に対応していないためグラフを表示できません。
</canvas>
<script type="text/javascript">
'use strict';
update();

function decM() {
  var m = document.getElementById("m").value;
  m = parseInt(m)-1;
  if (m<1 || isNaN(m)) {
    m = 1;
  }
  if (m>300) {
    m = 300;
  }
  document.getElementById("m").value = m;
  update();
}

function incM() {
  var m = document.getElementById("m").value;
  m = parseInt(m)+1;
  if (isNaN(m)) {
    m = 1;
  }
  if (m>300) {
    m = 300;
  }
  document.getElementById("m").value = m;
  update();
}

function update() {
  // Initialize canvas
  var c = document.getElementById('canvas');
  var ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.width = c.width;
  ctx.height = c.height;
  ctx.font = "20px serif"; // Font of the text
  ctx.lineWidth = 1; // Line width

  // Get parameter
  var textM = document.getElementById("m").value;
  var m = Number(textM);
  ctx.m = m;

  // Check range of m
  if (m>300) {
    m = NaN;
    ctx.fillStyle = "red";
    ctx.fillText("このプログラムでは m ≦ 300 としてください", 80, 300);
  }
  if (m<=0) {
    m = NaN;
    ctx.fillStyle = "red";
    ctx.fillText("m > 0 でなければなりません", 150, 300);
  }

  // Set Cartesian coodinate system for the graph (GC)
  // Origin of GC with respect to canvas coordinate = (ctx.originX, ctx.originY)
  ctx.originX = 50;
  ctx.originY = 570;
  // Unit vector of GC with respect to canvas coordinate = (ctx.unitX, ctx.unitY)
  var maxX = m*2.5
  if (maxX < 20) {
    maxX = 20;
  }
  ctx.unitX = Math.floor(500 / maxX);
  if (ctx.unitX < 1) {
    ctx.unitX = 1;
  }
  var maxNorm = 1/Math.sqrt(2*Math.PI*m);
  var pZero = Math.pow(Math.E, -m)
  ctx.unitY = -Math.floor(500 / Math.max(maxNorm, pZero));

  // Draw graphs
  if (m>0) {
    drawCoord(ctx, "black");
    var scaleX = Math.pow(10, Math.floor(2.6 - Math.log10(ctx.unitX)));
    drawScaleX(ctx, scaleX);
    var scaleY = 1/Math.pow(10, Math.floor(Math.log10(-ctx.unitY)-1.5));;
    drawScaleY(ctx, scaleY);
    plotInt(poisson, ctx, "red");
    draw(normDist, ctx, "blue");
    // Legend
    var legendX = 360; var legendY = 120; // Location of the legend
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(legendX+15, legendY, 4, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.fillText("ポアソン分布", legendX + 40, legendY + 5);
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.moveTo(legendX, legendY+30);
    ctx.lineTo(legendX+30, legendY+30);
    ctx.stroke();
    ctx.fillText("正規分布", legendX + 40, legendY + 35);
  }
}

// Mathematical functions
function poisson(k, m){
  if (k < 100) {
    return Math.pow(m,k)*Math.pow(Math.E,-m)/factorial(k);
  }
  var logP = k * Math.log(m) - m - logfact(k);
  return Math.pow(Math.E, logP);
}

function normDist(x, m) {
  return Math.pow(Math.E, -(x-m)*(x-m) / (2*m)) / Math.sqrt(2*Math.PI*m);
}

function factorial(n) {
  if (n < 2) {
    return 1;
  } else {
    return n * factorial(n-1);
  }
}

function logfact(n) {
  if (n < 2) {
    return 0;
  } else {
    return Math.log(n) + logfact(n-1);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
// DrawCartesianGraph by Katsutoshi Seki
// https://sekika.github.io/2020/01/03/DrawCartesianGraph/
// MIT License

// Draw coordinates
function drawCoord(ctx, color){
  // X Axis
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, ctx.originY);
  ctx.lineTo(ctx.width-30, ctx.originY);
  ctx.lineTo(ctx.width-45, ctx.originY-10);
  ctx.moveTo(ctx.width-30, ctx.originY);
  ctx.lineTo(ctx.width-45, ctx.originY+10);
  ctx.strokeText("x", ctx.width-25, ctx.originY+5);

  // Y Axis
  ctx.moveTo(ctx.originX, ctx.height);
  ctx.lineTo(ctx.originX, 30);
  ctx.lineTo(ctx.originX-10, 45);
  ctx.moveTo(ctx.originX, 30);
  ctx.lineTo(ctx.originX+10, 45);
  ctx.strokeText("y", ctx.originX-5, 20);
  ctx.stroke();
}

// Draw Scale of the x axis
function drawScaleX(ctx, scaleX) {
  for (var x=0; ctx.originX+ctx.unitX*x < ctx.width - 30; x=x+scaleX) {
    var precision = 10000000; x = parseInt(x * precision + 0.5) / precision;
    ctx.moveTo(ctx.originX+ctx.unitX*x, ctx.originY);
    ctx.lineTo(ctx.originX+ctx.unitX*x, ctx.originY+7);
    ctx.fillStyle = "black";
    ctx.fillText(x, ctx.originX+ctx.unitX*x-20, ctx.originY+25);
  }
  ctx.stroke();
}

// Draw Scale of the y axis
function drawScaleY(ctx, scaleY) {
  for (var y=scaleY; ctx.originY+ctx.unitY*y > 30; y=y+scaleY) {
    var precision = 10000000; y = parseInt(y * precision + 0.5) / precision;
    ctx.moveTo(ctx.originX, ctx.originY+ctx.unitY*y);
    ctx.lineTo(ctx.originX-5, ctx.originY+ctx.unitY*y);
    ctx.fillText(y.toString(), ctx.originX-50, ctx.originY+ctx.unitY*y+10);
  }
  ctx.stroke();
}

// Draw a graph
function draw(func, ctx, color){
  ctx.strokeStyle = color;
  ctx.beginPath();
  var first = true;
  for (var pixX = 0; pixX < ctx.width-30; pixX++) {
     var x = (pixX-ctx.originX) / ctx.unitX;
     var y = func(x, ctx.m); // Calling function with a parameter m
     var pixY = ctx.originY + ctx.unitY * y
     if (pixY >= 35 && pixY <= ctx.height) {
        if (first) {
           ctx.moveTo(pixX, pixY);
           first = false;
        } else {
           ctx.lineTo(pixX, pixY);
        }
     } else {
        first = true;
     }
  }
  ctx.stroke();
}

function plotInt(func, ctx, color){
  ctx.beginPath();
  for (var x = 0; x*ctx.unitX < ctx.width-ctx.originX-30; x++) {
     var y = func(x, ctx.m); // Calling function with a parameter m
     var pixX = ctx.originX + ctx.unitX * x
     var pixY = ctx.originY + ctx.unitY * y
     if (pixY >= 35 && pixY <= ctx.height) {
         ctx.beginPath();
         ctx.fillStyle = color;
         ctx.arc(pixX, pixY, 4, 0, Math.PI*2);
         ctx.fill();
     }
  }
  ctx.stroke();
}
</script>
<!-- -------------------------------------------------------------------------------------------- -->
