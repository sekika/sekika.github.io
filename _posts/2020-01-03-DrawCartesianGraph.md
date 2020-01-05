---
layout: post
title: 関数のグラフを描画するプログラム
date: 2020-01-03 12:33:17 +0000
update: 2020-01-05 16:55:20 +0000
tags:
- jekyll
- javascript
- math
---
HTML5 の [Canvas要素](https://ja.wikipedia.org/wiki/Canvas%E8%A6%81%E7%B4%A0) で関数のグラフを描画するプログラム DrawCartesianGraph を JavaScript で作成した。

<!-- -------------------------------------------------------------------------------------------- -->
<canvas id="canvas" width="600" height="600"
  style="max-width: 100%; height: auto; max-height: 100%">
このブラウザはHTML5のCanvas要素に対応していないためグラフを表示できません。
</canvas>
<script src="https://sekika.github.io/js/graph.js"></script>
<script>
'use strict';

// Initialize canvas
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
ctx.font = "20px serif"; // Font of the text
ctx.lineWidth = 1; // Line width

// Set Cartesian coodinate system for the graph (GC)
// Origin of GC with respect to canvas coordinate = (ctx.originX, ctx.originY)
ctx.originX = 300;
ctx.originY = 500;
// Unit vector of GC with respect to canvas coordinate = (ctx.unitX, ctx.unitY)
ctx.unitX = 50;
ctx.unitY = -50;

// Draw graphs
drawAxis(ctx); // Draw axis and labels
drawScaleX(ctx); // Draw scale of x axis
drawScaleY(ctx); // Draw scale of y axis
ctx.strokeStyle = "blue"; // Color of the curve
draw(ctx, exp); // Draw y=exp(x) curve
ctx.fillStyle = "blue"; // Color of legend
ctx.fillText("y = exp(x)", 420, 80); // Write legend
ctx.strokeStyle = "green"; // Color of the curve
draw(ctx, plus, 1); // Draw y=x+1 curve
ctx.fillStyle = "green"; // Color of legend
ctx.fillText("y = x+1", 480, 300); // Write legend

// Define mathematical functions
function plus(x, a) {
    return x + a;
}

function exp(x) {
    return Math.pow(Math.E, x);
}
</script>
<!-- -------------------------------------------------------------------------------------------- -->

## 使い方

以下のようにして、指定した関数のグラフを描画することができる。

- このページの[ソース](https://raw.githubusercontent.com/sekika/sekika.github.io/master/_posts/2020-01-03-DrawCartesianGraph.md)を表示して、`<canvas id="canvas" width="600" height="600"`から`</script>`までをコピーしてHTML文書内に貼り付け、適宜書き換える。
- 描画エリア canvas の大きさは `<canvas id="canvas" width="600" height="600"` の width と height で指定する。
- `<script src="https://sekika.github.io/js/graph.js"></script>` では、[graph.js](https://sekika.github.io/js/graph.js) のURLを指定する。このサーバー上の graph.js が書き換えられる可能性があるため、コピーして使うことを推奨する。
- `var ctx = c.getContext('2d');` で指定されたキャンバスのコンテキスト ctx に対してグラフを描画する。グラフを描画するためパラメータは ctx のプロパティとして設定する。
- `// Set Cartesian coodinate system for the graph (GC)`のブロックで、グラフの座標系を、ctx の座標系に対して原点 (ctx.originX, ctx.originY)、単位ベクトル (ctx.unitX, ctx.unitY) で定める。ここでは、原点 (300, 500)、単位ベクトル (50, -50) としている。
- `// Draw graphs` のブロックで、以下のようにグラフを描画している。
- `drawAxis(ctx);` で ctx のキャンバスに座標軸を描画する。
- `drawScaleX(ctx);` でx軸の目盛りを、`drawScaleY(ctx);` でy軸の目盛りを描画する。目盛りの間隔を変えるときには、ctx.scaleX と ctx.scaleY にその値を入れておく。
- `draw(ctx, exp);` で ctx のキャンバスに exp 関数を描画する。exp 関数はこの JavaScript 内の `function exp(x)` で定義されている。
- `draw(ctx, plus, 1);` で ctx のキャンバスに plus 関数を描画する。3つ目の引数である1は、plus 関数の2つ目の引数である。このように、draw 関数の3つ目の引数があるときは、draw 関数の2つ目の引数で指定されている関数の2つ目の引数として渡される。関数に複数の引数があるときには、1つの配列変数にまとめれば良い。
- このように、JavaScript で自由に関数を定義して、その関数を設定した座標系で表示することができる。
- `ctx.fillText("y = exp(x)", 420,80);` では、[HTML canvas strokeText() Method](https://www.w3schools.com/Tags/canvas_stroketext.asp) で文字を直接描画している。
- パラメータの一覧は [graph.js](https://github.com/sekika/sekika.github.io/blob/master/js/graph.js) の頭の const で宣言されている定数を参照。たとえば、`const labelX = "x"; // Label of the x axis` はx軸のラベルにはxという文字が設定されていることを意味する。ctx の同じ名前のプロパティ、すなわち ctx.labelX を設定することで、このデフォルトとは異なる値を設定できる。

## 使用例


- [ポアソン分布の正規分布による近似](https://sekika.github.io/2020/01/04/Poisson/): ポアソン分布に整数値だけを離散的にプロットする plotInt 関数を使用している。テキストボックスに入力された数からリアルタイムにパラメータを変化させてグラフを描画する。（[ソース](https://raw.githubusercontent.com/sekika/sekika.github.io/master/_posts/2020-01-04-Poisson.md)）
- [指数と対数関数の微分](https://sekika.github.io/2017/05/06/derivative-exp-log/): 小さめのグラフ。軸ラベルの文字を変えている。（[ソース](https://raw.githubusercontent.com/sekika/sekika.github.io/master/_posts/2017-05-06-derivative-exp-log.md)）

## Canvas の参考サイト

- [Canvasリファレンス](http://www.htmq.com/canvas/) (HTMLクイックリファレンス)
- [HTML5 Canvas](https://www.w3schools.com/html/html5_canvas.asp) (w3schools.com)
- [【連載】第一回HTML5でCanvasアプリを作る入門編 ~canvas関連メソッドリファレンス~](http://nigohiroki.hatenablog.com/entry/2013/01/04/025502) (nigoblog, 2013/1/4)
- [HTML5 の Canvas を使って素晴らしいグラフィックスを作成する](https://www.ibm.com/developerworks/jp/web/library/wa-html5canvas/) (Ken Bluttman, IBM, 2011/2/8)
- [Canvas API](https://developer.mozilla.org/ja/docs/Web/API/Canvas_API) (Mozilla)
