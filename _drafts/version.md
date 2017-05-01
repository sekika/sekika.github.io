---
layout: post
title: ソフトウェアのバージョン
tag: jekyll
---
このサイトで使用しているソフトウェアのバージョンをチェックするための管理用ページです。

<table>
<tr><th>ソフトウェア</th>
<th>現バージョン</th>
<th>最新バージョンのチェック</th>
</tr>
<tr>
<td>Jekyll</td>
<td><a href="https://pages.github.com/versions/">Dependency</a></td>
<td><a href="https://jekyllrb.com/news/releases/">Jekyll release</a></td>
</tr>
<tr>
<td>Bootstrap</td>
<td>{{ site.bootstrap-version }}</td>
<td><a href="http://getbootstrap.com/getting-started/">Bootstrap download</a></td>
</tr>
<tr>
<td>jQuery</td>
<td>{{ site.jquery-version }}</td>
<td><a href="https://jquery.com/download/">jQuery download</a></td>
</tr>
<tr>
<td>KaTeX</td>
<td>{{ site.katex-version }}</td>
<td><a href="https://github.com/Khan/KaTeX/releases">KaTeX releases</a></td>
</tr>
</table>

更新方法：[_config.html](https://github.com/sekika/sekika.github.io/blob/master/_config.yml)を更新する。
