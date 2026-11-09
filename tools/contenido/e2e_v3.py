import asyncio, json, sys
from playwright.async_api import async_playwright

OUT = sys.argv[1]
LANG = sys.argv[2] if len(sys.argv) > 2 else 'es'
URL = sys.argv[3] if len(sys.argv) > 3 else 'http://localhost:8081/'
LVN = int(sys.argv[4]) if len(sys.argv) > 4 else 3
LV = json.load(open('/tmp/claude-0/-home-claude/5a1dc8cd-4e70-59e3-964c-a54d3230116f/scratchpad/levels.json'))[LVN - 1]
content = json.load(open(f'/home/claude/kids-all-star/src/i18n/locales/{LANG}/content.json'))
ui = json.load(open(f'/home/claude/kids-all-star/src/i18n/locales/{LANG}/ui.json'))
RIGHT = ui['lesson']['rightName'].replace('{name}', 'Prueba2')
POS = {'first': (250, 192), 'second': (180, 122), 'third': (110, 192), 'home': (180, 262), 'infield': (180, 170),
       'backstop': (240, 292), 'track': (180, 34), 'lane': (240, 212), 'bullpen': (322, 172), 'cutoff': (180, 92), 'path12': (215, 157), 'foulLine': (60, 135),
       'run-first': (250, 192), 'run-second': (180, 122), 'run-third': (110, 192), 'run-lead1': (232, 174), 'run-lead2': (160, 140),
       'run-mid12': (215, 157), 'run-mid23': (145, 157), 'run-past1': (270, 174), 'run-past2': (162, 104),
       'fld-path12': (215, 157), 'fld-mid12': (215, 157), 'run-mid3h': (145, 227), 'run-hole56': (128, 118), 'anyOF': (180, 54),
       'mound': (180, 194), 'posC': (180, 284), 'pos1b': (244, 166), 'pos2b': (216, 140), 'posSS': (144, 140),
       'pos3b': (116, 166), 'posLF': (82, 96), 'posCF': (180, 54), 'posRF': (278, 96), 'outfield': (180, 30)}
errors = []
STATE = {"locale": LANG, "nickname": "Prueba2", "country": "US", "playerId": "p_test", "xp": 400, "coins": 40,
         "weekId": "2026-W45", "weeklyXp": 400, "league": 0, "streak": {"count": 1, "lastDay": None, "days": []},
         "completed": {k: {"perfect": True} for k in [f'{a}.{b}' for a in range(1, LVN) for b in range(1, 6)]}, "examsPassed": {str(k): True for k in range(1, LVN)}, "plus": True}

async def svg_box(pg):
    return (await pg.evaluate("""() => [...document.querySelectorAll('svg[viewBox="0 0 360 300"]')].map(s=>{const r=s.getBoundingClientRect();return [r.x,r.y,r.width]}).filter(b=>b[2]>200)"""))[0]

async def tap_pos(pg, target):
    if target.startswith('ls-'):
        await pg.get_by_test_id(target).click(); return
    if target == 'zone':
        b = await pg.get_by_test_id('scene-zone').bounding_box(); s = b['width'] / 360
        await pg.mouse.click(b['x'] + 180 * s, b['y'] + 189 * s); return
    x, y, w = await svg_box(pg); s = w / 360
    px, py = POS[target]
    await pg.mouse.click(x + px * s, y + py * s)

async def drag_to(pg, tid, tx, ty):
    b = await pg.get_by_test_id(tid).bounding_box()
    await pg.mouse.move(b['x'] + b['width'] / 2, b['y'] + b['height'] / 2); await pg.mouse.down()
    await pg.mouse.move(tx, ty, steps=14); await pg.mouse.up(); await pg.wait_for_timeout(250)

BASEP = {'home': (180, 262), 'first': (250, 192), 'second': (180, 122), 'third': (110, 192),
         'pos1b': (244, 166), 'pos2b': (216, 140), 'posSS': (144, 140), 'cutoff': (180, 92), 'posCF': (180, 54)}
async def do_route(pg, a, wrong=False):
    x, y, w = await svg_box(pg); s = w / 360
    route = list(a['route'])
    if wrong: route = ['third'] + route if a.get('from', 'home') == 'home' else ['third']
    b = await pg.get_by_test_id('drag-runner').bounding_box()
    await pg.mouse.move(b['x'] + b['width'] / 2, b['y'] + b['height'] / 2); await pg.mouse.down()
    for t in route:
        px, py = BASEP[t]; await pg.mouse.move(x + px * s, y + py * s, steps=12)
    await pg.mouse.up(); await pg.wait_for_timeout(300)

async def do_place(pg, a, wrong=False):
    if 'route' in a and 'place' not in a: return await do_route(pg, a, wrong)
    place = dict(a['place'])
    if wrong:
        ks = list(place); place[ks[0]], place[ks[1]] = place[ks[1]], place[ks[0]]
    if a.get('board') in ('order', 'match'):
        first = list(place)[0]
        cont = await pg.evaluate("""(id) => {const r=document.querySelector('[data-testid="token-'+id+'"]').parentElement.getBoundingClientRect();return [r.x,r.y,r.width]}""", first)
        if a.get('board') == 'order':
            slots = ['1', '2', '3', '4']; n = 4; yy = 48
        else:
            slots = list(dict.fromkeys(a['place'].values())); n = len(slots); yy = 120 - 8 - 35 - 4
        cw = (cont[2] - 10 * (n - 1) - 6) / n
        for tok, slot in place.items():
            i = slots.index(slot)
            await drag_to(pg, f'token-{tok}', cont[0] + 3 + i * (cw + 10) + cw / 2, cont[1] + yy)
    else:
        x, y, w = await svg_box(pg); s = w / 360
        for tok, slot in place.items():
            px, py = POS[slot]
            await drag_to(pg, f'token-{tok}', x + px * s, y + py * s)

async def shot(pg, name):
    await pg.wait_for_timeout(350); await pg.screenshot(path=f'{OUT}/{LANG}_{name}.png')

async def click(pg, tid): await pg.get_by_test_id(tid).click()

async def lesson(pg, l, shots):
    by_q = {content['lessons'][l['id']]['acts'][str(a['n'])]['q']: a for a in l['activities']}
    await click(pg, f"node-{l['id']}"); await pg.wait_for_timeout(1500)
    if shots: await shot(pg, f"l{l['id']}_demo")
    btn = pg.get_by_test_id('demo-ready')
    seen = set()
    for _ in range(200):
        if await btn.get_attribute('aria-disabled') != 'true': break
        txt = await pg.get_by_test_id('demo-text').inner_text()
        if shots and txt not in seen:
            seen.add(txt); await pg.wait_for_timeout(500); await shot(pg, f"l{l['id']}_seg{len(seen)}")
        await pg.wait_for_timeout(300)
    if shots and l['id'].endswith('.5'): await shot(pg, f"l{l['id']}_demo_end")
    await click(pg, 'demo-ready')
    done = 0; guard = 0; mistake = shots
    while done < 6 and guard < 20:
        guard += 1; await pg.wait_for_timeout(450)
        q = await pg.get_by_test_id('act-question').inner_text(); a = by_q[q]
        wrong = False
        if shots and guard <= 6: await shot(pg, f"l{l['id']}_a{a['n']}")
        if a['type'] in ('choice', 'choiceImg', 'umpire'):
            await click(pg, f"opt-{a['correct']}"); await click(pg, 'check')
        elif a['type'] == 'tf':
            await click(pg, f"opt-{a['correct']}"); await click(pg, 'check')
        elif a['type'] == 'tap':
            await tap_pos(pg, a['target'])
        elif a['type'] == 'drag':
            wrong = mistake; mistake = False
            await do_place(pg, a, wrong=wrong)
        await pg.wait_for_timeout(500)
        fb = await pg.get_by_test_id('feedback').inner_text()
        if wrong:
            if shots: await shot(pg, f"l{l['id']}_a{a['n']}_wrong")
            await click(pg, 'feedback-continue'); await pg.wait_for_timeout(600); await click(pg, 'replay-continue'); continue
        if RIGHT not in fb: errors.append(f"{l['id']} #{a['n']} not right: {fb[:50]}")
        if shots and a['type'] == 'drag': await shot(pg, f"l{l['id']}_a{a['n']}_right")
        await click(pg, 'feedback-continue'); done += 1
    await pg.wait_for_timeout(700); await click(pg, 'result-continue'); await pg.wait_for_timeout(700)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
        await ctx.add_init_script("try{if(!localStorage.getItem('kas-state-v1'))localStorage.setItem('kas-state-v1', %s)}catch(e){}" % json.dumps(json.dumps(STATE)))
        pg = await ctx.new_page()
        pg.on('pageerror', lambda e: errors.append('PAGEERR ' + str(e)[:200]))
        await pg.goto(URL); await pg.wait_for_timeout(2500)
        await pg.get_by_test_id(f'node-{LVN}.1').scroll_into_view_if_needed(); await shot(pg, 'camino')
        for l in LV['lessons']:
            await pg.get_by_test_id(f"node-{l['id']}").scroll_into_view_if_needed()
            await lesson(pg, l, shots=True)
        await pg.get_by_test_id(f'exam-{LVN}').scroll_into_view_if_needed(); await click(pg, f'exam-{LVN}'); await pg.wait_for_timeout(900)
        await click(pg, 'exam-start'); await pg.wait_for_timeout(600)
        ex = {content['exams'][str(LVN)][str(q['n'])]['q']: q for q in LV['exam']}
        for k in range(12):
            q = await pg.get_by_test_id('exam-question').inner_text(); e = ex[q]
            if e['type'] == 'tap':
                if k == 2: await shot(pg, 'exam_tap')
                await tap_pos(pg, e['target'])
            else:
                await click(pg, f"opt-{e['correct']}"); await click(pg, 'exam-check')
            await pg.wait_for_timeout(300); await click(pg, 'exam-continue'); await pg.wait_for_timeout(300)
        await pg.wait_for_timeout(600); await shot(pg, 'exam_result')
        print(json.dumps(errors, ensure_ascii=False, indent=1))
        await b.close()

asyncio.run(main())
