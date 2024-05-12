---
layout: post
title: Bootstrap 5 へのバージョンアップ
tag: jekyll
---
このサイトの [Bootstrap](https://getbootstrap.com/) をバージョン3から5へとメジャーバージョンアップした。


以前、バージョン3から4に上げようとした時に、表示が崩れてうまくいかずにしばらく放置していたけれど、そろそろメジャーバージョンアップをしておいた方が良いかなと思い、[バージョン5に上げた](https://github.com/sekika/sekika.github.io/commit/01ebb46a1a402dfacecc9447aba7d71b11bb772a)。

bootstrapテーマのcssのリンクが散らばっていたので、[base-js](https://github.com/sekika/sekika.github.io/blob/master/_includes/base-js.html)にまとめて、[Flatly](https://bootswatch.com/flatly/)のcssについては cdn.jsdelivr.net を直接参照するようにした。ナビゲーションバーが壊れたので、[Flatlyページ](https://bootswatch.com/flatly/)のNavbarsから[ヘッダ](https://github.com/sekika/sekika.github.io/blob/master/_includes/header.html)へとコードをコピーし、さらに現在のページと一致する場合だけに nav-link active とするように、
```liquid
{% raw %}
{%- for item in site.data.navigation %}
<li class="nav-item">
  <a href="{{ item.link | prepend: site.baseurl }}" {% if item.link == page.url %}class="nav-link active"{% else %}class="nav-link"{% endif %}>{{ item.name }}</a></li>
{% endfor -%}
{% endraw %}
```
というコードを書いた。site.data.navigation は [_data/navigation.yaml](https://github.com/sekika/sekika.github.io/blob/master/_data/navigation.yaml) から読み込まれる。英語版も同様に。

Bootstrap 5 では jQuery は使わないようになったとのことなので、削除した。ただし、[UNSODAビューア](https://sekika.github.io/unsoda/ja/)と[KaTeXのヘッダ](https://github.com/sekika/sekika.github.io/blob/master/_includes/head-katex.html)には直接書いた。

これでだいたいのところは良くなったようなので、あとは何かおかしいことがあれば、あるいは見栄えを修正する方が良ければ、気がついた時に直していく。
