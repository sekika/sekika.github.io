#!/usr/bin/env python3
# http://sekika.github.io/search/ の index.js を生成するスクリプト
# 生成されたファイル: http://sekika.github.io/js/index.js

# pip3 install markdown

# ファイルの場所指定
post_dir = '../_posts/' # _posts/ ディレクトリ
index = '../js/index.js' # index.js

# date フォーマット (+0000 はスクリプト内で削除)
format = '%Y-%m-%d %H:%M:%S'

# Strip HTML from strings in Python
# http://stackoverflow.com/questions/753052/strip-html-from-strings-in-python
from html.parser import HTMLParser

class MLStripper(HTMLParser):
    def __init__(self):
        self.reset()
        self.strict = False
        self.convert_charrefs= True
        self.fed = []
    def handle_data(self, d):
        self.fed.append(d)
    def get_data(self):
        return ''.join(self.fed)

def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()

# 処理の開始
import os
import time
import markdown
f = open(index, 'w')
f.write('var start = new Date().getTime();\n')
f.write('var data = [')
first=True
for i in os.listdir(post_dir):
    data=open(post_dir+i, 'r')
    line=data.readline()
    date=int(time.mktime(time.strptime(i[:10], '%Y-%m-%d')))
    update=0
    while ('--' in line):
        line=data.readline()
    while ('--' in line) == False:
        if 'title' in line:
            title=line.rstrip("\n").replace('title:','').replace('"','').strip()
        if 'update' in line:
            line=line.rstrip("\n").replace('update:','').replace('+0000','').strip()
            update=int(time.mktime(time.strptime(line, format)))
        if 'date' in line:
            line=line.rstrip("\n").replace('date:','').replace('+0000','').strip()
            date=int(time.mktime(time.strptime(line, format)))
        line=data.readline()
    if update==0:
        update=date
    if first:
        first=False
    else:
        f.write(',\n')
    f.write('{file:"/')
    f.write(i.replace('-','/',3).replace('.md','').replace('.markdown',''))
    f.write('/",title:"'+title+'",mtime:'+str(update)+',ctime:'+str(date)+',body:"'+title+' ')
    for line in data:
        f.write(strip_tags(markdown.markdown(line)).replace("\n",'').replace('"',' ').replace('~~~',''))
    data.close()
    f.write('"}')
f.write('];\n')
f.close()
