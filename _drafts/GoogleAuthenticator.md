---
layout: post
title: Google 認証システムの仕組み
tag: security
---
Google アカウントの[2段階認証プロセス](https://www.google.co.jp/intl/ja/landing/2step/)では、[Google 認証システム](https://support.google.com/accounts/answer/1066447?hl=ja)をモバイル端末にインストールして、端末に```QRコード（バーコード）```を読み込ませることで、30秒ごとに変化する6桁の```確認コード```を生成することができる。Microsoft, Facebook, Dropbox 等多くのサービスで同じシステムが採用されている。この仕組みについて記す。

## 概要 ##

Google 認証システムで採用されている[RFC 6238](http://tools.ietf.org/html/rfc6238)の[時刻同期型ワンタイムパスワード (TOTP)](https://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm)は、サーバーとクライアントで共有する秘密鍵と現在時刻から、確認コードを計算するアルゴリズムである。

![Google 認証システム](/img/20160326-google-auth.png)

サーバーがランダムに生成した80ビットの```秘密鍵（シークレットキー）```を```QR コード```あるいは16文字の[Base32](https://en.wikipedia.org/wiki/Base32)文字列（A-Z, 2-7）として表示し、クライアントのモバイルアプリで読み取ることで、サーバーとクライアントに同じ秘密鍵が保存される。```現在時刻```は30秒ごとに値が変わる```カウンター```に変換されてから確認コードが計算されるため、30秒間は同じ確認コードが計算される仕組みとなっている。なお、確認コードの計算アルゴリズムについては最後に記す。

## 秘密鍵と確認コード ##

ある時刻においてカウンターがサーバーとクライアントで等しければ、サーバーとクライアントで秘密鍵を共有しているため同じ確認コードが計算されるはずであるから、サーバーとクライアントで確認コードの計算結果が一致するかどうかで認証ができるとするのが TOTP アルゴリズムである。ここで、サーバーとクライアントではそれぞれ[NTP](https://ja.wikipedia.org/wiki/Network_Time_Protocol)のような仕組みによってある程度正確に現在時刻を得ることができるという前提であり、RFC 6238では[通信のタイムラグ](http://tools.ietf.org/html/rfc6238#section-5.2)と[時刻のずれ](http://tools.ietf.org/html/rfc6238#section-6)を調整するための仕組みを実装することが推奨されている。

秘密鍵をモバイルアプリで読み込ませた端末を持っていなければ認証が成功しないことから、```持っているものでアカウントを保護する仕組み```であると説明される。端末を持っていなければ、漏洩した確認コードを知り得たとしても、30秒後にはその確認コードは無効となって認証が成功しなくなるためである。しかし、たとえば[中間者攻撃](https://ja.wikipedia.org/wiki/%E4%B8%AD%E9%96%93%E8%80%85%E6%94%BB%E6%92%83)によって素早く漏洩した確認コードが使われれば認証に成功してしまう。```30秒間は何度でも同じ確認コードを使えるという意味ではワンタイムではない。```サーバー側で最後に認証に成功した時のカウンターを記憶しておき、一致した時にはそのカウンターでは2回目は認証に成功させないようにすれば、真の意味でワンタイムになると考えられるが、RFC 6238ではそのような仕組みは提案されていないようである。

秘密鍵が漏洩すれば任意の時刻における確認コードを生成できるため、秘密鍵は適切なアクセス権限を設定して保存する必要があり、できれば[耐タンパー性](http://e-words.jp/w/%E8%80%90%E3%82%BF%E3%83%B3%E3%83%91%E3%83%BC%E6%80%A7.html)のあるデバイスに保存することが望ましいとされている。

## TOTP に対応するサービス ##

Google 認証システムを使ってTOTPの確認コードを生成できるサービスには、例えば次のようなサービスがある。このように多くのサービスで対応し、同じモバイルアプリを使用できることが、このシステムの利便性であろう。

- [Google](https://www.google.co.jp/intl/ja/landing/2step/)
- [Microsoft](http://windows.microsoft.com/ja-jp/windows/two-step-verification-faq)
- [Facebook](http://bey.jp/?p=9484)
- [Dropbox](https://www.dropbox.com/ja/help/363)
- [Evernote](https://evernote.com/intl/jp/contact/support/info/2fa/)
- [GitHub](https://help.github.com/articles/configuring-two-factor-authentication-via-a-totp-mobile-app/)
- [WordPress](https://wordpress.org/plugins/two-factor-authentication/)
- [Yahoo! Japan](https://hanakomachi.wordpress.com/2014/09/29/yahoo-googleauthenticator/) 秘密鍵の読み込み方法に注意

[Amazon.co.jp は2段階認証に対応していない](http://ischool.co.jp/2015-11-13/)模様。

## TOTP を計算するモバイルアプリ ##

TOTPをサポートするモバイルアプリには、例えば次のようなアプリがある。

- [Gooogle 認証システム](https://support.google.com/accounts/answer/1066447?hl=ja) (Android, iPhone, BlackBerry)
- [Duo Mobile](https://guide.duo.com/third-party-accounts) (Android, iPhone)
- [Token2](https://token2.com/?content=mobileapp) (Android, iPhone, Windows Phone)

## 複数端末への秘密鍵の登録 ##

サーバーがQRコードを生成した時に、複数の端末でアプリから同じQRコードを読み込ませれば、同じ秘密鍵が登録されるため、どの端末からも同じ確認コードを生成できるようになる。端末の紛失や故障、ソフトウェアの不具合によってモバイルアプリが起動できなくなった時のことを考えると、可能であれば2つ以上の端末に同じ秘密鍵を登録するのが良いであろう。SMSやバックアップコード等の手段で2段階認証を可能とする手段も有効である。

なお、すでにある端末に秘密鍵が登録されている時に、他の端末に同じ秘密鍵を登録することはできない（アプリに登録されている秘密鍵を表示する機能がない）ため、すでに登録されている秘密鍵を無効にしてから、すべての端末に同じQRコードを新しく読み込み直す必要がある。

## 確認コードの計算アルゴリズム ##

[RFC 6238](http://tools.ietf.org/html/rfc6238) の```TOTP```アルゴリズムは、サーバーとクライアントで共有する```秘密鍵```と、```現在時刻```から計算される```カウンター```から、一意に```トークン``` TOTP すなわち```確認コード```を計算するアルゴリズムであり、[RFC 4226](https://tools.ietf.org/html/rfc4226) の```HOTP```（HMAC ベースのワンタイムパスワード）に基づいている。具体的には次のように計算する。

- ```K```を```秘密鍵```、```TC```を```現在時刻```（[UNIX時間](https://ja.wikipedia.org/wiki/UNIX%E6%99%82%E9%96%93)）、```X```を```時間ステップ```（秒）、```T0```を```カウント開始時刻```（UNIX時間）、```N```を```トークンの長さ```とする。また、ハッシュアルゴリズムを決める。デフォルトでは ```X=30```, ```T0=0```, ```N=6```, ハッシュアルゴリズムは ```SHA-1``` であり、Google 認証システムではこのデフォルトを使って計算をする。なお、HOTPでは秘密鍵は128ビット以上が必要で160ビットを推奨としているが、Google 認証システムでは80ビットである。
- ```T = floor((TC - T0) / X)``` により、時刻T0からの経過時間に応じた```カウンター``` T を 64-bit unsigned integer で得る。ここで、floor は[床関数](https://ja.wikipedia.org/wiki/%E5%BA%8A%E9%96%A2%E6%95%B0%E3%81%A8%E5%A4%A9%E4%BA%95%E9%96%A2%E6%95%B0)であり、Tを整数型としておけば通常は自動的にfloor関数が適用される。
- ```H = HMAC-SHA-1(K, T)``` により20バイトの```ハッシュ``` H を計算する。すなわち、[HMAC](https://ja.wikipedia.org/wiki/HMAC)-SHA-1 アルゴリズム ([RFC 2104](https://tools.ietf.org/html/rfc2104)) によって秘密鍵KとメッセージTからハッシュHを計算する。
- 下記の Truncate 関数を使い、```TOTP = Truncate(H)``` として10進数N桁の```トークン``` TOTP を計算する。

ここで Truncate 関数は [RFC 4226](https://tools.ietf.org/html/rfc4226) に定められている20バイト文字列から10進数N桁のトークンを得る次のような関数である。

- 20バイト、すなわち160ビット文字列 String = String[0]...String[19] から31ビット文字列を得るDT関数 ```DT(String)``` を次のように定義する。String[19] の下位4ビットを正の整数に変換して Offset を得る(0 <= OffSet <= 15)。次に、P = String[OffSet]...String[OffSet+3] とする。Pは32ビットとなり、最上位ビットを除いた31ビットを DT(String) とする。
- DT(String) を正の整数に変換した数字を Snum として、```D = Snum mod 10^N``` を計算する。DはN桁以内の正の整数となる。DがN桁よりも少ない時には先頭に0を埋めて10進数N桁のトークンとしたものが、Truncate(String) である。

