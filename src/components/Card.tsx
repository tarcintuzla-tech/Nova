import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { radius, shadow, spacing } from '../constants/theme';
import { useColors } from '../hooks/useColors';

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  return (
    <View style={[{ backgroundColor: c.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm }, shadow, style]}>
      {children}
    </View>
  );
}
