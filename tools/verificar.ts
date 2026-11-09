// Revisión de un nivel contra el guion (Prompt 5) y de los 4 idiomas (Prompt 6).
// Uso:  npx tsx tools/verificar.ts 1
// No corrige nada: solo reporta diferencias para aprobarlas a mano.
import fs from 'node:fs';
import path from 'node:path';
import { LEVELS } from '../src/content/levels';

const ROOT = path.resolve(__dirname, '..');
const LOCALES = ['es', 'en', 'zh-Hans', 'ja'];
const levelN = Number(process.argv[2] ?? 1);
const level = LEVELS.find((l) => l.n === levelN);
if (!level) throw new Error(`Nivel ${levelN} no existe`);

const norm = (s: string) => s.replace(/\*/g, '').replace(/\s+/g, ' ').trim();
const read = (p: string) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

// ---------------------------------------------------------------- Guion (docs/guion-v2.md)
// Niveles 1-4: guion Versión 2. Niveles 5-12: guion definitivo (Versión Fusionada).
const doc = ['docs/guion-v2.md', 'docs/guion-v3-niveles-5-12.md'].flatMap((f) => fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n'));
const docAnswer = new Map<string, string[]>(); // pregunta -> correctas (la misma pregunta puede salir en la lección y en el examen)
const addAnswer = (q: string, a: string) => docAnswer.set(q, [...(docAnswer.get(q) ?? []), a]);
const docLessons = new Map<string, number>(); // lección -> nº de actividades
let curLesson = '';
for (const ln of doc) {
  const m = ln.match(/^### Lección (\d+\.\d)/);
  if (m) curLesson = m[1];
  if (/^### Examen/.test(ln)) curLesson = '';
  if (!ln.startsWith('|') || ln.startsWith('|--')) continue;
  const cells = ln.trim().replace(/^\||\|$/g, '').split('|').map(norm);
  if (!/^\d+$/.test(cells[0])) continue;
  if (cells.length === 6) {
    addAnswer(cells[2], cells[4]);
    if (curLesson) docLessons.set(curLesson, (docLessons.get(curLesson) ?? 0) + 1);
  } else if (cells.length === 4) addAnswer(cells[1], cells[3]);
}

const es = read('src/i18n/locales/es/content.json');
const esUi = read('src/i18n/locales/es/ui.json');
const tfLabel = (v?: string) => (v === 'true' ? esUi.common.true : esUi.common.false);

console.log(`\n## Prompt 5 — Nivel ${levelN} contra el guion\n`);
console.log('| Lección | Actividades (app / guion) | Respuestas que no coinciden |');
console.log('|---|---|---|');
let p5Issues = 0;
for (const l of level.lessons) {
  const t = es.lessons[l.id];
  const bad: string[] = [];
  for (const a of l.activities) {
    const at = t.acts[String(a.n)];
    const programmed =
      a.type === 'tap' || a.type === 'drag' ? at.answer : a.type === 'tf' ? tfLabel(a.correct) : at.opts?.[a.correct ?? ''];
    const want = docAnswer.get(norm(at.q));
    if (!want) bad.push(`#${a.n}: pregunta no encontrada en el guion`);
    else if (!want.includes(norm(programmed ?? ''))) bad.push(`#${a.n}: app «${programmed}» / guion «${want.join(' | ')}»`);
  }
  p5Issues += bad.length;
  console.log(`| ${l.id} | ${l.activities.length} / ${docLessons.get(l.id) ?? '?'} | ${bad.length ? bad.join('; ') : 'ninguna'} |`);
}
{
  const bad: string[] = [];
  const et = es.exams[String(levelN)];
  for (const q of level.exam) {
    const qt = et[String(q.n)];
    const programmed = q.type === 'tap' ? qt.answer : q.type === 'tf' ? tfLabel(q.correct) : qt.opts?.[q.correct ?? ''];
    const want = docAnswer.get(norm(qt.q));
    if (!want) bad.push(`#${q.n}: pregunta no encontrada`);
    else if (!want.includes(norm(programmed ?? ''))) bad.push(`#${q.n}: app «${programmed}» / guion «${want.join(' | ')}»`);
  }
  p5Issues += bad.length;
  console.log(`| Examen | ${level.exam.length} preguntas · aprueba con ${level.passPercent} % | ${bad.length ? bad.join('; ') : 'ninguna'} |`);
}

// ---------------------------------------------------------------- Idiomas
function flatten(o: unknown, pre = '', out: string[] = []): string[] {
  if (o && typeof o === 'object' && !Array.isArray(o)) {
    for (const [k, v] of Object.entries(o)) flatten(v, pre ? `${pre}.${k}` : k, out);
  } else if (Array.isArray(o)) {
    o.forEach((v, i) => flatten(v, `${pre}[${i}]`, out));
  } else out.push(pre);
  return out;
}
const keysOf = (lang: string) => {
  const c = read(`src/i18n/locales/${lang}/content.json`);
  const u = read(`src/i18n/locales/${lang}/ui.json`);
  return new Set([...flatten(c).map((k) => `content.${k}`), ...flatten(u).map((k) => `ui.${k}`)]);
};
const esKeys = keysOf('es');

console.log(`\n## Prompt 6 — Idiomas\n`);
console.log(`Claves de texto en español: ${esKeys.size}\n`);
console.log('| Idioma | Claves | Faltan | Sobran | Términos del glosario que no coinciden | Guion de voz (pedazos) |');
console.log('|---|---|---|---|---|---|');
for (const lang of LOCALES) {
  const ks = keysOf(lang);
  const missing = [...esKeys].filter((k) => !ks.has(k));
  const extra = [...ks].filter((k) => !esKeys.has(k));
  const c = read(`src/i18n/locales/${lang}/content.json`);
  const g = read(`src/i18n/locales/${lang}/glossary.json`);
  const badTerms: string[] = [];
  let segs = 0;
  let emptySegs = 0;
  for (const l of level.lessons) {
    const t = c.lessons[l.id];
    const blob = JSON.stringify(t).toLowerCase();
    for (const term of lang === 'es' ? [] : l.glossary) {
      const forms = String(g[term])
        .split('/')
        .map((f) => f.trim().replace(/^(el|la|los|las)\s+/i, '').toLowerCase())
        .filter(Boolean);
      if (!forms.some((f) => blob.includes(f))) badTerms.push(`${l.id}:${term} (${g[term]})`);
    }
    segs += t.demo.length;
    emptySegs += t.demo.filter((s: string) => !s.trim()).length;
    if (t.demo.length !== l.demo.length) badTerms.push(`${l.id}: ${t.demo.length} pedazos de voz, se esperan ${l.demo.length}`);
  }
  console.log(
    `| ${lang} | ${ks.size} | ${missing.length ? missing.slice(0, 5).join(', ') : 0} | ${extra.length ? extra.slice(0, 5).join(', ') : 0} | ${badTerms.length ? badTerms.join('; ') : 'ninguno'} | ${segs - emptySegs}/${segs} |`,
  );
}

// Texto escrito fijo en pantallas (debe salir siempre de los archivos de idioma).
const hard: string[] = [];
const walk = (dir: string) => {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.tsx')) {
      const src = fs.readFileSync(p, 'utf8').replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\/.*$/gm, '');
      const re = />([^<>{}]*[A-Za-zÀ-ÿぁ-んァ-ン一-龥][^<>{}]*)</g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(src))) {
        const txt = m[1].trim();
        if (txt && !/^[\s=>&|?:().,'"-]*$/.test(txt) && !/=>|\bconst\b|return|\?\s|&&|[;=]|\bcase\b|\bbreak\b|Record|\?:|\n/.test(txt)) hard.push(`${path.relative(ROOT, p)}: «${txt.slice(0, 40)}»`);
      }
    }
  }
};
walk(path.join(ROOT, 'src'));
console.log(`\nTexto fijo en el código: ${hard.length ? hard.join('; ') : 'ninguno'}`);
console.log(`Voz de la mascota: voz del sistema en es-US, en-US, zh-CN y ja-JP (src/services/speech.ts).`);
console.log(`\nDiferencias del Prompt 5: ${p5Issues}`);
