// Scoreboard semanal: mi liga, mi país y mundial.
// Con Firebase configurado usa Firestore; sin configuración muestra jugadores de ejemplo (modo de prueba).
//
// Variables (ver README): EXPO_PUBLIC_FIREBASE_API_KEY, EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
// EXPO_PUBLIC_FIREBASE_PROJECT_ID, EXPO_PUBLIC_FIREBASE_APP_ID.
//
// Privacidad (COPPA): solo se guarda el apodo, el país, la liga y los XP. Nada más del niño.

export type BoardTab = 'league' | 'country' | 'world';

export interface Row {
  rank: number;
  nickname: string;
  country: string;
  xp: number;
  me?: boolean;
  gapBefore?: boolean;
}

export interface Me {
  playerId: string;
  nickname: string;
  country: string;
  league: number;
  weeklyXp: number;
  totalXp: number;
  weekId: string;
}

const cfg = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const SCOREBOARD_DEMO = !cfg.apiKey || !cfg.projectId;

// ---------------------------------------------------------------- Firebase
let fb: any = null;

async function firebase() {
  if (fb) return fb;
  const app = await import('firebase/app');
  const store = await import('firebase/firestore');
  const auth = await import('firebase/auth');
  const a = app.getApps().length ? app.getApp() : app.initializeApp(cfg as Record<string, string>);
  const au = auth.getAuth(a);
  if (!au.currentUser) await auth.signInAnonymously(au);
  fb = { db: store.getFirestore(a), store, uid: au.currentUser?.uid };
  return fb;
}

export async function submitScore(me: Me): Promise<void> {
  if (SCOREBOARD_DEMO || !me.nickname) return;
  try {
    const { db, store, uid } = await firebase();
    await store.setDoc(
      store.doc(db, 'players', me.playerId),
      {
        uid,
        nickname: me.nickname,
        country: me.country,
        league: me.league,
        weekId: me.weekId,
        weeklyXp: me.weeklyXp,
        totalXp: me.totalXp,
        updatedAt: store.serverTimestamp(),
      },
      { merge: true },
    );
  } catch {
    // sin conexión: se envía en la próxima lección
  }
}

async function fetchFirebase(tab: BoardTab, me: Me): Promise<Row[]> {
  const { db, store } = await firebase();
  const base = [store.where('weekId', '==', me.weekId)];
  const filter =
    tab === 'league' ? [store.where('league', '==', me.league)] : tab === 'country' ? [store.where('country', '==', me.country)] : [];
  const top = tab === 'league' ? 10 : 8;
  const q = store.query(store.collection(db, 'players'), ...base, ...filter, store.orderBy('weeklyXp', 'desc'), store.limit(top));
  const snap = await store.getDocs(q);
  const rows: Row[] = [];
  let i = 0;
  snap.forEach((d: { id: string; data: () => { nickname: string; country: string; weeklyXp: number } }) => {
    const x = d.data();
    i++;
    rows.push({ rank: i, nickname: x.nickname, country: x.country, xp: x.weeklyXp, me: d.id === me.playerId });
  });
  if (!rows.some((r) => r.me)) {
    const above = await store.getCountFromServer(
      store.query(store.collection(db, 'players'), ...base, ...filter, store.where('weeklyXp', '>', me.weeklyXp)),
    );
    rows.push({ rank: above.data().count + 1, nickname: me.nickname, country: me.country, xp: me.weeklyXp, me: true, gapBefore: true });
  }
  return rows;
}

// ---------------------------------------------------------------- Modo de prueba
const SAMPLE: [string, string][] = [
  ['TakumiBat', 'JP'], ['HomeRunHero', 'US'], ['PichonVeloz', 'DO'], ['WeiHomeRun', 'TW'], ['GuanteDeOro', 'VE'],
  ['ElCatcher', 'MX'], ['RoboDeBase', 'PR'], ['HanaStar', 'JP'], ['FlyAlto', 'CO'], ['MinjunK', 'KR'],
  ['SoraPitcher', 'JP'], ['ElZurdo', 'MX'], ['CurveKing', 'US'], ['LaBolaRapida', 'PA'], ['DiamondDan', 'US'],
  ['BateMagico', 'NI'], ['RyuSlugger', 'JP'], ['TripleAva', 'CA'], ['JonronKid', 'CU'], ['ShortstopLi', 'SG'],
];
const COUNTRY_NAMES = ['Slugger', 'Estrella', 'Jonron', 'Guante', 'Curva', 'Bateo', 'Diamante', 'Rapido', 'Zurdo', 'Toque'];

function seeded(n: number) {
  let x = n * 9301 + 49297;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
}

function demoBoard(tab: BoardTab, me: Me): Row[] {
  const meRow = { nickname: me.nickname, country: me.country, xp: me.weeklyXp, me: true };
  if (tab === 'league') {
    const xs = [412, 388, 320, 297, 260, 232, 190, 121, 84];
    const others = xs.map((xp, i) => ({ nickname: SAMPLE[i][0], country: SAMPLE[i][1], xp }));
    const all = [...others, meRow].sort((a, b) => b.xp - a.xp);
    return all.map((r, i) => ({ ...r, rank: i + 1 }));
  }
  const rnd = seeded(tab === 'country' ? me.country.charCodeAt(0) * 31 + me.country.charCodeAt(1) : 7);
  const population = tab === 'country' ? 64 : 1500;
  const topXp = tab === 'country' ? 1420 : 2140;
  const pool = Array.from({ length: population }, (_, i) => Math.round(topXp / (1 + i * (tab === 'country' ? 0.05 : 0.012)) + rnd() * 8));
  pool.sort((a, b) => b - a);
  const top: Row[] = pool.slice(0, 8).map((xp, i) => {
    if (tab === 'world') return { rank: i + 1, nickname: SAMPLE[i][0], country: SAMPLE[i][1], xp };
    const name = `${COUNTRY_NAMES[i]}${Math.floor(10 + rnd() * 89)}`;
    return { rank: i + 1, nickname: name, country: me.country, xp };
  });
  const above = pool.filter((x) => x > me.weeklyXp).length;
  const rank = above + 1;
  if (rank <= 8) {
    top.splice(rank - 1, 0, { ...meRow, rank });
    return top.slice(0, 9).map((r, i) => ({ ...r, rank: i + 1 }));
  }
  return [...top, { ...meRow, rank, gapBefore: true }];
}

export async function fetchBoard(tab: BoardTab, me: Me): Promise<Row[]> {
  if (SCOREBOARD_DEMO) return demoBoard(tab, me);
  try {
    return await fetchFirebase(tab, me);
  } catch {
    // Sin conexión: nunca se muestran jugadores inventados a usuarios reales, solo tu fila.
    return [{ rank: 0, nickname: me.nickname, country: me.country, xp: me.weeklyXp, me: true }];
  }
}
