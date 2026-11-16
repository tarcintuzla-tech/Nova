import React from 'react';
import { ScrollView, View } from 'react-native';
import { Chip } from './Chip';

type Props = { items: { id: string; label: string }[]; value: string; onChange: (id: string) => void };

export function SectionTabs({ items, value, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {items.map((i) => <Chip key={i.id} label={i.label} selected={i.id === value} onPress={() => onChange(i.id)} />)}
      </View>
    </ScrollView>
  );
}
