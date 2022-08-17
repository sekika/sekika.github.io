---
layout: post
title: ブラウザでPython
tag: python
---
ブラウザで Python を動かす。

[ブラウザサイドでNumPyもscikit-learnもできるPython環境「Pyodide」がすごい](https://zenn.dev/bluepost/articles/93d1fa8eabce99)の記事を参考に、[テストコード](https://zenn.dev/bluepost/articles/93d1fa8eabce99#:~:text=https%3A//pyodide.org/en/stable/usage/quickstart.html%23alternative%2Dexample)を動かす。

    <input id="code" value="sum([1, 2, 3, 4, 5])" />
    <button onclick="evaluatePython()">Run</button>
    <br />
    <br />
    <div>Output:</div>
    <textarea id="output" style="width: 100%;" rows="6" disabled></textarea>

    <script>
      const output = document.getElementById("output");
      const code = document.getElementById("code");

      function addToOutput(s) {
        output.value += ">>>" + code.value + "\n" + s + "\n";
      }

      output.value = "Initializing...\n";
      // init Pyodide
      async function main() {
        let pyodide = await loadPyodide();
        output.value += "Ready!\n";
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
  