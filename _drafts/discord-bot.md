---
layout: post
title: Discord 簡易ボット
tag: python
---
[Discord](https://ja.wikipedia.org/wiki/Discord) のボットはサーバーに常駐させて使うものが[ほとんど](https://top.gg/)である。常駐させずに、自分宛に特定のメッセージを送る、あるいは自分が管理するサーバー内のチャンネルに投稿する、といった動作をして、終わったらログアウトする簡易ボットを作成した。

定期的に [crontab](https://ja.wikipedia.org/wiki/Crontab) で実行するプログラム内で、実行結果を送信するような場合に便利である。

## 準備

通常のボットと同様に、以下の準備が必要となる。

- [ボットアカウントを作成](https://discordpy.readthedocs.io/en/stable/discord.html)し、トークンを取得する。トークンを公開してはならない。
- サーバーのチャンネルに投稿する場合には、サーバーに招待する。
- `python3 -m pip install -U discord.py` によって [discord.py](https://pypi.org/project/discord.py/) を読み込む。

次のモジュールを `espresso.py` という名前で保存する。

{% gist aff133b238bdfb8ebc1e67ec89bf7f44 %}

## 実行方法

以下の Python コードで、ユーザーID `user_id`（int 型）宛に「やっほー」というメッセージを送信し、チャンネル ID `channel_id`（int 型）宛に「こんにちは！」という投稿をする。

- `token`（str 型）にはボットのトークンを入れる。プログラムを共有する場合にはトークンを共有しないように別ファイルで管理するなどの注意をする。
- `path`（str 型）は`espresso.py` が保存されているディレクトリである。同じディレクトリに入れる場合には最初の2行は不要である。

```python
import sys
sys.path.append(path)
import espresso
client = espresso.Client()
client.send_dm(user_id, 'やっほー')
client.send_channel(channel_id, 'こんにちは！')
client.run(token)
```

client.send_dm と client.send_channel はそれぞれ何回実行しても良いが、client.run(token) で投稿をした後は同じプログラム内では投稿できなくなる。
