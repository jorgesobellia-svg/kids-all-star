import React, { useEffect, useMemo, useState } from 'react';
import { Animated, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Polygon, Polyline, Rect, Stop } from 'react-native-svg';

// Estadio del camino visto desde detrás del home, en perspectiva de verdad (cámara elevada,
// como en la TV): las líneas se juntan hacia el fondo y todo se achica con la distancia.
// Medidas del terreno en pies, como un campo real: home en (0,0), primera a la derecha,
// segunda al fondo. La cerca del outfield es curva y detrás están las gradas con el público.

export interface XY {
  x: number;
  y: number;
}

const S2 = 63.64; // 90 pies entre bases, en diagonal
const R = 230; // distancia a la cerca (más corta que la real para que quepa en la pantalla)
const F = 360;
const CAM_H = 150;
const CAM_BACK = 150;

export function stadiumGeom(W: number) {
  const k = W / 360;
  const H = Math.round(370 * k);
  const P = (X: number, Y: number, Z = 0): XY => {
    const d = Y + CAM_BACK;
    return { x: W / 2 + (k * F * X) / d, y: k * (-36 + (F * (CAM_H - Z)) / d) };
  };
  /** Tamaño relativo de algo parado en ese punto (1 = en el home). */
  const depth = (Y: number) => CAM_BACK / (Y + CAM_BACK);
  const W3 = {
    onDeck: [-30, 6],
    home: [0, 0],
    first: [S2, S2],
    second: [0, 2 * S2],
    third: [-S2, S2],
    dugout: [33, 3], // frente del dugout de primera (el examen)
  } as const;
  const at = (n: keyof typeof W3) => ({ ...P(W3[n][0], W3[n][1]), s: depth(W3[n][1]) });
  const pts = {
    onDeck: at('onDeck'),
    home: at('home'),
    first: at('first'),
    second: at('second'),
    third: at('third'),
    dugout: at('dugout'),
  };
  // Nodos del camino: lecciones 1-5 (estrella, 1ª, 2ª, 3ª, home) y el examen en el dugout.
  const nodes = [pts.onDeck, pts.first, pts.second, pts.third, pts.home, { ...P(36, 6, 14), s: depth(6) }];
  // Recorrido del corredor y en qué punto de él está cada nodo.
  const route = [pts.onDeck, pts.home, pts.first, pts.second, pts.third, pts.home, pts.dugout];
  const nodeAt = [0, 2, 3, 4, 5, 6];
  return { W, H, k, P, depth, pts, nodes, route, nodeAt };
}
export type StadiumGeom = ReturnType<typeof stadiumGeom>;

const pts = (a: XY[]) => a.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ');
const ring = (cx: number, cy: number, r: number, n = 36): [number, number][] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos((2 * Math.PI * i) / n), cy + r * Math.sin((2 * Math.PI * i) / n)]);

/** El dibujo fijo del estadio (sin el público, que va aparte para poder brincar). */
export function StadiumScene({ g }: { g: StadiumGeom }) {
  const { W, H, P } = g;
  const arc = useMemo(() => Array.from({ length: 41 }, (_, i) => (-60 + i * 3) * (Math.PI / 180)).map((a) => [R * Math.sin(a), R * Math.cos(a)] as const), []);
  const standsTop = arc.map(([x, y]) => P(x * 1.25, y * 1.25, 60));
  const fenceTop = arc.map(([x, y]) => P(x, y, 8));
  const fenceBot = arc.map(([x, y]) => P(x, y, 0));
  const track = arc.map(([x, y]) => P(x * 0.94, y * 0.94));
  const stripes = [0, 2, 4, 6, 8, 10].map((i) => {
    const y1 = -40 + i * 22;
    return [P(-400, y1), P(400, y1), P(400, y1 + 22), P(-400, y1 + 22)];
  });
  const e = 10;
  const mound: [number, number] = [0, 60.5];
  const infArc = Array.from({ length: 25 }, (_, i) => 48 - i * 4).map((t) => P(mound[0] + 95 * Math.sin((t * Math.PI) / 180), mound[1] + 95 * Math.cos((t * Math.PI) / 180)));
  const dirt = [P(0, -e * 1.4), P(S2 + e, S2 + e * 0.2), ...infArc, P(-S2 - e, S2 + e * 0.2)];
  const gi = 12;
  const grassIn = [P(0, gi * 1.4), P(S2 - gi, S2), P(0, 2 * S2 - gi * 1.4), P(-S2 + gi, S2)];
  const homeCircle = ring(0, 0, 13).map(([x, y]) => P(x, y));
  const moundRing = ring(mound[0], mound[1], 9).map(([x, y]) => P(x, y));
  const onDeckRing = ring(-30, 6, 5.5).map(([x, y]) => P(x, y));
  const pole = (sx: number) => [P(sx * R * 0.7071, R * 0.7071), P(sx * R * 0.7071, R * 0.7071, 45)];
  // Dugout paralelo a la línea de foul, fuera del terreno: pared, techo y banca.
  const dugout = (sx: number) => {
    const ux = sx * 0.7071;
    const uy = 0.7071;
    const nx = sx * 0.7071;
    const ny = -0.7071;
    const a0 = 24;
    const a1 = 62;
    const off = 24;
    const dep = 7;
    const q = (a: number, o: number, z: number) => P(ux * a + nx * o, uy * a + ny * o, z);
    return {
      wall: [q(a0, off, 0), q(a1, off, 0), q(a1, off, 7), q(a0, off, 7)],
      roof: [q(a0, off, 7), q(a1, off, 7), q(a1, off + dep, 7), q(a0, off + dep, 7)],
      bench: [q(a0 + 4, off + 0.5, 2), q(a1 - 4, off + 0.5, 2), q(a1 - 4, off + 0.5, 3.2), q(a0 + 4, off + 0.5, 3.2)],
    };
  };
  const route = g.route;
  const hp = [P(-4, 1.5), P(4, 1.5), P(4, -1.5), P(0, -4.5), P(-4, -1.5)];
  return (
    <Svg pointerEvents="none" width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#5BB4EE" />
          <Stop offset="1" stopColor="#BFE6FF" />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={W} height={H} fill="url(#sky)" />
      <Polygon points={pts([...standsTop, ...fenceTop.slice().reverse()])} fill="#1E3A5F" />
      <Polygon points={pts([P(-400, -60), P(400, -60), ...fenceBot.slice().reverse()])} fill="#3E9A42" />
      {stripes.map((s, i) => (
        <Polygon key={i} points={pts(s)} fill="#48A64C" opacity={0.9} />
      ))}
      <Polygon points={pts([...track, ...fenceBot.slice().reverse()])} fill="#B7834F" />
      <Polygon points={pts([...fenceTop, ...fenceBot.slice().reverse()])} fill="#0F5132" />
      <Polygon points={pts(dirt)} fill="#C98B4F" />
      <Polygon points={pts(grassIn)} fill="#48A64C" />
      <Polygon points={pts(homeCircle)} fill="#C98B4F" />
      {[1, -1].map((sx) => {
        const a = P(0, 0);
        const b = P(sx * R * 0.7071, R * 0.7071);
        const [p0, p1] = pole(sx);
        return (
          <React.Fragment key={sx}>
            <Line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#FFFFFF" strokeWidth={2.5} />
            <Line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="#FFD43B" strokeWidth={2} />
          </React.Fragment>
        );
      })}
      {/* Montículo con la goma del lanzador: referencia para el niño. */}
      <Polygon points={pts(moundRing)} fill="#C98B4F" stroke="#A86F3C" strokeWidth={1.5} />
      <Polygon points={pts([P(-2, 60.2, 0.6), P(2, 60.2, 0.6), P(2, 61, 0.6), P(-2, 61, 0.6)])} fill="#FFFFFF" />
      {/* Recorrido: del círculo de espera al home, la vuelta a las bases y al dugout. */}
      <Polyline points={pts(route)} fill="none" stroke="#FFFFFF" strokeWidth={3.5} strokeDasharray="2 9" strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
      <Polygon points={pts(onDeckRing)} fill="#C98B4F" stroke="#FFFFFF" strokeWidth={2} />
      {[-1, 1].map((sx) => {
        const d = dugout(sx);
        return (
          <React.Fragment key={`d${sx}`}>
            <Polygon points={pts(d.wall)} fill="#1E3A5F" stroke="#0C2340" strokeWidth={1.5} />
            <Polygon points={pts(d.bench)} fill="#FFB81C" />
            <Polygon points={pts(d.roof)} fill="#2B4A6F" stroke="#0C2340" strokeWidth={1.5} />
          </React.Fragment>
        );
      })}
      <Polygon points={pts(hp)} fill="#F1F5F9" stroke="#FFFFFF" strokeWidth={2} />
    </Svg>
  );
}

// ------------------------------------------------------------------ público
// Puntos de colores en las gradas. Cuando Pelotín corre, el público brinca en ola (8 grupos).
const DOT_COLORS = ['#FCA5A5', '#FDE68A', '#BFDBFE', '#FFFFFF', '#FDBA74'];
const GROUPS = 8;

function seeded(n: number) {
  let s = n;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function Crowd({ g, seed, cheering }: { g: StadiumGeom; seed: number; cheering: boolean }) {
  const { W, H, P, k } = g;
  const groups = useMemo(() => {
    const rnd = seeded(seed * 7 + 3);
    const out: { x: number; y: number; c: string }[][] = Array.from({ length: GROUPS }, () => []);
    for (let i = 0; i < 110; i++) {
      const t = rnd();
      const u = rnd();
      const a = ((-60 + 120 * t) * Math.PI) / 180;
      const rr = R * (1.02 + 0.2 * u);
      const q = P(rr * Math.sin(a), rr * Math.cos(a), 10 + 48 * u);
      out[Math.min(GROUPS - 1, Math.floor(t * GROUPS))].push({ x: q.x, y: q.y, c: DOT_COLORS[Math.floor(rnd() * DOT_COLORS.length)] });
    }
    return out;
  }, [P, seed]);
  const [jumps] = useState(() => Array.from({ length: GROUPS }, () => new Animated.Value(0)));
  useEffect(() => {
    if (!cheering) return;
    const loops = jumps.map((v, i) =>
      Animated.sequence([
        Animated.delay(i * 70),
        Animated.loop(
          Animated.sequence([
            Animated.timing(v, { toValue: -5 * k, duration: 170, useNativeDriver: true }),
            Animated.timing(v, { toValue: 0, duration: 170, useNativeDriver: true }),
          ]),
        ),
      ]),
    );
    loops.forEach((l) => l.start());
    return () => {
      loops.forEach((l) => l.stop());
      jumps.forEach((v) => v.setValue(0));
    };
  }, [cheering, jumps, k]);
  const r = 1.7 * k;
  if (!cheering) {
    return (
      <Svg pointerEvents="none" width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
        {groups.flat().map((d, i) => (
          <Circle key={i} cx={d.x} cy={d.y} r={r} fill={d.c} />
        ))}
      </Svg>
    );
  }
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width: W, height: H }}>
      {groups.map((grp, gi) => (
        <Animated.View key={gi} testID="crowd-jump" style={{ position: 'absolute', left: 0, top: 0, transform: [{ translateY: jumps[gi] }] }}>
          <Svg width={W} height={H}>
            {grp.map((d, i) => (
              <Circle key={i} cx={d.x} cy={d.y} r={r} fill={d.c} />
            ))}
          </Svg>
        </Animated.View>
      ))}
    </View>
  );
}
