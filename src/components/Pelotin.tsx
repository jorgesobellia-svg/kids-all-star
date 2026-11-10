import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing } from 'react-native';
import { Mascot, type MascotMouth } from '@/components/Art';
import { isTalking, onTalkingChange } from '@/services/speech';

/** true mientras Pelotín está hablando (voz grabada o voz del teléfono). */
export function useTalking(): boolean {
  const [on, setOn] = useState(isTalking());
  useEffect(() => onTalkingChange(setOn), []);
  return on;
}

function useReduceMotion(): boolean {
  const [r, setR] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setR)
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setR);
    return () => sub.remove();
  }, []);
  return r;
}

const MOUTHS: MascotMouth[] = ['open', 'half', 'open', 'rest', 'half', 'open', 'half'];

/**
 * Pelotín animado: mueve la boca y se mece mientras habla, parpadea de vez en cuando
 * y da un salto cuando el niño acierta (mood "cheer").
 * Con "reducir movimiento" activado en el teléfono no se mece ni salta (la boca sí se mueve).
 */
export default function Pelotin({ size = 72, mood = 'happy', testID }: { size?: number; mood?: 'happy' | 'cheer' | 'think'; testID?: string }) {
  const talking = useTalking();
  const reduce = useReduceMotion();
  const [frame, setFrame] = useState(0);
  const [blink, setBlink] = useState(false);
  const [sway] = useState(() => new Animated.Value(0));
  const [jump] = useState(() => new Animated.Value(0));

  // Boca: cambia de forma unas 8 veces por segundo mientras suena la voz.
  useEffect(() => {
    if (!talking) return;
    const iv = setInterval(() => setFrame((k) => (k + 1 + Math.floor(Math.random() * 2)) % MOUTHS.length), 120);
    return () => clearInterval(iv);
  }, [talking]);
  const mouth: MascotMouth = talking ? MOUTHS[frame] : 'rest';

  // Parpadeo cada 2,5–5 s.
  useEffect(() => {
    let tm: ReturnType<typeof setTimeout>;
    const loop = () => {
      tm = setTimeout(() => {
        setBlink(true);
        tm = setTimeout(() => {
          setBlink(false);
          loop();
        }, 140);
      }, 2500 + Math.random() * 2500);
    };
    loop();
    return () => clearTimeout(tm);
  }, []);

  // Se mece suavemente mientras habla.
  useEffect(() => {
    if (!talking || reduce) {
      Animated.timing(sway, { toValue: 0, duration: 150, useNativeDriver: true }).start();
      return;
    }
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, { toValue: 1, duration: 380, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(sway, { toValue: -1, duration: 380, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [talking, reduce, sway]);

  // Salto de alegría al acertar.
  useEffect(() => {
    if (mood !== 'cheer' || reduce) return;
    jump.setValue(0);
    Animated.sequence([
      Animated.timing(jump, { toValue: 1, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(jump, { toValue: 0, friction: 4, tension: 120, useNativeDriver: true }),
    ]).start();
  }, [mood, reduce, jump]);

  const rotate = sway.interpolate({ inputRange: [-1, 1], outputRange: ['-5deg', '5deg'] });
  const translateY = jump.interpolate({ inputRange: [0, 1], outputRange: [0, -size * 0.22] });

  return (
    <Animated.View testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ transform: [{ translateY }, { rotate }] }}>
      <Mascot size={size} mood={mood} mouth={mouth} blink={blink && mouth === 'rest'} />
    </Animated.View>
  );
}
