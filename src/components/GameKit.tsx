import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { CoinBall } from '@/components/Art';
import Pelotin from '@/components/Pelotin';
import { Btn } from '@/components/ui';
import type { Avatar } from '@/content/shop';
import type { GameReward } from '@/state/store';
import { C, F } from '@/theme';

// Piezas comunes de los minijuegos: pantalla de inicio, pantalla final, encabezado, marcador,
// botón grande de acción, la bola y el público de las gradas que brinca.

export const RIVAL: Avatar = { cap: 'cap-blue', uniform: 'uni-blue', bat: 'bat-wood', number: 7 };
export const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Temporizadores que se cancelan solos al salir de la pantalla. */
export function useTimers() {
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    const list = timers;
    return () => {
      alive.current = false;
      list.current.forEach(clearTimeout);
      list.current = [];
    };
  }, []);
  return useMemo(
    () => ({
      alive,
      later(fn: () => void, ms: number) {
        const id = setTimeout(() => alive.current && fn(), ms);
        timers.current.push(id);
      },
      clear() {
        timers.current.forEach(clearTimeout);
        timers.current = [];
      },
    }),
    [],
  );
}

export function BackBtn({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={{ width: 44, height: 44, justifyContent: 'center' }}>
      <Svg width={28} height={28} viewBox="0 0 24 24">
        <Path d="M15 5l-7 7 7 7" fill="none" stroke={C.white} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Pressable>
  );
}

const page = { paddingHorizontal: 20, gap: 16, alignItems: 'center' as const, maxWidth: 560, width: '100%' as const, alignSelf: 'center' as const };

export function GameIntro({ label, title, intro, rule, art, best, play, back, onStart, onBack }: { label: string; title: string; intro: string; rule: string; art: React.ReactNode; best?: string; play: string; back: string; onStart: () => void; onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.navy }} contentContainerStyle={{ ...page, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }}>
      <View style={{ alignSelf: 'stretch' }}>
        <BackBtn onPress={onBack} label={back} />
      </View>
      <Text style={{ fontFamily: F.bodyHeavy, fontSize: 14, letterSpacing: 1.5, color: C.gold }}>{label}</Text>
      <Text style={{ fontFamily: F.display, fontSize: 44, color: C.white, textAlign: 'center' }}>{title}</Text>
      {art}
      <View style={{ backgroundColor: C.white, borderRadius: 20, padding: 18, gap: 10, alignSelf: 'stretch' }}>
        <Text style={{ fontFamily: F.bodyBold, fontSize: 18, lineHeight: 25, color: C.ink }}>{intro}</Text>
        <Text style={{ fontFamily: F.body, fontSize: 16, lineHeight: 22, color: C.muted }}>{rule}</Text>
      </View>
      {best ? <Text style={{ fontFamily: F.bodyHeavy, fontSize: 16, color: C.gold }}>{best}</Text> : null}
      <Btn testID="game-start" label={play} variant="gold" style={{ alignSelf: 'stretch' }} onPress={onStart} />
    </ScrollView>
  );
}

export function GameOver({ title, rows, reward, newBest, capText, coinsText, bestText, again, toPath, onAgain, onExit }: { title: string; rows: [string, number][]; reward: GameReward | null; newBest: string; capText: string; coinsText: string; bestText: string; again: string; toPath: string; onAgain: () => void; onExit: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.navy }} contentContainerStyle={{ ...page, gap: 14, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}>
      <Pelotin size={120} mood="cheer" />
      <Text testID="game-over" style={{ fontFamily: F.display, fontSize: 38, color: C.gold, textAlign: 'center' }}>
        {title}
      </Text>
      {reward?.newBest ? <Text style={{ fontFamily: F.bodyHeavy, fontSize: 20, color: C.white }}>{newBest}</Text> : null}
      <View style={{ backgroundColor: C.white, borderRadius: 20, padding: 18, gap: 10, alignSelf: 'stretch' }}>
        {rows.map(([label, value]) => (
          <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontFamily: F.bodyBold, fontSize: 18, color: C.muted }}>{label}</Text>
            <Text style={{ fontFamily: F.display, fontSize: 30, color: C.ink }}>{value}</Text>
          </View>
        ))}
      </View>
      {reward && reward.coins > 0 ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <CoinBall size={26} />
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 20, color: C.white }}>{coinsText}</Text>
        </View>
      ) : null}
      {reward?.capped ? <Text style={{ fontFamily: F.body, fontSize: 15, lineHeight: 21, color: '#CBD5E1', textAlign: 'center' }}>{capText}</Text> : null}
      <Text style={{ fontFamily: F.bodyBold, fontSize: 16, color: '#CBD5E1' }}>{bestText}</Text>
      <Btn testID="game-again" label={again} variant="gold" style={{ alignSelf: 'stretch' }} onPress={onAgain} />
      <Btn label={toPath} variant="ghost" style={{ alignSelf: 'stretch' }} onPress={onExit} />
    </ScrollView>
  );
}

export function GameHeader({ title, back, onBack, right }: { title: string; back: string; onBack: () => void; right?: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 6, gap: 8, maxWidth: 560, width: '100%', alignSelf: 'center' }}>
      <BackBtn onPress={onBack} label={back} />
      <Text numberOfLines={1} adjustsFontSizeToFit style={{ flex: 1, fontFamily: F.display, fontSize: 24, color: C.white }}>
        {title}
      </Text>
      {right}
    </View>
  );
}

function Dots({ n, of, color }: { n: number; of: number; color: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {Array.from({ length: of }, (_, i) => (
        <View key={i} style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: i < n ? color : 'rgba(255,255,255,0.18)' }} />
      ))}
    </View>
  );
}

/** Marcador como el del estadio: filas de puntos (B, S, O...) y un número grande a la derecha. */
export function Board({ rows, label, n }: { rows: { k: string; n: number; of: number; color: string }[]; label: string; n: number }) {
  return (
    <View testID="game-count" style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.navyDeep, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 }}>
      {rows.length ? (
        <View style={{ gap: 3 }}>
          {rows.map((r) => (
            <View key={r.k} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Text style={{ minWidth: 12, fontFamily: F.bodyHeavy, fontSize: 12, color: '#CBD5E1' }}>{r.k}</Text>
              <Dots n={r.n} of={r.of} color={r.color} />
            </View>
          ))}
        </View>
      ) : null}
      <View style={{ alignItems: 'center', minWidth: 28 }}>
        <Text style={{ fontFamily: F.bodyHeavy, fontSize: 11, color: '#CBD5E1' }}>{label}</Text>
        <Text testID="game-score" style={{ fontFamily: F.display, fontSize: 24, color: C.white }}>
          {n}
        </Text>
      </View>
    </View>
  );
}

/** Botón grande de abajo (BATEA, PICHA...). Se activa al apoyar el dedo, sin esperar a soltarlo. */
export function ActionBtn({ label, onPress, active, color = C.red, shadow = C.redDark, dim = '#7F1D2D', testID, flex }: { label: string; onPress: () => void; active: boolean; color?: string; shadow?: string; dim?: string; testID?: string; flex?: boolean }) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPressIn={onPress}
      onPress={onPress}
      unstable_pressDelay={0}
      style={({ pressed }) => [
        { flex: flex ? 1 : undefined, minHeight: 84, borderRadius: 22, backgroundColor: active ? color : dim, alignItems: 'center', justifyContent: 'center', marginTop: pressed ? 5 : 0, marginBottom: pressed ? 0 : 5 },
        Platform.OS === 'web' ? ({ boxShadow: `0 ${pressed ? 0 : 6}px 0 ${shadow}` } as object) : { shadowColor: shadow, shadowOffset: { width: 0, height: pressed ? 0 : 6 }, shadowOpacity: 1, shadowRadius: 0 },
      ]}
    >
      <Text adjustsFontSizeToFit numberOfLines={1} style={{ fontFamily: F.display, fontSize: 36, letterSpacing: 2, color: C.white, paddingHorizontal: 8 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Ball({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={11} fill={C.white} stroke="#CBD5E1" strokeWidth={1} />
      <Path d="M6 4q4 8 0 16M18 4q-4 8 0 16" fill="none" stroke={C.red} strokeWidth={1.6} strokeDasharray="2 1.6" />
    </Svg>
  );
}

/** Texto grande de la jugada (¡HIT!, STRIKE...) con una explicación corta debajo. */
export function CallText({ text, tip, big, top }: { text: string; tip?: string | null; big?: boolean; top: number }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top, alignItems: 'center', gap: 6 }}>
      <Text testID="game-call" style={{ fontFamily: F.display, fontSize: big ? 58 : 48, color: big ? C.gold : C.white, textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 6, textAlign: 'center' }}>
        {text}
      </Text>
      {tip ? (
        <View style={{ backgroundColor: 'rgba(12,35,64,0.88)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6, marginHorizontal: 20 }}>
          <Text testID="game-tip" style={{ fontFamily: F.bodyBold, fontSize: 16, color: C.white, textAlign: 'center' }}>
            {tip}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

// ------------------------------------------------------------------ público de las gradas
// Igual que en el camino: puntos de colores en las gradas, en 8 grupos que brincan en ola cuando hay un hit.
const DOT_COLORS = ['#FCA5A5', '#FDE68A', '#BFDBFE', '#FFFFFF', '#FDBA74'];
const GROUPS = 8;

function seeded(n: number) {
  let x = n;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
}

/**
 * Público en las gradas del fondo. `box` es el rectángulo de las gradas en unidades del dibujo
 * y `map` pasa esas unidades a píxeles de la pantalla.
 */
export function Fans({ box, s, ox = 0, oy = 0, cheering }: { box: { x: number; y: number; w: number; h: number }; s: number; ox?: number; oy?: number; cheering: boolean }) {
  const groups = useMemo(() => {
    const rnd = seeded(11);
    const out: { x: number; y: number; c: string }[][] = Array.from({ length: GROUPS }, () => []);
    const cols = Math.round(box.w / 9);
    const rows = Math.max(1, Math.round(box.h / 9));
    for (let r = 0; r < rows; r++)
      for (let i = 0; i < cols; i++) {
        const x = box.x + 4 + i * 9 + (r % 2) * 4.5 + (rnd() - 0.5) * 2;
        const y = box.y + 5 + r * 9 + (rnd() - 0.5) * 2;
        out[Math.min(GROUPS - 1, Math.floor(((x - box.x) / box.w) * GROUPS))].push({ x, y, c: DOT_COLORS[Math.floor(rnd() * DOT_COLORS.length)] });
      }
    return out;
  }, [box.x, box.y, box.w, box.h]);
  const [jumps] = useState(() => Array.from({ length: GROUPS }, () => new Animated.Value(0)));
  useEffect(() => {
    if (!cheering) return;
    const loops = jumps.map((v, i) =>
      Animated.sequence([
        Animated.delay(i * 70),
        Animated.loop(
          Animated.sequence([
            Animated.timing(v, { toValue: -4 * s, duration: 170, useNativeDriver: true }),
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
  }, [cheering, jumps, s]);
  const W = box.w * s;
  const H = (box.h + 8) * s;
  return (
    <View testID={cheering ? 'fans-cheer' : 'fans'} pointerEvents="none" style={{ position: 'absolute', left: (box.x - ox) * s, top: (box.y - 4 - oy) * s, width: W, height: H }}>
      {groups.map((grp, gi) => (
        <Animated.View key={gi} style={{ position: 'absolute', left: 0, top: 0, transform: [{ translateY: jumps[gi] }] }}>
          <Svg width={W} height={H} viewBox={`${box.x} ${box.y - 4} ${box.w} ${box.h + 8}`}>
            {grp.map((d, i) => (
              <Circle key={i} cx={d.x} cy={d.y} r={3.1} fill={d.c} />
            ))}
          </Svg>
        </Animated.View>
      ))}
    </View>
  );
}
