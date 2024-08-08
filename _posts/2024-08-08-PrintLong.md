---
layout: post
title: Python で長いテキストをページごとに表示
date: 2024-08-08 07:37:28 +0000
tag: python
---
Python の print 文で結果を表示するときに、結果が端末に収まらないほどに長い場合には、1画面（端末の表示域）に収まる分だけを表示するページャーを使えると良い。`pypager`というパッケージを使うと良いが、それを使いやすくするためのスクリプト [print_long](https://gist.github.com/sekika/0b6094335d5c32dcbe04edbb369b76ad) を書いた。

## pypager
[pypager](https://github.com/prompt-toolkit/pypager) は有名なページャーである [more](https://ja.wikipedia.org/wiki/More_(UNIX)) や [less](https://ja.wikipedia.org/wiki/Less) の代わりとして作られたものであり、less のキーバインドの多くを使うことができる。
```
pip install pypager
```
でインストールして、コマンドラインから直接
```
pypager file.py
```
のように起動することができて、`PAGER`環境変数に設定すればデフォルトのページャーになる。

Python のプログラムからライブラリとして利用するには、
```
from pypager.source import GeneratorSource
from pypager.pager import Pager
p = Pager()
p.add_source(GeneratorSource(text))
p.run()
```
のようなコードを書く。ここで、[ドキュメント](https://github.com/prompt-toolkit/pypager/blob/master/README.rst)では text のかわりに generate_a_lot_of_content() という関数が使われている。これは、無限にコンテンツを生成する関数であり、ページャーの特性として、このような場合でもファイルの読み込み終了を待つことなく、最初のページを読み込んだ時点ですぐに表示できる。したがって、非常に大きなファイルを表示する場合でも、ページ表示開始までの時間が短い、という特徴がある。

## スクリプト作成の動機
しかしながら、このように`p.add_source(GeneratorSource(text))`でテキストを表示する方法だと、text が自動的に改行されないため、端末の幅を超えるようなテキストがある場合に適切に表示されない（コマンドラインから呼び出す方法では適切に折り返して表示される）。たとえば AI になんらかの質問を投げて、その回答を表示するようなプログラムにおいて、テキストが長い場合にページャーを使って表示する、というような場合には、回答のテキストが自動的に改行されて、さらに1ページで収まる場合にはわざわざページャーを通さずに表示する方が便利である（実際には、1ページで収まる場合が多いため）。そのような「前処理」をするために時間がかかるところはページャーの特性が失われるものの、AIの回答程度の長さであれば、その処理にかかる時間はほとんど無視できる。

ということで、そのような処理をするスクリプトを作成した。なお、[pypager の issue](https://github.com/prompt-toolkit/pypager/issues/30)に、このような機能を入れてもらえないかということも書き込んでおいた。

## print_long - pypagerを使用して長いテキストを表示する
[このスクリプト](https://gist.github.com/sekika/0b6094335d5c32dcbe04edbb369b76ad)は、pypagerパッケージを使用して長いテキストをページ分割表示するための関数を提供します。テキストが1ページ内に収まる場合は、コンソールに直接表示されます。テキストが複数ページにわたる場合は、pypagerを使用して簡単にナビゲートできるように表示します。使用方法を記します。

1. pypagerをインストールしてください：
    ```sh
    pip install pypager
    ```

2. 関数をインポートし、テキストを渡して使用します：
    ```python
    from your_script import print_long
    print_long(text)
    ```

3. 使用例：
    ```python
    long_text = "ここに長いテキストを入力..."
    print_long(long_text)
    ```

この関数は、端末の幅に基づいてテキストの折り返しを処理し、テキストを表示するのに必要なページ数を計算します。ページ数が1ページ以内であれば直接printで表示し、複数ページになる場合はpypagerを使用して表示します。
