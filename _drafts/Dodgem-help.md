---
layout: post-en
title: How to play dodgem
ja: /dodgem/ja/help/
hashtag: dodgem
permalink: /dodgem/help/
tags:
- game
- javascript
- english
---
This article explains how to play [Dodgem](/dodgem/).

## Rules
On an n×n board, n−1 blue pieces are placed in the leftmost column and n−1 red pieces in the bottom row. The figure below shows the case n=4.

<img src="/file/dodgem/initial4.jpg" width="250px">

- Blue moves first, then Red, alternating turns.
- Blue pieces move to the right as their forward direction; they may also move vertically (up or down) by one square.
- Red pieces move upward as their forward direction; they may also move horizontally (left or right) by one square.
- Pieces may move only to empty squares. No jumps, captures, or stacking.
- When a piece reaches its exit edge (Blue: rightmost column; Red: top row), it can be removed on a subsequent move.
- Players must not block their opponent’s movement completely. Equivalently, if you have no legal move on your turn, you win.
- The player who removes all of their own pieces first wins.
- If the same position appears three times, the game is a draw.

## Controls
- Click or tap the piece you want to move, then select the destination.
- Double-click or double-tap the same piece to remove it, if removal is available.
- Select the board size, whether you play first or second, and the computer’s strength (levels 1–3), then press the “Start Game” button to begin a new game.
- Selecting “Watch” lets the computer play itself. You can choose the playback speed; selecting “100” runs 100 games continuously. You can change the speed or stop at any time.
- When playing consecutive games with the same settings, wins and losses are recorded. The record resets if you reload the page or interrupt the run.

## Strategy by board size
It is known that 3×3 is a first-player win, while 4×4 and 5×5 are draws under perfect play.
- First, aim to consistently defeat the computer as the first player on 3×3.
- On 4×4 and 5×5, you cannot force a win against perfect play, but you have good chances at levels 1 and 2. Since winning as the first player is easier, aim to win as first and draw as second.
- At level 3 on 4×4, defeating the computer is nearly impossible, so focus on securing a draw. If the computer detects a forced win, it will show a notification. Studying these positions before returning to levels 1 and 2 will improve your chances.
- For 4×4 or larger human-vs-human play, a fair format—similar to chess championships—is to alternate colors an equal number of times and compare results.

## About this program
- This program is written in JavaScript. [Source code](https://github.com/sekika/sekika.github.io/tree/master/js/dodgem.js). It requires loading [pako](https://cdnjs.com/libraries/pako).
- It loads, as a compressed evalmap, a subset of the position‑evaluation database computed offline in MongoDB by a nearly perfect analysis [Python program](https://sekika.github.io/dodgem-py/). Because the online version does not use MongoDB, it supports CPU levels 1–3 only; the MongoDB‑backed level 4 is available in the local CLI/GUI version.

## Reference
- Berlekamp, Elwyn R.; Conway, John Horton; Guy, Richard K. (2003), “Dodgem,” Winning Ways for your Mathematical Plays, vol. 3 (2nd ed.), A.K. Peters, pp. 749–750, ISBN 978-1-56881-143-7.
- [Discussion thread, rec.games.abstract (1996)](https://ics.uci.edu/~eppstein/cgt/dodgem.html). David desJardins created win–loss tables for 4×4 and 5×5, concluding they are draws.
- [Wikipedia article](https://en.wikipedia.org/wiki/Dodgem)
