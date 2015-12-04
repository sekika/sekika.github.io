---
layout: post
title: El Capitan へのアップグレード
tag: mac
---
Mac OS X の、Yosemitte から El Capitan へのアップグレードのメモ。

* App Store から、El Capitan のアップグレード
* ダウンロード、再起動してインストール。途中[Command-Lでインストールログを確認できる](http://www.softantenna.com/wp/mac/yosemite-upgrade-tips-for-homebrew/)。
* App Store で、Xcode の最新版をインストールとソフトウェアのアップデート。
* ```sudo xcodebuild -license``` で、Xcode のライセンスに合意。
* [/usr/local ディレクトリのオーナー変更]({% post_url 2015-11-26-el-capitan-homebrew %})。
* `Homebrew` 関係
~~~
brew update
brew upgrade
brew install ruby
sudo gem install bundle jekyll
~~~

