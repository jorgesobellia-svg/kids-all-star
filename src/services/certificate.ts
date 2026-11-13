import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

// Certificado de graduación All Star: una página tamaño carta en HTML que se imprime o se
// guarda como PDF para compartir. Todo va dentro del HTML (sin imágenes externas), porque
// en el iPhone la impresión no puede leer archivos locales.

export interface CertText {
  kicker: string;
  title: string;
  sub: string;
  to: string;
  name: string;
  text: string;
  date: string;
  dateLabel: string;
  coach: string;
  coachLabel: string;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const BADGE = ['#FFB81C', '#C8102E', '#1D4ED8', '#0F766E'];
const STAR = '28,12 32.6,22.4 44,23.4 35.4,30.8 38,42 28,36 18,42 20.6,30.8 12,23.4 23.4,22.4';

const badge = (i: number) =>
  `<svg width="34" height="34" viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="${BADGE[i % 4]}" stroke="#0C2340" stroke-width="2"/><polygon points="${STAR}" fill="#fff"/></svg>`;

// Pelotín (cara con gorra), igual que el ícono de la app.
const MASCOT = `<svg width="90" height="90" viewBox="0 0 100 100">
<circle cx="50" cy="54" r="38" fill="#F5F1EA" stroke="#FFB81C" stroke-width="5"/>
<path d="M30 32 Q24 54 32 78" fill="none" stroke="#C8102E" stroke-width="3" stroke-dasharray="5 4"/>
<path d="M70 32 Q76 54 68 78" fill="none" stroke="#C8102E" stroke-width="3" stroke-dasharray="5 4"/>
<path d="M14 44 Q16 12 50 12 Q84 12 86 44 Z" fill="#C8102E"/><rect x="60" y="38" width="34" height="9" rx="4" fill="#C8102E"/>
<polygon points="50,18 53,26 61,26 55,31 57,39 50,34 43,39 45,31 39,26 47,26" fill="#FFB81C"/>
<circle cx="40" cy="56" r="4.5" fill="#0C2340"/><circle cx="60" cy="56" r="4.5" fill="#0C2340"/>
<path d="M38 68 Q50 78 62 68" fill="none" stroke="#0C2340" stroke-width="4" stroke-linecap="round"/></svg>`;

const SEAL = `<svg width="86" height="86" viewBox="0 0 58 58"><polygon points="29,2 35,10 45,7 46,17 56,21 50,29 56,37 46,41 45,51 35,48 29,56 23,48 13,51 12,41 2,37 8,29 2,21 12,17 13,7 23,10" fill="#FFB81C" stroke="#B7800F" stroke-width="1.5"/><circle cx="29" cy="29" r="14" fill="#C8102E"/><polygon points="29,19 32,26 39,26 33,30 35,37 29,33 23,37 25,30 19,26 26,26" fill="#fff"/></svg>`;

export function certificateHtml(c: CertText): string {
  const badges = Array.from({ length: 20 }, (_, i) => badge(i)).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
@page { size: letter; margin: 0.4in; }
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; color: #0C2340; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 7.7in; height: 10.1in; margin: 0 auto; background: #FFFDF6; border: 10px solid #0C2340; padding: 8px; }
.in { height: 100%; border: 3px solid #FFB81C; display: flex; flex-direction: column; align-items: center; padding: 34px 48px 28px; text-align: center; }
.kicker { color: #C8102E; font-weight: 800; letter-spacing: 6px; font-size: 18px; margin-top: 6px; }
.title { font-family: Impact, 'Arial Black', sans-serif; font-size: 78px; letter-spacing: 2px; margin: 8px 0 0; }
.sub { font-weight: 800; letter-spacing: 3px; font-size: 20px; }
.to { color: #475569; font-size: 20px; margin-top: 40px; }
.name { font-family: Impact, 'Arial Black', sans-serif; color: #C8102E; font-size: 76px; margin-top: 4px; }
.rule { width: 70%; height: 3px; background: #FFB81C; }
.text { font-size: 21px; line-height: 1.45; margin: 24px 20px 0; font-weight: 600; }
.badges { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; width: 420px; margin-top: 34px; }
.foot { margin-top: auto; width: 100%; display: flex; justify-content: space-between; align-items: flex-end; }
.sig { width: 200px; }
.sig b { display: block; font-size: 20px; padding-bottom: 4px; border-bottom: 1.5px solid #0C2340; }
.sig span { color: #475569; font-size: 14px; }
</style></head><body><div class="page"><div class="in">
${MASCOT}
<div class="kicker">${esc(c.kicker)}</div>
<div class="title">${esc(c.title)}</div>
<div class="sub">${esc(c.sub)}</div>
<div class="to">${esc(c.to)}</div>
<div class="name">${esc(c.name)}</div>
<div class="rule"></div>
<div class="text">${esc(c.text)}</div>
<div class="badges">${badges}</div>
<div class="foot">
<div class="sig"><b>${esc(c.date)}</b><span>${esc(c.dateLabel)}</span></div>
${SEAL}
<div class="sig"><b>${esc(c.coach)}</b><span>${esc(c.coachLabel)}</span></div>
</div></div></div></body></html>`;
}

/** Abre el diálogo de impresión del teléfono con el certificado. */
export async function printCertificate(c: CertText): Promise<void> {
  const html = certificateHtml(c);
  if (Platform.OS === 'web') {
    // En la web, printAsync imprimiría la pantalla del juego: se abre el certificado solo.
    const w = typeof window !== 'undefined' ? window.open('', '_blank') : null;
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
    return;
  }
  await Print.printAsync({ html });
}

/** Crea el PDF y abre el menú de compartir del teléfono (WhatsApp, correo, Archivos…). */
export async function shareCertificate(c: CertText, title: string): Promise<void> {
  if (Platform.OS === 'web') return printCertificate(c);
  const { uri } = await Print.printToFileAsync({ html: certificateHtml(c) });
  if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: '.pdf', dialogTitle: title });
  else await Print.printAsync({ uri });
}
