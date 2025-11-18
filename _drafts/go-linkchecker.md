---
layout: post
title: Go で作るリンクチェッカーの仕組み
tag: go
---
Web サイトのリンクチェックを自動化するには、多数の URL を効率よく処理しつつ、アクセス先に負荷をかけない工夫が必要になります。[Go](https://ja.wikipedia.org/wiki/Go_(%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0%E8%A8%80%E8%AA%9E)) は goroutine とチャネルを用いた並列処理を得意としており、この仕組みを使うことでリンクチェックも高速化できます。

しかし、単に並列化すると同じホストに短時間で大量アクセスしてしまい、相手サーバーに迷惑をかける可能性があります。そこで今回紹介するリンクチェッカーのコードでは、**ホストごとに専用のワーカー（goroutine）を割り当て、同じホストには一定間隔を空けてアクセスする**という仕組みを実装しています。

この記事では、このアクセス制御をどのように実現しているのか、`FetchHTTP` と `RunWorkers` の2つの関数を解説します。

## FetchHTTP：実際に GET してステータスを調べる関数

```go
func FetchHTTP(link string, client *http.Client, userAgent string) error {
	req, err := http.NewRequest("GET", link, nil)
	if err != nil {
		return err
	}
	req.Header.Set("User-Agent", userAgent)
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		return fmt.Errorf("status %d", resp.StatusCode)
	}
	return nil
}
```

* GET を送る
* User-Agent を設定
* ステータスコードでエラーを返す

という **シンプルな HTTP アクセス関数**です。

## RunWorkers：ホストごとにワーカーを作り、リンクを処理する

ここからが全体の中心になる関数です。

```go
func RunWorkers(
	links []string,
	baseURL string,
	timeoutSec int,
	waitSec int,
	userAgent string,
) {
```

### 1. リンクの変換

まずは relative URL の解決を行います。ここで、除外するホストを指定するといった処理を入れることも可能です。

```go
base, _ := url.Parse(baseURL)
filteredLinks := []string{}

for _, link := range links {
	u, err := base.Parse(link)
	if err != nil {
		continue
	}

	filteredLinks = append(filteredLinks, u.String())
}
```

### 2. ホストごとのチャネルを保持する map を用意

```go
hostQueues := make(map[string]chan string)
var mu sync.Mutex
var wg sync.WaitGroup
```

ここで、ホストごとの専用キュー（channel）を入れていく **map** を用意します。

### 3. リンクを1件ずつ処理し、ホストごとにワーカーを作る

重要なループがこれです。

```go
for _, link := range filteredLinks {
	u, _ := url.Parse(link)
	host := u.Host
```

この `for` 文は、

* すべてのリンクを 1 行ずつ取り出す
* そのリンクのホスト名（例：example.com）を取り出す

という処理を行っています。

このあとに、**そのホスト専用のチャネルとワーカーが必要かどうか判定する処理**が続きます。

#### 3-1. ホスト用のキューが無いなら作る

```go
	mu.Lock()
	if _, ok := hostQueues[host]; !ok {
		hostQueues[host] = make(chan string, 100)
		ch := hostQueues[host]
```

この `if` 文は **for の中にあり**、
つまり **リンクごとに毎回「このホストのキューは作り済みか？」をチェックしている** ことになります。

新しいホストなら：

* 新しいチャネルを作成
* そのチャネルを処理するワーカー goroutine を起動

という流れになります。

#### 3-2. ワーカー goroutine の起動（ホストごとに1つだけ）

```go
		wg.Add(1)
		go func(host string, ch chan string) {
			defer wg.Done()
			client := &http.Client{Timeout: time.Duration(timeoutSec) * time.Second}
			for l := range ch {
				err := FetchHTTP(l, client, userAgent)
				if err != nil {
					log.Printf("[NG] %s (%v)\n", l, err)
				} else {
					log.Printf("[OK] %s\n", l)
				}
				time.Sleep(time.Duration(waitSec) * time.Second)
			}
		}(host, ch)
	}
	mu.Unlock()
```

この goroutine は、**そのホストに属するリンクだけ**を順番に処理します。

`for l := range ch` により、チャネルが閉じられるまで動作します。

そして、各アクセスの後には必ず

```
time.Sleep(waitSec)
```

を入れることで、**同一ホストへのアクセス間隔があく**ようになっています。

#### 3-3. 作成済みの（または前に作った）ホスト用チャネルにリンクを送る

```go
	hostQueues[host] <- link
}
```

この部分も for の一部で、
「今扱っているリンクを、対応するホストのチャネルへ入れる」
という動作になっています。

### 4. 全チャネルを閉じてワーカーの終了を待つ

```go
for _, ch := range hostQueues {
	close(ch)
}

wg.Wait()
```

チャネルを閉じることで、ワーカー側の

```
for l := range ch
```

が終わり、各 goroutine が終了します。

### 全体構造をまとめると

1. まず URL リストをフィルタする
2. `for _, link := range filteredLinks` のループが始まる
3. ループの中で
   * ホスト名を取得
   * そのホストのキューが map に無ければ作る
   * 対応するチャネルにリンクを送る
4. ループがすべて終わったらチャネルを閉じる
5. ワーカーが終わるまで待つ

という流れになっています。

## おわりに
以上は、AIが書いたプログラムをAIに解説させたものです。AI にプログラムを書かせて動くことを確認し、その解説文を AI に書かせて（分かりにくいところは何度か書き直させて）それをブログに掲載し、それを読んで自分が理解するというAIに依存したプログラミング言語の学習法です。このプログラムは[授業で使っているリンク集](https://sekika.github.io/toyo/kankyo/suzuki.html)のリンク切れをチェックするために、実際に使っています。
