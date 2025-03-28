---
layout: post
title: ドッジェムの遊び方
en: /dodgem/help/
hashtag: dodgem
permalink: /dodgem/ja/help/
tags:
- game
- javascript
---
[ドッジェム](/dodgem/ja/)の遊び方を説明します。

## ルール
n × n の盤面に、n-1個の青い駒が左端の列に、n-1個の赤い駒が下端の列に並んでいます。下の図は n=4 の場合です。

<img src="/file/dodgem/initial4.jpg" width="250px">

- 青が先手、赤が後手で、交互に駒を1つずつ1マス動かします。
- **青の駒** は **右方向** に進みます。前に進む（右へ）か、横に移動（上下）できます。
- **赤の駒** は **上方向** に進みます。前に進む（上へ）か、横に移動（左右）できます。
- 駒は空いているマスにのみ進めます。他の駒を飛び越えたり、取ったり、重ねたりすることはできません。
- 一番前まで進むと（青ならば最も右、赤ならば最も上）、次に進むことで駒を取り除けます。
- 相手を動かせなくしてはいけません。つまり、自分が動けなくなった時点で自分の勝ちとなります。
- 先にすべての自分の駒を取り除いたほうが勝ちです。
- 同じ局面が3回出現した場合は引き分けとなります。

## 操作方法
- 動かしたい駒を**クリックまたはタップ**し、その後、移動先を選びます。
- 同じ駒を2回タップすると、取り除ける場合は駒が除去されます。
- 盤面の大きさと先手・後手、コンピュータの強さ（レベル1から3まで）を選び、**「ゲーム開始」ボタン**を押すと新しいゲームが始まります。
- 観戦を選ぶとコンピュータ同士で対戦します。再生の速度を選ぶことができます。「100」を選ぶとノンストップで100回対戦します。途中で速さを変えることも止めることもできます。
- 同じ設定で連続して対局すると勝敗が記録されます。リロードまたはゲーム中断でリセットされます。

## 各盤面における戦略  

3×3 は先手必勝、4×4 と 5×5 は、お互いが最善手を選べば引き分けになることが知られています。  
- まずは、3×3 の先手でコンピュータに常に勝つことを目指してください。  
- 4×4 と 5×5 では、コンピュータが常に最善手を選べば勝つことはできませんが、レベル1と2では十分に勝つチャンスがあります。特に先手では勝ちやすいため、先手では勝ちを、後手では引き分けを目指すとよいでしょう。  
- 4×4 のレベル3では、コンピュータに勝つことはほぼ不可能なので、引き分けを狙ってください。レベル3では、コンピュータが必勝形であると判断した場合、その旨を表示します。必勝形を理解してからレベル1と2に戻ると、勝ちやすくなります。  
- 人間同士で 4×4 以上の盤面で対戦する場合は、チェスのタイトル戦と同様に、先手と後手を交互に同数ずつ対戦し、その結果を競う方法が公平でしょう。  

## このプログラムについて
- このプログラムは JavaScript で書かれています。[ソースコードはこちら](https://github.com/sekika/sekika.github.io/tree/master/js/dodgem.js)です。[pako](https://cdnjs.com/libraries/pako)を読み込む必要があります。
- ほぼ完全読みで得られた局面の評価値データベースの一部を読み込んでいます。

## 参考
- Berlekamp, Elwyn R.; Conway, John Horton; Guy, Richard K. (2003), "Dodgem", Winning Ways for your Mathematical Plays, vol. 3 (2nd ed.), A.K. Peters, pp. 749–750, ISBN 978-1-56881-143-7.
- 松田道弘(1989)『世界のゲーム事典』東京堂出版
- [Thread from discussion group rec.games.abstract, 1996](https://ics.uci.edu/~eppstein/cgt/dodgem.html) David desJardins が 4x4 と 5x5 の勝敗表を作成して、引き分けであると結論づけている。
- [Wikipediaの記事](https://en.wikipedia.org/wiki/Dodgem)
