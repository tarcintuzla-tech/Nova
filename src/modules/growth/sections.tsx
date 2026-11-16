import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { CheckRow } from '../../components/Check';
import { EmptyState } from '../../components/EmptyState';
import { GoalsPanel } from '../../components/GoalsPanel';
import { Loaded } from '../../components/Loaded';
import { QuickForm } from '../../components/QuickForm';
import { Bars, ProgressBar } from '../../components/Bars';
import { Body, Heading, Muted } from '../../components/Text';
import { useColors } from '../../hooks/useColors';
import { useData, write } from '../../hooks/useData';
import { archiveHabit, completionDays, completionsOnDay, countCompletions, createHabit, listHabits, toggleCompletion } from '../../db/repos/habits';
import { createTask, deleteTask, listTasks, toggleTask } from '../../db/repos/goals';
import { activityByDay, totals } from '../../db/repos/stats';
import { lastDays, todayStr, weekdayLabel } from '../../utils/date';
import { LIMITS } from '../../utils/validation';

export function TodaySection() {
  const { t } = useTranslation();
  const today = todayStr();
  const state = useData(async (db) => ({
    tasks: await listTasks(db, today), habits: await listHabits(db), done: await completionsOnDay(db, today),
  }), [today]);
  return (
    <>
      <Heading>{t('growth.todayTasks')}</Heading>
      <Card>
        <QuickForm max={LIMITS.short} placeholder={t('growth.taskPlaceholder')} submitLabel={t('common.add')} onSubmit={(v) => write((db) => createTask(db, v, today))} />
      </Card>
      <Loaded state={state}>
        {({ tasks, habits, done }) => (
          <>
            {tasks.length === 0 ? <EmptyState body={t('growth.emptyTasks')} /> : (
              <Card>
                {tasks.map((k) => (
                  <CheckRow key={k.id} label={k.title} checked={!!k.done} deleteLabel={t('common.delete')}
                    onToggle={() => write((db) => toggleTask(db, k.id))} onDelete={() => write((db) => deleteTask(db, k.id))} />
                ))}
              </Card>
            )}
            <Heading>{t('growth.todayHabits')}</Heading>
            {habits.length === 0 ? <EmptyState body={t('growth.noHabits')} /> : (
              <Card>
                {habits.map((h) => (
                  <CheckRow key={h.id} label={h.name} checked={done.includes(h.id)} onToggle={() => write((db) => toggleCompletion(db, h.id, today))} />
                ))}
                <Muted>{t('growth.noShame')}</Muted>
              </Card>
            )}
          </>
        )}
      </Loaded>
    </>
  );
}

function HabitCalendar({ habitId }: { habitId: number }) {
  const c = useColors();
  const { t, i18n } = useTranslation();
  const days = lastDays(28);
  const state = useData(async (db) => ({ done: await completionDays(db, habitId, days[0]), total: await countCompletions(db, habitId) }), [habitId]);
  return (
    <Loaded state={state}>
      {({ done, total }) => (
        <Card>
          <Muted>{t('growth.last28')}</Muted>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {['0', '1', '2', '3', '4', '5', '6'].map((i) => <Muted key={i} style={{ flex: 1, textAlign: 'center' }}>{weekdayLabel(days[Number(i)], i18n.language).slice(0, 2)}</Muted>)}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }} accessibilityLabel={t('growth.calendar')}>
            {days.map((d) => (
              <View key={d} style={{ width: '12.4%', aspectRatio: 1, borderRadius: 8, backgroundColor: done.includes(d) ? c.accent : c.soft }} />
            ))}
          </View>
          <Body>{t('growth.totalCompletions', { n: total })}</Body>
        </Card>
      )}
    </Loaded>
  );
}

export function HabitsSection() {
  const { t } = useTranslation();
  const state = useData(listHabits, []);
  const [selected, setSelected] = useState<number | null>(null);
  const confirmArchive = (id: number) =>
    Alert.alert(t('growth.archive'), t('growth.archiveConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('growth.archive'), style: 'destructive', onPress: async () => { await write((db) => archiveHabit(db, id)); setSelected(null); } },
    ]);
  return (
    <>
      <Card>
        <QuickForm max={LIMITS.short} placeholder={t('growth.habitPlaceholder')} submitLabel={t('growth.addHabit')} onSubmit={(v) => write((db) => createHabit(db, v))} />
      </Card>
      <Loaded state={state}>
        {(habits) => {
          if (habits.length === 0) return <EmptyState body={t('growth.noHabits')} />;
          const active = habits.find((h) => h.id === selected) ?? habits[0];
          return (
            <>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {habits.map((h) => <Chip key={h.id} label={h.name} selected={h.id === active.id} onPress={() => setSelected(h.id)} />)}
              </View>
              <HabitCalendar habitId={active.id} />
              <Chip label={t('growth.archive')} selected={false} onPress={() => confirmArchive(active.id)} />
            </>
          );
        }}
      </Loaded>
    </>
  );
}

export function GoalsSection() { return <GoalsPanel />; }

const MILESTONES = [1, 10, 50, 100];

export function StatsSection() {
  const { t, i18n } = useTranslation();
  const days = lastDays(7);
  const state = useData(async (db) => ({ tot: await totals(db), act: await activityByDay(db, days) }), []);
  return (
    <Loaded state={state}>
      {({ tot, act }) => {
        const week = days.map((d) => act[d].habits + act[d].tasks);
        const weekTotal = week.reduce((a, b) => a + b, 0);
        const doneDays = days.filter((d) => act[d].habits + act[d].tasks > 0).length;
        const all = tot.habits + tot.tasks;
        return (
          <>
            <Card>
              <Heading>{t('growth.weekly')}</Heading>
              <Bars values={week} labels={days.map((d) => weekdayLabel(d, i18n.language))} />
              <Body>{t('growth.weekSummary', { n: weekTotal, days: doneDays })}</Body>
              <ProgressBar ratio={doneDays / 7} />
            </Card>
            <Card>
              <Heading>{t('growth.stats')}</Heading>
              <Body>{t('growth.statHabits', { n: tot.habits })}</Body>
              <Body>{t('growth.statTasks', { n: tot.tasks })}</Body>
              <Body>{t('growth.statGoals', { n: tot.goals })}</Body>
            </Card>
            <Card>
              <Heading>{t('growth.milestones')}</Heading>
              {all === 0 ? <Muted>{t('growth.noMilestones')}</Muted> : null}
              {MILESTONES.filter((m) => all >= m).map((m) => <Body key={m}>✓ {t('growth.milestone', { n: m })}</Body>)}
              {all > 0 ? <Muted>{t('growth.noShame')}</Muted> : null}
            </Card>
          </>
        );
      }}
    </Loaded>
  );
}
