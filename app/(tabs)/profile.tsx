import React from 'react';
import { Alert, Share, StyleSheet, Switch, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { Chip } from '../../src/components/Chip';
import { Button } from '../../src/components/Button';
import { Title, Body, Muted } from '../../src/components/Text';
import { defaultPrefs, usePrefs } from '../../src/store/preferences';
import { useColors } from '../../src/hooks/useColors';
import { useReminderToggle } from '../../src/hooks/useReminder';
import { write } from '../../src/hooks/useData';
import { getDb } from '../../src/db/client';
import { deleteAll, exportAll } from '../../src/db/repos/data';
import { disableReminder } from '../../src/utils/notifications';
import { font, radius } from '../../src/constants/theme';

export default function Profile() {
  const { t } = useTranslation();
  const router = useRouter();
  const c = useColors();
  const p = usePrefs();
  const toggleReminder = useReminderToggle();

  const doExport = async () => {
    try {
      const data = await exportAll(await getDb());
      await Share.share({ title: 'nova-export.json', message: JSON.stringify(data, null, 2) });
    } catch (e) {
      console.warn('Export failed', e);
      Alert.alert(t('errors.title'), t('profile.exportFailed'));
    }
  };
  const doDelete = () =>
    Alert.alert(t('profile.deleteTitle'), t('profile.deleteBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'), style: 'destructive',
        onPress: async () => {
          const ok = await write(async (db) => { await deleteAll(db); return true; });
          if (!ok) return;
          await disableReminder().catch(() => undefined);
          p.update({ ...defaultPrefs(), language: p.language, theme: p.theme });
          Alert.alert(t('profile.deleted'));
          router.replace('/onboarding');
        },
      },
    ]);

  return (
    <Screen tabs>
      <Title>{t('profile.title')}</Title>

      <Card>
        <Muted>{t('profile.name')}</Muted>
        <TextInput
          style={{ minHeight: 48, borderRadius: radius.md, backgroundColor: c.bg, color: c.text, paddingHorizontal: 14, fontSize: font.body }}
          value={p.name} onChangeText={(v) => p.update({ name: v.slice(0, 40) })} maxLength={40}
          accessibilityLabel={t('profile.name')} placeholder={t('onboarding.namePlaceholder')} placeholderTextColor={c.muted}
        />
      </Card>

      <Card>
        <Muted>{t('profile.language')}</Muted>
        <View style={styles.row}>
          <Chip label="Türkçe" selected={p.language === 'tr'} onPress={() => p.update({ language: 'tr' })} />
          <Chip label="English" selected={p.language === 'en'} onPress={() => p.update({ language: 'en' })} />
        </View>
        <Muted>{t('profile.appearance')}</Muted>
        <View style={styles.row}>
          <Chip label={t('profile.light')} selected={p.theme === 'light'} onPress={() => p.update({ theme: 'light' })} />
          <Chip label={t('profile.dark')} selected={p.theme === 'dark'} onPress={() => p.update({ theme: 'dark' })} />
        </View>
      </Card>

      <Card>
        <View style={styles.between}>
          <Body style={{ flex: 1 }}>{t('profile.notifications')}</Body>
          <Switch value={p.notifications} onValueChange={toggleReminder} accessibilityLabel={t('profile.notifications')}
            trackColor={{ true: c.accent, false: c.soft }} />
        </View>
        <Muted>{t('profile.notifNote')}</Muted>
      </Card>

      <Card>
        <Muted>{t('profile.privacy')}</Muted>
        <Button variant="ghost" label={t('profile.export')} onPress={doExport} />
        <Button variant="danger" label={t('profile.delete')} onPress={doDelete} />
      </Card>

      <Button variant="ghost" label={t('profile.replay')} onPress={() => { p.update({ onboarded: false }); router.replace('/onboarding'); }} />
      <Muted style={{ textAlign: 'center' }}>{t('profile.version')} {Constants.expoConfig?.version}</Muted>
    </Screen>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
});
