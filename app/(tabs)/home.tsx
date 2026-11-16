import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { Loaded } from '../../src/components/Loaded';
import { ModuleGrid } from '../../src/components/ModuleGrid';
import { ProgressBar } from '../../src/components/Bars';
import { Title, Heading, Body, Muted } from '../../src/components/Text';
import { usePrefs } from '../../src/store/preferences';
import { useColors } from '../../src/hooks/useColors';
import { useData } from '../../src/hooks/useData';
import { useLang } from '../../src/i18n';
import { LEARNING_CARDS, findCard } from '../../src/content/cards';
import { QUESTIONS } from '../../src/content/questions';
import { EXERCISES } from '../../src/content/awareness';
import { ACTIVITIES } from '../../src/content/kindness';
import { pick } from '../../src/content/helpers';
import { listTasks } from '../../src/db/repos/goals';
import { completionsOnDay, listHabits } from '../../src/db/repos/habits';
import { getTodayEntry } from '../../src/db/repos/journal';
import { doneOnDay } from '../../src/db/repos/kindness';
import { listFavoriteIds } from '../../src/db/repos/favorites';
import { dayIndex, todayStr } from '../../src/utils/date';
import { radius, spacing } from '../../src/constants/theme';

export default function Home() {
  const { t } = useTranslation();
  const lang = useLang();
  const c = useColors();
  const router = useRouter();
  const name = usePrefs((s) => s.name);
  const today = todayStr();
  const i = dayIndex();
  const state = useData(async (db) => ({
    tasks: await listTasks(db, today), habits: await listHabits(db), habitDone: await completionsOnDay(db, today),
    kind: await doneOnDay(db, today), daily: await getTodayEntry(db, 'daily'), favs: await listFavoriteIds(db),
  }), [today]);

  const hour = new Date().getHours();
  const key = hour < 12 ? 'greetingMorning' : hour < 18 ? 'greetingDay' : 'greetingEvening';
  const greeting = name ? `${t(`home.${key}`)}, ${name}` : t(`home.${key}`);
  const card = LEARNING_CARDS[i % LEARNING_CARDS.length];
  const question = pick(QUESTIONS[i % QUESTIONS.length], lang);
  const exercise = EXERCISES[i % EXERCISES.length];
  const kindness = ACTIVITIES[i % ACTIVITIES.length];
  const go = (path: string) => () => router.push(path);

  const recs = [
    { title: t('home.recReflect'), sub: question, path: '/module/self?section=today' },
    { title: t('home.recAware'), sub: pick(exercise.title, lang), path: '/module/awareness?section=today' },
    { title: t('home.recKind'), sub: pick(kindness.title, lang), path: '/module/kindness?section=today' },
  ];

  return (
    <Screen tabs>
      <Title>{greeting}</Title>

      <Pressable accessibilityRole="button" accessibilityLabel={question} onPress={go('/module/self?section=today')}>
        <Card style={{ backgroundColor: c.hero }}>
          <Muted style={{ color: c.heroMuted }}>{t('home.dailyQuestion')}</Muted>
          <Heading style={{ color: c.onHero }}>{question}</Heading>
        </Card>
      </Pressable>

      <Pressable accessibilityRole="button" accessibilityLabel={pick(card.title, lang)} onPress={go('/module/learning?section=today')}>
        <Card>
          <View style={styles.row}>
            <Muted>{t('home.dailyCard')}</Muted>
            <View style={[styles.badge, { backgroundColor: c.soft }]}><Muted style={{ color: c.accent }}>{t(`home.${card.kind}`)}</Muted></View>
          </View>
          <Heading>{pick(card.title, lang)}</Heading>
          <Body numberOfLines={3}>{pick(card.body, lang)}</Body>
        </Card>
      </Pressable>

      <Loaded state={state}>
        {({ tasks, habits, habitDone, kind, daily, favs }) => {
          const tasksDone = tasks.filter((x) => x.done).length;
          const total = tasks.length + habits.length + 2;
          const done = tasksDone + habitDone.length + (kind.length > 0 ? 1 : 0) + (daily ? 1 : 0);
          const saved = favs.slice(0, 3).map(findCard).filter((x): x is NonNullable<typeof x> => !!x);
          return (
            <>
              <Heading>{t('home.progressToday')}</Heading>
              <Card>
                <ProgressBar ratio={done / total} />
                <Muted>{t('home.tasksLabel', { done: tasksDone, total: tasks.length })} · {t('home.habitsLabel', { done: habitDone.length, total: habits.length })}</Muted>
                <Muted>{daily ? t('home.reflectionDone') : t('home.reflectionOpen')} · {kind.length > 0 ? t('home.kindDone') : t('home.kindOpen')}</Muted>
              </Card>

              <Heading>{t('home.recommended')}</Heading>
              {recs.map((r) => (
                <Pressable key={r.path} accessibilityRole="button" accessibilityLabel={r.title} onPress={go(r.path)}>
                  <Card>
                    <Muted>{r.title}</Muted>
                    <Body>{r.sub}</Body>
                  </Card>
                </Pressable>
              ))}

              <Heading>{t('home.modules')}</Heading>
              <ModuleGrid />

              <Heading>{t('home.recentSaved')}</Heading>
              {saved.length === 0 ? (
                <Card><Muted>{t('home.emptySaved')}</Muted></Card>
              ) : (
                saved.map((s) => (
                  <Pressable key={s.id} accessibilityRole="button" accessibilityLabel={pick(s.title, lang)}
                    onPress={go(s.id.startsWith('p-') ? '/module/people?section=saved' : '/module/learning?section=favorites')}>
                    <Card><Body>{pick(s.title, lang)}</Body></Card>
                  </Pressable>
                ))
              )}
            </>
          );
        }}
      </Loaded>
    </Screen>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { borderRadius: radius.md, paddingHorizontal: spacing.sm + 2, paddingVertical: 4 },
});
