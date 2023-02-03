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

In this way, touch events are stored as a list in e.changedTouches, the length of which can be obtained by e.changedTouches.length. The coordinates of the first finger can be obtained by pos(e.changedTouches[0]) using the pos function described earlier. The same applies to touchcancel, touchend, and touchmove.

For the process of drawing lines, the down function is called from the mousedown and touchdown events, the up function from the mouseup and touchup events, and the move function from the mousemove and touchmove events, so that the same process can be performed for mouse and touch. Each of these functions is called with the coordinates on the canvas as arguments. The global variable "dragging" is set to true for down and false for up, and lines are drawn only when "dragging" is true.

The lines are drawn as follows.

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

When a finger is moved by touch, it is difficult to draw because the screen moves with the swipe. Therefore, by checking the "Disable swiping in the canvas" checkbox, the default touch operation is disabled by e.preventDefault() when a touchmove event occurs in the Canvas (Normally, we always disable it, but here we did it this way to see the difference between disabling it and not disabling it.). It is in the following place.

```javascript
        if (document.formOption.noSwipe.checked) {
            e.preventDefault();
        }
```

In addition, drawing of lines by touch events occurs only when one finger is used.

I tried drawing with a stylus and found it to be a good drawing experience. If we add functions to change the color and line thickness, dot, draw a straight line, and fill, it will be a practical simple drawing software. Since it seems that c.toDataURL() can be used to obtain image data, the software can also be used to store the created images in the browser's local storage. I may eventually create such software and release it to the public.

When writing a JavaScript program that involves mouse and touch operations on the canvas, it would be efficient to copy this program first and then write the program while checking the events. Finally, you can delete the process of displaying the events before publishing the program.

## Example
- [15 Puzzle](https://sekika.github.io/2020/01/14/15Puzzle/) ([source](https://sekika.github.io/js/15.js))

## Reference

- [Using Touch Events with the HTML5 Canvas](http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html) (Ben Centra, 2014/12/5)
- [Touch events](https://developer.mozilla.org/ja/docs/Web/API/Touch_events) (MDN web docs)
