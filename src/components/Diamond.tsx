import React, { useEffect, useState } from 'react';
import { Animated, Easing, Platform, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';
import type { FieldExtras, Target } from '@/content/types';
import { C } from '@/theme';

// Diamante dibujado como un cuadrado girado: home abajo, primera a la derecha,
// segunda arriba y tercera a la izquierda (requisito del Prompt 1).
export const VB = { w: 360, h: 300 };
export const P = {
  home: { x: 180, y: 262 },
  first: { x: 250, y: 192 },
  second: { x: 180, y: 122 },
  third: { x: 110, y: 192 },
  mound: { x: 180, y: 194 },
  onDeck: { x: 238, y: 278 },
};
// Dónde se para cada uno de los 9 jugadores de la defensa (Prompt 2):
// pitcher en el montículo, catcher detrás de home, primera y tercera en sus esquinas,
// segunda entre primera y segunda, campocorto entre segunda y tercera, jardineros mirando desde home.
export const POS = {
  mound: { x: 180, y: 194 },
  posC: { x: 180, y: 284 },
  pos1b: { x: 244, y: 166 },
  pos2b: { x: 216, y: 140 },
  posSS: { x: 144, y: 140 },
  pos3b: { x: 116, y: 166 },
  posLF: { x: 82, y: 96 },
  posCF: { x: 180, y: 54 },
  posRF: { x: 278, y: 96 },
};
/** Número oficial de cada posición, igual en todo el béisbol. */
export const POS_NUM: Record<keyof typeof POS, number> = { mound: 1, posC: 2, pos1b: 3, pos2b: 4, pos3b: 5, posSS: 6, posLF: 7, posCF: 8, posRF: 9 };
const LEFT_END = { x: 14, y: 96 };
const RIGHT_END = { x: 346, y: 96 };

// Niveles 5 a 12: lugares del campo para el vuelo de la bola, los corredores y las zonas nuevas.
// La cerca (el arco de los jardines) pasa por y≈28 en el centro.
export const XP: Record<string, { x: number; y: number }> = {
  lf: { x: 82, y: 76 },
  cf: { x: 180, y: 42 },
  rf: { x: 278, y: 76 },
  gapL: { x: 126, y: 64 },
  gapR: { x: 236, y: 64 },
  overL: { x: 74, y: 14 },
  overC: { x: 180, y: 8 },
  overR: { x: 300, y: 18 },
  poleR: { x: 340, y: 100 },
  hole56: { x: 128, y: 150 }, // entre tercera y campocorto
  hole34: { x: 232, y: 150 }, // entre primera y segunda
  midIF: { x: 180, y: 150 }, // por el medio del cuadro
  popIF: { x: 196, y: 128 }, // elevado al cuadro
  bunt: { x: 196, y: 236 },
  foulL: { x: 46, y: 172 },
  cutoff: { x: 180, y: 92 },
  backstop: { x: 232, y: 291 },
  path12: { x: 215, y: 157 },
  path23: { x: 145, y: 157 },
  path3h: { x: 145, y: 227 },
  bullpen: { x: 322, y: 172 },
  // Niveles 13 a 20: la pista de advertencia (junto a la cerca) y el carril del corredor a primera.
  track: { x: 180, y: 34 },
  lane: { x: 240, y: 212 },
};
// Dónde se para un corredor (además de las bases).
const SPOT: Record<string, { x: number; y: number }> = {
  first: P.first,
  second: P.second,
  third: P.third,
  home: { x: 166, y: 250 },
  lead1: { x: 232, y: 174 },
  lead2: { x: 160, y: 140 },
  lead3: { x: 124, y: 208 },
  past1: { x: 270, y: 174 },
  past2: { x: 162, y: 104 },
  mid12: { x: 215, y: 157 },
  mid23: { x: 145, y: 157 },
  mid3h: { x: 145, y: 227 },
  midh1: { x: 215, y: 227 },
};
export const spotPt = (s: string) => SPOT[s] ?? XP[s] ?? (P as Record<string, { x: number; y: number }>)[s] ?? P.home;

export type Hit = Target | 'none';

interface Props {
  width: number;
  highlight?: Target[];
  /** Zonas marcadas después de responder (verde = correcta, rojo = tocada mal). */
  good?: Target | null;
  bad?: Hit | null;
  onTap?: (hit: Hit) => void;
  /** Ruta que la mascota recorre (demostración). */
  run?: Target[] | null;
  runKey?: number;
  /** Ruta dibujada (actividad de arrastrar). */
  trail?: Target[];
  /** Muestra a los 9 jugadores de la defensa. */
  players?: boolean;
  /** Muestra el número oficial sobre cada jugador. */
  numbers?: boolean;
  /** Lugares vacíos (círculos punteados) para colocar fichas. */
  slots?: Target[];
  /** Batazo de foul por la línea de tercera: cae al suelo o lo atrapan en el aire. */
  foulHit?: 'ground' | 'caught';
  /** Niveles 5 a 12: corredores, vuelo de la bola, tiros y zonas nuevas. */
  fx?: FieldExtras;
  children?: React.ReactNode;
}

const ALL = { ...XP, ...P, ...POS } as Record<string, { x: number; y: number }>;
export const pt = (t: Target) => {
  if (t.startsWith('run-')) return spotPt(t.slice(4));
  if (t.startsWith('fld-')) return spotPt(t.slice(4));
  return ALL[t] ?? spotPt(t);
};

// Curva del vuelo de la bola: sale de home y llega al punto pedido.
function flightPath(kind: string, to: { x: number; y: number }) {
  const h = { x: 180, y: 256 };
  if (kind === 'ground' || kind === 'bunt' || kind === 'hitRunner') return `M${h.x} ${h.y} L${to.x} ${to.y}`;
  if (kind === 'bounceOut') {
    // pica dentro del campo y después salta la cerca
    const land = { x: to.x, y: Math.max(to.y + 44, 40) };
    return `M${h.x} ${h.y} Q${(h.x + land.x) / 2} ${land.y - 70} ${land.x} ${land.y} Q${land.x} ${(land.y + to.y) / 2 - 10} ${to.x} ${to.y}`;
  }
  const lift = kind === 'foul' ? 60 : 110;
  return `M${h.x} ${h.y} Q${(h.x + to.x) / 2} ${Math.min(h.y, to.y) - lift} ${to.x} ${to.y}`;
}

/** Arco de la pista de advertencia: un poco por dentro de la cerca. */
function trackArc() {
  const k = 226 / 236;
  const a = { x: P.home.x + (LEFT_END.x - P.home.x) * k, y: P.home.y + (LEFT_END.y - P.home.y) * k };
  const b = { x: P.home.x + (RIGHT_END.x - P.home.x) * k, y: P.home.y + (RIGHT_END.y - P.home.y) * k };
  return `M${a.x} ${a.y} A 226 226 0 0 1 ${b.x} ${b.y}`;
}

function Extras({ fx, glow, tap }: { fx: FieldExtras; glow: (t: Target) => string | null; tap: (h: Hit) => (() => void) | undefined }) {
  const ball = fx.ball;
  const to = ball ? spotPt(ball.to) : null;
  return (
    <G>
      {fx.bullpen ? (
        <G onPress={tap('bullpen')}>
          <Rect x={296} y={146} width={56} height={52} rx={8} fill="#3F8A43" stroke={glow('bullpen') ?? C.white} strokeWidth={glow('bullpen') ? 4 : 2} strokeDasharray="5 4" />
          <Circle cx={312} cy={172} r={7} fill={C.dirt} />
          <Circle cx={336} cy={172} r={7} fill={C.dirt} />
          {glow('bullpen') ? <Rect x={296} y={146} width={56} height={52} rx={8} fill={glow('bullpen')!} fillOpacity={0.3} /> : null}
        </G>
      ) : null}
      {fx.track ? (
        <G onPress={tap('track')}>
          <Path d={trackArc()} fill="none" stroke={glow('track') ?? '#B9875A'} strokeWidth={13} strokeOpacity={glow('track') ? 0.9 : 1} />
          <Path d={trackArc()} fill="none" stroke="#000" strokeOpacity={0.001} strokeWidth={30} />
        </G>
      ) : null}
      {fx.lane ? (
        <G onPress={tap('lane')}>
          <Polygon points="215,227 250,192 260,202 225,237" fill={glow('lane') ?? C.dirt} fillOpacity={glow('lane') ? 0.75 : 1} stroke={C.white} strokeWidth={2} />
          <Polygon points="205,227 250,182 272,204 227,249" fill="#000" fillOpacity={0.001} />
        </G>
      ) : null}
      {fx.backstop ? (
        <G onPress={tap('backstop')}>
          <Path d="M50 299 Q180 280 310 299" fill="none" stroke={glow('backstop') ?? '#CBD5E1'} strokeWidth={glow('backstop') ? 6 : 3} />
          <Rect x={44} y={278} width={272} height={22} fill="#000" fillOpacity={0.001} />
        </G>
      ) : null}
      {fx.path12 ? (
        <G onPress={tap('path12')}>
          <Line x1={P.first.x} y1={P.first.y} x2={P.second.x} y2={P.second.y} stroke={glow('path12') ?? C.white} strokeOpacity={glow('path12') ? 1 : 0.5} strokeWidth={glow('path12') ? 8 : 4} strokeDasharray="6 6" strokeLinecap="round" />
          <Line x1={P.first.x} y1={P.first.y} x2={P.second.x} y2={P.second.y} stroke="#000" strokeOpacity={0.001} strokeWidth={26} />
        </G>
      ) : null}
      {fx.throws && fx.throws.length > 1
        ? fx.throws.slice(1).map((k, i) => {
            const a = pt(fx.throws![i] as Target);
            const b = pt(k as Target);
            const ang = Math.atan2(b.y - a.y, b.x - a.x);
            const ax = b.x - Math.cos(ang) * 16;
            const ay = b.y - Math.sin(ang) * 16;
            return (
              <G key={`t${i}`}>
                <Line x1={a.x} y1={a.y} x2={ax} y2={ay} stroke={C.gold} strokeWidth={4} strokeDasharray="7 5" strokeLinecap="round" />
                <Polygon
                  points={`${ax + Math.cos(ang) * 8},${ay + Math.sin(ang) * 8} ${ax + Math.cos(ang + 2.4) * 8},${ay + Math.sin(ang + 2.4) * 8} ${ax + Math.cos(ang - 2.4) * 8},${ay + Math.sin(ang - 2.4) * 8}`}
                  fill={C.gold}
                />
              </G>
            );
          })
        : null}
      {ball && to ? (
        <G>
          <Path d={flightPath(ball.kind, to)} fill="none" stroke={C.white} strokeWidth={3} strokeDasharray={ball.kind === 'ground' || ball.kind === 'bunt' ? '2 5' : '3 6'} strokeLinecap="round" />
          {ball.kind === 'bounceOut' ? <Circle cx={to.x} cy={Math.max(to.y + 44, 40)} r={5} fill="#1F5E22" /> : null}
          {ball.kind === 'drop' ? <Circle cx={to.x + 10} cy={to.y + 10} r={11} fill="none" stroke={C.wrong} strokeWidth={3} /> : null}
          {ball.kind === 'caught' ? <Circle cx={to.x} cy={to.y} r={12} fill="none" stroke={C.green} strokeWidth={3} /> : null}
          <Circle testID="ball-flight" cx={ball.kind === 'drop' ? to.x + 10 : to.x} cy={ball.kind === 'drop' ? to.y + 10 : to.y} r={6.5} fill={C.white} stroke={C.red} strokeWidth={1.5} />
        </G>
      ) : null}
      {fx.fielders?.map((f) => {
        const p = spotPt(f);
        const id = `fld-${f}` as Target;
        const g = glow(id);
        return (
          <G key={id} onPress={tap(id)}>
            <Circle cx={p.x} cy={p.y} r={19} fill="#000" fillOpacity={0.001} />
            {g ? <Circle cx={p.x} cy={p.y} r={17} fill={g} fillOpacity={0.4} stroke={g} strokeWidth={3} /> : null}
            <Circle cx={p.x} cy={p.y + 1} r={11} fill={C.navy} stroke={C.white} strokeWidth={2} />
            <Path d={`M${p.x - 9} ${p.y - 3} a 9 7 0 0 1 18 0 z`} fill={C.red} />
          </G>
        );
      })}
      {fx.runners?.map((r) => {
        const p = spotPt(r);
        const id = `run-${r}` as Target;
        const g = glow(id);
        return (
          <G key={id} onPress={tap(id)}>
            <Circle cx={p.x} cy={p.y} r={19} fill="#000" fillOpacity={0.001} />
            {g ? <Circle cx={p.x} cy={p.y} r={17} fill={g} fillOpacity={0.4} stroke={g} strokeWidth={3} /> : null}
            <Circle cx={p.x} cy={p.y} r={10} fill={C.red} stroke={C.white} strokeWidth={2.5} />
            <Path d={`M${p.x - 8} ${p.y - 2} a 8 7 0 0 1 16 0 z`} fill={C.navy} />
          </G>
        );
      })}
    </G>
  );
}

export default function Diamond({ width, highlight = [], good, bad, onTap, run, runKey, trail, players, numbers, slots, foulHit, fx, children }: Props) {
  const s = width / VB.w;
  const height = VB.h * s;
  const hl = (t: Target) => highlight.includes(t) || highlight.includes('all');
  const tap = (h: Hit) => (onTap ? () => onTap(h) : undefined);
  const glow = (t: Target) => {
    if (good === t) return C.green;
    if (bad === t) return C.wrong;
    return hl(t) ? C.gold : null;
  };

  // Brillo que late sobre lo resaltado.
  const [pulse] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 650, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(pulse, { toValue: 0, duration: 650, useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] });

  // Mascota corriendo las bases.
  const [pos] = useState(() => new Animated.ValueXY({ x: P.home.x, y: P.home.y }));
  useEffect(() => {
    if (!run || run.length < 2) return;
    pos.setValue(pt(run[0]));
    const steps = run.slice(1).map((t) =>
      Animated.timing(pos, { toValue: pt(t), duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
    );
    const anim = Animated.sequence([Animated.delay(300), ...steps]);
    anim.start();
    return () => anim.stop();
  }, [run, runKey, pos]);

  const lineGlow = glow('foulLine');
  const fieldGlow = glow('outfield');
  const dirtGlow = glow('infield');
  const dugGlow = glow('dugout');

  const base = (t: 'first' | 'second' | 'third') => {
    const p = P[t];
    const g = glow(t);
    return (
      <G key={t} onPress={tap(t)}>
        {/* zona de toque más grande que la base */}
        <Circle cx={p.x} cy={p.y} r={20} fill="#000" fillOpacity={0.001} />
        {g ? <Circle cx={p.x} cy={p.y} r={17} fill={g} fillOpacity={0.35} stroke={g} strokeWidth={3} /> : null}
        <Rect x={p.x - 8} y={p.y - 8} width={16} height={16} fill={C.white} stroke="#8a6a44" strokeWidth={1} transform={`rotate(45 ${p.x} ${p.y})`} />
      </G>
    );
  };

  const homeGlow = glow('home');
  const deckGlow = glow('onDeck');

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox={`0 0 ${VB.w} ${VB.h}`}>
        {/* Territorio de foul (fondo) */}
        <Rect x={0} y={0} width={VB.w} height={VB.h} rx={22} fill="#2A6E2D" />
        {/* Jardines (outfield) */}
        <G onPress={tap('outfield')}>
          <Path d={`M${P.home.x} ${P.home.y} L${LEFT_END.x} ${LEFT_END.y} A 236 236 0 0 1 ${RIGHT_END.x} ${RIGHT_END.y} Z`} fill={C.grass} />
          {fieldGlow ? (
            <Path d={`M${P.home.x} ${P.home.y} L${LEFT_END.x} ${LEFT_END.y} A 236 236 0 0 1 ${RIGHT_END.x} ${RIGHT_END.y} Z`} fill={fieldGlow} fillOpacity={0.28} stroke={fieldGlow} strokeWidth={4} />
          ) : null}
        </G>
        {/* Cuadro (infield): tierra y pasto interior */}
        <G onPress={tap('infield')}>
          <Polygon points={`180,280 268,192 180,104 92,192`} fill={C.dirt} />
          <Polygon points={`180,248 236,192 180,136 124,192`} fill={C.grass} />
          {dirtGlow ? <Polygon points={`180,280 268,192 180,104 92,192`} fill={dirtGlow} fillOpacity={0.3} stroke={dirtGlow} strokeWidth={4} /> : null}
        </G>
        {/* Montículo */}
        <G onPress={tap('mound')}>
          <Circle cx={P.mound.x} cy={P.mound.y} r={11} fill={C.dirt} />
          <Rect x={P.mound.x - 5} y={P.mound.y - 1.5} width={10} height={3} fill={C.white} />
        </G>
        {/* Líneas de foul: zona de toque ancha e invisible encima de la línea */}
        <G onPress={tap('foulLine')}>
          <Line x1={P.home.x} y1={P.home.y} x2={LEFT_END.x} y2={LEFT_END.y} stroke={lineGlow ?? C.white} strokeWidth={lineGlow ? 6 : 3} strokeLinecap="round" />
          <Line x1={P.home.x} y1={P.home.y} x2={RIGHT_END.x} y2={RIGHT_END.y} stroke={lineGlow ?? C.white} strokeWidth={lineGlow ? 6 : 3} strokeLinecap="round" />
          <Line x1={P.home.x} y1={P.home.y} x2={LEFT_END.x} y2={LEFT_END.y} stroke="#000" strokeOpacity={0.001} strokeWidth={22} />
          <Line x1={P.home.x} y1={P.home.y} x2={RIGHT_END.x} y2={RIGHT_END.y} stroke="#000" strokeOpacity={0.001} strokeWidth={22} />
        </G>
        {/* Dugouts a los dos lados, en territorio de foul */}
        <G onPress={tap('dugout')}>
          {[{ x: 8, y: 236 }, { x: 278, y: 236 }].map((d, i) => (
            <G key={i}>
              <Rect x={d.x} y={d.y} width={74} height={30} rx={6} fill="#5B4636" stroke={dugGlow ?? '#3E2F24'} strokeWidth={dugGlow ? 4 : 1.5} />
              <Rect x={d.x + 6} y={d.y + 16} width={62} height={6} rx={2} fill="#C9A27A" />
              {dugGlow ? <Rect x={d.x} y={d.y} width={74} height={30} rx={6} fill={dugGlow} fillOpacity={0.3} /> : null}
            </G>
          ))}
        </G>
        {/* Círculo de espera (on-deck) */}
        <G onPress={tap('onDeck')}>
          <Circle cx={P.onDeck.x} cy={P.onDeck.y} r={16} fill="#000" fillOpacity={0.001} />
          <Circle cx={P.onDeck.x} cy={P.onDeck.y} r={9} fill="none" stroke={deckGlow ?? C.white} strokeWidth={deckGlow ? 4 : 2} />
        </G>
        {/* Ruta del corredor (arrastrar) */}
        {trail && trail.length > 1
          ? trail.slice(1).map((t, i) => {
              const a = pt(trail[i]);
              const b = pt(t);
              return <Line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />;
            })
          : null}
        {base('first')}
        {base('second')}
        {base('third')}
        {/* Home: placa plana con punta, como una casita */}
        <G onPress={tap('home')}>
          <Circle cx={P.home.x} cy={P.home.y} r={20} fill="#000" fillOpacity={0.001} />
          {homeGlow ? <Circle cx={P.home.x} cy={P.home.y} r={17} fill={homeGlow} fillOpacity={0.35} stroke={homeGlow} strokeWidth={3} /> : null}
          <Polygon points={`172,256 188,256 188,264 180,271 172,264`} fill={C.white} stroke="#8a6a44" strokeWidth={1} />
        </G>
        {foulHit ? (
          <G>
            {/* Vuelo de la pelota: sale de home y cruza la línea de tercera hacia territorio de foul */}
            <Path d={foulHit === 'ground' ? 'M180 258 Q110 150 46 172' : 'M180 258 Q112 146 74 194'} fill="none" stroke={C.white} strokeWidth={3} strokeDasharray="3 6" strokeLinecap="round" />
            {foulHit === 'ground' ? <Circle cx={46} cy={180} r={6} fill="#1F5E22" /> : null}
            <Circle testID="foul-ball" cx={foulHit === 'ground' ? 46 : 74} cy={foulHit === 'ground' ? 172 : 194} r={7} fill={C.white} stroke={C.red} strokeWidth={1.5} />
          </G>
        ) : null}
        {fx ? <Extras fx={fx} glow={glow} tap={tap} /> : null}
        {slots?.map((id) => (
          <Circle key={`slot-${id}`} cx={pt(id).x} cy={pt(id).y} r={17} fill={C.white} fillOpacity={0.18} stroke={C.white} strokeWidth={2.5} strokeDasharray="4 4" />
        ))}
        {players
          ? (Object.keys(POS) as (keyof typeof POS)[]).map((id) => {
              const p = POS[id];
              const g = glow(id);
              return (
                <G key={id} onPress={tap(id)}>
                  <Circle cx={p.x} cy={p.y} r={19} fill="#000" fillOpacity={0.001} />
                  {g ? <Circle cx={p.x} cy={p.y} r={17} fill={g} fillOpacity={0.4} stroke={g} strokeWidth={3} /> : null}
                  <Circle cx={p.x} cy={p.y + 1} r={11} fill={C.navy} stroke={C.white} strokeWidth={2} />
                  <Path d={`M${p.x - 9} ${p.y - 3} a 9 7 0 0 1 18 0 z`} fill={C.red} />
                  {numbers ? (
                    <SvgText x={p.x} y={p.y + 6} fontSize={11} fontWeight="bold" fill={C.white} textAnchor="middle">
                      {String(POS_NUM[id])}
                    </SvgText>
                  ) : null}
                </G>
              );
            })
          : null}
      </Svg>
      {/* Capa que late sobre lo resaltado (solo visual) */}
      {highlight.length ? (
        <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width, height, opacity: pulseOpacity }}>
          <Svg width={width} height={height} viewBox={`0 0 ${VB.w} ${VB.h}`}>
            {highlight.filter((t) => ['first', 'second', 'third', 'home', 'onDeck', 'cutoff', 'backstop', 'path12', 'track', 'lane', ...Object.keys(POS)].includes(t) || t.startsWith('run-') || t.startsWith('fld-')).map((t) => (
              <Circle key={t} cx={pt(t).x} cy={pt(t).y} r={24} fill="none" stroke={C.gold} strokeWidth={4} />
            ))}
          </Svg>
        </Animated.View>
      ) : null}
      {run && run.length > 1 ? (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: 30 * s,
            height: 30 * s,
            borderRadius: 15 * s,
            backgroundColor: C.red,
            borderWidth: 3,
            borderColor: C.white,
            transform: [
              { translateX: Animated.subtract(Animated.multiply(pos.x, s), 15 * s) },
              { translateY: Animated.subtract(Animated.multiply(pos.y, s), 15 * s) },
            ],
          }}
        />
      ) : null}
      {children}
    </View>
  );
}

/** ¿La zona tocada cuenta como el objetivo pedido? */
export function hitMatches(hit: Hit, target: Target): boolean {
  if (hit === target) return true;
  // Tocar al corredor parado sobre una base cuenta como tocar esa base (y al revés).
  if (hit === `run-${target}` || target === `run-${hit}`) return true;
  // El cuadro incluye sus bases y el montículo.
  if (target === 'infield' && (hit === 'first' || hit === 'second' || hit === 'third' || hit === 'mound')) return true;
  // "Toca junto a primera / tercera": vale la base o el jugador que la cuida.
  if (target === 'pos1b' && hit === 'first') return true;
  if (target === 'pos3b' && hit === 'third') return true;
  // "Toca a un jardinero": cualquiera de los tres, o los jardines.
  if (target === 'anyOF' && (hit === 'posLF' || hit === 'posCF' || hit === 'posRF' || hit === 'outfield')) return true;
  // El montículo y el pitcher son el mismo lugar.
  // Tocar el camino entre primera y segunda: vale el corredor que está ahí.
  if (target === 'path12' && (hit === 'run-lead1' || hit === 'run-mid12')) return true;
  return false;
}
