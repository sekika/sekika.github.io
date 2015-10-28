---
layout: post
title: "株価時系列データからの線形回帰トレンド作成"
tags:
- excel
- math
---
株価のテクニカル分析について、以下の資料の線形回帰トレンド(p.15)に示されているExcelによる計算方法を利用して、株価時系列データから線形回帰トレンドの図を作成した。

- [Excelによる経済・経営分野の情報処理IV」ー株価のテクニカル分析ー](http://www.wakayama-u.ac.jp/~makino/lectures/houdai/tchn.pdf) (和歌山大学経済学部　牧野真也)

これが、その Excel ファイルである。

- [株価分析 Excel ファイル](/file/linear-trend.xlsx)

[Yahoo! ファイナンス](http://finance.yahoo.co.jp/) の株価時系列データを水色のセルに貼り付ければ、75日線形回帰と25日線形回帰が計算できる。

[アップルインターナショナルの2015年10月28日までの株価データ](http://info.finance.yahoo.co.jp/history/?code=2788.T&sy=2015&sm=7&sd=28&ey=2015&em=10&ed=28&tm=d&p=1)を使うと、次のようなグラフが作成できる。

![線形回帰トレンド](/img/20151029-linear-trend.png)


