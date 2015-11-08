---
layout: post
title: 素因数分解プログラム msieve
tag: math
---
素因数分解をするプログラム msieve は相当に早いということなので、インストールした。

- [Integer Factorization Source Code](http://www.boo.net/~jasonp/qs.html)
- [Sourceforge: Msieve](https://sourceforge.net/projects/msieve/)
- [Msieve の使い方](http://stdkmd.com/nrr/msieve_ja.htm)

Mac で Homebrew を使っていれば、[homebrew/science](https://github.com/Homebrew/homebrew-science/blob/master/README.md) tap に [Formula を入れておいた](https://github.com/Homebrew/homebrew-science/blob/master/msieve.rb) ので、

~~~
brew install homebrew/science/msieve
~~~

で、インストールできる。これで、

~~~
msieve -q 素因数分解したい数
~~~

で、手軽に素因数分解ができるようになった。

ためしに、[レピュニット](https://ja.wikipedia.org/wiki/%E3%83%AC%E3%83%94%E3%83%A5%E3%83%8B%E3%83%83%E3%83%88) R<sub>n</sub> = (10<sup>n</sup> - 1) について、R<sub>100</sub> までの素因数分解をしてみた。```python``` が入っていれば、

~~~
python -c "for i in range(101): print ('1'*i)" | msieve -m -l rep100.txt
~~~

で、```rep100.txt``` に計算結果が保存される。計算は1時間半ほどで終了した。あまり細かいログがいらない時には、
 
~~~
python -c "for i in range(101): print ('1'*i)" | msieve -m -q | grep -v next > rep100.txt
~~~

とすれば、計算結果だけが保存される。たとえば、R<sub>97</sub> の計算結果は

<pre>
1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
p8: 12004721
prp36: 846035731396919233767211537899097169
prp54: 109399846855370537540339266842070119107662296580348039
</pre>

となる。これはつまり、

R<sub>97</sub> = 1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 =
12004721
* 846035731396919233767211537899097169
* 109399846855370537540339266842070119107662296580348039

であることを示している。

ここで、p8 は8桁の素数であることを、prp36 は36桁の「おそらく素数」であることを示している。素数判定には確率的手法を使っているため、prp はまだ素数であることが確定しているわけではない。とはいえ、実際にはかなり素数である確度は高いはずである。

ここに、R<sub>100</sub> までの計算結果を貼っておく。

- [Factorization of repunit up to 100 with msieve](https://gist.github.com/sekika/494c59d12d88655ce951)

レピュニットの素因数分解はこのサイトで計算結果がまとめられている。

- [Factorizations of 11...11 (Repunit)](http://stdkmd.com/nrr/repunit/)
