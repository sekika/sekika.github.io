# 検索インデックスのセットアップ

このディレクトリには、サイト内検索で使う `js/index.js` と記事PDFを生成し、記事をコミットするときに自動更新するためのスクリプトがあります。

## 初回設定

リポジトリのルートディレクトリで、次を一度実行します。

```sh
make -C setup install-hook
```

これにより、`setup/pre-commit` が Git の `pre-commit` フックとしてインストールされます。Git フックは各ローカルクローンごとの設定なので、別のPCや別のクローンでも同じ操作が必要です。

## 通常の運用

`_posts/` 内の記事を追加、編集、削除、または名前変更してコミットすると、`pre-commit` フックが次を自動的に行います。

1. `setup/index` を実行して、全記事の検索データを `js/index.js` に生成します。
2. `tools/minitype-pdf/generate-pdfs.mjs` を実行し、未生成のPDFを一括生成します。コミットに含まれる記事のPDFは、既存であっても再生成します。
3. 生成された `js/index.js` と `pdf/` 配下のPDFをコミット対象に追加します。

したがって、通常は記事と一緒に `js/index.js` やPDFを手作業で `git add` する必要はありません。ただし、生成された変更内容を確認したい場合は、コミット前に手動生成しておくこともできます。

```sh
python3 setup/index
node tools/minitype-pdf/generate-pdfs.mjs --missing
git diff -- js/index.js
```

## 注意点

記事の変更を一部だけステージし、同じ `_posts/` 内に未ステージの変更が残っている場合、フックは処理を中止します。これは、コミットする記事本文と検索インデックスの内容が食い違うことを防ぐためです。

その場合は、記事の変更をすべてステージするか、未ステージの変更を退避してから再度コミットしてください。

```sh
git add _posts/
```

## スクリプトの仕様

- `index` はPython 3の標準ライブラリだけで動作し、追加の `pip` パッケージは不要です。
- PDF生成はNode.jsを使用します。初回だけ `cd tools/minitype-pdf && npm install` を実行してください。
- 実行するディレクトリにかかわらず、リポジトリ内の `_posts/` を読み込み、`js/index.js` に出力します。
- 記事のタイトル、作成日、更新日、本文のテキストを検索データに含めます。
- 検索メニューは日本語サイトのナビゲーションにのみ表示されます。

## PDF生成の対象外

`_posts/` 内の記事はデフォルトでPDF生成対象です。フロントマターに `pdf: false` を指定した記事は生成しません。また、コード例の外に実行・操作用のHTML（`script`、`canvas`、`form`、`input`、`textarea`、`select`、`button`、`iframe`、`object`、`embed`、`applet`）がある記事、JavaScriptイベント属性または `javascript:` URLがある記事、実行環境用レイアウト（`javascript`、`javascript-en`、`post-js`、`post-js-en`、`pyodide`）の記事も生成しません。

判定時にはMarkdownのコードフェンス、インラインコード、およびJekyllのhighlightタグで囲んだコード例を除外します。そのため、JavaScriptを説明するだけの記事はPDF生成対象のままです。PDFは通常 `/pdf/YYYY/MM/DD/slug.pdf` に生成され、既存記事で `pdf:` にパスを指定している場合はそのパスを維持します。

画像はMarkdown画像記法に加え、リポジトリ内のファイルを参照する `img` タグにも対応します。`src` が `/img/example.png` のようなリポジトリ内パスであり、`alt` 属性を持つ場合、PDFでは共通の画像幅で配置され、`alt` 属性はキャプションとして使われます。SVGはminitypeで直接読めない場合にPNGへ一時変換して配置します。HTMLの `style`、外部URL、data URLはPDFの画像指定には使いません。

現在の実行型19記事には、この判定に基づいて `pdf: false` を設定済みです。新たな実行型記事にも同じ指定を追加してください。

## フックを更新した場合

`setup/pre-commit` を変更した後は、改めて次を実行してローカルフックへ反映します。

```sh
make -C setup install-hook
```
