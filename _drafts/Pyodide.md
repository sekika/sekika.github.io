---
layout: post
title: ブラウザで Python が動くよ
tag: python
---
下のボックスに Python のコマンドを入れて「実行する」ボタンを押すと、対話モードで Python が動きます。

<script src="https://cdn.jsdelivr.net/pyodide/v{{ site.katex-version }}/full/pyodide.js"></script>

<input id="code" value="sum([1, 2, 3, 4, 5])" size="40"/>
<button onclick="evaluatePython()">実行する</button>
<br />
<br />
<div>結果表示</div>
<textarea id="output" style="width: 100%;" rows="15" disabled></textarea>

<script>
    const output = document.getElementById("output");
    const code = document.getElementById("code");

    function addToOutput(s) {
    output.value += ">>>" + code.value + "\n" + s + "\n";
    }

    output.value = "初期化中...\n";
    // init Pyodide
    async function main() {
    let pyodide = await loadPyodide();
    await pyodide.loadPackage("numpy");
    await pyodide.loadPackage("scipy");
    await pyodide.loadPackage("scikit-learn");
    output.value += "準備できたよ!\n";
    return pyodide;
    }
    let pyodideReadyPromise = main();

    async function evaluatePython() {
    let pyodide = await pyodideReadyPromise;
    try {
        let output = pyodide.runPython(code.value);
        addToOutput(output);
    } catch (err) {
        addToOutput(err);
    }
    }
</script>

[ブラウザサイドでNumPyもscikit-learnもできるPython環境「Pyodide」がすごい](https://zenn.dev/bluepost/articles/93d1fa8eabce99)の記事を参考に、Pyodide の[テストコード](https://pyodide.org/en/stable/usage/quickstart.html#alternative-example)を設置した。numpy, scipy, scikit-learn を import できるようにしておいた。たとえば import numpy as np とすると undefined と出力されるが、きちんと import できている。


## Pyodide とは何か？

[Pyodide のページ](https://pyodide.org/en/stable/)から What is Pyodide? を以下に訳します。 

Pyodide は CPython の WebAssembly / [Emscripten](https://emscripten.org/) への移植です。

Pyodide は、micropip によってブラウザ内で Python パッケージをインストールして走らせることを可能とします。PyPI で wheel が配布されている純粋な Python のパッケージであれば、すべてサポートされます。さらに、多くの C 言語の拡張パッケージが Pyodide に移植されています。その中には、regex, pyyaml, lxml のような多くの一般的なパッケージや、numpy, pandas, scipy, matplotlib, scikit-learn のような科学分野の Python パッケージが含まれます。

Pyodide は強力な Javascript ⟺ Python 間の関数インターフェイスを提供しているため、言語間の摩擦をほとんど感じることなしに、この2つの言語を自由に混ぜて使うことができます。たとえば、エラー制御のフルサポート（片方の言語でエラーを発生させ、もう片方でエラーをキャッチする）、async と await の処理など、他にも色々あります。

ブラウザ内で実行されるときには、Python は Web API に完全にアクセスできます。
