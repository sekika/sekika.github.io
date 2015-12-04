---
layout: post
title: El Capitan へのアップグレード
tag: mac
---
[Mac OS X](http://www.apple.com/jp/osx/) の、Yosemite から El Capitan へのアップグレードのメモ。

* App Store から、El Capitan のアップグレードを開始する。
* ダウンロード、再起動してインストール。途中、[Command-Lでインストールログを確認できる](http://www.softantenna.com/wp/mac/yosemite-upgrade-tips-for-homebrew/)。
* App Store で、Xcode の最新版をインストールとソフトウェアのアップデート。
* ```sudo xcodebuild -license``` で、Xcode のライセンスに合意。
* [/usr/local ディレクトリのオーナー変更]({% post_url 2015-11-26-el-capitan-homebrew %})。
* 諸々のソフトをアップデート

~~~
xcode-select --install
brew update
brew upgrade
brew install ruby
gem install bundle
bundle install
~~~

* [TeX のヒラギノフォント埋め込み設定]({% post_url 2015-12-01-mac-tex %})
* 拡張子の関連付け再設定
* git の pre-commit hook が消えていることもあり

