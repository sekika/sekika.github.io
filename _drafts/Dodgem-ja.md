---
layout: post
title: ドッジェム
en: /dodgem/
excerpt: ドッジェムで遊ぶ
hashtag: dodgem
permalink: /dodgem/ja/
tags:
- game
- javascript
---
<canvas id="canvas">このブラウザはCanvasに対応していません。</canvas>
<div id="message"></div>
<div id="watchMode"></div>
<div id="status"></div>
<div id="lang" style="display: none">ja</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pako/{{ site.pako-version }}/pako.min.js"></script>
<script src="/js/dodgem.min.js"></script>

- <a href="help/">ドッジェムの遊び方</a>
- 盤面: <input type="radio" name="board" value="3">3×3
<input type="radio" name="board" value="4" checked>4×4
<input type="radio" name="board" value="5">5×5
- 手番: <input type="radio" name="turn" id="sente" value="sente" checked>先手
<input type="radio" name="turn" id="gote" value="gote">後手
<input type="radio" name="turn" id="alt" value="alt">交互
<input type="radio" name="turn" id="comp" value="comp">観戦
- 強さ: <input type="radio" name="level" value="1" checked>L1
<input type="radio" name="level" value="2">L2
<input type="radio" name="level" value="3">L3
- <button id="new" onclick="board.newGame()">ゲーム開始</button>
- <button onclick="board.changeTileSize()">ます目の大きさ</button>を変える
- [15パズル](/2020/01/17/15Puzzle/)と[ナンプレ](/kaidoku/sudoku)もどうぞ。
