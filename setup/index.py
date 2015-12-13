#!/usr/bin/env python
import os
import datetime
import dateutil.parser
f = open('../js/index.js', 'w')
f.write('var start = new Date().getTime();\n')
f.write('var data = [')
for i in os.listdir('../_posts'):
  data=open('../_posts/'+i, 'r')
  line=data.readline()
  while ('--' in line):
    line=data.readline()
  while ('--' in line) == False:
    if 'title' in line:
      title=line.rstrip("\n").replace(': ',':').replace('title:','').replace('"','')
    if 'update' in line:
      line=line.rstrip("\n").replace('update:','')
      update=dateutil.parser.parse(line)
    if 'date' in line:
      dt=line.rstrip("\n").replace('date:','')
      date=dateutil.parser.parse(dt)
    line=data.readline()
  f.write('{file:"/')
  f.write(i.replace('-','/',3).replace('.md','').replace('.markdown',''))
  f.write('/",title:"'+title+'",body:"'+title+' ')
  for line in data:
     f.write(line.rstrip("\n").replace('"',' ').replace(':',' '))
  data.close()
  f.write('"},\n')
f.write('];\n')
f.close()

