import React, { useState } from 'react';
import { StyleSheet, Switch, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { Chip } from '../../src/components/Chip';
import { Button } from '../../src/components/Button';
import { Title, Body, Muted, Heading } from '../../src/components/Text';
import { toggleIn, usePrefs } from '../../src/store/preferences';
import { useColors } from '../../src/hooks/useColors';
import { useReminderToggle } from '../../src/hooks/useReminder';
import { MODULES, INTERESTS, GOALS } from '../../src/constants/modules';
import { font, radius } from '../../src/constants/theme';

const LAST = 5;

export default function Onboarding() {
  const { t } = useTranslation();
  const router = useRouter();
  const c = useColors();
  const p = usePrefs();
  const toggleReminder = useReminderToggle();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(p.name);

  const finish = () => {
    p.update({ name: name.trim().slice(0, 40), onboarded: true });
    router.replace('/(tabs)/home');
  };
  const optional = step >= 2 && step <= 4;

  const footer = (
    <View style={{ gap: 4 }}>
      <Button label={step === LAST ? t('onboarding.enter') : t('common.next')} onPress={step === LAST ? finish : () => setStep(step + 1)} />
      {optional ? <Button variant="ghost" label={t('common.skip')} onPress={() => setStep(step + 1)} /> : null}
      {step > 0 && step < LAST ? <Button variant="ghost" label={t('common.back')} onPress={() => setStep(step - 1)} /> : null}
    </View>
  );

  return (
    <Screen footer={footer}>
      <View style={styles.dots} accessibilityLabel={`${step + 1} / ${LAST + 1}`}>
        {Array.from({ length: LAST + 1 }).map((_, i) => (
          <View key={i} style={[styles.dot, { backgroundColor: i <= step ? c.accent : c.soft }]} />
        ))}
      </View>

      {step === 0 && (
        <>
          <Title>{t('onboarding.welcomeTitle')}</Title>
          <Body>{t('onboarding.welcomeBody')}</Body>
          <Muted>{t('app.tagline')}</Muted>
          <Heading>{t('onboarding.language')}</Heading>
          <View style={styles.wrap}>
            <Chip label="Türkçe" selected={p.language === 'tr'} onPress={() => p.update({ language: 'tr' })} />
            <Chip label="English" selected={p.language === 'en'} onPress={() => p.update({ language: 'en' })} />
          </View>
        </>
      )}

      {step === 1 && (
        <>
          <Title>{t('onboarding.offersTitle')}</Title>
          <Body>{t('onboarding.offersBody')}</Body>
          {MODULES.map(({ id, Icon }) => (
            <Card key={id} style={styles.offer}>
              <Icon size={22} color={c.accent} />
              <View style={{ flex: 1 }}>
                <Heading style={{ fontSize: font.body }}>{t(`modules.${id}.title`)}</Heading>
                <Muted>{t(`modules.${id}.desc`)}</Muted>
              </View>
            </Card>
          ))}
        </>
      )}

      {step === 2 && (
        <>
          <Title>{t('onboarding.interestsTitle')}</Title>
          <Body>{t('onboarding.interestsBody')}</Body>
          <View style={styles.wrap}>
            {INTERESTS.map((id) => <Chip key={id} label={t(`categories.${id}`)} selected={p.interests.includes(id)} onPress={() => p.update({ interests: toggleIn(p.interests, id) })} />)}
          </View>
        </>
      )}

      {step === 3 && (
        <>
          <Title>{t('onboarding.goalsTitle')}</Title>
          <Body>{t('onboarding.goalsBody')}</Body>
          <View style={styles.wrap}>
            {GOALS.map((id) => <Chip key={id} label={t(`goalAreas.${id}`)} selected={p.devGoals.includes(id)} onPress={() => p.update({ devGoals: toggleIn(p.devGoals, id) })} />)}
          </View>
        </>
      )}

      {step === 4 && (
        <>
          <Title>{t('onboarding.notifTitle')}</Title>
          <Body>{t('onboarding.notifBody')}</Body>
          <Card>
            <View style={styles.between}>
              <Body style={{ flex: 1 }}>{t('onboarding.notifToggle')}</Body>
              <Switch value={p.notifications} onValueChange={toggleReminder} accessibilityLabel={t('onboarding.notifToggle')} trackColor={{ true: c.accent, false: c.soft }} />
            </View>
          </Card>
        </>
      )}

      {step === 5 && (
        <>
          <Title>{t('onboarding.enterTitle')}</Title>
          <Body>{t('onboarding.enterBody')}</Body>
          <TextInput
            style={{ minHeight: 52, borderRadius: radius.md, backgroundColor: c.surface, color: c.text, paddingHorizontal: 16, fontSize: font.body }}
            value={name} onChangeText={setName} maxLength={40} accessibilityLabel={t('onboarding.namePlaceholder')}
            placeholder={t('onboarding.namePlaceholder')} placeholderTextColor={c.muted}
          />
        </>
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  dots: { flexDirection: 'row', gap: 6 },
  dot: { flex: 1, height: 4, borderRadius: 2 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  offer: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
});
