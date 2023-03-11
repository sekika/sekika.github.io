---
layout: post
title: Matplotlib で日本語文字を使う
tags:
- python
- mac
---
Python の matplotlib でグラフを描くと、日本語の文字が文字化けをする。これは、日本語のフォントが設定されていないためである。特に Mac の環境下で日本語のフォントを設定する方法を含めてまとめる。

## FontProperties による日本語文字化けの解決

[【matplotlib】日本語の文字化けをFontPropertiesで解決](https://self-development.info/%E3%80%90matplotlib%E3%80%91%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%81%AE%E6%96%87%E5%AD%97%E5%8C%96%E3%81%91%E3%82%92fontproperties%E3%81%A7%E8%A7%A3%E6%B1%BA/)で解説されているように、FontProperties を使って日本語のフォントを設定することで、matplotlib のグラフで凡例やタイトルの文字化けを防ぐことができる。また、フォントの使い分けをすることができるようになる。

from matplotlib.font_manager import FontProperties

