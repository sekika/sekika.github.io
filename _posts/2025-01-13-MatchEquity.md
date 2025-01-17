---
layout: post-en
title: Match equity calculator
date: 2025-01-13 12:29:51 +0000
tags:
- game
- javascript
- english
---
The match equity in backgammon and the reference values for cube decisions can be calculated for matches of up to 15 points.

<ul>
    <li><input name="point" id="point" type="text" value="5" size="3" onkeyup="update()" /> point match
    <input type="button" value="-" onclick="decPoint();" />
    <input type="button" value="+" onclick="incPoint();" /></li>
    <li>I won <input name="myPoint" id="myPoint" type="text" value="0" size="3" onkeyup="update()" /> points
    <input type="button" value="-" onclick="decMyPoint();" />
    <input type="button" value="+" onclick="incMyPoint();" /></li>
    <li>Opponent won <input name="oppPoint" id="oppPoint" type="text" value="0" size="3" onkeyup="update()" /> points
    <input type="button" value="-" onclick="decOppPoint();" />
    <input type="button" value="+" onclick="incOppPoint();" /></li>
    <li><input type="button" value="0 - 0" onclick="resetPoint();" /></li>
</ul>

<h2 id="matchStatus"></h2>

<div id="result"></div>

<h2>Reference</h2>
<ul>
<li><a href="https://bkgm.com/articles/GOL/Aug99/double.htm">Doubling Theory and Market Losers</a> by Hank Youngerman</li>
<li><a href="https://bkgm.com/articles/GOL/Oct99/hanka99.htm">Match Equity and Doubling Windows</a> by Hank Youngerman</li>
<li><a href="https://bkgm.com/articles/GOL/Nov99/hankb99.htm">Doubling Windows and Special Doubling Situations</a> by Hank Youngerman</li>
<li><a href="https://bkgm.com/articles/GOL/Aug99/fivept.htm">Five Point Match</a> by Kit Woolsey</li>
</ul>

<script src="/js/matchequity.min.js"></script>
