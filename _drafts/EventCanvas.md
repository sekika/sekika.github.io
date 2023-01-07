---
layout: post-js-en
ja: /2020/01/07/CanvasEvent/
title: Show mouse and touch events in the HTML canvas element
hashtag: JavaScript
tags:
- english
- javascript
---
For showing the handling of mouse and touch events in the HTML canvas element, I created a JavaScript program that draws a line while displaying the name and position of the event that occurred.

<canvas id="canvas" width="400" height="250"
  style="border:1px solid #000000; background: #ffffe8; max-width: 100%; height: auto; max-height: 100%">
This browser does not support Canvas element of HTML5
</canvas>
<script src="/js/canvasevent.js"></script>

<form name="formOption">
<input id="noSwipe" type="checkbox"><label for="noSwipe">Disable swipe in the canvas</label>
<button onclick="clear()">Clear</button>
</form>

- <div id="messageMouseMove">(mousemove)</div>
- <div id="messageTouchMove">(touchmove)</div>
- mousedown, mouseup, click, touchstart, touchend, touchcancel, touchmove
<pre style='width: 350px; max-height: 300px;'>
<div id="message"></div>
</pre>

## Explanation

I will briefly describe the main points because the details are written in the reference site at the end of this document. In the HTML of this page, a canvas is set up in the following location

```html
<canvas id="canvas" width="400" height="250" style="border:1px solid #000000; background: #ffffe8; max-width: 100%; height: auto; max-height: 100%">
This browser does not support Canvas element of HTML5
</canvas>
<script src="/js/canvasevent.js"></script>
```

to load [this JavaScript](https://github.com/sekika/sekika.github.io/blob/master/js/canvasevent.js). In the following part of the JavaScript

```javascript
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
```

the canvas and context are read by the global variables c and ctx. For example, the mousedown event is read as follows.

```javascript
    c.addEventListener('mousedown', function(e) {
        showMessage('mousedown' + strPair(pos(e)));
        down(pos(e));
    });
```

Here, pos(e) is a function that returns the coordinates on the canvas of the mouse from the event e as a list, and is calculated like this.

```javascript
function pos(e) {
    var x, y;
    x = e.clientX - c.getBoundingClientRect().left;
    y = e.clientY - c.getBoundingClientRect().top;
    return [x, y];
}
```

This means that the x-coordinate on the canvas can be obtained by subtracting the position c.getBoundingClientRect().left of the left edge of the canvas from the x-coordinate e.clientX of the mouse position. The same is true for the y-coordinate. strPair is a function that converts a list of coordinates into a string, and strPair(pos(e)) can obtain the mouse position of the event e as a string of the form (x, y).

The same is true for the mouse events mouseup, click and mousemove.

Touch events are handled differently because, unlike a mouse, multiple finger touches occur. For example touchstart handles like this.

```javascript
   c.addEventListener('touchstart', function(e) {
        message = 'touchstart';
        for (i = 0; i < e.changedTouches.length; i++) {
            message += strPair(pos(e.changedTouches[i]));
        }
        showMessage(message);
        if (e.changedTouches.length == 1) {
            down(pos(e.changedTouches[0]));
        }
    });
```

すなわち、タッチのイベントは e.changedTouches にリストとして格納されていて、その長さを e.changedTouches.length で取得できる。1つ目の指の座標は、先程の pos 関数を使って pos(e.changedTouches[0]) によって取得できる。touchcancel, touchend, touchmove も同様である。

線を描画する処理については、マウスとタッチで同じ処理ができるように、mousedown と touchdown イベントからは down 関数を、mouseup と touchup イベントからは up 関数を、mousemove と touchmove イベントからは move 関数を、それぞれキャンバス上の座標を引数として呼び出している。グローバル変数 dragging を、down で true に、up で false にして、dragging が true のときだけ線を描画している。線の描画は、

```javascript
function move(pos) {
    if (dragging) {
        ctx.moveTo(lastPos[0], lastPos[1]);
        ctx.lineTo(pos[0], pos[1]);
        ctx.stroke();
        lastPos = pos;
    }
}
```

のようにしている。

タッチで指を動かすと、スワイプによって画面が動くため描画しにくい。そこで「Canvas 内のスワイプを無効にする」をチェックすることで、Canvas 内で touchmove イベントが発生したときには e.preventDefault() によってデフォルトのタッチ操作が無効となるようにした（通常は常に無効にするが、ここでは無効にする場合としない場合の違いを見るためにこのようにした）。それは、次の箇所である。

```javascript
        if (document.formOption.noSwipe.checked) {
            e.preventDefault();
        }
```

また、タッチイベントによる線の描画は、1本指のときにだけ発生するようにしている。

タッチペンで描画してみたところ、良い書き心地であった。色や線の太さを変える機能と点を打つ機能、直線を引く機能、塗りつぶす機能をつければ、十分に実用的な簡易お絵かきソフトになるであろう。c.toDataURL() で画像データを得ることができるようなので、作成した画像をブラウザの localStorage に保存するといった運用も可能である。いずれまた、そのようなソフトを作って公開するかもしれない。

キャンバスのマウスとタッチによる操作をともなう JavaScript プログラムを書くときには、まずはこのプログラムをコピーしてからプログラムを書けば、イベントを確認しながらプログラムを書けるので効率的であろう。最後にイベントを表示する処理を消してから公開すれば良い。

## Example
- [15 Puzzle](https://sekika.github.io/2020/01/14/15Puzzle/) ([source](https://sekika.github.io/js/15.js))

## Reference

- [Using Touch Events with the HTML5 Canvas](http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html) (Ben Centra, 2014/12/5)
- [Touch events](https://developer.mozilla.org/ja/docs/Web/API/Touch_events) (MDN web docs)