---
layout: post
title: 取り消し線
tag: javascript
---
テキストに取り消し線 ([合成可能なダイアクリティカルマーク](https://ja.wikipedia.org/wiki/%E5%90%88%E6%88%90%E5%8F%AF%E8%83%BD%E3%81%AA%E3%83%80%E3%82%A4%E3%82%A2%E3%82%AF%E3%83%AA%E3%83%86%E3%82%A3%E3%82%AB%E3%83%AB%E3%83%9E%E3%83%BC%E3%82%AF) の U+0336) をつけます。

<p>文字入力:<br />
<textarea id="string" rows="4" cols="40" onkeyup="striken()"></textarea>
</p>
<p>取り消し線:<br />
<textarea id="striken"  rows="4" cols="40" readonly="true"></textarea>
</p>
<button id="btnCopy" disabled="true">コピー</button>

<script>
'use strict';
function striken() {
    const chrStrikeThrough = String.fromCharCode(822);
    const string = document.getElementById("string").value;
    let txtStriken = "";
    for (const char of string.split('')) {
        if (char != '\n') {
        	txtStriken += chrStrikeThrough;
        }
    	txtStriken += char;
    }
    document.getElementById("striken").value = txtStriken;
    document.getElementById('btnCopy').disabled = false;
}
var btn = document.getElementById('btnCopy');
btn.addEventListener('click', function(e) {
    copy_to_clipboard(document.getElementById("striken").value);
});
function copy_to_clipboard(value) {
    var copyText = value;
    navigator.clipboard.writeText(copyText);
    document.getElementById('btnCopy').disabled = true;
}
</script>
