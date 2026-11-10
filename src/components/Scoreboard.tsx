import React, { useEffect, useState } from 'react';
import { Animated, Platform, Pressable, Text, View } from 'react-native';
import { F } from '@/theme';

// Pizarra de estadio para la parte de arriba de la lección:
//   - una casilla por "inning" (cada pregunta de la lección); al acertar se enciende la carrera ("1");
//   - la casilla del inning que se está jugando parpadea;
//   - a la derecha, los OUTS como bombillos rojos, igual que en las pizarras de los estadios.
const SB = {
  board: '#0E2A1C', // verde oscuro de pizarra
  frame: '#2B4A38',
  rim: '#08170F',
  cell: '#061209',
  cellLine: '#24402F',
  head: '#C9D6CB',
  amber: '#FFC93C',
  amberGlow: 'rgba(255, 201, 60, 0.55)',
  bulbOff: '#2A1A1A',
  bulbOn: '#FF3B3B',
  bulbGlow: 'rgba(255, 59, 59, 0.7)',
  white: '#FFFFFF',
};

function glow(color: string, r: number) {
  return Platform.OS === 'android' ? {} : { shadowColor: color, shadowOpacity: 1, shadowRadius: r, shadowOffset: { width: 0, height: 0 } };
}

export default function Scoreboard({
  total,
  runs,
  strikes,
  strikesLabel,
  inningLabel,
  exitLabel,
  onExit,
  topInset,
}: {
  total: number;
  runs: number;
  strikes: number;
  strikesLabel: string;
  inningLabel: string;
  exitLabel: string;
  onExit: () => void;
  topInset: number;
}) {
  // Parpadeo de la casilla del inning en juego.
  const [blink] = useState(() => new Animated.Value(1));
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 0.25, duration: 550, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1, duration: 550, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [blink]);

  const cells = Array.from({ length: total }, (_, i) => i);
  const cellW = total > 8 ? 24 : 30;

  return (
    <View style={{ backgroundColor: SB.rim, paddingTop: topInset + 6, paddingHorizontal: 8, paddingBottom: 8 }}>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: total, now: runs }}
        style={{
          backgroundColor: SB.board,
          borderWidth: 3,
          borderColor: SB.frame,
          borderRadius: 10,
          paddingVertical: 8,
          paddingHorizontal: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Pressable
          testID="lesson-exit"
          accessibilityRole="button"
          accessibilityLabel={exitLabel}
          onPress={onExit}
          style={{ width: 36, height: 44, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 22, color: SB.head, fontFamily: F.bodyBold }}>✕</Text>
        </Pressable>

        {/* Innings */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', gap: 3, marginBottom: 3 }}>
            {cells.map((i) => (
              <Text key={i} style={{ width: cellW, textAlign: 'center', fontFamily: F.display, fontSize: 12, color: SB.head }}>
                {i + 1}
              </Text>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 3 }}>
            {cells.map((i) => {
              const done = i < runs;
              const now = i === runs;
              return (
                <View
                  key={i}
                  testID={done ? 'inning-done' : now ? 'inning-now' : 'inning'}
                  style={{
                    width: cellW,
                    height: 30,
                    backgroundColor: SB.cell,
                    borderWidth: 2,
                    borderColor: now ? SB.amber : SB.cellLine,
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {done ? (
                    <Text style={[{ fontFamily: F.display, fontSize: 22, lineHeight: 26, color: SB.amber }, Platform.OS === 'web' ? { textShadow: `0 0 6px ${SB.amberGlow}` } : {}] as never}>1</Text>
                  ) : now ? (
                    <Animated.View style={[{ width: 10, height: 10, borderRadius: 5, backgroundColor: SB.amber, opacity: blink }, glow(SB.amberGlow, 5)]} />
                  ) : null}
                </View>
              );
            })}
          </View>
          <Text style={{ fontFamily: F.display, fontSize: 10, letterSpacing: 2, color: SB.head, marginTop: 3, opacity: 0.8 }}>{inningLabel}</Text>
        </View>

        {/* Outs */}
        <View testID="strikes" accessibilityLabel={`${strikesLabel}: ${strikes}`} style={{ alignItems: 'center', paddingHorizontal: 4 }}>
          <Text style={{ fontFamily: F.display, fontSize: 12, letterSpacing: 1, color: SB.head, marginBottom: 5 }}>{strikesLabel.toUpperCase()}</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {[0, 1, 2].map((i) => {
              const on = i < strikes;
              return (
                <View
                  key={i}
                  style={[
                    {
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      backgroundColor: on ? SB.bulbOn : SB.bulbOff,
                      borderWidth: 2,
                      borderColor: on ? '#FF8A8A' : '#3A2626',
                    },
                    on ? glow(SB.bulbGlow, 7) : {},
                  ]}
                />
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
