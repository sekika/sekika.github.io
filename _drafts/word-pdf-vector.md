---
layout: post
title: Windows Word での PDF 図ベクター保持の問題と対応
tags:
- word
- science
---
論文や学会誌の投稿では、多パネル図や LaTeX 数式を含む PDF 図を用いることが多い。最近、Windows 版の Microsoft Word で PDF 図をベクター品質のまま貼り付けられない問題に直面した。この記事では、これまでの試行と技術的背景、現実的な対応策を整理する。

## 出版社との経緯

論文の著者校正の過程で、出版社が Windows 版の Microsoft Word を用いて PDF 図を貼り付けたが、貼り付け後の図はベクター形式として保持されず、拡大すると文字や線がぼやける状態であった。このため、元の高解像度 PDF を使用しても、Windows Word 上では図の品質を十分に再現できなかった。

次に EMF（Enhanced Metafile）形式への変換を試みた。Inkscape や pstoedit を用いて PDF を EMF に変換する手順を実施したが、多パネル構成の図や Type3 フォントを含む図では、文字消失や bounding box の崩れが生じ、結果的に信頼性のある貼り付けは難しいことが分かった。

最終的に、出版社から Word ファイルを送付してもらい、こちらで macOS 版 Word を用いて PDF 図を直接貼り付ける方法を採用した。macOS Word では PDF をベクター形式のまま貼り付けて PDF 出力でき、文字や線も鮮明な状態で保持されることを確認した。Windows 版と Mac 版ではレンダリング差によりレイアウトが若干異なる場合があるが、品質面での問題は生じなかった。

## EMF 変換の技術的課題

EMF は Windows 専用のベクター形式で、理論上は Word に高品質なベクター図を貼り付け可能である。しかし、複雑な多パネル図や Type3 フォントを含む図では、文字が消えたり bounding box が崩れる問題が発生しやすい。

PDF から EMF への変換には、Inkscape を用いて以下のように処理することができる。

```
inkscape fig1.pdf --export-type=emf
```

あるいは PDF を EPS に変換し、pstoedit を用いて EMF に変換する方法もある。

```
pdftops -eps fig1.pdf fig1.eps
pstoedit -f emf fig1.eps fig1.emf
```

しかし、いずれの方法でも Type3 フォントやクリッピング、細線などを含む複雑な図では文字の消失やレイアウトの破綻が起きやすく、信頼性は限定的である。

## PDF レンダリングの違い

Windows 版と macOS 版の Word では、PDF の描画方法に違いがある。Windows Word は GDI（Graphics Device Interface）を用いて描画するため、PDF を貼り付けると自動的にラスター化され、ベクター情報は保持されない。一方、macOS Word は Quartz / CoreGraphics を利用するため、PDF を貼り付けた場合でもベクター情報を保持しやすい。このため、Mac Word 上で PDF を貼り付け、PDF 出力を行うと文字や線が鮮明に維持される。

通常の論文組版では、LaTeX や InDesign などを用いれば PDF 図をそのままベクター形式で配置できる。これらのツールでは拡大しても劣化せず、文字や線も正確に保持される。

## 結論

Windows 版 Word 上で PDF 図をベクター形式のまま貼り付けることは、複雑な図ではほぼ不可能である。EMF への変換も理論上は可能だが、文字やレイアウトの破綻が起きやすく、実務上は信頼性に欠ける。最も確実な方法は、Mac 版 Word で PDF 図を直接貼り付けて PDF 出力すること、あるいは LaTeX や InDesign, QuarkXPress などの専用組版ツールで PDF を配置することである。Word はあくまで編集補助用として割り切ることが望ましい。
