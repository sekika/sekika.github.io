---
layout: post
title: ファイルの拡張子について
tags:
- windows
- mac
---
ファイルの拡張子とは、ファイルのデータ形式を識別するためにファイル名の最後につけられる文字列である。Windows や Mac では、ドット (.) の後に続く文字であり、たとえば、```filename.txt``` という名前のファイルがあるときに、```.txt``` の部分、あるいは ```txt``` の部分が拡張子である。

## 拡張子とアプリケーションの関連付け

```Windows``` では、拡張子とアプリケーションが関連付けられているときに、ファイルをダブルクリックすると、関連付けられたプログラムでそのファイルが開く。たとえば、Microsoft Office をインストールすると、拡張子 ```docx``` は Microsoft Word に関連付けられるため、拡張子 ```docx``` のファイルをダブルクリックすると、Word でそのファイルを開くことができる。この関連付けを変える方法については、Windows のバージョンによって異なり、以下のサイトに解説されている。

- [Windows 10でファイルとアプリの関連付けを変更する](https://dekiru.net/article/12837/) (できるネット)
- [Windows 10でアプリケーションと拡張子の関連付けを変更する方法](http://121ware.com/qasearch/1007/app/servlet/qadoc?QID=018054) (NEC Personal Computers)
- [ファイル拡張子とアプリケーションの関連付けを変更する（Windows 8編）](http://www.atmarkit.co.jp/ait/articles/1303/29/news102.html) (@IT, 2013/3/29)
- [Windows 8 / 8.1でアプリケーションと拡張子の関連付けを変更する方法](https://121ware.com/qasearch/1007/app/servlet/relatedqa?QID=015611) (NEC Personal Computers)
- [Windows7 ： 拡張子の関連付け法（ダブルクリックで開くプログラムを変更する）](http://office-qa.com/win/win04.htm) (教えて！HELPDESK)
- [ファイルを開くアプリケーションソフトを変更したい
拡張子の関連付けを変更したい](http://soft1.jp/trouble/w/w015.html) (HEARTSNET)

```Mac OS X``` では、v10.4 以降、UTI (<a href="https://ja.wikipedia.org/wiki/Uniform_Type_Identifier">Uniform Type Identifier</a>) という仕組みでデータの種類を識別している。UTIによって拡張子とファイルタイプが関連付けられるため、拡張子によってファイルタイプを判別することができる。以下の方法で、拡張子とファイルの関連付けを変えることができる。

- [Mac OS Xでファイルの関連付けをちょっと簡単に変更する方法](https://makopoppo.wordpress.com/2011/08/13/mac-osx%E3%81%A7%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%81%AE%E9%96%A2%E9%80%A3%E4%BB%98%E3%81%91%E3%82%92%E3%81%A1%E3%82%87%E3%81%A3%E3%81%A8%E7%B0%A1%E5%8D%98%E3%81%AB%E5%A4%89%E6%9B%B4%E3%81%99/) (@makopo, 2011/8/13)
- [Mac ファイルの関連付けを変更する設定方法！](http://applian.jp/mac-change-association/) (アプリアン, 2015/4/26)

## 拡張子を表示する

Windows では、アプリケーションの関連付けがされているファイルの拡張子が、デフォルトでは表示されないようになっている。そのため、多くの人は拡張子を意識せず、そのようなものがあることを知らない。ファイルの種類は、アイコンの種類で識別されている。しかし、これは以下の理由でよろしくない。

- ウィルスの可能性の高い ```exe``` ```scr``` ```vbs``` ```com``` などの実行ファイルの拡張子が表示されない。たとえば、```見積書.exe``` というファイル名で、ファイルのアイコンが Word のアイコンになっていたときに、拡張子が見えないと、アイコンの形だけで Word のファイルだと認識して、そのファイルを起動してしまう可能性がある。
- ファイル名を ```レポート.docx``` として保存したところ、さらに自動的に ```.docx``` の拡張子が付与されて、```レポート.docx.docx``` といったようなファイル名となる。フォルダでは ``レポート.docx``` というファイル名で表示される、といったような混乱が生じる。

ファイルの拡張子を表示する設定方法については、以下のサイトに解説されている。

```Windows``` の場合

- [Windows10でファイルの拡張子を表示させる方法](http://win10labo.info/win10-exp/) (Win10ラボ)
- [Windows 8 / 8.1でファイルの拡張子を表示する方法](https://121ware.com/qasearch/1007/app/servlet/qadoc?QID=013988) (NEC Personal Computers)
- [ファイルの拡張子を表示する - Windows 7](http://www.microsoft.com/ja-jp/atlife/tips/archive/windows/tips/252.aspx) (Microsoft)
- [ファイルの拡張子を表示させる方法を教えてください。](http://www.fmworld.net/cs/azbyclub/qanavi/jsp/qacontents.jsp?PID=8702-9695) (Fujitsu FMVサポート)

```Mac``` の場合

- [Mac - ファイルの拡張子を表示/非表示にする](http://pc-karuma.net/mac-finder-show-file-extensions/) (PC設定のカルマ)
- [Macでファイルの拡張子を常に表示させる方法](http://blog.atenasyokunin.com/win2mac/mac_extension/) (MacPlus+, 2014/12/9)

## 拡張子の文字数

拡張子の取り扱いはOSによって異なり、また歴史的な変遷もあった。インターネットが普及しだしたころ、Windows では「ファイル名8文字 + "." + 拡張子3文字」という 8.3 ファイル形式が使われていたため、HTML ファイルの拡張子を ```.HTM``` と3文字にする必要があったが、Macintosh や UNIX では拡張子の文字数が自由であったため、```.html``` が使われていた。やがて Windows でも、Winows NT 3.5 と Windows 95 から長いファイル名がサポートされ、8.3 文字の制限がなくなった。そのような経緯もあり、拡張子はドットを除いて3文字以内のものが多いが、4文字以上のものもある。

## 拡張子の例

Wikipedia の<a href="https://ja.wikipedia.org/wiki/%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%83%95%E3%82%A9%E3%83%BC%E3%83%9E%E3%83%83%E3%83%88%E4%B8%80%E8%A6%A7">ファイルフォーマット一覧</a>には、拡張子とファイルフォーマットが一覧にされている。ただし、拡張子はファイルのデータ形式に必ずしも対応していないため、参考であるとしている。また、<a href="https://ja.wikipedia.org/wiki/%E7%94%BB%E5%83%8F%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%83%95%E3%82%A9%E3%83%BC%E3%83%9E%E3%83%83%E3%83%88">画像</a>、<a href="https://ja.wikipedia.org/wiki/%E9%9F%B3%E5%A3%B0%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%83%95%E3%82%A9%E3%83%BC%E3%83%9E%E3%83%83%E3%83%88">音声</a>、動画等の<a href="https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%E3%83%95%E3%82%A9%E3%83%BC%E3%83%9E%E3%83%83%E3%83%88">コンテナ</a>のファイル形式が、それぞれまとめられている。その中から、いくつかを以下に抜粋する。

|拡張子 |説明 |主な使用ソフトウェア |種類|
|--------|-----|-------------------------|-----|
|7z| 7-Zipペッドファイル	|7-Zip |アーカイブ|
|AAC |Advanced Audio Coding （音楽ファイルの標準の1つ） ||音声|
ACCDB |データファイル |Microsoft Access Database (Open XML)|データベース|
|AVI |Audio Video Interleaved 動画ファイル |Video for Windows、他多数|動画|
|BAT |バッチファイル|MS-DOS, RT-11|スクリプト|
|BMP|Windows、OS/2のビットマップ画像ファイル |QPeg、CorelDraw、PC Paintbrush、他多数|画像|
|BZ2 |圧縮ファイル |bzip2|圧縮|
|C |C言語ソース |GCCなど|ソース|
|CGI |Common Gateway Interface スクリプト | |スクリプト|
|CLASS|Java classファイル |Java|実行|
|COM |コマンドファイル |DOS|実行|
|CSS |カスケーディング スタイル シート| |スクリプト|
|CSV |カンマ区切りテキストファイル (Comma Separated Values) ||
|DOC |ドキュメントファイル。テキストファイル形式の説明書。| 多数 |文書|
|DOC|ワープロファイル |Microsoft Word、他 |文書|
|DOCM |Microsoft Word 2007 以降で作成されたマクロ機能有効な文書ファイル |Microsoft Word |文書|
|DOCX |Office Open XML ドキュメント |Microsoft Word|文書|
|DLL|Dynamic Link Library, 動的リンクライブラリ |Windows |実行|
|DVI |DeVice Independent document |TeX|文書|
|EPS|Encapsulated PostScript |CorelDraw - PhotoStyler - PMView - Adobe Illustrator - Ventua Publisher|画像|
|EXE |実行可能なプログラム |DOS, Windows|実行|
|FLV |Flash ビデオファイル |Flash Video Player|動画|
|GIF |Compuserves' Graphics Interchange Format |QPeg - Display - CompuShow |画像|
|GZ |圧縮ファイル |GNU zip - WinZipNT|圧縮|
|HTM |HTML 参照||文書 |
|HTML |Hypertext Markup Language (WWW)	|Netscape - Mosaic - 多数 |文書|
|INDD |InDesign 文書 |Adobe InDesign|文書 |
|INI |初期設定ファイル ||
|JAVA |Java ソースコード ||ソース |
|JPEG |Joint Photography Experts Groupファイルフォーマット |多数 |画像|
|JPG |JPEGを参照 |多数 |画像|
|LZH |アーカイブ |LHA/LHARC|アーカイブ|
|MDB |Microsoft DataBase |Microsoft Access |データベース|
|MID |標準 MIDI ファイル |music synthetizers, Winamp|音声 |
|MIDI |MID 参照 ||音声 |
|MOV |動画形式 (Mac) |QuickTime|動画|
|MP3 |MPEG オーディ オストリーム, レイヤー3 |AWAVE, CoolEdit(+PlugIn), Winamp |音声|
|MP4 |マルチメディアコンテナ形式 MPEG 4 Part 14 |Winamp |音声|
|MPEG |マルチメディアコンテナ形式 |MPEG Player, Winamp |音声/動画|
|MPG |MPEGを参照	 ||音声/動画|
|PDF |Adobe's Portable Document Format |Adobe Acrobat Reader|文書|
|PHP |PHP ファイル ||スクリプト |
|PNG |Portable Network Graphics, Animated Portable Network Graphics |多数 |画像/動画|
|PPS |Microsoft PowerPoint Slideshow |Microsoft PowerPoint|プレゼンテーション|
|PPT |Microsoft PowerPoint プレゼンテーション |Microsoft PowerPoint|プレゼンテーション|
|PPTM |マクロ付き PowerPoint ファイル |Microsoft PowerPoint|プレゼンテーション|
|PPTX |Office Open XML プレゼンテーション |Microsoft PowerPoint|プレゼンテーション|
|PS |PostScript 形式の文書 |Adobe|文書|
|PSD |Photoshop bitmap file |Photoshop document|画像 |
|PY |Python スクリプトファイル |Python |スクリプト|
|RB |Ruby スクリプトファイル |Ruby |スクリプト|
|RTF |Rich Text Format |ワードパッドなど多数 |文書|
|SVG |Scalable Vector Graphics, 多数 ||画像|
|TAR |アーカイブ |TAR |アーカイブ|
|TGZ |アーカイブ |WindowsZipNT - TAR - GNUzip |アーカイブ|
|TIF |TIFFを参照 ||画像|
|TIFF |TIFF (tagged image format file) bitmapped file |Alchemy - PhotoStyler -PageMaker - CorelDRAW |画像|
|TTF |TrueType Font ||フォント|
|TXT |ASCIIテキストファイルの一般的な名称 |メモ帳、テキストエディタなど多数 |文書|
|XLS|Microsoft Excelの表計算ファイル |Microsoft Excel |表計算|
|XLSM |Microsoft Excel 2007 Macro-Enabled Workbook (Spreadsheets) |Microsoft Excel 2007|表計算|
|XLSX |Office Open XML Workbook (スプレッドシート) |Microsoft Excel 2007 |表計算|
|XML |eXtensible Markup Language 文書 | |文書|
|WAV |音声形式 |Media Player |音声|
|ZIP |ZIPアーカイブ |PKZip, WinZip, Mac OS X、他多数 |アーカイブ|


