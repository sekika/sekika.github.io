---
layout: katex
title: ポアソン分布の正規分布による近似
tags:
- math
---
ポアソン分布が正規分布に近似される様子をグラフで確認する。

[ポアソン分布](https://ja.wikipedia.org/wiki/%E3%83%9D%E3%82%A2%E3%82%BD%E3%83%B3%E5%88%86%E5%B8%83)

[[ P(X=x)=\frac{m^x e^{-m}}{x!} ]]

は、mが大きくなると平均 m 標準偏差 $ \sqrt{m} $ の[正規分布](https://ja.wikipedia.org/wiki/%E6%AD%A3%E8%A6%8F%E5%88%86%E5%B8%83) N(m, m) の確率密度関数

[[ f(x)=\frac{1}{\sqrt{2\pi m}} \exp \left( -\frac{(x-m)^2}{2 m} \right) ]]

に近似される。このページでは、その様子をグラフで確認する。mの値をテキストに直接入力（小数の入力可能）するか、ボタンで1ずつ増減できる。

m = <input name="m" id="m" type="text" value="10" size="5" onkeyup="update()"> (0 < m &le; 300)
<input type="button" value="-" onclick="decM();">
<input type="button" value="+" onclick="incM();">

<!-- -------------------------------------------------------------------------------------------- -->
<canvas id="canvas" width="600" height="600">
このブラウザはHTML5のCanvas要素に対応していないためグラフを表示できません。
</canvas>
<script type="text/javascript">
// DrawCartesianGraph by Katsutoshi Seki
// https://sekika.github.io/2020/01/03/DrawCartesianGraph/
// MIT License

update();

function decM() {
  m = document.getElementById("m").value;
  m = parseInt(m)-1;
  if (m<1) {
    m = 1;
  }
  document.getElementById("m").value = m;
  update();
}

function incM() {
  m = document.getElementById("m").value;
  m = parseInt(m)+1;
  if (m>300) {
    m = 300;
  }
  document.getElementById("m").value = m;
  update();
}

function update() {
  // Get parameter
  m = document.getElementById("m").value;
  m = Number(m);
  if (isNaN(m)) {
      m = 1;
  }
  if (m>300) {
    m = 300;
    document.getElementById("m").value = m;
  }
  if (m<=0) {
    m = 1;
  }


// Initialize canvas
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
ctx.font = "20px serif"; // Font of the text
ctx.lineWidth = 1; // Line width
width = c.width; // Width of the canvas
height = c.height; // Height of the canvas

// Clear canvas
ctx.clearRect(0, 0, width, height);

// Set Cartesian coodinate system for the graph (GC)
// Origin of GC with respect to canvas coordinate
originX = 30;
originY = 570;
// Unit vector of GC with respect to canvas coordinate
maxX = m*2.5
if (maxX < 20) {
  maxX = 20;
}
unitX = Math.floor(500 / maxX);
if (unitX < 1) {
  unitX = 1;
}
maxNorm = 1/Math.sqrt(2*Math.PI*m);
unitY = -Math.floor(500 / maxNorm);
var coord = [originX, originY, unitX, unitY, width, height];

// Draw coordinates
// X Axis
ctx.strokeStyle = "black";
ctx.beginPath();
ctx.moveTo(0, originY);
ctx.lineTo(width-30, originY);
ctx.lineTo(width-45, originY-10);
ctx.moveTo(width-30, originY);
ctx.lineTo(width-45, originY+10);
ctx.strokeText("x", width-25, originY+5);

// Y Axis
ctx.moveTo(originX, height);
ctx.lineTo(originX, 30);
ctx.lineTo(originX-10, 45);
ctx.moveTo(originX, 30);
ctx.lineTo(originX+10, 45);
ctx.strokeText("y", originX-5, 20);

// Origin
ctx.strokeText("0", originX-15, originY+20);
ctx.stroke();

// Legend
legendX = 360
legendY = 120
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
  
// Draw graphs
if (m > 0) {
  plotint(poisson, ctx, coord, "red");
  draw(normDist, ctx, coord, "blue");
}
}

// Define functions to draw
function poisson(k){
  if (k < 100) {
    return Math.pow(m,k)*Math.pow(Math.E,-m)/factorial(k);
  }
  logP = k * Math.log(m) - m - logfact(k);
  return Math.pow(Math.E, logP);
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

function normDist(x) {
  return Math.pow(Math.E, -(x-m)*(x-m) / (2*m)) * maxNorm;
}

// Draw a graph
function draw(func, ctx, coord, color){
  originX = coord[0];
  originY = coord[1];
  unitX = coord[2];
  unitY = coord[3];
  width = coord[4];
  height = coord[5];
  ctx.strokeStyle = color;
  ctx.beginPath();
  first = true;
  for (pixX = 0; pixX < width-30; pixX++) {
     x = (pixX-originX) / unitX;
     y = func(x);
     pixY = originY + unitY * y
     if (pixY >= 35 && pixY <= height) {
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

function plotint(func, ctx, coord, color){
  originX = coord[0];
  originY = coord[1];
  unitX = coord[2];
  unitY = coord[3];
  width = coord[4];
  height = coord[5];
  ctx.beginPath();
  for (x = 0; x*unitX < width-originX-30; x++) {
     y = func(x);
     pixX = originX + unitX * x
     pixY = originY + unitY * y
     if (pixY >= 35 && pixY <= height) {
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
