---
layout: post
title: Matplotlib で日本語のグラフを作成する
tags:
- python
- mac
---
Python の [matplotlib](https://matplotlib.org/) でグラフを描くと、日本語が文字化けをする。これは、日本語のフォントが設定されていないためである。この記事では FontProperties によって日本語フォントを設定する方法と、macOS で TTC 形式のフォントファイルを扱う方法をまとめる。

## FontProperties による日本語フォントの設定

[【matplotlib】日本語の文字化けをFontPropertiesで解決](https://self-development.info/%E3%80%90matplotlib%E3%80%91%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%81%AE%E6%96%87%E5%AD%97%E5%8C%96%E3%81%91%E3%82%92fontproperties%E3%81%A7%E8%A7%A3%E6%B1%BA/)で解説されているように、FontProperties を使って日本語のフォントを設定することで、matplotlib のグラフで凡例やタイトルの文字化けを防ぐことができる。また、フォントの使い分けをすることができるようになる。まずは
~~~
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
fp = FontProperties(fname=font_path)
~~~
によって[matplotlib.font_manager](https://matplotlib.org/stable/api/font_manager_api.html) から FontProperties を import して、font_path の場所にあるフォントファイルの内容のフォントを fp という変数に FotProperties インスタンスとして格納する。その後は、たとえば
~~~
plt.xticks(fontproperties=fp)
plt.title('グラフのタイトル', fontproperties=fp)
plt.xlabel('X軸のラベル', fontproperties=fp)
plt.ylabel('Y軸のラベル', fontproperties=fp)
plt.legend(loc='center right', prop=fp)
~~~
のように fontproperties として fp を渡すことで、グラフのタイトル、ラベルにそのフォントが使われる。凡例の場合には legend に prop として渡す。

[matplotlib.font_manager.FontProperties](https://matplotlib.org/stable/api/font_manager_api.html#matplotlib.font_manager.FontProperties) に記されているように、FontProperties では family, style, size などを指定できる。たとえば、斜体でフォントサイズを9とするには

~~~
fp = FontProperties(fname=font_path, style='italic', size=9)
~~~

とする。

## TTC ファイルの変換方法

macOS では複数のフォントファイルがまとめられた [TTC](https://en.wikipedia.org/wiki/TrueType#Collection) (TrueType Collection) 形式のファイルによってフォントが保存されていることがあり、直接 matplotlib で TTC ファイルを読み込むことができなかった。[MacでTTC形式のフォントをTTF形式に分解する](https://note.com/5mingame2/n/na0d71a827c2a)に書かれているようにフォントファイルを分解することで読み込むことができた。まずは

~~~
brew install fontforge
~~~

で [fontforge](https://fontforge.org/) をインストールし、[ttc2ttf.pe](https://gist.github.com/fatum12/941a10f31ac1ad48ccbc) をダウンロードしてから、たとえば

~~~
fontforge -script ttc2ttf.pe '/System/Library/Fonts/ヒラギノ角ゴシック W4.ttc'
~~~

とする。ヒラギノ角ゴシック W4.ttc を分解したところ、HiraKakuProN-W4-AlphaNum-01.otf と HiraKakuProN-W4-AlphaNum-02.otf という2つの otf ファイルが得られ、HiraKakuProN-W4-AlphaNum-02.otf をフォントファイルとして FontProperties を設定することで、無事 matplotlib で日本語の凡例が入ったグラフを作成することができた。
