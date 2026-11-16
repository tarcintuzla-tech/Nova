import React from 'react';
import { View } from 'react-native';
import { Muted } from './Text';
import { useColors } from '../hooks/useColors';

type Props = { values: number[]; labels: string[]; height?: number };

export function Bars({ values, labels, height = 90 }: Props) {
  const c = useColors();
  const max = Math.max(1, ...values);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }} accessibilityLabel={values.join(', ')}>
      {values.map((v, i) => (
        <View key={i} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
          <View style={{ height, justifyContent: 'flex-end', width: '100%' }}>
            <View style={{ height: Math.max(4, (v / max) * height), borderRadius: 6, backgroundColor: v ? c.accent : c.soft }} />
          </View>
          <Muted>{labels[i]}</Muted>
        </View>
      ))}
    </View>
  );
}

export function ProgressBar({ ratio }: { ratio: number }) {
  const c = useColors();
  return (
    <View style={{ height: 8, borderRadius: 4, backgroundColor: c.soft, overflow: 'hidden' }}>
      <View style={{ width: `${Math.round(Math.min(1, Math.max(0, ratio)) * 100)}%`, height: 8, backgroundColor: c.accent }} />
    </View>
  );
}
