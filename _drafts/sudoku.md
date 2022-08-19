---
layout: post
title: ナンプレ問題集ヒント機能付き
tag: 
- python
- javascript
- puzzle
---
オンラインの[ナンプレ問題集](https://sekika.github.io/kaidoku/ja/sudoku)にヒントを表示する機能をつけた。Hキーを押すことで、その場面でどのように考えれば良いかというヒントが表示される。解き方を理解するまではヒントを多めに表示して、次第にヒントの表示を少なくし、さらにより高いレベルの問題に挑戦することで、数独の解き方を理解できる。

この問題集は、[数独](https://ja.wikipedia.org/wiki/%E6%95%B0%E7%8B%AC)（ナンプレ）を解析する[解独 (Kaidoku)](https://sekika.github.io/kaidoku/ja/)のウェブ版である。解独はコマンドラインからナンプレの問題を解析・作成するプログラムであり、オンライン問題集は解独が作成した問題を難易度別にまとめたものである。解独は「人間が数独を解くための手順」をなるべく再現できるようにしている。[使われている解法](https://sekika.github.io/kaidoku/ja/logic)に記されているように、「単独候補数字」「単独候補マス」のような基本的な解法が適用できるかどうかを試して、その適用ができなければ様々な高度な解法を順番に試して、探索は最後の手段としている。コンピュータにとっては探索だけで解く方が簡単に解けるが、人間にとってより解きやすい方法を探索しているということになる。

解独は Python で書かれているため、ブラウザで直接実行できない。したがって、オンライン版には解析機能をつけていなかった。しかし、[Pyodide を使えばブラウザで Python が動かせる](https://sekika.github.io/2022/08/18/Pyodide/)ことがわかったので、ヒント表示機能をつけた。

### 技術メモ ###

局面の文字列をクリップボードにコピーする機能はすでにつけていたので、あとはそのクリップボードの局面からヒントを返すようなモジュールを作成して呼び出せばいいだけなので簡単だろうと思ったが、いくつか苦労したところがあるので Pyodide プログラミングの参考のためにここに記録する。

まずは、解独にモジュールを作成して、Kaidoku 1.0.0 として[PyPI に公開](https://pypi.org/project/kaidoku/)した。モジュールの使い方は[サンプルスクリプト](https://github.com/sekika/kaidoku/blob/master/dev/sample.py)のように簡単なもので、局面の文字列を引数としてインスタンスを生成すればヒントの文字列がインスタンスのプロパティとして設定される。

次に [JavaScript](https://github.com/sekika/kaidoku/blob/master/docs/assets/js/sudoku.js) から Pyodide を読み込む。micropip で kaidoku を読み込む時に、pip の依存パッケージを読み込むとうまくいかず、依存パッケージは不要なので[Micropip API](https://pyodide.org/en/stable/usage/api/micropip-api.html) に書かれているように `deps=False` を指定して `await micropip.install("kaidoku", deps=False);` とするとエラーになる。JavaScript から呼び出しているのだから、Python と同じ引数の指定方法ではだめだ。しかし、どうやって deps のオプションを指定するのだろうか？と考えて、よくわからなかったので deps は3番目の引数だから3番目が false になっていればいいのかな、と思って `await micropip.install("kaidoku", false, false);` としたところうまくいった。

変数のやりとりについては[ここ](https://pyodide.org/en/stable/usage/type-conversions.html#type-translations-using-js-obj-from-py)に書かれているように [pyodide.registerJsModule](https://pyodide.org/en/stable/usage/type-conversions.html#type-translations-using-js-obj-from-py) を使った。Python の変数を JavaScript に読み込むときには、[ここ](https://pyodide.org/en/stable/usage/type-conversions.html#importing-objects)に書かれているように pyodide.globals.get を使った。

以上の仕組みでなんとか動いたのだが、最初はヒントを表示する関数 `hint()` のところに `async func hint()` として pyodide を読み込んで実行するようにしていたため、ヒントボタンを押すたびに pyodide を読み込むことになる。読み込みには時間がかかるので、できれば読み込みは 1回だけバックグラウンドで読み込むことととしたい。そこで、pyodide をグローバル変数として、JavaScript を読み込んだ時に最初に `loadpyodide()` として読み込むこととした。

    async function loadpyodide() {
        pyodide = await loadPyodide();
        await pyodide.loadPackage("micropip");
        const micropip = pyodide.pyimport("micropip");
        await micropip.install("kaidoku", false, false);
    }

すると、ヒントを表示する関数の中では、すでに pyodide が読み込まれているグローバル変数 pyodide を使って pyodide の実行ができる。これでうまくいくと思ったのだが、今度は JavaScript で

    let js_namespace = { pos : current };
    pyodide.registerJsModule("js_namespace", js_namespace);

として、Python で `from js_namespace import pos` として読み込ませた pos 変数が、2回目以降の実行の時に更新されない、という現象が生じた。JavaScript 側では js_namespace は更新されていて Python 側では pos 変数が更新されないことから、pyodide をグローバル変数としたため、2回目の pyodide の実行時に import で pos が更新されなかったためと推測された。そこで、Python で pos 変数の取得後に `del sys.modules["js_namespace"]` で js_namespace モジュールを削除することで、次に js_namespace をインポートする時に pos 変数が更新されることとなった。

このように、Python で開発したモジュールを JavaScript から Pyodide で読み込んで実行するという一連の流れを試すことができた。

PCとタブレットでは問題なく実行できる。iPhone では Safari では実行できないが Chrome で実行できる。
