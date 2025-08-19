---
layout: post-en
title: Dodgem
ja: /dodgem/ja/
excerpt: Play dodgem.
hashtag: dodgem
permalink: /dodgem/
tags:
- game
- javascript
- english
---
<canvas id="canvas">This browzer does not support Canvas</canvas>
<div id="message"></div>
<div id="watchMode"></div>
<div id="status"></div>
<div id="lang" style="display: none;">en</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js"></script>
<script src="/js/dodgem.min.js"></script>

- <a href="help/">How to play dodgem</a>
- Board: <input type="radio" name="board" value="3">3×3
<input type="radio" name="board" value="4" checked>4×4
<input type="radio" name="board" value="5">5×5
- <input type="radio" name="turn" id="sente" value="sente" checked>Play 1st
<input type="radio" name="turn" id="gote" value="gote">Play 2nd
<input type="radio" name="turn" id="alt" value="alt">Alternate
<input type="radio" name="turn" id="comp" value="comp">Watch
- Strength: <input type="radio" name="level" value="1" checked>L1
<input type="radio" name="level" value="2">L2
<input type="radio" name="level" value="3">L3
- <p><button id="new" onclick="board.newGame()">New game</button>
- Change <button onclick="board.changeTileSize()">size of square</button>
- [15 puzzle](/2020/01/14/15Puzzle/) and [Sudoku](/kaidoku/sudoku) are also available.
