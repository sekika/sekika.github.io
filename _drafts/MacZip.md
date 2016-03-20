---
layout: post
title: Mac で zip 圧縮するときの文字化け対処法
tag: mac
---
Mac の標準機能で zip ファイルを作成すると、ファイル名が UTF-8 でエンコードされる。一方、Windows では日本語のファイル名を Shift-JIS でエンコードする。そのため、日本語を含むzipファイルをやりとりするときに文字化けのトラブルが生じることがある。対処方法を調べたのでメモする。

## Mac で Shift-JIS の zip ファイルを作成する

以下が、Mac で Shift-JIS ファイル名で圧縮するソフトである。.DS_StoreをはじめとするMac特有のファイルを自動的に除外する機能が付いている。

- [WinArchiver Lite](https://itunes.apple.com/jp/app/winarchiver-lite/id414855915?l=en&mt=12) （無料版） / [WinArchiver](https://itunes.apple.com/jp/app/winarchiver/id413215883?l=ja&mt=12)  （有料版）
- [MacZip4Win](http://ynomura.com/home/?page_id=116) 

なお、Mac では Shift-JIS で圧縮されたファイルは文字コードを自動的に判別して解凍するので、読み込みについては対処の必要がない。

## Windows で UTF-8 の zip ファイルを解凍する

- Windows 7 では[修正プログラム](http://support.microsoft.com/kb/2704299/ja)を適用する。
- Windows 8 からは UTF-8 の圧縮ファイルをそのまま解凍できるようになっているようである。
- その他の環境の場合[Explzh](http://www.ponsoftware.com/)等のフリーソフトを使う。

今後、Windows 8 以降のシェアが増えるにつれて、このトラブルは減少するであろうと考えられる。

## 参考サイト
- [日本語を含むZIPファイルを文字化けせず解凍する方法](http://qiita.com/hoo89@github/items/46dcd8134061c392772f) (Qiita, 2014/3/9)
- [MacでWindows向けに作成したZIPファイルの文字化けを解消するアプリWinArchiver](http://hep.eiz.jp/201209/mac-windows-zip-winarchiver/) (HepHep!, 2015/4/25)
- [MacWinZipper (WinArchiver)](http://tidajapan.com/macwinzipper) (Tida)
- [MacでWindowsと互換性のあるzipファイルを作る方法【文字化けなし】](http://matome.naver.jp/odai/2134318298182284801) (Naver まとめ, 2012/9/7)
