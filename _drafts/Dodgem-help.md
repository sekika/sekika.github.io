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
On an n × n board, n-1 blue pieces are arranged in the leftmost column, and n-1 red pieces are arranged in the bottom row. The figure below shows the case for n=4.

<img src="/file/dodgem/initial4.jpg" width="250px">

- Blue goes first, followed by Red, taking turns moving one piece at a time, one square per move.
- **Blue pieces** move **to the right**. They can move forward (right) or sideways (up/down).
- **Red pieces** move **upward**. They can move forward (up) or sideways (left/right).
- Pieces can only move to empty squares. They cannot jump over, capture, or stack on top of other pieces.
- When a piece reaches the last row or column (Blue: rightmost, Red: topmost), it can be removed on the next move.
- Players **must not** block their opponent’s movement. In other words, if you become unable to move, **you win**.
- The player who removes all their pieces first wins.
- If the same position appears three times, the game ends in a draw.

## Controls
- **Click or tap** on the piece you want to move, then select the destination.
- Double-tapping the same piece will remove it if removal is possible.
- Select the board size, whether you play first or second, and the computer's strength (levels 1 to 3), then press the **"Start Game" button** to begin a new game.
- Selecting "Watch" will let computers play against each other. You can select the playback speed. Choosing "100" will run 100 matches non-stop. You can change the speed or stop the matches at any time during play.
- When playing consecutive games with the same settings, wins and losses will be recorded. This record will be reset when you reload or interrupt the game.

## Strategy for each board size
It is known that 3×3 is a first-player win, while 4×4 and 5×5 result in a draw if both players make optimal moves.  
- First, aim to consistently defeat the computer when playing first in 3×3.  
- In 4×4 and 5×5, you cannot win if the computer always plays optimally. However, you have a good chance of winning at levels 1 and 2. In particular, since winning is easier as the first player, aim to win when playing first and to draw when playing second.  
- At level 3 of 4×4, defeating the computer is nearly impossible, so focus on securing a draw. If the computer determines that it has a winning position, it will display a notification. Understanding these winning positions before returning to levels 1 and 2 will help you improve your chances of winning.  
- When playing 4×4 or larger boards against another human, a fair approach—similar to chess championship matches—is to alternate between first and second player an equal number of times and compare the results.

## About this program
- This program is written in JavaScript. [Source code is here](https://github.com/sekika/sekika.github.io/tree/master/js/dodgem.js). It requires loading [pako](https://cdnjs.com/libraries/pako).
- It loads part of an evaluation database of positions obtained through nearly perfect analysis.

## Reference
- Berlekamp, Elwyn R.; Conway, John Horton; Guy, Richard K. (2003), "Dodgem", Winning Ways for your Mathematical Plays, vol. 3 (2nd ed.), A.K. Peters, pp. 749–750, ISBN 978-1-56881-143-7.
- [Thread from discussion group rec.games.abstract, 1996](https://ics.uci.edu/~eppstein/cgt/dodgem.html) David desJardins created win-loss tables for 4x4 and 5x5 games, concluding that they result in draws.
- [Wikipedia article](https://en.wikipedia.org/wiki/Dodgem)
