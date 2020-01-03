---
layout: post
title: Canvas でグラフ描画
tags:
- jekyll
- javascript
- math
---
HTML5 の [Canvas要素](https://ja.wikipedia.org/wiki/Canvas%E8%A6%81%E7%B4%A0) で関数のグラフを描画するプログラム DrawCartesianGraph を JavaScript で作成した。

<!-- -------------------------------------------------------------------------------------------- -->
<canvas id="canvas" width="600" height="600"></canvas>
<script type="text/javascript">
// DrawCartesianGraph by Katsutoshi Seki
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
draw(exp, "blue");
ctx.strokeText("y = exp(x)", 420,80);
draw(plus1, "green");
ctx.strokeText("y = x+1", 480,300);

// Define functions to draw
function plus1(x){
  return x+1;
}

function exp(x){
  return Math.pow(Math.E,x);
}

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

このページのソースを表示して、`<canvas id="canvas" width="600" height="600"></canvas>`から`</script>`までをコピーしてHTML文書内に貼り付け、適宜書き換えることで指定したグラフを描画することができる。

- 描画エリア canvas の大きさは `<canvas id="canvas" width="600" height="600">` の width と height で指定する。
- `// Set Cartesian coodinate system for the graph (GC)`のブロックで、グラフの座標系を、Canvasの座標系に対して原点 (originX, originY)、単位ベクトル (unitX, unitY) で定める。ここでは、原点 (300, 500)、単位ベクトル (50, -50) としている。
- `// Draw graphs` のブロックで、以下のようにグラフを描画している。
- `coordinates("black");` で座標軸を描画する。引数で色を指定する。`coordinates("black", showOrigin = false);` とすると、原点の0を表示しない。
- `draw(exp, "blue");` で exp 関数を青 (blue) で描画する。ここで、exp 関数はこの JavaScript 内の `function exp(x)` で定義されている。
- このように、JavaScript で自由に関数を定義して、その関数を設定した座標系で表示することができる。
- `ctx.strokeText("y = exp(x)", 420,80);` では、[HTML canvas strokeText() Method](https://www.w3schools.com/Tags/canvas_stroketext.asp) で文字を直接描画している。
