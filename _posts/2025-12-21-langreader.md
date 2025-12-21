---
layout: post-en
title: "langreader: Automatically Generate 'Read & Listen' Language Materials from Markdown"
date: 2025-12-21 02:32:28 +0000
ja: /2025/12/19/langreader/
tags:
- english 
- python
---
When reading foreign texts, having materials formatted so you can check meanings and instantly play audio significantly boosts learning efficiency. On the other hand, manually creating these materials—splitting paragraphs into sentences, adding translations, and embedding playback buttons—is a tedious and time-consuming task.

That is why I created **langreader**. It takes source text prepared in Markdown, uses LLMs to split it into natural sentence units, and generates HTML study materials complete with translations for each sentence. In the generated HTML, every source sentence gets a speaker button; simply clicking it plays the audio using the browser's TTS (Web Speech API).

For example, take the text from the French Wikipedia article on [Alsace](https://fr.wikipedia.org/wiki/Alsace_(ancienne_r%C3%A9gion_administrative)). First, prepare it as Markdown (you can convert it using the helper script included with langreader). When you run this through langreader, the paragraphs are split into "natural sentence units," each is given an English translation, and the source text gets audio buttons, resulting in HTML like this:

👉 **[Live Demo: French Reader (Alsace)](https://sekika.github.io/langreader/examples/alsace.html)**

Here are the key points:

- Source text and translations are organized into blocks.
- A 🔊 button is attached to every source sentence.
- Clicking the button plays the source text using the browser's TTS.
- Paragraphs are broken down sentence-by-sentence, making it easy to follow during study.

## Features

- 🤖 **AI-Powered Translation**: Automatically splits paragraphs into natural sentences and translates them line-by-line.
- 🔊 **Text-to-Speech**: Built-in audio buttons for every source sentence (uses browser Web Speech API).
- ⏯️ **Resumable Generation**: Hit an API rate limit? Use `--continue` to resume generation exactly where it stopped.
- 📝 **Markdown Support**: Preserves headings, code blocks, and basic formatting.
- 🌍 **Wikipedia Helper**: Includes a script to easily fetch and format Wikipedia articles for learning.

## Documentation

For detailed installation instructions, CLI options, and tutorials, please visit the official documentation:

👉 **[https://sekika.github.io/langreader/](https://sekika.github.io/langreader/)**

- [**Usage Guide**](https://sekika.github.io/langreader/usage/): Options for styling, resuming, and metadata.
- [**Tutorial**](https://sekika.github.io/langreader/tutorial/): Step-by-step guide to creating a reader from a Wikipedia article.
- [**TTS Setup**](https://sekika.github.io/langreader/tts/): How to configure high-quality voices on your device.
