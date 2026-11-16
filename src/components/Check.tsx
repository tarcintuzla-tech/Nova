import React from 'react';
import { Pressable, View } from 'react-native';
import { Check as CheckIcon, Trash2 } from 'lucide-react-native';
import { Body } from './Text';
import { useColors } from '../hooks/useColors';

type Props = { label: string; checked: boolean; onToggle: () => void; onDelete?: () => void; deleteLabel?: string };

export function CheckRow({ label, checked, onToggle, onDelete, deleteLabel }: Props) {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 48, gap: 12 }}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={label}
        onPress={onToggle}
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 }}
      >
        <View style={{
          width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: checked ? c.accent : c.border,
          backgroundColor: checked ? c.accent : 'transparent', alignItems: 'center', justifyContent: 'center',
        }}>
          {checked ? <CheckIcon size={16} color={c.onAccent} /> : null}
        </View>
        <Body style={{ flex: 1, opacity: checked ? 0.6 : 1 }}>{label}</Body>
      </Pressable>
      {onDelete ? (
        <Pressable accessibilityRole="button" accessibilityLabel={deleteLabel} onPress={onDelete} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Trash2 size={18} color={c.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}
