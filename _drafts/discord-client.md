---
layout: post
title: Discord 簡易ボット
tag: python
---
Discord の ボットはサーバーに常駐して動かすものがほとんどである。サーバーに常駐せずに、サーバーに入って特定のメッセージを自分宛にDMで送る、あるいは自分が管理するサーバー内のチャンネルに投稿する、といった動作をして、終わったらサーバーから抜ける簡易ボットを作成した。

## 準備

通常の Discord bot と同様に、以下の準備が必要となる。

- [bot アカウントの作成](https://discordpy.readthedocs.io/en/stable/discord.html)とトークンの取得
- サーバーのチャンネルに投稿する場合には、サーバーに招待する。
- `python3 -m pip install -U discord.py` によって [discord.py](https://pypi.org/project/discord.py/) を読み込む。

次のモジュールを espresso.py という名前で保存する。

{% gist aff133b238bdfb8ebc1e67ec89bf7f44 %}

## 実行方法

以下の Python コードで、ユーザーID `user_id` 宛に「ダイレクトメッセージ」というメッセージを送信し、チャンネル ID `channel_id` 宛に「ポスト」というポストをする。

- `token` にはボットのトークンを入れておく。
- `path` は、espresso.py が保存されているディレクトリである。同じディレクトリに入れる場合には最初の行は不要である。

```
sys.path.append(path)
import espresso
client = espresso.Client()
client.send_dm(user_id, 'ダイレクトメッセージ')
client.send_channel(channel_id, 'ポスト')
client.run(token)
```
