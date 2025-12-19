---
layout: post
title: Markdownから「読む・聴く」語学教材HTMLを自動生成する：langreader
date: 2025-12-19 12:58:16 +0000
tag: python
---
外国語の文章を読んでいると、「意味を確認しながら、音声もすぐ再生できる形」に整えるだけで学習効率が一気に上がります。一方で、段落を文ごとに切り分け、訳を付け、読み上げボタンまで付けた教材を毎回手作業で作るのは大変です。

そこで作ったのが **langreader** です。Markdownで用意した原文（src）を、LLMで自然な文単位に分割し、各文の翻訳（tgt）を付けたHTML教材を生成します。生成されたHTMLでは、原文の各文にスピーカーボタンが付き、クリックするだけでブラウザのTTS（Web Speech API）で読み上げられます。

詳しい使い方はREADMEにまとめています：
<https://github.com/sekika/langreader/blob/main/README-ja.md>

## 何が生成されるのか

例えば、フランス語Wikipediaの[Alsace](https://fr.wikipedia.org/wiki/Alsace_(ancienne_r%C3%A9gion_administrative))から得た本文を、まずはMarkdownとして用意します（見出し＋段落のプレーンなMarkdownでOKです）。

入力Markdownの例（抜粋）：

----
 # Alsace (ancienne région administrative)

La région Alsace est une ancienne collectivité territoriale du nord-est de la France, incorporée à la région Grand Est le 1 er janvier 2016. Il s'agit d'une ancienne région administrative dont la préfecture était Strasbourg, ville qui était aussi le siège du conseil régional d'Alsace. Plus petite région de France métropolitaine par la superficie, elle regroupait les départements du Bas-Rhin et du Haut-Rhin. Elle couvrait ainsi 13 arrondissements, 75 cantons et 904 communes. Elle correspond géographiquement à l'actuelle Collectivité européenne d'Alsace, issue de la fusion des collectivités départementales du Bas-Rhin et du Haut-Rhin.

----

これをlangreaderにかけると、段落が「自然な文単位」に分割され、各文に英訳が付き、さらに原文側に読み上げボタンが付いたHTMLが生成されます。

生成HTMLのイメージ：

----
<style>
body { font-family: sans-serif; line-height: 1.6; }
.src { margin-top: 1em; }
.tgt { margin-left: 1em; color: #555; }
button.speak-btn { margin-left: 0.5em; }
pre { background: #f6f8fa; padding: 0.75em; overflow-x: auto; }
code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
</style>
<script>
(function() {
  const SRC_LANG = "fr";

  function chooseVoice(u) {
    // Voice list may be initially empty in some browsers.
    const voices = speechSynthesis.getVoices ? speechSynthesis.getVoices() : [];
    if (!voices || !voices.length) return;

    let v = voices.find(v => v.lang === u.lang);
    if (!v) {
      v = voices.find(v => v.lang && v.lang.startsWith(u.lang));
    }
    if (!v) {
      const prefix = (u.lang || "").split("-")[0];
      v = voices.find(v => v.lang && v.lang.startsWith(prefix));
    }
    if (v) u.voice = v;
  }

  function speakText(text) {
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = SRC_LANG;
    chooseVoice(u);
    speechSynthesis.speak(u);
  }

  function wireButtons() {
    document.querySelectorAll("button.speak-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        speakText(btn.dataset.speak || "");
      });
    });
  }

  // Ensure buttons are wired after DOM is ready.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireButtons);
  } else {
    wireButtons();
  }

  // Some browsers populate voices asynchronously.
  if ("onvoiceschanged" in speechSynthesis) {
    speechSynthesis.onvoiceschanged = function() {
      // No-op: we select the best available voice at click time anyway.
    };
  }
})();
</script>

<h1>Alsace (ancienne région administrative)</h1>

<div class="src">
La région Alsace est une ancienne collectivité territoriale du nord-est de la France, incorporée à la région Grand Est le 1 er janvier 2016. <button class="speak-btn" type="button" data-speak="La région Alsace est une ancienne collectivité territoriale du nord-est de la France, incorporée à la région Grand Est le 1 er janvier 2016.">🔊</button>
</div>
<div class="tgt">The Alsace region is a former territorial collectivity in northeastern France, incorporated into the Grand Est region on January 1, 2016.</div>
<div class="src">
Il s&#x27;agit d&#x27;une ancienne région administrative dont la préfecture était Strasbourg, ville qui était aussi le siège du conseil régional d&#x27;Alsace. <button class="speak-btn" type="button" data-speak="Il s&#x27;agit d&#x27;une ancienne région administrative dont la préfecture était Strasbourg, ville qui était aussi le siège du conseil régional d&#x27;Alsace.">🔊</button>
</div>
<div class="tgt">It is a former administrative region whose prefecture was Strasbourg, a city which was also the seat of the Alsace regional council.</div>
<div class="src">
Plus petite région de France métropolitaine par la superficie, elle regroupait les départements du Bas-Rhin et du Haut-Rhin. <button class="speak-btn" type="button" data-speak="Plus petite région de France métropolitaine par la superficie, elle regroupait les départements du Bas-Rhin et du Haut-Rhin.">🔊</button>
</div>
<div class="tgt">The smallest region in metropolitan France by area, it comprised the departments of Bas-Rhin and Haut-Rhin.</div>

----

ポイントは次の通りです。

- 原文と訳文がブロック分けされる
- 原文の各文に🔊ボタンが付く
- ボタンを押すと、原文テキストをブラウザが読み上げる（TTS）
- 段落内が「1文ずつ」になっているので、学習時に追いやすい

## 仕組み

langreaderがやっていることはシンプルです。

1. Markdownを読み込み、見出しと段落を取り出す  
2. 各段落を[multiai](https://sekika.github.io/multiai/index-ja.html)によってLLMに渡して、
   - 自然な文ごとに分割
   - 各文の翻訳を作成
   という形で結果を受け取る
3. 原文＋訳をHTMLとして並べ、各原文文にTTSボタンを付ける
4. 生成されたHTMLをブラウザで開き、クリックで読み上げできる教材にする

## 使い方

[multiai](https://sekika.github.io/multiai/index-ja.html)のAPIキー設定をしたら、Markdownを用意して、コマンドを1回叩くだけです。例：

```bash
langreader \
  -i alsace.md \
  -o alsace.html \
  --src fr \
  --tgt en \
  --provider YOUR_PROVIDER \
  --model YOUR_MODEL
```

`--src` と `--tgt` を変えれば、他の言語でも同じ流れで教材化できます。

## こんな用途に向いています

- Wikipediaやニュース記事など、長文を「読む＋聴く」で学習したい
- 文単位で意味確認したい（段落を丸ごと訳すよりも追いやすい）
- 自分用の学習教材を素早く量産したい

README（日本語）：
<https://github.com/sekika/langreader/blob/main/README-ja.md>
