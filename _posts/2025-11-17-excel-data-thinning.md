---
layout: post-en
title: Data thinning with Excel
date: 2025-11-17 17:57:26 +0000
hashtag: Excel
tags:
- excel
- english
---
Here, I’ll show you an easy way to thin out data in Excel without using any special tools.

1. Create a column named “Filter.” If you want to thin the data by taking every 6th item, enter six characters such as `a, b, c, d, e, f`. You just need as many symbols as the interval you want to use.
2. Select `a` through `f` and copy them down to the bottom of your data. The Filter column will then contain repeating data like `a, b, c, d, e, f, a, b, c, d, e, f...`. To do this using the AutoFill feature, select `a`–`f`, move the cursor to the bottom-right corner of the selected rectangle until it becomes a cross, then double-click.
3. Go to “Data” → “Filter” → “AutoFilter” to turn on AutoFilter. Then click the drop-down menu that appears next to the Filter column; you’ll be able to choose from `a, b, c, d, e, f`.
4. If you want to keep the rows labeled `e`, select `e` from the Filter drop-down.
5. The sheet will now display only the rows where the Filter column is `e`, i.e., data thinned to every 6th row.
6. If you create a chart in this state, it will use only the thinned data. You can also copy and paste this filtered range to another worksheet to create a new sheet containing only the thinned data.
