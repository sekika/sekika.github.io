#!/usr/bin/env python3
import os
import time

format = '%Y-%m-%d %H:%M:%S'

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

f = open('../js/index.js', 'w')
f.write('var start = new Date().getTime();\n')
f.write('var data = [')
for i in os.listdir('../_posts'):
    data=open('../_posts/'+i, 'r')
    line=data.readline()
    update=0
    date=int(time.mktime(time.strptime(i[:10], '%Y-%m-%d')))
    while ('--' in line):
        line=data.readline()
    while ('--' in line) == False:
        if 'title' in line:
            title=line.rstrip("\n").replace(': ',':').replace('title:','').replace('"','')
        if 'update' in line:
            line=line.rstrip("\n").replace('update:','').replace('+0000','').strip()
            update=int(time.mktime(time.strptime(line, format)))
        if 'date' in line:
            line=line.rstrip("\n").replace('date:','').replace('+0000','').strip()
            date=int(time.mktime(time.strptime(line, format)))
        if update==0:
            update=date
        line=data.readline()
    f.write('{file:"/')
    f.write(i.replace('-','/',3).replace('.md','').replace('.markdown',''))
    f.write('/",title:"'+title+'",mtime:'+str(update)+',ctime:'+str(date)+',body:"'+title+' ')
    for line in data:
        f.write(strip_tags(line.rstrip("\n").replace('"',' ')))
    data.close()
    f.write('"},\n')
f.write('];\n')
f.close()
