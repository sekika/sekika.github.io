---
layout: post
title: Google 認証システムのアルゴリズム
tag: jekyll
---
Google アカウントの[2段階認証プロセス](https://www.google.co.jp/intl/ja/landing/2step/)では、[Google 認証システム](https://support.google.com/accounts/answer/1066447?hl=ja)をモバイル端末にインストールすることで、[RFC 6238](http://tools.ietf.org/html/rfc6238)の[時刻同期型ワンタイムパスワード (TOTP)](https://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm)によって、端末に保存される秘密鍵（QRコードによって取得）と現在時刻から6桁の確認コードを生成する。


ここで、TOTPをサポートするモバイルアプリにはいくつかある。

- [Gooogle 認証システム](https://support.google.com/accounts/answer/1066447?hl=ja) (Android, iPhone, BlackBerry)
- [Duo Mobile](https://guide.duo.com/third-party-accounts) (Android, iPhone)
- [Token2](https://token2.com/?content=mobileapp) (Android, iPhone, Windows Phone)

## アルゴリズム ##

RFC 6238 のTOTPアルゴリズムは、サーバーとクライアントで共有する秘密鍵 K と現在時刻 TC（UNIX 時間）から、一意にトークン TOTP を計算するアルゴリズムであり、具体的には次のように計算する。

- Xを時間ステップ（秒）、T0を時間ステップのカウントを始める時刻（[UNIX時間](https://ja.wikipedia.org/wiki/UNIX%E6%99%82%E9%96%93)）、Nをトークンの長さとする。また、ハッシュアルゴリズムを決める。デフォルトでは X=30, T0=0, N=6, ハッシュアルゴリズムは SHA-1 であり、Google 認証システムではこのデフォルトを使って計算をする。
- T = floor((TC - T0) / X) により、時刻T0からの経過した時間ステップを 64-bit unsigned integer で得る。ここで、floor は[床関数](https://ja.wikipedia.org/wiki/%E5%BA%8A%E9%96%A2%E6%95%B0%E3%81%A8%E5%A4%A9%E4%BA%95%E9%96%A2%E6%95%B0)である。
- H = HMAC-SHA-1(K, T) により20バイトの文字列Hを計算する。すなわち、[HMAC](https://ja.wikipedia.org/wiki/HMAC)-SHA-1 アルゴリズム ([RFC 2104](https://tools.ietf.org/html/rfc2104)) によって秘密鍵KによってメッセージTのハッシュ H を計算する。
- TOTP = Truncate(H) により、10進数N桁のTOTPを計算する。ここで Truncate 関数は [RFC 4226](https://tools.ietf.org/html/rfc4226) の HOTP（HMAC ベースのワンタイムパスワード）に定められている。

ここで、サーバーとクライアントで時刻を共有するためには、


## 参考サイト ##

- [2段階認証できないAmazon・・主要サービスの2段階認証のまとめ](http://ischool.co.jp/2015-11-13/)
