// Graduación del nivel 20: la noche de estrellas en el estadio (fuegos artificiales, público
// celebrando y Pelotín saltando), la tarjeta dorada que se da vuelta y el certificado para
// imprimir o compartir (detrás de la puerta para papás).
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Polygon, Rect, RadialGradient, Stop } from 'react-native-svg';
import { BadgeMedal, Mascot } from '@/components/Art';
import { Fans, rand } from '@/components/GameKit';
import ParentGate from '@/components/ParentGate';
import PelotinBody from '@/components/PelotinBody';
import { tapFeedback } from '@/components/ui';
import { LEVELS } from '@/content/levels';
import type { Avatar } from '@/content/shop';
import { MINIGAMES } from '@/content/minigames';
import { printCertificate, shareCertificate, type CertText } from '@/services/certificate';
import { startGradMusic, startLevelMusicIfPending, stopGradMusic } from '@/services/music';
import { playSfx } from '@/services/sfx';
import { avatarOf, useStore } from '@/state/store';
import { C, F } from '@/theme';

type Phase = 'party' | 'card' | 'cert' | 'gate';
const GOLD = ['#FFF3B0', '#FFD54A', '#E0A100', '#FFE48A', '#B7800F'];
const FW_COLORS = [C.gold, '#F472B6', '#60A5FA', '#34D399', '#F87171', C.white];
const CONFETTI = [C.red, C.gold, '#60A5FA', '#34D399', '#F472B6', C.white];

const dateText = (iso: string | undefined, locale: string) => {
  const d = iso ? new Date(iso) : new Date();
  try {
    return d.toLocaleDateString(locale === 'zh-Hans' ? 'zh-CN' : locale, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return d.toISOString().slice(0, 10);
  }
};

// ------------------------------------------------------------------ Fuegos artificiales
function Burst({ size, col }: { size: number; col: string }) {
  const r = size / 2;
  const rays = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    rays.push(<Path key={i} d={`M${r + Math.cos(a) * r * 0.3} ${r + Math.sin(a) * r * 0.3} L${r + Math.cos(a) * r * 0.85} ${r + Math.sin(a) * r * 0.85}`} stroke={col} strokeWidth={2.4} strokeLinecap="round" />);
    rays.push(<Circle key={'d' + i} cx={r + Math.cos(a) * r * 0.95} cy={r + Math.sin(a) * r * 0.95} r={2.2} fill={col} />);
  }
  return (
    <Svg width={size} height={size}>
      <Circle cx={r} cy={r} r={r * 0.12} fill={col} />
      {rays}
    </Svg>
  );
}

/** Un cohete que estalla una y otra vez en lugares distintos del cielo. */
function Firework({ W, skyH, delay, onPop }: { W: number; skyH: number; delay: number; onPop?: () => void }) {
  const [v] = useState(() => new Animated.Value(0));
  const [spot, setSpot] = useState(() => ({ x: rand(0.1, 0.9) * W, y: rand(0.15, 0.75) * skyH, size: rand(90, 150), col: FW_COLORS[Math.floor(rand(0, FW_COLORS.length))] }));
  useEffect(() => {
    let alive = true;
    let first = true;
    const run = () => {
      if (!alive) return;
      v.setValue(0);
      if (!first) setSpot({ x: rand(0.1, 0.9) * W, y: rand(0.15, 0.75) * skyH, size: rand(90, 150), col: FW_COLORS[Math.floor(rand(0, FW_COLORS.length))] });
      first = false;
      onPop?.();
      Animated.timing(v, { toValue: 1, duration: 1300, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(({ finished }) => {
        if (finished && alive) setTimeout(run, rand(200, 700));
      });
    };
    const id = setTimeout(run, delay);
    return () => {
      alive = false;
      clearTimeout(id);
      v.stopAnimation();
    };
  }, [v, W, skyH, delay, onPop]);
  const scale = v.interpolate({ inputRange: [0, 1], outputRange: [0.15, 1.15] });
  const opacity = v.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 0.9, 0] });
  return (
    <Animated.View pointerEvents="none" style={{ position: 'absolute', left: spot.x - spot.size / 2, top: spot.y - spot.size / 2, opacity, transform: [{ scale }] }}>
      <Burst size={spot.size} col={spot.col} />
    </Animated.View>
  );
}

// ------------------------------------------------------------------ Confeti cayendo
function Confetti({ W, H, n }: { W: number; H: number; n: number }) {
  const [bits] = useState(() =>
    Array.from({ length: n }, (_, i) => ({ x: rand(0, W), dur: rand(2600, 5200), delay: rand(0, 3000), rot: rand(0, 180), col: CONFETTI[i % CONFETTI.length], sway: rand(-30, 30), v: new Animated.Value(0) })),
  );
  useEffect(() => {
    const loops = bits.map((b) => Animated.sequence([Animated.delay(b.delay), Animated.loop(Animated.timing(b.v, { toValue: 1, duration: b.dur, easing: Easing.linear, useNativeDriver: true }))]));
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [bits]);
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width: W, height: H }}>
      {bits.map((b, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: b.x,
            top: -12,
            width: 8,
            height: 4,
            backgroundColor: b.col,
            transform: [
              { translateY: b.v.interpolate({ inputRange: [0, 1], outputRange: [0, H + 24] }) },
              { translateX: b.v.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, b.sway, 0] }) },
              { rotate: b.v.interpolate({ inputRange: [0, 1], outputRange: [`${b.rot}deg`, `${b.rot + 540}deg`] }) },
            ],
          }}
        />
      ))}
    </View>
  );
}

// ------------------------------------------------------------------ Pelotín saltando
function JumpingPelotin({ avatar, h }: { avatar: Avatar; h: number }) {
  const [v] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 300, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.delay(120),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v]);
  const jump = h * 0.28;
  return (
    <View style={{ width: h, height: h + jump, alignItems: 'center', justifyContent: 'flex-end' }}>
      <Animated.View style={{ position: 'absolute', bottom: -6, opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.15] }), transform: [{ scaleX: v.interpolate({ inputRange: [0, 1], outputRange: [1, 0.6] }) }] }}>
        <Svg width={h * 0.6} height={14}>
          <Ellipse cx={h * 0.3} cy={7} rx={h * 0.3} ry={6} fill="#000" />
        </Svg>
      </Animated.View>
      <Animated.View testID="grad-pelotin" style={{ transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -jump] }) }] }}>
        <PelotinBody avatar={avatar} height={h} holdBat face={{ mood: 'cheer' }} />
      </Animated.View>
    </View>
  );
}

// ------------------------------------------------------------------ Tarjeta dorada
function CardFrame({ w, children }: { w: number; children: React.ReactNode }) {
  const h = w * 1.4;
  return (
    <View style={{ width: w, height: h, borderRadius: 16, overflow: 'hidden' }}>
      <Svg width={w} height={h} style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
            {GOLD.map((c, i) => (
              <Stop key={i} offset={i / (GOLD.length - 1)} stopColor={c} />
            ))}
          </LinearGradient>
          <RadialGradient id="sky" cx="0.5" cy="0.4" r="0.7">
            <Stop offset="0" stopColor="#1E40AF" />
            <Stop offset="1" stopColor={C.navy} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={w} height={h} fill="url(#gold)" />
        <Rect x={10} y={10} width={w - 20} height={h * 0.66} rx={10} fill="url(#sky)" stroke="#7C5A06" strokeWidth={2} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Polygon key={i} points={`${w / 2},${h * 0.36} ${w / 2 + Math.cos(i * 0.785) * w},${h * 0.36 + Math.sin(i * 0.785) * w} ${w / 2 + Math.cos(i * 0.785 + 0.2) * w},${h * 0.36 + Math.sin(i * 0.785 + 0.2) * w}`} fill="#FFFFFF" opacity={0.07} />
        ))}
      </Svg>
      {children}
    </View>
  );
}

function CardFront({ w, name, avatar }: { w: number; name: string; avatar: Avatar }) {
  const { t } = useStore();
  const h = w * 1.4;
  return (
    <CardFrame w={w}>
      <View style={{ position: 'absolute', top: 16, left: 0, right: 0, alignItems: 'center' }}>
        <Text style={{ fontFamily: F.display, fontSize: w * 0.075, color: C.gold, letterSpacing: 2 }}>★ ALL STAR ★</Text>
      </View>
      <View style={{ position: 'absolute', top: h * 0.12, left: 0, right: 0, alignItems: 'center' }}>
        <PelotinBody avatar={avatar} height={h * 0.52} holdBat face={{ mood: 'cheer' }} />
      </View>
      <View style={{ position: 'absolute', bottom: h * 0.06, left: 8, right: 8, alignItems: 'center' }}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: F.display, fontSize: w * 0.13, color: C.navy }}>
          {name.toUpperCase()}
        </Text>
        <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: F.bodyHeavy, fontSize: w * 0.05, color: '#5B3B00', letterSpacing: 1.2 }}>
          {t('grad.hof')}
        </Text>
        <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: F.bodyBold, fontSize: w * 0.045, color: '#5B3B00', marginTop: 2 }}>
          {t('grad.line')}
        </Text>
      </View>
    </CardFrame>
  );
}

function Row({ k, v, w }: { k: string; v: string; w: number }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.15)', paddingVertical: w * 0.011 }}>
      <Text numberOfLines={1} style={{ fontFamily: F.bodyBold, fontSize: w * 0.046, color: '#CBD5E1', flexShrink: 1 }}>{k}</Text>
      <Text style={{ fontFamily: F.bodyHeavy, fontSize: w * 0.046, color: C.white }}>{v}</Text>
    </View>
  );
}

function CardBack({ w, name }: { w: number; name: string }) {
  const { t, p, locale } = useStore();
  const h = w * 1.4;
  const lessons = LEVELS.reduce((a, l) => a + l.lessons.length, 0);
  const done = Object.keys(p.completed).length;
  const badges = LEVELS.filter((l) => p.examsPassed[String(l.n)]).length;
  return (
    <CardFrame w={w}>
      <View testID="grad-card-back" style={{ position: 'absolute', top: 18, left: 22, right: 22, height: h * 0.66 - 16 }}>
        <Text style={{ fontFamily: F.display, fontSize: w * 0.08, color: C.gold, textAlign: 'center', marginBottom: 4 }}>{t('grad.backTitle')}</Text>
        <Row w={w} k={t('grad.lessons')} v={`${Math.min(done, lessons)}/${lessons}`} />
        <Row w={w} k={t('grad.badges')} v={`${badges}/${LEVELS.length}`} />
        <Row w={w} k={t('grad.xp')} v={p.xp.toLocaleString('en-US')} />
        <Text style={{ fontFamily: F.bodyHeavy, fontSize: w * 0.047, color: C.gold, marginTop: 6, marginBottom: 0 }}>{t('grad.records')}</Text>
        {MINIGAMES.map((g) => (
          <Row w={w} key={g.id} k={t(g.title)} v={String(p.games?.[g.id]?.best ?? 0)} />
        ))}
      </View>
      <View style={{ position: 'absolute', bottom: h * 0.07, left: 8, right: 8, alignItems: 'center', gap: 2 }}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: F.display, fontSize: w * 0.1, color: C.navy }}>
          {name.toUpperCase()}
        </Text>
        <Text style={{ fontFamily: F.bodyBold, fontSize: w * 0.048, color: '#5B3B00' }}>{t('grad.since', { date: dateText(p.graduated, locale) })}</Text>
      </View>
    </CardFrame>
  );
}

function GoldenCard({ w, name, avatar }: { w: number; name: string; avatar: Avatar }) {
  const [enter] = useState(() => new Animated.Value(0));
  const [flip] = useState(() => new Animated.Value(1));
  const [shine] = useState(() => new Animated.Value(0));
  const [back, setBack] = useState(false);
  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 900, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }).start();
    const loop = Animated.loop(Animated.sequence([Animated.delay(900), Animated.timing(shine, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }), Animated.delay(1400)]));
    loop.start();
    return () => loop.stop();
  }, [enter, shine]);
  const turn = () => {
    tapFeedback();
    playSfx('bat');
    Animated.timing(flip, { toValue: 0, duration: 160, easing: Easing.in(Easing.quad), useNativeDriver: true }).start(() => {
      setBack((b) => !b);
      Animated.timing(flip, { toValue: 1, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    });
  };
  const h = w * 1.4;
  return (
    <Animated.View
      style={{
        opacity: enter.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 1] }),
        transform: [{ scale: enter.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) }, { rotate: enter.interpolate({ inputRange: [0, 1], outputRange: ['-200deg', '0deg'] }) }],
      }}
    >
      <Pressable testID="grad-card" accessibilityRole="button" onPress={turn} unstable_pressDelay={0}>
        <Animated.View style={{ transform: [{ scaleX: flip }], borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.45)' } as object}>
          {back ? <CardBack w={w} name={name} /> : <CardFront w={w} name={name} avatar={avatar} />}
          <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, borderRadius: 16, overflow: 'hidden' }}>
            <Animated.View style={{ position: 'absolute', top: -h * 0.2, width: w * 0.28, height: h * 1.4, backgroundColor: 'rgba(255,255,255,0.28)', transform: [{ translateX: shine.interpolate({ inputRange: [0, 1], outputRange: [-w * 0.6, w * 1.3] }) }, { rotate: '20deg' }] }} />
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// ------------------------------------------------------------------ Certificado en pantalla
function Certificate({ w, text }: { w: number; text: CertText }) {
  const s = w / 360;
  return (
    <View testID="grad-cert" style={{ width: w, height: w * 1.3, backgroundColor: '#FFFDF6', padding: 10 * s, boxShadow: '0 8px 24px rgba(0,0,0,0.35)' } as object}>
      <View style={{ flex: 1, borderWidth: 4 * s, borderColor: C.navy, padding: 3 * s }}>
        <View style={{ flex: 1, borderWidth: 1.5, borderColor: C.gold, alignItems: 'center', paddingTop: 12 * s, paddingHorizontal: 16 * s }}>
          <Mascot size={52 * s} />
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 11 * s, color: C.red, letterSpacing: 2, marginTop: 4 * s }}>{text.kicker}</Text>
          <Text style={{ fontFamily: F.display, fontSize: 30 * s, color: C.navy }}>{text.title}</Text>
          <Text style={{ fontFamily: F.bodyBold, fontSize: 11 * s, color: C.navy, letterSpacing: 1 }}>{text.sub}</Text>
          <Text style={{ fontFamily: F.body, fontSize: 11 * s, color: C.muted, marginTop: 10 * s }}>{text.to}</Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: F.display, fontSize: 34 * s, color: C.red }}>
            {text.name}
          </Text>
          <View style={{ height: 1.5, backgroundColor: C.gold, alignSelf: 'stretch', marginHorizontal: 40 * s }} />
          <Text style={{ fontFamily: F.bodySemi, fontSize: 11 * s, lineHeight: 15 * s, color: C.ink, textAlign: 'center', marginTop: 8 * s }}>{text.text}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 * s, width: 262 * s }}>
            {Array.from({ length: 20 }, (_, i) => (
              <View key={i} style={{ margin: 1 * s }}>
                <BadgeMedal earned level={i + 1} size={24 * s} />
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', marginTop: 'auto', marginBottom: 10 * s, alignItems: 'flex-end' }}>
            <View style={{ alignItems: 'center', width: 110 * s }}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: F.bodyBold, fontSize: 11 * s, color: C.ink }}>
                {text.date}
              </Text>
              <View style={{ height: 1, alignSelf: 'stretch', backgroundColor: C.ink }} />
              <Text style={{ fontFamily: F.body, fontSize: 9 * s, color: C.muted }}>{text.dateLabel}</Text>
            </View>
            <Svg width={52 * s} height={52 * s} viewBox="0 0 58 58">
              <Polygon points="29,2 35,10 45,7 46,17 56,21 50,29 56,37 46,41 45,51 35,48 29,56 23,48 13,51 12,41 2,37 8,29 2,21 12,17 13,7 23,10" fill={C.gold} stroke={C.goldDark} strokeWidth={1.5} />
              <Circle cx={29} cy={29} r={14} fill={C.red} />
              <Polygon points="29,19 32,26 39,26 33,30 35,37 29,33 23,37 25,30 19,26 26,26" fill={C.white} />
            </Svg>
            <View style={{ alignItems: 'center', width: 110 * s }}>
              <Text style={{ fontFamily: F.display, fontSize: 16 * s, color: C.navy }}>{text.coach}</Text>
              <View style={{ height: 1, alignSelf: 'stretch', backgroundColor: C.ink }} />
              <Text style={{ fontFamily: F.body, fontSize: 9 * s, color: C.muted }}>{text.coachLabel}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function BigBtn({ testID, label, onPress, gold }: { testID: string; label: string; onPress: () => void; gold?: boolean }) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPressIn={() => {}}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      unstable_pressDelay={0}
      style={{ backgroundColor: gold ? C.gold : C.red, borderRadius: 16, paddingVertical: 15, alignItems: 'center', alignSelf: 'stretch', minHeight: 56, boxShadow: `0 5px 0 ${gold ? C.goldDark : C.redDark}` } as object}
    >
      <Text style={{ fontFamily: F.display, fontSize: 22, color: gold ? C.navy : C.white, letterSpacing: 1 }}>{label}</Text>
    </Pressable>
  );
}

// ------------------------------------------------------------------ Pantalla
export default function Graduation() {
  const { ready, t, p, locale, graduate } = useStore();
  const { view } = useLocalSearchParams<{ view?: string }>();
  const insets = useSafeAreaInsets();
  const { width: winW, height: winH } = useWindowDimensions();
  const W = Math.min(winW, 520);
  const H = winH;
  const avatar = avatarOf(p);
  const name = (p.nickname ?? '').trim();
  const [phase, setPhase] = useState<Phase>(view === 'card' ? 'card' : 'party');
  const [after, setAfter] = useState<'print' | 'share'>('print');
  const [pops, setPops] = useState(0);

  useEffect(() => {
    if (!ready) return;
    // Solo quien aprobó el último examen llega aquí; la fecha se guarda una sola vez.
    if (p.examsPassed[String(LEVELS[LEVELS.length - 1].n)]) graduate();
    startGradMusic();
    // El público grita y el umpire da la bienvenida al Salón de la Fama.
    const ids = [setTimeout(() => playSfx('crowd'), 400), setTimeout(() => playSfx('umpHof'), 1500)];
    return () => {
      ids.forEach(clearTimeout);
      stopGradMusic();
    };
  }, [ready, graduate, p.examsPassed]);

  // El público vuelve a gritar de vez en cuando con los fuegos artificiales.
  useEffect(() => {
    if (phase === 'party' && pops > 0 && pops % 8 === 0) playSfx('crowd');
  }, [pops, phase]);
  const [onPop] = useState(() => () => {
    playSfx('fireworks');
    setPops((n) => n + 1);
  });

  const cert: CertText = {
    kicker: t('grad.certKicker'),
    title: t('grad.certTitle'),
    sub: t('grad.certSub'),
    to: t('grad.certTo'),
    name: name || 'All Star',
    text: t('grad.certText'),
    date: dateText(p.graduated, locale),
    dateLabel: t('grad.certDate'),
    coach: 'Pelotín',
    coachLabel: t('grad.certCoach'),
  };

  const exit = () => {
    stopGradMusic();
    startLevelMusicIfPending();
    if (router.canGoBack()) router.back();
    else router.replace('/camino' as never);
  };

  if (!ready) return <View style={{ flex: 1, backgroundColor: '#050B1F' }} />;

  if (phase === 'gate')
    return (
      <ParentGate
        onClose={() => setPhase('cert')}
        onPass={() => {
          setPhase('cert');
          (after === 'print' ? printCertificate(cert) : shareCertificate(cert, t('grad.certTitle'))).catch(() => {});
        }}
      />
    );

  const skyH = H * 0.62;
  const close = (
    <Pressable testID="grad-close" accessibilityRole="button" accessibilityLabel={t('common.close')} onPress={exit} style={{ position: 'absolute', top: insets.top + 6, right: 12, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
      <Text style={{ fontSize: 24, color: C.white }}>✕</Text>
    </Pressable>
  );

  if (phase === 'party')
    return (
      <View testID="grad-party" style={{ flex: 1, backgroundColor: '#050B1F', alignItems: 'center' }}>
        <View style={{ width: W, flex: 1 }}>
          {/* Cielo de noche con estrellas */}
          <Svg width={W} height={H} style={{ position: 'absolute' }}>
            <Defs>
              <LinearGradient id="night" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#020617" />
                <Stop offset="1" stopColor="#0B1E44" />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width={W} height={H} fill="url(#night)" />
            {Array.from({ length: 40 }, (_, i) => (
              <Circle key={i} cx={(i * 97) % W} cy={(i * 61) % (skyH * 0.9)} r={i % 3 === 0 ? 1.4 : 0.8} fill="#FFFFFF" opacity={0.6} />
            ))}
            {/* Grada y campo */}
            <Path d={`M0 ${skyH} Q${W / 2} ${skyH - 50} ${W} ${skyH} L${W} ${skyH + 60} L0 ${skyH + 60} Z`} fill="#1E3A5F" />
            <Rect x={0} y={skyH + 52} width={W} height={H - skyH} fill={C.field} />
            {Array.from({ length: 8 }, (_, i) => (
              <Rect key={i} x={0} y={skyH + 52 + i * 30} width={W} height={15} fill="#3E9A42" opacity={0.35} />
            ))}
            <Path d={`M${W / 2 - 70} ${H} L${W / 2} ${skyH + 60} L${W / 2 + 70} ${H} Z`} fill="#FFFFFF" opacity={0.08} />
            <G opacity={0.9}>
              <Rect x={8} y={skyH - 150} width={6} height={150} fill="#334155" />
              <Rect x={W - 14} y={skyH - 150} width={6} height={150} fill="#334155" />
              <Rect x={0} y={skyH - 162} width={22} height={14} rx={3} fill="#FDE68A" />
              <Rect x={W - 22} y={skyH - 162} width={22} height={14} rx={3} fill="#FDE68A" />
            </G>
          </Svg>
          {/* Público brincando */}
          <View style={{ position: 'absolute', top: skyH - 30, left: 0 }}>
            <Fans box={{ x: 0, y: 0, w: W, h: 70 }} s={1} cheering />
          </View>
          {[0, 350, 700, 1050, 1400].map((d, i) => (
            <Firework key={i} W={W} skyH={skyH * 0.9} delay={d} onPop={i === 0 || i === 3 ? onPop : undefined} />
          ))}
          <Confetti W={W} H={H} n={36} />
          <View style={{ position: 'absolute', top: insets.top + skyH * 0.26, left: 16, right: 16, alignItems: 'center' }}>
            <Text style={{ fontFamily: F.bodyHeavy, fontSize: 16, color: C.gold, letterSpacing: 3 }}>{t('grad.kicker')}</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: F.display, fontSize: 48, color: C.white, textAlign: 'center' }}>
              {t('grad.title')}
            </Text>
            <Text style={{ fontFamily: F.bodySemi, fontSize: 17, color: '#E2E8F0', textAlign: 'center', marginTop: 4, paddingHorizontal: 14 }}>{name ? t('grad.text', { name }) : t('grad.textNoName')}</Text>
          </View>
          <View style={{ position: 'absolute', top: skyH - 120, left: 0, right: 0, alignItems: 'center' }}>
            <JumpingPelotin avatar={avatar} h={Math.min(210, H * 0.25)} />
          </View>
          <View style={{ position: 'absolute', bottom: insets.bottom + 28, left: 24, right: 24 }}>
            <BigBtn testID="grad-get-card" label={t('grad.getCard')} gold onPress={() => setPhase('card')} />
          </View>
          {close}
        </View>
      </View>
    );

  if (phase === 'card')
    return (
      <View testID="grad-card-screen" style={{ flex: 1, backgroundColor: C.navy, alignItems: 'center' }}>
        <Svg width={winW} height={H} style={{ position: 'absolute' }}>
          <Defs>
            <RadialGradient id="glow" cx="0.5" cy="0.45" r="0.55">
              <Stop offset="0" stopColor="#FFD54A" stopOpacity={0.5} />
              <Stop offset="1" stopColor={C.navy} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width={winW} height={H} fill="url(#glow)" />
        </Svg>
        <Confetti W={W} H={H} n={24} />
        <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: insets.top + 50, paddingBottom: insets.bottom + 24, paddingHorizontal: 24, gap: 10, minHeight: H }}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: F.display, fontSize: 34, color: C.gold, textAlign: 'center' }}>
            {t('grad.cardTitle')}
          </Text>
          <Text style={{ fontFamily: F.bodySemi, fontSize: 15, color: '#CBD5E1', textAlign: 'center', marginBottom: 6 }}>{t('grad.cardSub')}</Text>
          <GoldenCard w={Math.min(270, W - 90, (H - 330) / 1.4)} name={name || 'All Star'} avatar={avatar} />
          <Text style={{ fontFamily: F.bodyBold, fontSize: 14, color: C.white, textAlign: 'center', marginTop: 8 }}>{t('grad.flip')}</Text>
          <Text style={{ fontFamily: F.body, fontSize: 13, color: '#CBD5E1', textAlign: 'center' }}>{t('grad.inAlbum')}</Text>
          <View style={{ flex: 1, minHeight: 12 }} />
          <View style={{ alignSelf: 'stretch', maxWidth: 472, width: '100%' }}>
            <BigBtn testID="grad-see-cert" label={t('grad.seeCert')} onPress={() => setPhase('cert')} />
          </View>
        </ScrollView>
        {close}
      </View>
    );

  // Certificado
  return (
    <View style={{ flex: 1, backgroundColor: '#E5E7EB', alignItems: 'center' }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: insets.top + 56, paddingBottom: insets.bottom + 24, paddingHorizontal: 16, gap: 14 }}>
        <Certificate w={Math.min(W - 32, 420)} text={cert} />
        <Text style={{ fontFamily: F.bodyBold, fontSize: 13, color: C.muted, textAlign: 'center' }}>{t('grad.parents')}</Text>
        <View style={{ flexDirection: 'row', gap: 10, alignSelf: 'stretch', maxWidth: 452, width: '100%' }}>
          <View style={{ flex: 1 }}>
            <BigBtn
              testID="grad-print"
              label={t('grad.print')}
              gold
              onPress={() => {
                setAfter('print');
                setPhase('gate');
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <BigBtn
              testID="grad-share"
              label={t('grad.share')}
              gold
              onPress={() => {
                setAfter('share');
                setPhase('gate');
              }}
            />
          </View>
        </View>
        <View style={{ alignSelf: 'stretch', maxWidth: 452, width: '100%' }}>
          <BigBtn testID="grad-done" label={t('grad.done')} onPress={exit} />
        </View>
      </ScrollView>
      <Pressable testID="grad-back-card" accessibilityRole="button" accessibilityLabel={t('common.back')} onPress={() => setPhase('card')} style={{ position: 'absolute', top: insets.top + 6, left: 12, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 28, color: C.navy }}>‹</Text>
      </Pressable>
    </View>
  );
}
