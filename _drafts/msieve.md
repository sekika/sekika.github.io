---
layout: post
title: 素因数分解プログラム msieve
tag: math
---
素因数分解をするプログラム msieve は相当に早いということなので、インストールした。

- [Integer Factorization Source Code](http://www.boo.net/~jasonp/qs.html)
- [Sourceforge: Msieve](https://sourceforge.net/projects/msieve/)
- [Msieve の使い方](http://stdkmd.com/nrr/msieve_ja.htm)

ソースをダウンロードして、```make all```でコンパイル。```make``` とすると、

<pre>
to build:
make all
add 'WIN=1 if building on windows
add 'ECM=1' if GMP-ECM is available (enables ECM)
add 'CUDA=1' for Nvidia graphics card support
add 'MPI=1' for parallel processing using MPI
add 'BOINC=1' to add BOINC wrapper
add 'NO_ZLIB=1' if you don't have zlib
</pre>

のようにオプションが表示される。Mac では、特にオプションを指定しないでもコンパイルできた。```make install``` はないので、パスが通っているところに ```msieve``` をコピーしておく。

ためしに、[レピュニット](https://ja.wikipedia.org/wiki/%E3%83%AC%E3%83%94%E3%83%A5%E3%83%8B%E3%83%83%E3%83%88) R<sub>100</sub> までの素因数分解を計算してみた。計算は1時間半ほどで終了した。```python``` が入っていれば、

~~~
python -c "for i in range(101): print ('1'*i)" | msieve -m -l rep100.txt
~~~

で、```rep100.txt``` に計算結果が保存される。あまり細かいログがいらない時には、
 
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

となる。ここで、p8 は8桁の素数であることを、prp36 は36桁の「おそらく素数」を示している。素数判定が確率的手法を使っているためであり、実際にはかなり素数である確度は高いはずである。

なお、レピュニットの素因数分解はこのサイトで計算結果がまとめられている。

- [Factorizations of 11...11 (Repunit)](http://stdkmd.com/nrr/repunit/)


