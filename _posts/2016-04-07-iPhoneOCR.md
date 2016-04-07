---
layout: post
title: iPhone で文字認識
date: 2016-04-07 11:48:44 +0000
tag: iphone
---
iPhone のカメラで撮影した画像をそのまま文字認識してテキスト化するアプリについて。私は、日本語は「もじかめ」、英語、フランス語等では「Pixter」を使っている。

## 日本語 ##

株式会社メディアドライブのスマートフォン向け文字認識アプリ「**もじかめ**」は、2011年にリリースされ、2016年に無料アプリとしてリニューアル公開された。実際に使ってみたところ、日本語の文字認識精度は英語圏で開発されたアプリよりもかなり良い。

- [Internet Watch の記事](http://internet.watch.impress.co.jp/docs/news/20160407_752108.html)　(2016/4/7)
- [メディアドライブのプレスリリース](http://mediadrive.jp/topics/2016/renewal_mojicamei.html) (2016/3/29)
- [App Store: iOS 版ダウンロード](https://itunes.apple.com/jp/app/mojikame/id1085983690)
- [Google Play: Android 版ダウンロード](https://play.google.com/store/apps/details?id=jp.mediadrive.rtocr2)

文字認識テスト：近くにあったマスクの使用方法を読み込み。この例では認識ミスなし。

> 使用方法●上下表裏を確認してノーズフィッターを鼻の形に合わせます。(耳ひもが取り付けてある面が顔側です)●顔にフィットさせながら耳ひもを掛けます。●顔の大きさに合わせてプリーツを上下に広げます。

## 英語等のアルファベットを使う言語 ##

[The Best iPhone OCR Apps Tested](http://www.makeuseof.com/tag/the-best-iphone-ocr-apps-tested/) では、3つの iPhone アプリがレビューされている。その中で、2つ目の PDFpen Scan+ は、他の2つと比べて文字認識精度が良くないとレビューされているので、残りの2つを紹介する。以下には、App Store 日本語版へのリンクを示す。価格はこの記事を投稿した時点のもの。

- [CamScanner](https://itunes.apple.com/jp/app/camscanner-free-pdf-document/id388627783): 結果を共有するためには App 内課金で高級アカウント（月間600円、年間6000円）を購入する必要あり。[日本語もそれなりの精度で認識できる](http://hokoxjouhou.blog105.fc2.com/blog-entry-241.html)が、[Xcode Ghost 感染騒ぎ](http://hokoxjouhou.blog105.fc2.com/blog-entry-408.html)があった。現在は、対策されている。[INTSIG Information](http://www.intsig.com/) 開発。
- [Pixter](https://itunes.apple.com/jp/app/pixter-scanner-ocr-by-quanticapps/id622615952): 480円。日本語の文字認識精度は悪いので日本語のレビューは良くないが、英語、フランス語の文字認識精度は良い。他にもいろいろな言語に対応し、アルファベット系言語の読み込みには便利。「ソース言語」と「ターゲット言語」を設定して使う。[Quanticapps](http://quanticapps.com/) 開発。

文字認識テストの例として、[Céréal](https://www.delhaizedirect.lu/fr/F-10335-alimentation-regime-specifique/P-14048-actif-%7C-biscuit-soja-orange)というお菓子に表示されていたフランス語の原材料名の Pixter による読み込み結果を記す。正確。

> Biscuit avec soja et orange, avec vitamines ajoutés. INGRÉDIENTS: Farine de blé, sucre de canne, huile de colza, flocons de scia 7%, germe de blé 5,3%, flocons d'orange 2,5% (orange, sucre, amidon de maïs), émulsifiant: lécithine de colza, minéraux (sels de magnésium de l'acide orthophosphorique et carbonate de calcium), poudres à lever: carbonates de sodium, diphosphates et carbonates d'ammonium, fibre d'avoine, sel marin, arôme naturel d'orange, protéines de lait, amidon de blé, vitamines (E., 83, B5, B6, B1, acide folique), lactose. Peut contenir des traces de fruits à coque (amandes, noisettes, noix et noix de pécan), oeuf et lupin.

## その他の言語 ##

日本語でもなく、アルファベットを使わない言語については、テストをしていないのでよく分からない。その言語専用のアプリがあれば、それを使うのがベストであろう。
