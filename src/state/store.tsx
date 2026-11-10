import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { REWARDS } from '@/content/levels';
import { DEFAULT_AVATAR, DEFAULT_OWNED, GIFT_CAP, SHOP, SHOP_BY_ID, type Avatar } from '@/content/shop';
import type { Locale } from '@/i18n';
import { translate } from '@/i18n';

const KEY = 'kas-state-v1';

export interface Progress {
  locale: Locale | null;
  nickname: string | null;
  country: string;
  playerId: string;
  xp: number;
  coins: number;
  weekId: string;
  weeklyXp: number;
  league: number; // 0 Novatos · 1 Doble A · 2 Triple A · 3 Grandes Ligas
  streak: { count: number; lastDay: string | null; days: string[] };
  completed: Record<string, { perfect: boolean }>;
  examsPassed: Record<string, boolean>;
  plus: boolean;
  /** Solo en modo de prueba: abre todos los niveles para revisarlos sin aprobar exámenes. */
  review?: boolean;
  /** Cómo está vestido Pelotín (Mi Pelotín). */
  avatar?: Avatar;
  /** Cosas del vestidor que ya son suyas. */
  owned?: string[];
  /** Tutorial de Mi Pelotín: 'done' cuando ya lo vio completo. */
  shopIntro?: 'done';
}

export type BuyResult = 'ok' | 'coins' | 'locked' | 'owned';

export const avatarOf = (p: Progress): Avatar => ({ ...DEFAULT_AVATAR, ...(p.avatar ?? {}) });
export const ownedOf = (p: Progress): string[] =>
  Array.from(new Set([...DEFAULT_OWNED, ...(p.owned ?? []), ...SHOP.filter((i) => i.reward && p.examsPassed[String(i.reward)]).map((i) => i.id)]));
/** Mi Pelotín se abre al aprobar el examen del nivel 1. */
export const shopOpen = (p: Progress): boolean => !!p.examsPassed['1'];

export interface LessonReward {
  xp: number;
  coins: number;
  correct: number;
  total: number;
  perfect: boolean;
  streak: number;
  milestone: number | null;
  newCard: boolean;
}

export function dayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Semana ISO, p. ej. "2026-W45". El scoreboard semanal se reinicia cada lunes. */
export function weekKey(d = new Date()): string {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function newId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = 'p_';
  for (let i = 0; i < 16; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

const initial = (): Progress => ({
  locale: null,
  nickname: null,
  country: 'US',
  playerId: newId(),
  xp: 0,
  coins: 0,
  weekId: weekKey(),
  weeklyXp: 0,
  league: 0,
  streak: { count: 0, lastDay: null, days: [] },
  completed: {},
  examsPassed: {},
  plus: false,
});

interface Store {
  ready: boolean;
  p: Progress;
  t: (key: string, vars?: Record<string, string | number>) => string;
  locale: Locale;
  setLocale: (l: Locale) => void;
  setPlayer: (nickname: string, country: string) => void;
  setCountry: (country: string) => void;
  completeLesson: (id: string, correct: number, total: number, perfect: boolean, bonusCoins?: number) => LessonReward;
  passExam: (level: number) => { xp: number; coins: number };
  setPlus: (on: boolean) => void;
  setReview: (on: boolean) => void;
  reset: () => void;
  /** Compra una cosa del vestidor y se la pone a Pelotín. */
  buy: (id: string) => BuyResult;
  /** Se pone algo que ya es suyo. */
  equip: (id: string) => void;
  setNumber: (n: number) => void;
  /** Regalo del tutorial: la primera gorra gratis. */
  giftCap: () => void;
  finishShopIntro: () => void;
}

const Ctx = createContext<Store | null>(null);

function touchStreak(s: Progress['streak'], today: string): { streak: Progress['streak']; milestone: number | null } {
  if (s.lastDay === today) return { streak: s, milestone: null };
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const count = s.lastDay === dayKey(y) ? s.count + 1 : 1;
  const days = [...s.days.filter((d) => d !== today), today].slice(-14);
  const milestone = REWARDS.streakMilestones.includes(count) ? count : null;
  return { streak: { count, lastDay: today, days }, milestone };
}

function rollWeek(p: Progress): Progress {
  const wk = weekKey();
  return p.weekId === wk ? p : { ...p, weekId: wk, weeklyXp: 0 };
}

function wear(a: Avatar, id: string): Avatar {
  const it = SHOP_BY_ID[id];
  if (!it) return a;
  return it.kind === 'cap' ? { ...a, cap: id } : it.kind === 'uniform' ? { ...a, uniform: id } : { ...a, bat: id };
}

export function StoreProvider({ children, fallbackLocale }: { children: React.ReactNode; fallbackLocale: Locale }) {
  const [p, setP] = useState<Progress>(initial);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) {
          try {
            setP(rollWeek({ ...initial(), ...JSON.parse(raw) }));
          } catch {
            // archivo dañado: se empieza de cero
          }
        }
      })
      .finally(() => {
        loaded.current = true;
        setReady(true);
      });
  }, []);

  useEffect(() => {
    if (loaded.current) AsyncStorage.setItem(KEY, JSON.stringify(p)).catch(() => {});
  }, [p]);

  const locale: Locale = p.locale ?? fallbackLocale;

  const t = useCallback((key: string, vars?: Record<string, string | number>) => translate(locale, key, vars), [locale]);

  const setLocale = useCallback((l: Locale) => setP((s) => ({ ...s, locale: l })), []);
  const setPlayer = useCallback((nickname: string, country: string) => setP((s) => ({ ...s, nickname, country })), []);
  const setCountry = useCallback((country: string) => setP((s) => ({ ...s, country })), []);
  const setPlus = useCallback((on: boolean) => setP((s) => (s.plus === on ? s : { ...s, plus: on })), []);
  const setReview = useCallback((on: boolean) => setP((s) => ({ ...s, review: on })), []);
  const reset = useCallback(() => setP(initial()), []);

  // Se calcula con el estado actual del render; las pantallas llaman esto una sola vez por lección.
  const pRef = useRef(p);
  useEffect(() => {
    pRef.current = p;
  }, [p]);

  const completeLesson = useCallback((id: string, correct: number, total: number, perfect: boolean, bonusCoins = 0): LessonReward => {
    const cur = rollWeek(pRef.current);
    const xp = correct * REWARDS.xpPerCorrect + (perfect ? REWARDS.xpPerfectBonus : 0);
    const coins = correct * REWARDS.coinsPerCorrect + (perfect ? REWARDS.coinsPerfectBonus : 0) + bonusCoins;
    const { streak, milestone } = touchStreak(cur.streak, dayKey());
    const newCard = !cur.completed[id];
    const next: Progress = {
      ...cur,
      xp: cur.xp + xp,
      weeklyXp: cur.weeklyXp + xp,
      coins: cur.coins + coins,
      streak,
      completed: { ...cur.completed, [id]: { perfect: perfect || !!cur.completed[id]?.perfect } },
    };
    pRef.current = next;
    setP(next);
    return { xp, coins, correct, total, perfect, streak: streak.count, milestone, newCard };
  }, []);

  const passExam = useCallback((level: number) => {
    const cur = rollWeek(pRef.current);
    const already = !!cur.examsPassed[String(level)];
    const xp = already ? 0 : REWARDS.examXp;
    const coins = already ? 0 : REWARDS.examCoins;
    const next: Progress = {
      ...cur,
      xp: cur.xp + xp,
      weeklyXp: cur.weeklyXp + xp,
      coins: cur.coins + coins,
      examsPassed: { ...cur.examsPassed, [String(level)]: true },
    };
    pRef.current = next;
    setP(next);
    return { xp, coins };
  }, []);

  const buy = useCallback((id: string): BuyResult => {
    const cur = pRef.current;
    const it = SHOP_BY_ID[id];
    if (!it) return 'locked';
    if (ownedOf(cur).includes(id)) return 'owned';
    if (it.reward || (it.unlock && !cur.examsPassed[String(it.unlock)])) return 'locked';
    if (cur.coins < it.price) return 'coins';
    const next: Progress = { ...cur, coins: cur.coins - it.price, owned: [...(cur.owned ?? []), id], avatar: wear(avatarOf(cur), id) };
    pRef.current = next;
    setP(next);
    return 'ok';
  }, []);

  const equip = useCallback((id: string) => {
    setP((s) => (ownedOf(s).includes(id) ? { ...s, avatar: wear(avatarOf(s), id) } : s));
  }, []);

  const setNumber = useCallback((n: number) => {
    const num = Math.max(0, Math.min(99, Math.round(n)));
    setP((s) => ({ ...s, avatar: { ...avatarOf(s), number: num } }));
  }, []);

  const giftCap = useCallback(() => {
    setP((s) => (ownedOf(s).includes(GIFT_CAP) ? { ...s, avatar: wear(avatarOf(s), GIFT_CAP) } : { ...s, owned: [...(s.owned ?? []), GIFT_CAP], avatar: wear(avatarOf(s), GIFT_CAP) }));
  }, []);

  const finishShopIntro = useCallback(() => setP((s) => ({ ...s, shopIntro: 'done' })), []);

  const value = useMemo<Store>(
    () => ({ ready, p, t, locale, setLocale, setPlayer, setCountry, completeLesson, passExam, setPlus, setReview, reset, buy, equip, setNumber, giftCap, finishShopIntro }),
    [ready, p, t, locale, setLocale, setPlayer, setCountry, completeLesson, passExam, setPlus, setReview, reset, buy, equip, setNumber, giftCap, finishShopIntro],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore fuera de StoreProvider');
  return s;
}
