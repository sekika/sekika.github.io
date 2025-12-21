---
layout: post
title: Markdownから「読む・聴く」語学教材HTMLを自動生成する：langreader
en: /2025/12/21/langreader/
date: 2025-12-19 12:58:16 +0000
tag: python
---
外国語の文章を読んでいると、「意味を確認しながら、音声もすぐ再生できる形」に整えるだけで学習効率が一気に上がります。一方で、段落を文ごとに切り分け、訳を付け、読み上げボタンまで付けた教材を毎回手作業で作るのは大変です。

そこで作ったのが **langreader** です。Markdownで用意した原文を、LLMで自然な文単位に分割し、各文の翻訳を付けたHTML教材を生成します。生成されたHTMLでは、原文の各文にスピーカーボタンが付き、クリックするだけでブラウザのTTS（Web Speech API）で読み上げられます。

例えば、フランス語Wikipediaの[Alsace](https://fr.wikipedia.org/wiki/Alsace_(ancienne_r%C3%A9gion_administrative))から得た本文を、まずはMarkdownとして用意します（langreader付属のスクリプトで変換できます）。これをlangreaderにかけると、段落が「自然な文単位」に分割され、各文に英訳が付き、さらに原文側に読み上げボタンが付いたこのようなHTMLが生成されます。

👉 **[ライブデモ: フランス語リーダー (アルザス)](https://sekika.github.io/langreader/examples/alsace.html)**

ポイントは次の通りです。

- 原文と訳文がブロック分けされる
- 原文の各文に🔊ボタンが付く
- ボタンを押すと、原文テキストをブラウザが読み上げる（TTS）
- 段落内が「1文ずつ」になっているので、学習時に追いやすい

## 特徴

- 🤖 **AI翻訳**: 段落を自動的に自然な文に分割し、行ごとに翻訳します。
- 🔊 **音声読み上げ**: すべての原文に対して音声ボタンを埋め込みます（ブラウザのWeb Speech APIを使用）。
- ⏯️ **生成の再開**: APIレート制限にかかっても大丈夫です。`--continue`を使えば、中断した場所から正確に生成を再開できます。
- 📝 **Markdownサポート**: 見出し、コードブロック、基本的なフォーマットを保持します。
- 🌍 **Wikipediaヘルパー**: 学習用にWikipediaの記事を簡単に取得・整形するスクリプトが付属しています。

## ドキュメント

詳しいインストール方法、CLIオプション、チュートリアルについては、公式ドキュメントをご覧ください。

👉 **[https://sekika.github.io/langreader/](https://sekika.github.io/langreader/)**

- [**利用ガイド**](https://sekika.github.io/langreader/usage/): スタイル設定、生成の再開、メタデータなどのオプションについて。
- [**チュートリアル**](https://sekika.github.io/langreader/tutorial/): Wikipediaの記事からリーダーを作成する手順の解説。
- [**音声設定**](https://sekika.github.io/langreader/tts/): デバイス上で高品質な音声を有効にする設定方法。
