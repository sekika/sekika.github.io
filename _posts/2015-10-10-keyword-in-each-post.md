---
layout: post
title:  "ページごとのキーワード（タグ）の表示"
tags:
- jekyll
---
[カテゴリ / タグの作成]({% post_url 2015-10-09-tag-jekyll %}) で、タグの一覧を表示できるようになったので、今度は各記事に含まれるタグを記して、そのタグに関する記事の一覧に直接飛べるようにした。「タグ」という日本語は微妙にわかりにくい感じがするので「キーワード」にしてみた。

[_layouts/post.html](https://github.com/sekika/sekika.github.io/blob/master/_layouts/post.html) に、以下の記述を加えた。

<pre><code>キーワード：
&lcub;% capture tags %&rcub;
  &lcub;% for tag in page.tags %&rcub;
    &lcub;&lcub; tag &rcub;&rcub;
  &lcub;% endfor %&rcub;
&lcub;% endcapture %&rcub;
&lcub;% assign eachtag = tags | split:' ' %&rcub;

&lcub;% for tag in eachtag %&rcub;
  &lt;a href="/tags/&lcub;&lcub; tag }}/index.html">&lcub;&lcub; tag }}&lt;/a>
&lcub;% endfor %&rcub;
</code></pre>

これで、キーワードが表示され、そのキーワードの記事一覧へとべるようになった。複数のキーワードにも対応していることを確認した。
