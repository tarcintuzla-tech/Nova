import React from 'react';
import { Pressable, Text } from 'react-native';
import { font, radius } from '../constants/theme';
import { useColors } from '../hooks/useColors';

type Props = { label: string; onPress: () => void; variant?: 'primary' | 'ghost' | 'danger'; disabled?: boolean };

export function Button({ label, onPress, variant = 'primary', disabled }: Props) {
  const c = useColors();
  const bg = variant === 'primary' ? c.accent : 'transparent';
  const fg = variant === 'primary' ? c.onAccent : variant === 'danger' ? c.danger : c.accent;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 52, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: 24, backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
      })}
    >
      <Text style={{ fontSize: font.body, fontWeight: '600', color: fg }}>{label}</Text>
    </Pressable>
  );
}
