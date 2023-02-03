---
layout: post
title: JavaScript コードの整形
date: 2023-02-03 08:07:46 +0000
tag: javascript
---
JavaScript コードの構文チェック (lint) と圧縮 (minify) について調べながらやってみたことをまとめる。Makefile を作成して作業を一本化した。

## 構文チェック (lint)

[ESLint](https://eslint.org/)を使った。[.eslintrc.json](https://github.com/sekika/sekika.github.io/blob/master/js/.eslintrc.json)は、`"extends": "eslint:all"`でESLint Rulesのルールがすべて適用してから、lintを実行しながら好みではないオプションを削っていった。[chromiumのページにあったもの](https://chromium.googlesource.com/external/github.com/twbs/bootstrap/+/refs/tags/v4.1.2/.eslintrc.json)も参照した。

## 圧縮 (minify)

[uglifyjs](https://lisperator.net/uglifyjs/)を使った。[コマンドラインオプション](https://github.com/mishoo/UglifyJS#readme)では、これを使った。

    --comments [filter]         Preserve copyright comments in the output. By
                                default this works like Google Closure, keeping
                                JSDoc-style comments that contain "@license" or
                                "@preserve". You can optionally pass one of the
                                following arguments to this flag:
                                - "all" to keep all comments
                                - a valid JS RegExp like `/foo/` or `/^!/` to
                                keep only matching comments.
                                Note that currently not *all* comments can be
                                kept when compression is on, because of dead
                                code removal or cascading statements into
                                sequences.

コメントは先頭の著作権表示だけを残すために、そこには必ず入れているMITという単語を使って`--comments /.*MIT.*/`とした。

## Makefile

構文チェックと圧縮をまとめる[Makefile](https://github.com/sekika/sekika.github.io/blob/master/js/Makefile)を作った。

```
ESFLAGS := --fix
UGFLAGS := --comments /.*MIT.*/ --verbose --warn

all: canvasevent.min.js graph.min.js 15.min.js unsoda.min.js

%.min.js: %.js
	eslint $(ESFLAGS) $<
	uglifyjs $(UGFLAGS) $< > $@

install:
	npm install -g eslint uglify-js

.PHONY: install
```

[このディレクトリ](https://github.com/sekika/sekika.github.io/tree/master/js)で`make`を実行すると、ターゲット `all` で対象となっているファイルに対して、ターゲット`%.min.js`の

```
%.min.js: %.js
	eslint $(ESFLAGS) $<
	uglifyjs $(UGFLAGS) $< > $@
```

によって構文チェックと圧縮がされる。ここで、`%.min.js: %.js`は[パターンルール](http://quruli.ivory.ne.jp/document/make_3.79.1/make-jp_9.html#Pattern-Rules) ([pattern rule](https://www.gnu.org/software/make/manual/html_node/Pattern-Rules.html#Pattern-Rules)) であり、`%`は空ではないすべての文字列にマッチする。したがって、たとえばターゲット 15.min.js に対応する事前要件 (必要条件, prerequisite) は 15.js となり、15.js が更新されると校正と圧縮がされて 15.min.js が生成される。

`$@`と`$<`は[自動変数](http://quruli.ivory.ne.jp/document/make_3.79.1/make-jp_9.html#Automatic) ([automatic variable](https://www.gnu.org/software/make/manual/html_node/Automatic-Variables.html#Automatic-Variables)) であり、`$@`はターゲットのファイル名、`$<`は最初の事前要件の名前である。ESFLAGSとUGFLAGSは[変数](http://quruli.ivory.ne.jp/document/make_3.79.1/make-jp_5.html#Using-Variables)([variable](https://www.gnu.org/software/make/manual/html_node/Using-Variables.html#Using-Variables))である。
