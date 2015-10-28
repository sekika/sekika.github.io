---
layout: post
title: VirtualBox への Windows 10 のアップグレードインストール
date: 2015-10-28 13:48:07 +0000
tag: windows
---
VirtualBox 上で、Windows 7 から Windows 10 へアップグレードした。ホストOSは、Mac OS X。

## OSバージョンの設定

まずは、OS タイプのバージョンを Windows 10 に設定した。

- [VirtualBox での新規仮想マシンの作成](https://docs.oracle.com/cd/E26217_01/E35194/html/qs-create-vm.html) より

> 図 6.6 に示すように、VM 名および OS タイプの手順で、仮想マシンのわかりやすい名前を「名前」フィールドに入力し、インストールしようとしているオペレーティングシステムとバージョンをドロップダウンリストから選択します。これによって VirtualBox が仮想マシンに使用するデフォルト設定が決まるため、正しいオペレーティングシステムとバージョンを選択することが重要です。

最初は、仮想マシンの OS タイプのバージョンに、Windows 10 が表示されなかったので、VirtualBox を最新版 (5.0.8) にアップデートしてから設定した。

## ディスク容量の拡張

Windows 7 で確保していたディスク容量が、Windows 10 をインストールするには少なかったので、仮想ディスク容量を拡張した。可変サイズの VDI 形式で仮装ディスクを作成していたので、次の手順で拡張できた。

- [VirtualBoxにおける仮想マシンの仮想ディスク容量を拡張するための手順](http://www.virment.com/extend-virtualbox-disk/)

まず、ホストOSで ```VBoxManage``` コマンドを実行して、ディスク容量を拡張する。

~~~~
VBoxManage modifyhd 拡張したい仮想マシンの仮想ディスクのパス —-resize 拡張後のディスク容量
~~~~

これだけでは、仮想マシンで拡張された分のディスクを使用できる状態にないので、仮想マシン側でディスクを拡張する。Windows 7 を起動して C ドライブの拡張を試みたが（システムとセキュリティー > 管理ツール > コンピューターの管理 > ディスクの管理 > Cドライブを右クリックして「ボリュームの拡張」[参考](http://tech.ewdev.info/2014/10/2140/
)）、Cドライブは起動ディスクなので、拡張できなかった。そこで、上記サイトに書かれているように、Linux で起動して、```gparted``` でパーティションを編集した。LiveCD から起動しても良いが、すでに Debian をインストールした仮想ディスク環境があったので、そこから起動した。

- Debian 環境の SATA ドライブに Windows のディスクを追加して起動
- gparted で Cドライブに相当する /dev/sdb2 を拡大して、シャットダウン
- Debian 環境からは Windows のディスクを削除
- Windows 7 を起動
- チェックディスクが立ち上がる
- 再起動、無事にCドライブが拡張された

## Windows 10 へのアップグレード

「Windows 10 を入手する」アプリからのアップグレードを試みた。

- [「Windows 10を入手する」アプリは表示されましたか](http://www.atmarkit.co.jp/ait/articles/1506/04/news013.html)

しかし、「Windows 10 を入手する」アプリを起動すると、VirtualBox Graphics Adapter が Windows 10 に対応していないから Windows 10 を入手できないと言われてしまう。その件について、いくつかのサイトを検索した。

- [VirtualBoxでWindows 10アップデート](http://d.hatena.ne.jp/b3g/20150731)
- [How to get VirtualBox video driver working in Windows 10 build 10041](http://winaero.com/blog/how-to-get-virtualbox-video-driver-working-in-windows-10-build-10041/)
- [Windows 10 inside VirtualBox not scaling after upgrade from 8.1](http://superuser.com/questions/951818/windows-10-inside-virtualbox-not-scaling-after-upgrade-from-8-1)

VirtualBox Graphics Adapter を削除する方法はうまくいかなかったので、手動インストールすることとし、Windows 10 のディスクイメージをダウンロードした。

- [Windows 10 のディスク イメージ (ISO ファイル) のダウンロード](http://www.microsoft.com/ja-jp/software-download/windows10ISO)

ファイルサイズは、32 bit 版は 2.9 GB、64 bit 版は 3.9 GB とけっこう大きく、時間がかかった。ダウンロードが終わり、Windows 7 を起動して、DVDドライブに Windows 10 のディスクイメージをマウントして、setup.exe を実行したら、アップグレードできた。

Windows 10 にアップグレードした直後の使用ディスク容量は 33.7 GBだった。Microsoft Office Professional 2013 がインストールされ、他にもいくつかのプログラムとデータが入っている状態で、ルートディレクトリの下は、ユーザー 1.55 GB、Program Files 2.79 GB、cygwin 1.33 GB、Windows 9.40 GB、Windows.old 14.5 GB。
