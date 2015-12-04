---
layout: post
title: El Capitan へのアップグレード
tag: mac
---
[Mac OS X](http://www.apple.com/jp/osx/) の、Yosemite から El Capitan へのアップグレードのメモ。

* App Store から、El Capitan のアップグレードを開始する。
* ダウンロード、再起動してインストール。待つ。途中、[Command-Lでインストールログを確認できる](http://www.softantenna.com/wp/mac/yosemite-upgrade-tips-for-homebrew/)。
* App Store で、Xcode 最新版のインストールとソフトウェアのアップデート。
* Xcode のライセンスに合意。

~~~
sudo xcodebuild -license
~~~

* [/usr/local ディレクトリのオーナー変更]({% post_url 2015-11-26-el-capitan-homebrew %})。

~~~
sudo chown -R $(whoami):admin /usr/local
~~~

* 諸々のソフトをアップデート

~~~
xcode-select --install
sudo chown -R $(whoami):admin /Library/Ruby
brew doctor
~~~

（brew doctor になにか言われたら直す）

~~~
brew update
brew upgrade
brew install ruby
~~~

`Gemfile` がある場合には、そのディレクトリに行ってから

~~~
gem install bundle
bundle install
~~~

* [TeX のヒラギノフォント埋め込み設定]({% post_url 2015-12-01-mac-tex %})
* 拡張子の関連付けは再設定。

