import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { C, F } from '@/theme';

export function tapFeedback() {
  if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
}

type Variant = 'red' | 'navy' | 'green' | 'wrong' | 'gold' | 'ghost' | 'disabled';

const V: Record<Variant, { bg: string; shadow: string; fg: string; border?: string }> = {
  red: { bg: C.red, shadow: C.redDark, fg: C.white },
  navy: { bg: C.navy, shadow: C.navyDeep, fg: C.white },
  green: { bg: C.green, shadow: C.greenDark, fg: C.white },
  wrong: { bg: C.wrong, shadow: C.wrongDark, fg: C.white },
  gold: { bg: C.gold, shadow: C.goldDark, fg: C.navy },
  ghost: { bg: 'transparent', shadow: 'transparent', fg: C.white, border: '#475569' },
  disabled: { bg: C.line, shadow: C.line, fg: '#64748B' },
};

export function Btn({
  label,
  onPress,
  variant = 'red',
  style,
  testID,
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const v = V[variant];
  const disabled = variant === 'disabled' || !onPress;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        tapFeedback();
        onPress?.();
      }}
      style={({ pressed }) => [
        {
          minHeight: 56,
          borderRadius: 16,
          backgroundColor: v.bg,
          borderWidth: v.border ? 2 : 0,
          borderColor: v.border,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 18,
          marginBottom: pressed ? 0 : 5,
          marginTop: pressed ? 5 : 0,
          shadowColor: v.shadow,
          shadowOffset: { width: 0, height: pressed ? 0 : 5 },
          shadowOpacity: v.shadow === 'transparent' ? 0 : 1,
          shadowRadius: 0,
          elevation: 0,
        },
        // En web la "sombra 3D" se dibuja como borde inferior.
        Platform.OS === 'web' && v.shadow !== 'transparent' ? ({ boxShadow: `0 ${pressed ? 0 : 5}px 0 ${v.shadow}` } as object) : null,
        style,
      ]}
    >
      <Text style={{ color: v.fg, fontFamily: F.bodyHeavy, fontSize: 18, letterSpacing: 0.5, textAlign: 'center' }}>{label}</Text>
    </Pressable>
  );
}

export function H1({ children, style, color = C.ink }: { children: React.ReactNode; style?: StyleProp<TextStyle>; color?: string }) {
  return <Text style={[{ fontFamily: F.display, fontSize: 30, lineHeight: 34, color }, style]}>{children}</Text>;
}

export function Body({ children, style, color = C.muted }: { children: React.ReactNode; style?: StyleProp<TextStyle>; color?: string }) {
  return <Text style={[{ fontFamily: F.body, fontSize: 16, lineHeight: 22, color }, style]}>{children}</Text>;
}

export function Label({ children, style, color = C.red }: { children: React.ReactNode; style?: StyleProp<TextStyle>; color?: string }) {
  return <Text style={[{ fontFamily: F.bodyHeavy, fontSize: 13, letterSpacing: 1.2, color }, style]}>{children}</Text>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ backgroundColor: C.white, borderRadius: 16, padding: 14 }, style]}>{children}</View>;
}

export function ProgressBar({ value, color = C.red, height = 14 }: { value: number; color?: string; height?: number }) {
  return (
    <View style={{ flex: 1, height, backgroundColor: C.line, borderRadius: 999, overflow: 'hidden' }} accessibilityRole="progressbar">
      <View style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, height: '100%', backgroundColor: color, borderRadius: 999 }} />
    </View>
  );
}
