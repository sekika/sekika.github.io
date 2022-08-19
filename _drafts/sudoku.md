---
layout: post
title: ナンプレ問題集ヒント機能付き
tag: 
- python
- javascript
- puzzle
---
オンラインの[ナンプレ問題集]にヒントを表示する機能をつけた。Hキーを押すことで、その場面でどのように考えれば良いかというヒントが表示される。

この問題集は、数独・ナンプレを解析する[解独 (Kaidoku)](https://sekika.github.io/kaidoku/ja/)のウェブ版である。解独はコマンドラインからナンプレの問題を解析・作成するプログラムであり、オンライン問題集は解独が作成した問題を難易度別にまとめたものである。解独は「人間が数独を解くための手順」をなるべく再現できるようにしている。[使われている解法](https://sekika.github.io/kaidoku/ja/logic)に記されているように、「単独候補数字」「単独候補マス」のような基本的な解法が適用できるかどうかを試して、その適用ができなければ様々な高度な解法を順番に試して、探索は最後の手段としている。コンピュータにとっては探索だけで解く方が簡単に解けるが、人間にとってより解きやすい方法を探索しているということになる。

解独は Python で書かれているため、ブラウザで直接実行できない。したがって、オンライン版には解析機能をつけていなかった。しかし、[Pyodide を使えばブラウザで Python が動かせる](https://sekika.github.io/2022/08/18/Pyodide/) ことがわかったので、Hボタンを押すとヒントが表示される機能をつけた。

### 技術メモ ###

局面の文字列をクリップボードにコピーする機能はすでにつけていたので、あとはそのクリップボードの局面からヒントを返すようなモジュールを作成して呼び出せばいいだけなので簡単だろうと思ったが、いくつか試行錯誤したところがあるのでメモをしておく。

まずは、解独にモジュールを作成して、Kaidoku 1.0.0 として公開した。モジュールの使い方は[サンプルスクリプト](https://github.com/sekika/kaidoku/blob/master/dev/sample.py)のように簡単なもので、局面の文字列を引数として呼び出せばヒントの文字列がインスタンスのプロパティとして設定される。

次に[JavaScript](https://github.com/sekika/kaidoku/blob/master/docs/assets/js/sudoku.js)から Pyodide を読み込む。micropip で kaidoku を読み込む時に、pip の依存パッケージを読み込むとうまくいかず、依存パッケージは不要なので[Micropip API](https://pyodide.org/en/stable/usage/api/micropip-api.html) に書かれているように deps=False を指定して `await micropip.install("kaidoku", deps=False);` とするとエラーになる。JavaScript から呼び出しているのだから、Python と同じ引数の指定方法ではだめだ。しかし、どうやって deps のオプションを指定するのだろうか？と考えて、よくわからなかったので deps は3番目の引数だから3番目が false になっていればいいのかな、と思って `await micropip.install("kaidoku", false, false);` としたところうまくいった。

変数のやりとりについては[ここ](https://pyodide.org/en/stable/usage/type-conversions.html#type-translations-using-js-obj-from-py)に書かれているように[pyodide.registerJsModule(https://pyodide.org/en/stable/usage/type-conversions.html#type-translations-using-js-obj-from-py)を使うのが簡便なので

    let js_namespace = { pos : current };
    pyodide.registerJsModule("js_namespace", js_namespace);

として、Python では

    from js_namespace import pos
  
としたら、pos に JavaScript の変数 current が代入された。同様に Python から js_namespace に入れれば JavaScript で読めるはずなのだけれどうまくできなkったので、[ここ](https://pyodide.org/en/stable/usage/type-conversions.html#importing-objects)に書かれているように pyodide.globals.get を使った。

このように、インターフェイスは JavaScript で書いて、計算部分を Python で書いて PyPI に公開してモジュールとして Pyodide で読み込む、という一連の流れを試すことができた。

PCとタブレットでは問題なく実行できる。iPhone では Safari では実行できないが Chrome で実行できる。

