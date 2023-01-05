#!/usr/bin/env python3
import json
import glob
js = {}
def num(str):
    ret = float(str)
    if int(ret) == ret:
        return int(ret)
    return ret
for f in glob.glob('*.json'):
    key = f.split('.')[0]
    if key == 'unsoda':
        continue
    j = json.load(open(f, 'r'))
    if ('lab_' in key or 'field_' in key or 'size' in key) and 'comment' not in key:
        k = {}
        code, x, y = list(j[0].keys())
        assert code == 'code'
        for i in j:
            if i[x] != '':
                if i[code] in k:
                    k[i[code]].append([num(i[x]),num(i[y])])
                else:
                    k[i[code]] = [[num(i[x]),num(i[y])]]
        kk = {}
        for i in k:
            kk[i] = [list(x) for x in zip(*k[i])]
        j = kk
    elif 'code' in j[0]:
        k = {}
        for i in j:
            k[i['code']] = i
        j = k
    if 'comment' in key or key in ['contact_person', 'publication']:
        index, value = list(j[0].keys())
        assert 'ID' in index
        k = {}
        for i in j:
            k[i[index]] = i[value]
        j = k
    if key == 'only_codes':
        k = []
        for i in j:
            k.append(i['codes'])
        k.sort()
        key = 'code'
        j = k
    js[key] = j
assert js['general']['4960']['location'] == 'Oso Flaco, CA, USA'
assert js['comment_general']['212'] == '2 mm sieved air-dried soil'
assert js['publication']['82'][:14] == 'Vachaud et al.'
assert js['lab_drying_h-k']['4800'][1][10] == 0.053
assert js['particle_size']['4661'][1][4] == 0.21
assert len(js['code']) == 790
with open('unsoda.json', 'w') as f:
    json.dump(js, f)
