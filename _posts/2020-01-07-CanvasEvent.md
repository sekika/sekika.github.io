---
layout: post-js
title: Canvas のマウスとタッチのイベントを表示するプログラム
date: 2020-01-07 06:12:16 +0000
tag: javascript
---
HTMLのCanvas要素におけるマウスとタッチのイベントの取り扱いを理解するために、発生したイベントの名前と位置を表示ながら線を描画するJavaScriptのプログラムを作成した。

<canvas id="canvas" width="400" height="250"
  style="border:1px solid #000000; background: #ffffe8; max-width: 100%; height: auto; max-height: 100%">
このブラウザはHTML5のCanvas要素に対応していません。
</canvas>
<script src="/js/canvasevent.js"></script>

<form name="formOption">
<input id="noSwipe" type="checkbox"><label for="noSwipe">Canvas 内のスワイプを無効にする</label>
<button onclick="clear()">クリア</button>
</form>

- <div id="messageMouseMove">(mousemove)</div>
- <div id="messageTouchMove">(touchmove)</div>
- mousedown, mouseup, click, touchstart, touchend, touchcancel, touchmove
<pre style='width: 350px; max-height: 300px;'>
<div id="message"></div>
</pre>

## 解説

詳しくは文末の参考サイトに書かれているので、要点を簡潔に記す。このページのHTMLでは

```html
<canvas id="canvas" width="400" height="250" style="border:1px solid #000000; background: #ffffe8; max-width: 100%; height: auto; max-height: 100%">
このブラウザはHTML5のCanvas要素に対応していません。
</canvas>
<script src="/js/canvasevent.js"></script>
```

の箇所でキャンバスが設置され、[このJavaScript](https://github.com/sekika/sekika.github.io/blob/master/js/canvasevent.js)を読み込む。JavaScript では、

```javascript
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
```

と、キャンバスとコンテキストをグローバル変数 c, ctx で読み取る。たとえば mousedown のイベントは

```javascript
    c.addEventListener('mousedown', function(e) {
        showMessage('mousedown' + strPair(pos(e)));
        down(pos(e));
    });
```

と読み取っている。ここで、pos(e)はeというイベントからマウスのキャンバスにおける座標をリストとして返す関数で

```javascript
function pos(e) {
    var x, y;
    x = e.clientX - c.getBoundingClientRect().left;
    y = e.clientY - c.getBoundingClientRect().top;
    return [x, y];
}
```

のように計算している。すなわち、マウス位置のx座標 e.clientX からキャンバス左端の位置 c.getBoundingClientRect().left を引くことで、キャンバス上のx座標を得ることができる。y座標も同様である。strPair は座標のリストを文字列に変換する関数で strPair(pos(e)) によって e というイベントのマウスの位置を ” (x, y)” の形の文字列として得ることができる。

マウスのイベント mouseup, click, mousemove についても同様である。

タッチのイベントについては、マウスと違って複数の指によるタッチが生じるため、取り扱いが異なる。たとえば touchstart では

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

としている。すなわち、タッチのイベントは e.changedTouches にリストとして格納されていて、その長さを e.changedTouches.length で取得できる。1つ目の指の座標は、先程の pos 関数を使って pos(e.changedTouches[0]) によって取得できる。touchcancel, touchend, touchmove も同様である。

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

## 作成例
- [15パズル](https://sekika.github.io/2020/01/17/15Puzzle/) ([ソースコード](https://sekika.github.io/js/15.js))

## 参考サイト

- [Using Touch Events with the HTML5 Canvas](http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html) (Ben Centra, 2014/12/5)
- [Touch events](https://developer.mozilla.org/ja/docs/Web/API/Touch_events) (MDN web docs)
- [【連載】第二回HTML5でCanvasアプリを作る入門編 ~マウスクリックイベントについて~](http://nigohiroki.hatenablog.com/entry/2013/01/11/010617) (nigoblog, 2013/1/11)
