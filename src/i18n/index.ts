// Todo el texto de la app sale de estos archivos, uno por idioma.
// Nada de texto fijo en las pantallas: siempre t('seccion.clave') o el contenido por clave.
import es_ui from './locales/es/ui.json';
import en_ui from './locales/en/ui.json';
import zh_ui from './locales/zh-Hans/ui.json';
import ja_ui from './locales/ja/ui.json';
import es_c from './locales/es/content.json';
import en_c from './locales/en/content.json';
import zh_c from './locales/zh-Hans/content.json';
import ja_c from './locales/ja/content.json';

export const LOCALES = ['es', 'en', 'zh-Hans', 'ja'] as const;
export type Locale = (typeof LOCALES)[number];

export type UiStrings = typeof es_ui;
export type ContentStrings = typeof es_c;

const UI: Record<Locale, UiStrings> = { es: es_ui, en: en_ui, 'zh-Hans': zh_ui, ja: ja_ui };
const CONTENT: Record<Locale, ContentStrings> = {
  es: es_c,
  en: en_c as unknown as ContentStrings,
  'zh-Hans': zh_c as unknown as ContentStrings,
  ja: ja_c as unknown as ContentStrings,
};

/** Código de voz para la mascota en cada idioma. */
export const SPEECH_LANG: Record<Locale, string> = {
  es: 'es-US',
  en: 'en-US',
  'zh-Hans': 'zh-CN',
  ja: 'ja-JP',
};

export function ui(locale: Locale): UiStrings {
  return UI[locale];
}

export function content(locale: Locale): ContentStrings {
  return CONTENT[locale];
}

/** Busca 'seccion.clave' en los textos de interfaz y reemplaza {variables}. */
export function translate(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const parts = key.split('.');
  let node: unknown = UI[locale];
  for (const p of parts) {
    node = node && typeof node === 'object' ? (node as Record<string, unknown>)[p] : undefined;
  }
  let s = typeof node === 'string' ? node : key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  }
  return s;
}

/** Elige el idioma del teléfono si es uno de los 4; si no, inglés. */
export function deviceLocale(tags: { languageTag?: string | null; languageCode?: string | null; languageScriptCode?: string | null }[]): Locale {
  for (const t of tags) {
    const code = (t.languageCode || '').toLowerCase();
    if (code === 'es') return 'es';
    if (code === 'en') return 'en';
    if (code === 'ja') return 'ja';
    if (code === 'zh') return 'zh-Hans';
  }
  return 'en';
}
