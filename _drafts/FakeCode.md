---
layout: post
title: フェイク暗証番号生成
tag: security
---
財布が盗まれたときに、偽の暗証番号をいくつか書いた紙を財布を入れておくと、盗んだ人はそれがキャッシュカードの暗証番号かと思い、その偽の暗証番号で引き出そうとするので、規定回数間違えるとATMがロックされる、というライフハックが古くからあります。

- [盗難されたキャッシュカードを引き出されにくくするための簡単な方法](http://nakamorikzs.net/entry/20080606/1212753072)

そこで、

<script>
// 100〜9999 の乱数を発生
var rand = 100 + Math.floor( Math.random() * 9900 ) ;
 document.write(rand);
</script>
