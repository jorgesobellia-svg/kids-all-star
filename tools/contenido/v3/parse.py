import re, json, sys
SP='/tmp/claude-0/-home-claude/5a1dc8cd-4e70-59e3-964c-a54d3230116f/scratchpad'
src=open(f'{SP}/muse/fus_c.md').read()+'\n\n'+open(f'{SP}/fus13/f_c.md').read()
lines=src.split('\n')
TYPES={'Selección simple':'choice','Verdadero o falso':'tf','Selección con imágenes':'choiceImg','Toca en el campo':'tap','¿Qué cantaría el umpire?':'umpire','Arrastrar':'drag'}
def cells(ln): return [c.strip() for c in ln.strip().strip('|').split('|')]
def para(start):
    # junta líneas hasta línea vacía
    out=[]; i=start
    while i<len(lines) and lines[i].strip(): out.append(lines[i].strip()); i+=1
    return ' '.join(out), i
levels={}; cur=None; lvl=None; i=0
while i<len(lines):
    ln=lines[i]
    m=re.match(r'^# Nivel (\d+) — (.+)',ln)
    if m:
        lvl=int(m.group(1)); intro,_=para(i+2)
        levels[lvl]={'n':lvl,'title':m.group(2).strip(),'intro':intro,'lessons':[],'exam':[]}; cur=None
    m=re.match(r'^### Lección (\d+\.\d+) (.+)',ln)
    if m and lvl:
        cur={'id':m.group(1),'title':m.group(2).strip(),'acts':[]}; levels[lvl]['lessons'].append(cur)
    if ln.startswith('### Examen') and lvl: cur='exam'
    if cur and cur!='exam' and ln.startswith('Objetivo:'):
        t,_=para(i); cur['objective']=t[len('Objetivo:'):].strip()
    if cur and cur!='exam' and ln.startswith('Demostración'):
        t,_=para(i+2); cur['demoRaw']=t
    if ln.startswith('|') and lvl and cur:
        c=cells(ln)
        if c[0].isdigit():
            if cur=='exam' and len(c)==4:
                levels[lvl]['exam'].append({'n':int(c[0]),'q':c[1],'opts':[o.strip() for o in c[2].split(' / ')],'correct':c[3]})
            elif cur!='exam' and len(c)==6:
                fb=c[5].split(' / ',1)
                cur['acts'].append({'n':int(c[0]),'tipo':c[1],'type':TYPES.get(c[1],'?'+c[1]),'q':c[2],'opts':[o.strip() for o in c[3].split(' / ')],'correct':c[4],'right':fb[0].strip(),'wrong':fb[1].strip() if len(fb)>1 else ''})
    if ln.startswith('Al aprobar') and lvl:
        t,_=para(i); levels[lvl]['reward']=t
    i+=1
json.dump(levels,open(f'{SP}/v3/guion.json','w'),ensure_ascii=False,indent=1)
for n,l in levels.items():
    print(n,l['title'],[ (x['id'],len(x['acts'])) for x in l['lessons']], 'exam',len(l['exam']))
    for x in l['lessons']:
        for a in x['acts']:
            if a['type'] in ('drag','tap','choiceImg') or a['type'].startswith('?'): print('   ',x['id'],a['n'],a['type'],'|',a['q'][:90],'|',a['opts'][0][:60],'|',a['correct'][:60])
            if a['type'] in ('choice','umpire','choiceImg','tf') and a['correct'] not in a['opts'] and a['type']!='tf': print('   !! correct not in opts',x['id'],a['n'])
    for e in l['exam']:
        if e['correct'] not in e['opts'] and not e['opts'][0].startswith('—'): print('   !! exam',n,e['n'],e['opts'],e['correct'])
        if e['opts'][0].startswith('—'): print('   exam tap',n,e['n'],e['q'],e['correct'])
