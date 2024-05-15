---
layout: page
title: このサイトについて
permalink: /about/
---
{% assign popular_link = site.data.navigation | where: "name", "人気記事" | map: "link" %}
<a href="/">このサイト</a>は{{ site.author }}のブログのような形式のメモ帳です。[よく読まれている記事]({{ popular_link.first }})は、IT系のちょっとした How to 記事です。授業で使う資料や、自分用のちょっとしたメモを置いたりもしています。

## プライバシーポリシー
このサイト sekika.github.io は以下のページもホストしています。これらは独立に管理され、プライバシーポリシーを共有します。

- <a href="/toyo/">関の東洋大学におけるプロフィールページ</a>
- <a href="/kaidoku/">Kaidoku</a> ソフトウェア
- <a href="/unsatfit/">Unsatfit</a> ソフトウェア
- <a href="/hystfit/">Hystfit</a> ソフトウェア

このサイト sekika.github.io をホストする GitHub はアクセスログを保持し、<a href="https://docs.github.com/ja/site-policy/privacy-policies/github-privacy-statement">プライバシーポリシー</a>に従って管理されます。このサイトの所有者はアクセスログを閲覧することができません。

このサイトではサイトの閲覧状況を知るためにGoogleによるアクセス解析ツール[Google アナリティクス](https://analytics.google.com)を使用しています。このGoogle アナリティクスではデータ収集のために [Cookie](https://ja.wikipedia.org/wiki/HTTP_cookie) を使用しています。このデータは匿名で収集されており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することができますので、お使いのブラウザの設定をご確認ください。技術的な詳細は[Googleによる説明](https://policies.google.com/technologies/partner-sites?hl=ja)を参照してください。

一部のソーシャルネットワーキングサービス（SNS）は、ログインした状態で、当該SNSの「ボタン」等が設置されたページを閲覧した場合、当該「ボタン」等を押さなくとも、当該ウェブサイトからSNSに対し、ユーザーID・アクセスしているサイト等の情報が自動で送信されていることがあります。Twitterのツイートボタンについては、<a href="https://twitter.com/privacy?lang=ja">Twitter社によるプライバシーポリシー</a>を参照してください。Facebookのシェアボタンについては、<a href="https://www.facebook.com/privacy/policy/">Meta社によるプライバシーポリシー</a>を参照してください。LINEで送るボタンについては、<a href="https://line.me/ja/terms/policy/">LINE株式会社によるプライバシーポリシー</a>を参照してください。

## ソフトウェア
このサイトは [GitHub](https://github.com/) がホストしています。使っている[ソフトウェアとバージョン]({% post_url 2017-05-02-version %})をまとめています。[過去のブログ]({% post_url 2015-10-11-old-blog %})も残っています。[Atom (RSS)](https://ja.wikipedia.org/wiki/Atom_(%E3%82%A6%E3%82%A7%E3%83%96%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84%E9%85%8D%E4%BF%A1)) は[こちらから購読](/feed.xml)できます。

## 著者へのフィードバック

<ul>
<li><a href="http://twitter.com/seki/">Twitter アカウント</a></li>
<li>著者のメールアドレスは<a href="http://www.sciencedirect.com/science/article/pii/S0016706115000622">この論文</a>にあります。</li>
</ul>

---
<a href="/en/about/">English version</a>
