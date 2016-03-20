---
layout: post
title: Mac で zip 圧縮するときのファイル名の文字コード
tag: mac
---
Mac の標準機能で zip ファイルを作成すると、ファイル名が UTF-8 でエンコードされる。一方、Windows では日本語のファイル名を Shift-JIS でエンコードする。Windows 8 からは UTF-8 の圧縮ファイルをそのまま解凍できるようになっているようであるが、Windows 7 までを使っている人が多くいるような場合には、Shift-JIS で圧縮する方が無難である。

Mac で Shift-JIS ファイル名で圧縮するソフトについて記す。

- [MacZip4Win http://ynomura.com/home/?page_id=116] .DS_Store などの Windows で不要なファイルは削除
- [WinArchiver Lite https://itunes.apple.com/jp/app/winarchiver-lite/id414855915?l=en&mt=12] / [WinArchiver https://itunes.apple.com/jp/app/winarchiver/id413215883?l=ja&mt=12] / [MacWinZipper http://tidajapan.com/macwinzipper]

## 参考サイト
- [日本語を含むZIPファイルを文字化けせず解凍する方法 http://qiita.com/hoo89@github/items/46dcd8134061c392772f] (Qiita, 2014/3/9)
- [MacでWindowsと互換性のあるzipファイルを作る方法【文字化けなし】 http://matome.naver.jp/odai/2134318298182284801] (Naver まとめ, 2012/9/7)
