import re,base64,sys
d,out=sys.argv[1],sys.argv[2]
html=open(f'{d}/index.html').read()
srcs=re.findall(r'<script src="(/_expo/[^"]+)" defer></script>',html)
FONTS=['Barlow_500Medium','Barlow_600SemiBold','Barlow_700Bold','Barlow_800ExtraBold','BarlowCondensed_700Bold','BarlowCondensed_800ExtraBold']
def data(path,mime): return 'data:%s;base64,%s'%(mime,base64.b64encode(open(d+path,'rb').read()).decode())
js=[]
for s in srcs:
    code=open(d+s).read()
    for f in FONTS:
        for m in set(re.findall(r'"(/assets/node_modules/@expo-google-fonts/[^"]*/%s\.[a-f0-9]+\.ttf)"'%f, code)):
            code=code.replace('"'+m+'"','"'+data(m,'font/ttf')+'"')
    for m in set(re.findall(r'"(/assets/assets/sfx/[^"]+\.wav)"',code)):
        code=code.replace('"'+m+'"','"'+data(m,'audio/wav')+'"')
    js.append(code.replace('</script','<\\/script'))
boot="<script>try{if(location.pathname!=='/'){history.replaceState(null,'','/'+location.search)}}catch(e){}</script>"
page=('<title>Kids All Star</title>\n<style>html,body{background:#0C2340;color-scheme:light;height:100%} body{margin:0;overflow:hidden} #root{display:flex;height:100%;flex:1}</style>\n'
      '<div id="root"></div>'+boot+''.join(f'<script>{c}</script>' for c in js))
open(out,'w').write(page)
print(round(len(page)/1e6,2),'MB')
