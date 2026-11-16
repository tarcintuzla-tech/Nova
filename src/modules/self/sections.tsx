import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { Loaded } from '../../components/Loaded';
import { QuickForm } from '../../components/QuickForm';
import { JournalList } from '../../components/JournalList';
import { GoalsPanel } from '../../components/GoalsPanel';
import { Body, Heading, Muted } from '../../components/Text';
import { useLang } from '../../i18n';
import { pick } from '../../content/helpers';
import { QUESTIONS } from '../../content/questions';
import { MAX_VALUES, STRENGTH_PROMPTS, VALUES } from '../../content/values';
import { useData, write } from '../../hooks/useData';
import { useColors } from '../../hooks/useColors';
import { createEntry, getTodayEntry, listEntries, updateEntry } from '../../db/repos/journal';
import { activityByDay, totals } from '../../db/repos/stats';
import { Bars } from '../../components/Bars';
import { usePrefs, toggleIn } from '../../store/preferences';
import { dayIndex, lastDays, weekdayLabel } from '../../utils/date';
import { LIMITS } from '../../utils/validation';

export function TodaySection() {
  const { t } = useTranslation();
  const lang = useLang();
  const state = useData((db) => getTodayEntry(db, 'daily'), []);
  const [editing, setEditing] = useState(false);
  const question = pick(QUESTIONS[dayIndex() % QUESTIONS.length], lang);
  return (
    <Card>
      <Muted>{t('home.dailyQuestion')}</Muted>
      <Heading>{question}</Heading>
      <Loaded state={state}>
        {(entry) =>
          entry && !editing ? (
            <>
              <Body>{entry.body}</Body>
              <Chip label={t('common.edit')} selected={false} onPress={() => setEditing(true)} />
            </>
          ) : (
            <QuickForm
              multiline max={LIMITS.journal} initial={entry?.body ?? ''} resetOnSubmit={false}
              placeholder={t('self.answerPlaceholder')} submitLabel={t('common.save')}
              onCancel={entry ? () => setEditing(false) : undefined}
              onSubmit={async (v) => {
                await write((db) => (entry ? updateEntry(db, entry.id, v) : createEntry(db, { kind: 'daily', prompt: question, body: v })));
                setEditing(false);
              }}
            />
          )
        }
      </Loaded>
    </Card>
  );
}

export function JournalSection() {
  const { t } = useTranslation();
  return (
    <>
      <Card>
        <QuickForm multiline max={LIMITS.journal} placeholder={t('journal.placeholder')} submitLabel={t('journal.save')}
          onSubmit={(v) => write((db) => createEntry(db, { kind: 'journal', body: v }))} />
      </Card>
      <JournalList kinds={['journal']} emptyText={t('journal.empty')} />
    </>
  );
}

export function ValuesSection() {
  const { t } = useTranslation();
  const lang = useLang();
  const values = usePrefs((s) => s.values);
  const update = usePrefs((s) => s.update);
  const toggle = (id: string) => {
    if (!values.includes(id) && values.length >= MAX_VALUES) return;
    update({ values: toggleIn(values, id) });
  };
  return (
    <Card>
      <Body>{t('self.valuesIntro', { max: MAX_VALUES })}</Body>
      <Muted>{t('self.valuesCount', { n: values.length, max: MAX_VALUES })}</Muted>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {VALUES.map((v) => <Chip key={v.id} label={pick(v.label, lang)} selected={values.includes(v.id)} onPress={() => toggle(v.id)} />)}
      </View>
    </Card>
  );
}

export function StrengthsSection() {
  const { t } = useTranslation();
  const lang = useLang();
  const c = useColors();
  const [selected, setSelected] = useState<string | null>(null);
  const answers = useData((db) => listEntries(db, ['strength']), []);
  const current = STRENGTH_PROMPTS.find((p) => p.id === selected);
  return (
    <>
      <Muted>{t('self.strengthsNote')}</Muted>
      {STRENGTH_PROMPTS.map((p) => {
        const done = (answers.data ?? []).some((e) => e.prompt === p.id);
        return (
          <Pressable key={p.id} accessibilityRole="button" accessibilityLabel={pick(p.text, lang)} onPress={() => setSelected(p.id === selected ? null : p.id)}>
            <Card style={{ borderWidth: p.id === selected ? 1.5 : 0, borderColor: c.accent }}>
              <Body>{pick(p.text, lang)}</Body>
              {done ? <Muted>{t('self.answered')}</Muted> : null}
            </Card>
          </Pressable>
        );
      })}
      {current ? (
        <Card>
          <QuickForm multiline max={LIMITS.journal} placeholder={t('self.answerPlaceholder')} submitLabel={t('common.save')}
            onSubmit={async (v) => { await write((db) => createEntry(db, { kind: 'strength', prompt: current.id, body: v })); setSelected(null); }} />
        </Card>
      ) : null}
      <JournalList kinds={['strength']} emptyText={t('self.noStrengths')} />
    </>
  );
}

export function GoalsSection() { return <GoalsPanel />; }

export function HistorySection() {
  const { t } = useTranslation();
  return <JournalList emptyText={t('journal.empty')} />;
}

export function SummarySection() {
  const { t, i18n } = useTranslation();
  const days = lastDays(7);
  const state = useData(async (db) => ({ tot: await totals(db), act: await activityByDay(db, days) }), []);
  return (
    <Loaded state={state}>
      {({ tot, act }) => (
        <Card>
          <Heading>{t('self.summaryTitle')}</Heading>
          <Body>{t('self.summaryEntries', { n: tot.journal })}</Body>
          <Body>{t('self.summaryGoals', { n: tot.goals })}</Body>
          <Bars values={days.map((d) => act[d].journal)} labels={days.map((d) => weekdayLabel(d, i18n.language))} />
        </Card>
      )}
    </Loaded>
  );
}
