#!/usr/bin/env python3
#
# 文科省の学校保健統計調査について、
# https://www.mext.go.jp/b_menu/toukei/chousa05/hoken/1268826.htm
# 指定した年次の「身長の年齢別分布」と「体重の年齢別分布」をそれぞれダウンロードして、
# 指定した年齢の標準化されたデータの正規分布と対数正規分布と比較するグラフを描く
#
# 使い方は -h オプションで起動
#
# Author: Katsutoshi Seki
# License: MIT License
#
import numpy as np
import pandas as pd

# 日本語フォントのパスを設定
# 詳しくは https://sekika.github.io/2023/03/11/pyplot-japanese/
FONT_PATH = '~/git/env/lib/font/otf/HiraKakuProN-W4-AlphaNum-02.otf'
START_YEAR = 2006  # この年以降のデータに対応


def main():
    import argparse
    from datetime import datetime
    import importlib.util
    import matplotlib.pyplot as plt
    from pathlib import Path
    import os
    import sys
    font_path = os.path.expanduser(FONT_PATH)
    if not Path(font_path).exists():
        print('日本語フォントファイルがありません。')
        print('https://sekika.github.io/2023/03/11/pyplot-japanese/ を参考に、')
        print(f'{Path(__file__).resolve()} の\nFONT_PATH に日本語フォントファイルのパスを設定してください。')
        sys.exit()
    current_year = datetime.now().year
    parser = argparse.ArgumentParser(description='学校保健統計調査の身長体重データ解析')
    parser.add_argument('-y', '--year', type=int, default=current_year - 2,
                        help=f'解析する年（西暦、{START_YEAR}年以降、デフォルトは2年前）')
    parser.add_argument('-a', '--age', type=int, default=17,
                        help='年齢（デフォルトは17）')
    parser.add_argument('-e', '--ext', nargs='?', const='help', default='png',
                        help='図のファイルの拡張子（デフォルトはsvg, -e のみで一覧表示）')
    parser.add_argument('-b', '--black', action='store_true',
                        help='白黒の図を生成')
    parser.add_argument('-k', '--kolmogorov', action='store_true',
                        help='Kolmogorov-Smirnov検定のp値をグラフに表示')
    args = parser.parse_args()
    supported_formats = plt.gcf().canvas.get_supported_filetypes()
    if args.ext not in supported_formats:
        print(f'対応する図のファイル形式（拡張子）は以下の通りです。')
        for extension, description in supported_formats.items():
            print(f"{extension}: {description}")
        sys.exit()
    year = args.year
    if year < START_YEAR:
        print(f'{START_YEAR - 1}年以前のデータ形式には対応していません。')
        sys.exit()
    if year < 2013 and not importlib.util.find_spec('xlrd'):
        print('Python の xlrd パッケージをインストールしてから実行してください。')
        sys.exit()
    if year < 2019:
        args.gengou = f'h{year - 1988}'
    else:
        args.gengou = f'r{year - 2018}'
    for label in ['身長', '体重']:
        get_file(args)
        num = {'身長': '02', '体重': '03'}[label]
        ext = 'xlsx' if args.year > 2012 else 'xls'
        file_path = f'{args.gengou}_hoken_tokei_{num}.{ext}'
        for sex in ['男', '女', '男女']:
            measure, weights = load_data(file_path, label, sex, args)
            plot_normal(measure, weights, label, sex, args)
            plot_lognormal(measure, weights, label, sex, args)


def get_file(args):
    from pathlib import Path
    import requests
    from bs4 import BeautifulSoup
    import sys
    ext = 'xlsx' if args.year > 2012 else 'xls'
    file_height = f'{args.gengou}_hoken_tokei_02.{ext}'
    file_weight = f'{args.gengou}_hoken_tokei_03.{ext}'
    if Path(file_height).exists() and Path(file_weight).exists():
        return
    url = f'https://www.e-stat.go.jp/stat-search/files?page=1&toukei=00400002&tstat=000001011648&year={args.year}1&metadata=1&data=1'
    response = requests.get(url)
    if response.status_code != 200:
        print(f'e-Stat にアクセスできませんでした: {response.status_code}')
        sys.exit()
    soup = BeautifulSoup(response.content, 'html.parser')
    body = soup.body
    span_tags = body.find_all('span')
    target_span = None
    for span in span_tags:
        if "全国表" in span.get_text():
            target_span = span
            break
    if target_span:
        inner_span = target_span.find('span', attrs={'data-value': True})
        if inner_span:
            data_value = inner_span.get('data-value')
        else:
            print('Inner span with data-value not found')
            sys.exit()
    else:
        print('データが見つかりませんでした。')
        sys.exit()
    url = f'https://www.e-stat.go.jp/stat-search/files?page=1&layout=datalist&toukei=00400002&tstat={data_value}&cycle=0&year={args.year}1&tclass3val=0'
    response = requests.get(url)
    if response.status_code != 200:
        print(f'tstat={data_value} にアクセスできませんでした: {response.status_code}')
        sys.exit()
    soup = BeautifulSoup(response.content, 'html.parser')
    body = soup.body
    if not Path(file_height).exists():
        id = get_id(body, '身長の年齢別分布')
        url = f'https://www.e-stat.go.jp/stat-search/file-download?statInfId={id}&fileKind=0'
        response = requests.get(url)
        if response.status_code == 200:
            with open(file_height, 'wb') as f:
                f.write(response.content)
            print(f'ダウンロード完了: {file_height}')
        else:
            print(f'ダウンロード失敗: {response.status_code}')
            sys.exit()
    if not Path(file_weight).exists():
        id = get_id(body, '体重の年齢別分布')
        url = f'https://www.e-stat.go.jp/stat-search/file-download?statInfId={id}&fileKind=0'
        response = requests.get(url)
        if response.status_code == 200:
            with open(file_weight, 'wb') as f:
                f.write(response.content)
            print(f'ダウンロード完了: {file_weight}')
        else:
            print(f'ダウンロード失敗: {response.status_code}')
            sys.exit()


def get_id(body, string):
    from urllib.parse import urlparse, parse_qs
    import sys
    a_tags = body.find_all('a')
    target_a = None
    for a in a_tags:
        if string in a.get_text():
            target_a = a
            break
    if target_a and 'href' in target_a.attrs:
        url = target_a['href']
        query_params = parse_qs(urlparse(url).query)
        stat_infid = query_params.get('stat_infid', [None])[0]
        return stat_infid
    print(f"{string}の場所がわかりませんでした")
    sys.exit()


def preprocess_data(data, args):
    if args.year < 2021:
        age_column = f'{convert_to_fullwidth(args.age)}歳'
    else:
        age_column = f'{args.age}歳'
    data.columns = data.iloc[0]
    data = data[1:].reset_index(drop=True)
    if args.year < 2021:
        data.rename(columns={data.columns[1]: '区分'}, inplace=True)
    data = data[['区分', age_column]].dropna()
    data = data[~data['区分'].astype(str).str.contains('合計|計|注|～')]
    if args.year > 2020:
        data.loc[:, '区分'] = data['区分'].str.replace(
            'cm', '').str.replace('kg', '').astype(float)
    for col in data.columns:
        data.loc[:, col] = pd.to_numeric(data[col], errors='coerce')
    data = data.dropna()
    data = data[(data.iloc[:, 1:] > 0).all(axis=1)]
    data.rename(columns={age_column: '分布'}, inplace=True)
    return data


def convert_to_fullwidth(num):
    num_str = str(num)
    half_to_full = {
        '0': '０', '1': '１', '2': '２', '3': '３', '4': '４',
        '5': '５', '6': '６', '7': '７', '8': '８', '9': '９'
    }
    fullwidth_str = ''.join(half_to_full[char] for char in num_str)
    return fullwidth_str


def load_data(file_path, label, sex, args):
    num = {'身長': '2', '体重': '3'}[label]
    sheet_names = pd.ExcelFile(file_path).sheet_names
    for s in sheet_names:
        if f'0{num}-001' in s:
            sheet_male = s
        if f'0{num}-002' in s:
            sheet_female = s
    if sex == '男':
        data = pd.read_excel(
            file_path, sheet_name=sheet_male, header=None, skiprows=4)
        data = preprocess_data(data, args)
    elif sex == '女':
        data = pd.read_excel(
            file_path, sheet_name=sheet_female, header=None, skiprows=4)
        data = preprocess_data(data, args)
    elif sex == '男女':
        data_male = pd.read_excel(
            file_path, sheet_name=sheet_male, header=None, skiprows=4)
        data_female = pd.read_excel(
            file_path, sheet_name=sheet_female, header=None, skiprows=4)
        data_male = preprocess_data(data_male, args)
        data_female = preprocess_data(data_female, args)
        # 両方のデータを連結し、数値列だけを合計
        data = pd.concat([data_male, data_female])
        data = data.groupby('区分', as_index=False).sum().reset_index(drop=True)
    else:
        raise ValueError("性別は '男', '女', '男女' のいずれかで指定してください。")
    # データが空でないことを確認
    if data.empty:
        raise ValueError(f"{sex}{args.age}歳のデータがありません。")
    # 身長データと重みを抽出
    measure = data['区分'].astype(float)
    weights = data['分布'].astype(float)
    return measure, weights


def plot_figure(bin_centers, hist_density, bin_width, xlabel, file_name, args):
    import os
    import matplotlib.pyplot as plt
    from matplotlib.font_manager import FontProperties
    from scipy import stats
    assert abs(np.sum(hist_density * bin_width) - 1) < 1e-12
    plt.figure(figsize=(4.5, 3))
    plt.subplots_adjust(left=0.13, right=0.98, top=0.98, bottom=0.17)
    if args.black:
        color = ['grey', 'black']
    else:
        color = ['blue', 'red']
    plt.bar(bin_centers, hist_density, width=bin_width,
            alpha=0.6, color=color[0], label='測定値')
    fp = FontProperties(fname=os.path.expanduser(FONT_PATH))

    # 標準正規分布のプロット
    x = np.linspace(-4, 4, 100)
    p = stats.norm.pdf(x, 0, 1)
    plt.plot(x, p, color[1], linestyle="dashed",
             alpha=0.6, linewidth=2, label='標準正規分布')
    plt.grid(True)

    # 歪度と尖度の計算（標準化されているので平均0分散1）
    w = hist_density * bin_width
    total = np.sum(w)
    skewness = np.sum(w * (bin_centers**3)) / total
    kurt = np.sum(w * (bin_centers**4)) / total - 3

    # Kolmogorov-Smirnov検定
    if args.kolmogorov:
        data = np.repeat(bin_centers, np.round(w * 1000).astype(int))
        stat, p_value = stats.kstest(data, 'norm')

    cdf = np.cumsum(hist_density * bin_width)
    def cdf_sigma(sigma):
        index = np.searchsorted(bin_centers, sigma)
        if index == 0:
            return 0
        if index == len(cdf):
            return 1
        # cdf[index-1] と cdf[index] の間の
        # sigma - bin_centers[index-1] : (bin_centers[index] - sigma) の
        # 内分点を計算する
        w = bin_centers[index] - bin_centers[index-1]
        c = cdf[index-1] * (bin_centers[index] - sigma) / w + cdf[index] * (sigma - bin_centers[index-1]) / w
        # print(f'{bin_centers[index-1]:.5} {sigma} {bin_centers[index]:.5}')
        # print(f'{cdf[index-1]:.5} {c:.5} {cdf[index]:.5}')
        return c
    def prob_sigma(sigma):
        return cdf_sigma(sigma) - cdf_sigma(-sigma)
    def display_prob(sigma):
        return rf'$\pm {sigma} \sigma$: {prob_sigma(sigma) * 100:.2f}%'

    # 歪度と尖度をグラフに表示
    textstr = f'歪度: {skewness:.2f}\n尖度: {kurt:.2f}'
    if args.kolmogorov:
        textstr += f'\np = {p_value:.4f}'
    props = dict(boxstyle='round', facecolor='white')
    plt.gcf().text(0.75, 0.6 if args.kolmogorov else 0.65, textstr, fontproperties=fp, bbox=props)
    textstr = f'{display_prob(1)}\n{display_prob(2)}\n{display_prob(3)}'
    plt.gcf().text(0.17, 0.77, textstr, fontproperties=fp, bbox=props)

    # x軸の範囲を設定
    plt.xlim(-4, 4)

    # y軸の最小値を0に設定
    plt.ylim(0, None)

    # グラフのラベル
    plt.xlabel(f'{xlabel}', fontproperties=fp)
    plt.ylabel('確率密度', fontproperties=fp)
    plt.legend(prop=fp)

    # 結果をファイルに保存
    plt.savefig(file_name)
    plt.close()
    print(f'図ができました: {file_name}')


def plot_normal(measure, weights, label, sex, args):
    # 重み付き平均と標準偏差を計算（通常の正規分布）
    mean_measure = np.average(measure, weights=weights)
    std_measure = np.sqrt(np.average(
        (measure - mean_measure)**2, weights=weights))

    display_measure = measure - 0.5
    standardized_display_height = (
        display_measure - mean_measure) / std_measure

    # 確率密度にするために重みを調整（通常の正規分布）
    density = weights / weights.sum()

    # ヒストグラムのプロット（確率密度）をバーで表示（通常の正規分布）
    bin_edges = np.sort(standardized_display_height)
    bin_centers = 0.5 * (bin_edges[1:] + bin_edges[:-1])
    hist, _ = np.histogram(standardized_display_height,
                           bins=bin_edges, weights=density)

    # ビンの幅を計算
    bin_widths = np.diff(bin_edges)

    # 高さをビンの幅で割って正規化
    hist_density = hist / bin_widths
    unit = {'身長': 'cm', '体重': 'kg'}[label]
    xlabel = rf'{sex}{args.age}歳の標準化された{label} ($\mu$={mean_measure:.2f}{unit}, $\sigma$={std_measure:.2f}{unit})'
    file_suffix = 'm' if sex == '男' else 'f' if sex == '女' else 'mf'
    f = {'身長': 'height', '体重': 'weight'}[label]
    file_name = f'{f}-{args.year}-{file_suffix}{args.age}.{args.ext}'
    plot_figure(bin_centers, hist_density, bin_widths, xlabel, file_name, args)


def plot_lognormal(measure, weights, label, sex, args):
    # 身長データの対数変換
    measure = measure[measure > 0].astype(float)  # ゼロ以上の値を除去し、floatに変換
    log_measure = np.log(measure)

    # 重み付き平均と標準偏差を計算（対数正規分布）
    mean_log_measure = np.average(log_measure, weights=weights[measure.index])
    std_log_measure = np.sqrt(np.average(
        (log_measure - mean_log_measure)**2, weights=weights[measure.index]))

    display_measure = measure - 0.5
    log_display_measure = np.log(display_measure[display_measure > 0])
    standardized_log_display_measure = (
        log_display_measure - mean_log_measure) / std_log_measure

    # 標準化された対数データをエッジとして設定
    log_bins = np.sort(standardized_log_display_measure)
    bin_centers = 0.5 * (log_bins[1:] + log_bins[:-1])
    hist, _ = np.histogram(standardized_log_display_measure,
                           bins=log_bins, weights=weights[measure.index] / weights.sum())

    # ビンの幅を計算
    bin_widths = np.diff(log_bins)

    # 高さをビンの幅で割って正規化
    hist_density = hist / bin_widths

    unit = {'身長': 'cm', '体重': 'kg'}[label]
    xlabel = rf'{sex}{args.age}歳の標準化されたlog[{label}] ($e^\mu$={np.exp(mean_log_measure):.2f}{unit}, $e^\sigma$={np.exp(std_log_measure):.3f})'
    file_suffix = 'm' if sex == '男' else 'f' if sex == '女' else 'mf'
    f = {'身長': 'height', '体重': 'weight'}[label]
    file_name = f'{f}-{args.year}-{file_suffix}{args.age}-log.{args.ext}'
    plot_figure(bin_centers, hist_density, bin_widths, xlabel, file_name, args)


if __name__ == "__main__":
    main()
