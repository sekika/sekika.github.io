---
layout: post
title: VirtualBox への Windows 10 のインストール
tag: windows
---
VirtualBox 上で、Windows 7 から Windows 10 へアップグレードした。ホストOSは、Mac OS X。

まずは、Windows 7 で確保したディスク容量が少なかったので、ディスク容量を拡張した。可変サイズの VDI 形式で仮装ディスクを作成していたので、次の手順で作成できた。

- [VirtualBoxにおける仮想マシンの仮想ディスク容量を拡張するための手順](http://www.virment.com/extend-virtualbox-disk/)

まず、ホストOSで ```VBoxManage``` コマンドを実行して、ディスク容量を拡張する。

~~~~
VBoxManage modifyhd 拡張したい仮想マシンの仮想ディスクのパス —-resize 拡張後のディスク容量
~~~~

これだけでは、仮想マシンで拡張された分のディスクを使用できる状態にないので、仮想マシン側でディスクを拡張する。Windows 7 を起動して C ドライブの拡張を試みたが（システムとセキュリティー > 管理ツール > コンピューターの管理 > ディスクの管理 > Cドライブを右クリックして「ボリュームの拡張」[参考](http://tech.ewdev.info/2014/10/2140/
)）、Cドライブは起動ディスクなので、拡張できなかった。そこで、上記サイトに書かれているように、Linux で起動して、```gparted``` でパーティションを編集した。LiveCD から起動しても良いが、すでに Debian をインストールした仮想ディスク環境があったので、そこから起動した。

- Debian SATA ドライブに Windows のディスクを追加
- gparted で Cドライブに相当する /dev/sdb2 を拡大して、シャットダウン
- Debian からは Windows のディスクを削除
- Windows 7 を起動
- チェックディスクが立ち上がる
- 再起動、無事にCドライブが拡張された


関連：「Windows 10を入手する」アプリは表示されましたか
http://www.atmarkit.co.jp/ait/articles/1506/04/news013.html

[How to get VirtualBox video driver working in Windows 10 build 10041](http://winaero.com/blog/how-to-get-virtualbox-video-driver-working-in-windows-10-build-10041/)
http://superuser.com/questions/951818/windows-10-inside-virtualbox-not-scaling-after-upgrade-from-8-1

