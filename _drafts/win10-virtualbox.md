---
layout: post
title: VirtualBox への Windows 10 のアップグレードインストール
tag: windows
---
VirtualBox 上で、Windows 7 から Windows 10 へアップグレードした。ホストOSは、Mac OS X。

## ディスク容量の拡張

まずは、Windows 7 で確保していたディスク容量が、Windows 10 をインストールするには少なかったので、仮想ディスク容量を拡張した。可変サイズの VDI 形式で仮装ディスクを作成していたので、次の手順で拡張できた。

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

次に、「Windows 10 を入手する」アプリからのアップグレードを試みた。

- [「Windows 10を入手する」アプリは表示されましたか](http://www.atmarkit.co.jp/ait/articles/1506/04/news013.html)

しかし、VirtualBox Graphics Adapter が Windows 10 に対応していないとのことで、「Windows 10 を入手する」アプリからのアップグレードができなかった。

- [VirtualBoxでWindows 10アップデート](http://d.hatena.ne.jp/b3g/20150731)
- [How to get VirtualBox video driver working in Windows 10 build 10041](http://winaero.com/blog/how-to-get-virtualbox-video-driver-working-in-windows-10-build-10041/)
- [Windows 10 inside VirtualBox not scaling after upgrade from 8.1](http://superuser.com/questions/951818/windows-10-inside-virtualbox-not-scaling-after-upgrade-from-8-1)

そこで、Windows 10 のディスクイメージをダウンロードした。

- [Windows 10 のディスク イメージ (ISO ファイル) のダウンロード](http://www.microsoft.com/ja-jp/software-download/windows10ISO)

ファイルサイズは、32 bit 版は 2.9 GB、64 bit 版は 3.9 GB とけっこう大きく、時間がかかった。ダウンロードが終わり、Windows 7 を起動して、CDドライブに Windows 10 のディスクイメージをマウントして、setup.exe を実行したら、アップグレードできた。

Microsoft Office Professional 2013 がインストールされ、他にもいくつかのプログラムとデータが入っている状態で、Windows 10 にアップグレードした直後の使用ディスク容量は 33.7 GB。ルートディレクトリの下は、ユーザー 1.55 GB、Program Files 2.79 GB、cygwin 1.33 GB、Windows 9.40 GB、Windows.old 14.5 GB。
