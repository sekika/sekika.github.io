---
layout: post
title: 最終更新日の表示
tag: jekyll
---
記事のヘッダーに最終更新日と更新履歴へのリンクを表示することを可能にした。

たとえば、[この記事]({% post_url 2015-11-12-office-soft %})では、ヘッダーにこのように表示されている。

> 公開日：2015年11月12日 - <a href="https://github.com/sekika/sekika.github.io/commits/master/_posts/2015-11-12-office-soft.md">最終更新日</a>：2015年11月15日<br />

そのためには、YAML フロントマターにこのように書く。

~~~
date: 2015-11-12 03:01:50 +0000
update: 2015-11-15 07:04:55 +0000
~~~

そして、[レイアウト](https://github.com/sekika/sekika.github.io/blob/master/_includes/post-header.html)で公開日 ```page.date``` と最終更新日 ```page.update``` を取得して表示している。

<pre>
公開日：&lcub;&lcub; page.date | date: "%Y年%-m月%-d日" &rcub;&rcub;&lcub;% if page.author %&rcub; • &lcub;&lcub; page.author &rcub;&rcub;&lcub;% endif %&rcub;&lcub;% if page.meta %&rcub; • &lcub;&lcub; page.meta &rcub;&rcub;&lcub;% endif %&rcub;&lcub;% if page.update %&rcub; - &lt;a href="https://github.com/sekika/sekika.github.io/commits/master/&lcub;&lcub; page.path &rcub;&rcub;"&gt;最終更新日&lt;/a&gt;：&lcub;&lcub; page.update | date: "%Y年%-m月%-d日" &rcub;&rcub;&lcub;% endif %&rcub;&lt;br /&gt;
</pre>

YAML フロントマターに ```update:``` がなければ、最終更新日は表示されない。最終更新日を表示したいときにだけ表示するようにした。

ここで、公開日の ```date:``` は[下書きを公開するスクリプト]({% post_url 2015-11-07-draft-and-publish %})で自動的に挿入している。最終更新日の ```update:``` については、YAML フロントマターに

~~~
update:
~~~

と書くことで、コミット時に自動的に更新時刻を挿入するようにした。そのために、[How to show the modification date of a file in Jekyll?](http://stackoverflow.com/questions/14978474/how-to-show-the-modification-date-of-a-file-in-jekyll) に書かれている [pre-commit フック](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%9E%E3%82%A4%E3%82%BA-Git-%E3%83%95%E3%83%83%E3%82%AF) を書き直して使った。すなわち、```.git/hooks/pre-commit``` に[このスクリプト](https://github.com/sekika/sekika.github.io/blob/master/setup/pre-commit)を置いた。

~~~
#!/bin/sh
# Contents of .git/hooks/pre-commit

# Read YAML front matter in all the modified files for committing,
# and replace "update:" line to "update: current date and time"

git diff --cached --name-status | grep "^M" | while read a b; do
  cat $b | sed "/---.*/,/---.*/s/^update:.*$/update: $(date -u "+%Y-%m-%d %T") +0000/" > tmp
  mv tmp $b
  git add $b
done
~~~

このスクリプトは、```git diff --cached --name-status``` で更新のあったファイルを調べて、更新のあったファイルの YAML フロントマターの中で、```update:``` で始まる行に対して、時刻を表示する。
