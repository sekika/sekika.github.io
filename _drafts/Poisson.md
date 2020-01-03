---
layout: katex
title: ポワソン分布と正規分布
tags:
- math
---
ポワソン分布

[[ P(X=k)=\frac{m^k e^{-m}}{k!} ]]

<!-- -------------------------------------------------------------------------------------------- -->
<canvas id="canvas" width="600" height="600">
このブラウザはHTML5のCanvas要素に対応していないためグラフを表示できません。
</canvas>
<script type="text/javascript">
// DrawCartesianGraph by Katsutoshi Seki
// https://sekika.github.io/2020/01/03/DrawCartesianGraph/
// MIT License

// Initialize canvas
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
ctx.font = "20px serif"; // Font of the text
ctx.lineWidth = 1; // Line width
width = c.width; // Width of the canvas
height = c.height; // Height of the canvas

// Set Cartesian coodinate system for the graph (GC)
// Origin of GC with respect to canvas coordinate
originX = 300;
originY = 500;
// Unit vector of GC with respect to canvas coordinate
unitX = 50;
unitY = -50;

// Draw graphs
coordinates("black");
draw(factorial, "blue");
// draw(plus1, "green");
ctx.strokeText("y = x+1", 480,300);

// Define functions to draw
function poisson(x){
  m=1;
  return Math.pow(m,k)*Math.pow(Math.E,-m)/factorial(k);
}

function exp(x){
  return Math.pow(Math.E,x);
}

function factorial(num) {
  if (num < 2) {
    return 1;
  } else {
    return num * factorial(num - 1);
  }
};

// Draw coordinates
function coordinates(color, showOrigin = true) {
  // X Axis
  ctx.strokeStyle = color;
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
  if (showOrigin) {
    ctx.strokeText("0", originX-15, originY+20);
  }
  ctx.stroke();
}

// Draw a graph
function draw(func, color){
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
</script>
<!-- -------------------------------------------------------------------------------------------- -->
