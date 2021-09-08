---
layout: post
title: 取り消し線
tag: javascript
---
テキストに取り消し線をつけます。

https://yaytext.com/

<p>文字入力:<br />
<textarea id="string" value="" onkeyup="striken()" /></textarea>
</p>
<p>取り消し線:<br />
<textarea id="striken" value="" readonly /></textarea>
</p>
<button id="btnCopy" disabled />コピー</button>

<script>
'use strict';
function striken() {
    const chrStrikeThrough = String.fromCharCode(822);
    const string = document.getElementById("string").value;
    let txtStriken = "";
    for (const char of string.split('')) {
    	txtStriken += chrStrikeThrough + char;
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
