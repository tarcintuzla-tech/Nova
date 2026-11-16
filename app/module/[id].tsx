import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react-native';
import { Screen } from '../../src/components/Screen';
import { SectionTabs } from '../../src/components/SectionTabs';
import { Body, Title } from '../../src/components/Text';
import { MODULES } from '../../src/constants/modules';
import { REGISTRY } from '../../src/modules/registry';
import { useColors } from '../../src/hooks/useColors';

export default function ModuleScreen() {
  const { id, section } = useLocalSearchParams<{ id: string; section?: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const c = useColors();
  const mod = MODULES.find((m) => m.id === id);
  const sections = mod ? REGISTRY[mod.id] : [];
  const [current, setCurrent] = useState(section && sections.some((s) => s.id === section) ? section : sections[0]?.id);
  if (!mod) return null;
  const Active = sections.find((s) => s.id === current)?.Component ?? sections[0].Component;

  return (
    <Screen>
      <Pressable accessibilityRole="button" accessibilityLabel={t('common.back')} onPress={() => router.back()} style={{ minHeight: 44, justifyContent: 'center' }}>
        <ArrowLeft color={c.accent} size={24} />
      </Pressable>
      <Title>{t(`modules.${mod.id}.title`)}</Title>
      <Body>{t(`modules.${mod.id}.desc`)}</Body>
      <SectionTabs items={sections.map((s) => ({ id: s.id, label: t(`sections.${mod.id}.${s.id}`) }))} value={current ?? ''} onChange={setCurrent} />
      <Active />
    </Screen>
  );
}
