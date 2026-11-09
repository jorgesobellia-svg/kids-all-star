import json,sys,re
g=json.load(open('/tmp/claude-0/-home-claude/5a1dc8cd-4e70-59e3-964c-a54d3230116f/scratchpad/v3/guion.json'))
n=sys.argv[1]; l=g[n]
print('TITLE',l['title']); print('INTRO',l['intro'])
for x in l['lessons']:
    print('\n##',x['id'],x['title']); print('OBJ',x['objective']); print('DEMO',x['demoRaw'])
    for a in x['acts']:
        print(f"{a['n']} [{a['type']}] Q: {a['q']} | O: {' / '.join(a['opts'])} | C: {a['correct']} | OK: {a['right']} | KO: {a['wrong']}")
print('\n## EXAM')
for e in l['exam']: print(f"{e['n']} Q: {e['q']} | O: {' / '.join(e['opts'])} | C: {e['correct']}")
