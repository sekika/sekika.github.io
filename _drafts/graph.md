---
layout: post
title: Canvas でグラフ描画
tags:
- jekell
- javascript
- math
---
HTML5 の[Canvas要素](https://ja.wikipedia.org/wiki/Canvas%E8%A6%81%E7%B4%A0)でグラフを描画するJavaScriptを作成した。

<canvas id="canvas" width="600" height="600"></canvas>
<script type="text/javascript">
// Initialize canvas
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
ctx.font = "20px serif"; // Font of the text
width = c.width;
height = c.height;

// Set Cartesian coodinate system
// Origin of the system with respect to pixels
originX = 300;
originY = 500;
// Unit vector of the system with respect to pixels
unitX = 50;
unitY = -50;

// Draw graphs
coordinates("black");
draw(exp, "blue");
ctx.lineWidth = 1;
ctx.strokeText("y = exp(x)", 420,80);
draw(plus1, "green"); // Set name of the function as the first variable
ctx.strokeText("y = x+1", 480,300);
// draw(normdist);

// Functions to draw
function plus1(x){
  return x+1;
}

function exp(x){
  return Math.pow(Math.E,x);
}

function normdist(x){
  return exp(-x*x/2) / Math.sqrt(2*Math.PI);
}

// Draw coordinates
function coordinates(color) {
  // X Axis
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
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
     }
  }
  ctx.stroke();
}

</script>
