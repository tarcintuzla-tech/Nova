import React from 'react';
import { Pressable, Text } from 'react-native';
import { font, radius } from '../constants/theme';
import { useColors } from '../hooks/useColors';

type Props = { label: string; selected: boolean; onPress: () => void };

export function Chip({ label, selected, onPress }: Props) {
  const c = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={{
        minHeight: 44, paddingHorizontal: 18, borderRadius: radius.pill, justifyContent: 'center',
        backgroundColor: selected ? c.accent : c.surface, borderWidth: 1, borderColor: selected ? c.accent : c.border,
      }}
    >
      <Text style={{ fontSize: font.body, color: selected ? c.onAccent : c.text }}>{label}</Text>
    </Pressable>
  );
}
