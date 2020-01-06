---
layout: post-js
title: Canvas のイベント
tag: javascript
---
Canvas に発生したマウスとタッチのイベントを表示します。ついでに線を書きます。

<canvas id="canvas" width="400" height="250"
  style="border:1px solid #000000; background: #ffffe8; max-width: 100%; height: auto; max-height: 100%">
</canvas>
<script>
'use strict';
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
var dragging = false;
var lastPos;

function move(pos) {
    if (dragging) {
        ctx.moveTo(lastPos[0], lastPos[1]);
        ctx.lineTo(pos[0], pos[1]);
        ctx.stroke();
        lastPos[0] = pos[0];
        lastPos[1] = pos[1];
    }
}

function down(pos) {
    dragging = true;
    lastPos = pos;
}

function up(pos) {
    move(pos);
    dragging = false;
}

function pos(e) {
    var x, y;
    x = e.clientX - c.getBoundingClientRect().left;
    y = e.clientY - c.getBoundingClientRect().top;
    return [x, y];
}

function showMessage(message) {
    var current = document.getElementById("message").textContent;
    message = current + '\n' + message;
    document.getElementById("message").innerHTML = message;
}

function showMessageMouseMove(message) {
    document.getElementById("messageMouseMove").innerHTML = message;
}

function showMessageTouchMove(message) {
    document.getElementById("messageTouchMove").innerHTML = message;
}

function init() {
    var i, t, message;
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 0.8;
    c.addEventListener('mouseup', function(e) {
        showMessage('mouseup' + ' (' + pos(e)[0] + ', ' + pos(e)[1] + ')');
        up(pos(e));
    });
    c.addEventListener('click', function(e) {
        showMessage('click' + ' (' + pos(e)[0] + ', ' + pos(e)[1] + ')');
    });
    c.addEventListener('mousedown', function(e) {
        showMessage('mousedown' + ' (' + pos(e)[0] + ', ' + pos(e)[1] + ')');
        down(pos(e));
    });
    c.addEventListener('mousemove', function(e) {
        showMessageMouseMove('mousemove' + ' (' + pos(e)[0] + ', ' +
            pos(e)[1] + ')');
        move(pos(e));
    });
    c.addEventListener('touchstart', function(e) {
        message = 'touchstart';
        for (i = 0; i < e.changedTouches.length; i++) {
            t = e.changedTouches[i];
            message += ' (' + pos(t)[0] + ', ' + pos(t)[1] + ')';
        }
        showMessage(message);
        if (e.changedTouches.length == 1) {
            down(pos(e.changedTouches[0]));
        }
    });
    c.addEventListener('touchcancel', function(e) {
        message = 'touchcancel';
        for (i = 0; i < e.changedTouches.length; i++) {
            t = e.changedTouches[i];
            message += ' (' + pos(t)[0] + ', ' + pos(t)[1] + ')';
        }
        showMessage(message);
    });
    c.addEventListener('touchend', function(e) {
        message = 'touchend';
        for (i = 0; i < e.changedTouches.length; i++) {
            t = e.changedTouches[i];
            message += ' (' + pos(t)[0] + ', ' + pos(t)[1] + ')';
        }
        showMessage(message);
        if (e.changedTouches.length == 1) {
            up(pos(e.changedTouches[0]));
        }
    });
    c.addEventListener('touchmove', function(e) {
        if (document.formOption.noSwipe.checked) {
            e.preventDefault();
        }
        message = 'touchmove';
        for (i = 0; i < e.changedTouches.length; i++) {
            t = e.changedTouches[i];
            message += ' (' + pos(t)[0] + ', ' + pos(t)[1] + ')';
        }
        showMessageTouchMove(message);
        if (e.changedTouches.length == 1) {
            move(pos(e.changedTouches[0]));
        }
    });
}

function clear() {
    c.width = c.width;
    document.getElementById("message").innerHTML = '';
    showMessageMouseMove("(mousemove");
    showMessageTouchMove("(touchmove");
}
</script>

<form name="formOption">
<input id="noSwipe" type="checkbox"><label for="noSwipe">Canvas 内のスワイプを無効にする</label>
<button onclick="clear()">クリア</button>
</form>

<ul>
<li><div id="messageMouseMove">(mousemove)</div>
<li><div id="messageTouchMove">(touchmove)</div>
<li>mousedown, mouseup, click, touchstart, touchend, touchcancel, touchmove
<pre style='width: 350px; max-height: 300px;'>
<div id="message"></div>
</pre>
</ul>

## 参考サイト

- [Using Touch Events with the HTML5 Canvas](http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html)
