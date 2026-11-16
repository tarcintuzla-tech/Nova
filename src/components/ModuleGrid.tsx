import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MODULES } from '../constants/modules';
import { font, radius, shadow, spacing } from '../constants/theme';
import { useColors } from '../hooks/useColors';

export function ModuleGrid() {
  const { t } = useTranslation();
  const router = useRouter();
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
      {MODULES.map(({ id, Icon }) => (
        <Pressable
          key={id}
          accessibilityRole="button"
          accessibilityLabel={t(`modules.${id}.title`)}
          onPress={() => router.push(`/module/${id}`)}
          style={[{ width: '47.5%', backgroundColor: c.surface, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm, minHeight: 112 }, shadow]}
        >
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.soft, alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={22} color={c.accent} />
          </View>
          <Text style={{ fontSize: font.body, fontWeight: '600', color: c.text }}>{t(`modules.${id}.title`)}</Text>
        </Pressable>
      ))}
    </View>
  );
}
