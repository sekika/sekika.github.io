---
layout: post
title: よく読まれている記事 (2025年)
tags:
- jekyll
- rank
---
当サイト（sekika.github.io がホストするページ）でよく読まれている記事の一覧です。[Google アナリティクス](https://ja.wikipedia.org/wiki/Google_Analytics)による2025年のアクセストップ40です。

1. [Sudoku books](https://sekika.github.io/kaidoku/book)
2. [Word で数式に式番号を付ける方法](/2023/03/09/WordEquation/) 2023年03月09日
3. [Seki's note トップページ](https://sekika.github.io/)
4. [15パズル](/2020/01/17/15Puzzle/) 2020年01月17日
5. [ナンプレ問題集](https://sekika.github.io/kaidoku/ja/book)
6. [Excel の計算における空白セルの処理](/2015/11/02/blank-cell/) 2015年11月02日
7. [リブレによる血糖値の連続測定](/2023/01/03/Libre/) 2023年01月03日
8. [Sudoku Kaidoku](https://sekika.github.io/kaidoku/sudoku/)
9. [ターミナルからファイルを開く](/2015/10/27/open-command/) 2015年10月27日
10. [取り消し線](/2021/09/08/StrikeThrough/) 2021年09月08日
11. [Google 認証システムの仕組み](/2016/03/26/GoogleAuthenticator/) 2016年03月26日
12. [Excel でデータの間引き](/2015/10/11/excel-mabiki/) 2015年10月11日
13. [環境の科学参考サイト](https://sekika.github.io/toyo/kankyo/suzuki.html)
14. [四大公害の比較](https://sekika.github.io/toyo/kankyo/pollution/4big.html)
15. [Kaidoku / Player, solver and creater of sudoku puzzles](https://sekika.github.io/kaidoku/)
16. [Canvas のマウスとタッチのイベントを表示するプログラム](/2020/01/07/CanvasEvent/) 2020年01月07日
17. [解独 - 数独・ナンプレの解析プログラム](https://sekika.github.io/kaidoku/ja/)
18. [FFmpegによる動画のアスペクト比変換](/2021/04/22/aspect/) 2021年04月22日
19. [EPSファイルの作成方法](/2015/10/18/eps-fig/) 2015年10月18日
20. [UNSODA viewer](https://sekika.github.io/unsoda/)
21. [unsatfit / Fitting functions of soil hydraulic properties](https://sekika.github.io/unsatfit/)
22. [Match equity calculator](/2025/01/13/MatchEquity/) 2025年01月13日
23. [関 勝寿 (東洋大学)](https://sekika.github.io/toyo/)
24. [難易度レベル別に問題を選ぶ](https://sekika.github.io/kaidoku/ja/level)
25. [使われている解法](https://sekika.github.io/kaidoku/ja/logic)
26. [macOS で zip 圧縮・展開するときの文字化け対処法](/2016/03/25/MacZip/) 2016年03月25日
27. [LaTeX の数式を Word に貼り付ける方法](/2017/02/09/Equation/) 2017年02月09日
28. [macOS 起動オプション](/2017/09/27/bootMac/) 2017年09月27日
29. [Seki's note](https://sekika.github.io/en/)
30. [ドイツのペットボトルリサイクル](https://sekika.github.io/toyo/photo/germany/pfand/index.html)
31. [GitHub リポジトリに大量のファイルを一括登録する方法](/2016/06/03/github-many-files/) 2016年06月03日
32. [Sudoku Kaidoku](https://sekika.github.io/kaidoku/app)
33. [Matplotlib で日本語のグラフを作成する](/2023/03/11/pyplot-japanese/) 2023年03月11日
34. [Word の校閲者名を統一する方法](/2015/10/20/word-author/) 2015年10月20日
35. [マークダウンと Word による論文執筆方法](/2024/05/31/MarkdownToWord/) 2024年05月31日
36. [室内空気の二酸化炭素濃度](/2022/06/21/room-co2/) 2022年06月21日
37. [Sample code of unsatfit / unsatfit](https://sekika.github.io/unsatfit/code.html)
38. [ナンプレ解独](https://sekika.github.io/kaidoku/ja/app)
39. [ブラウザで Python が動くよ](/2022/08/18/Pyodide/) 2022年08月18日
40. [関 勝寿 (Katsutoshi Seki) - マイポータル - researchmap](https://researchmap.jp/sekik/)

2025年の1年間で、総ページビュー数 109301、そのうちでトップ5の割合が47%、トップ10の割合が67%、トップ20の割合が80%、トップ40の割合が89%でした。[これまでのアクセス集計記事](/tags/rank/)。

総ページビュー数の年変化をグラフにしてみました。2025年のアクセスが少ないのは、今年度は国内研究で授業をしていないため、授業の履修者からのアクセスがないことが影響をしているかもしれません。

<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<div id="myChart" style="width: min(100%, 800px);"></div>
<script>
const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
const access = [75106, 82993, 87487, 76413, 153787, 182269, 109301];
const trace = {x: years, y: access, type: 'bar'};
const layout = {
    title: 'Annual page view',
    xaxis: { title: 'Year' },
    yaxis: { title: 'Access', range: [0, Math.max(...access) * 1.1] }
};
Plotly.newPlot('myChart', [trace], layout);
</script>
