import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { QuickForm } from '../../components/QuickForm';
import { JournalList } from '../../components/JournalList';
import { Body, Heading, Muted } from '../../components/Text';
import { useLang } from '../../i18n';
import { pick } from '../../content/helpers';
import { EXERCISES, THOUGHTS, type Exercise } from '../../content/awareness';
import { QUESTIONS } from '../../content/questions';
import { write } from '../../hooks/useData';
import { createEntry } from '../../db/repos/journal';
import { dayIndex } from '../../utils/date';
import { LIMITS } from '../../utils/validation';

function ExerciseCard({ ex }: { ex: Exercise }) {
  const { t } = useTranslation();
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <Card>
      <Muted>{t(`exType.${ex.type}`)} · {t('awareness.minutes', { n: ex.minutes })}</Muted>
      <Heading style={{ fontSize: 17 }}>{pick(ex.title, lang)}</Heading>
      <Body>{pick(ex.body, lang)}</Body>
      {saved ? (
        <Muted>{t('awareness.saved')}</Muted>
      ) : open ? (
        <QuickForm
          multiline optional max={LIMITS.note} placeholder={t('awareness.notePlaceholder')} submitLabel={t('awareness.complete')}
          onCancel={() => setOpen(false)}
          onSubmit={async (v) => {
            await write((db) => createEntry(db, { kind: 'awareness', prompt: ex.id, body: v || t('awareness.completedPlain', { title: pick(ex.title, lang) }) }));
            setSaved(true);
          }}
        />
      ) : (
        <Button label={t('awareness.start')} onPress={() => setOpen(true)} />
      )}
    </Card>
  );
}

export function TodaySection() {
  const { t } = useTranslation();
  const lang = useLang();
  const i = dayIndex();
  return (
    <>
      <Card>
        <Muted>{t('awareness.dailyThought')}</Muted>
        <Heading>{pick(THOUGHTS[i % THOUGHTS.length], lang)}</Heading>
      </Card>
      <ExerciseCard ex={EXERCISES[i % EXERCISES.length]} />
    </>
  );
}

export function ExercisesSection() {
  return <>{EXERCISES.map((ex) => <ExerciseCard key={ex.id} ex={ex} />)}</>;
}

export function GratitudeSection() {
  const { t } = useTranslation();
  return (
    <>
      <Card>
        <Body>{t('awareness.gratitudeIntro')}</Body>
        <QuickForm multiline max={LIMITS.journal} placeholder={t('awareness.gratitudePlaceholder')} submitLabel={t('common.save')}
          onSubmit={(v) => write((db) => createEntry(db, { kind: 'gratitude', body: v }))} />
      </Card>
      <JournalList kinds={['gratitude']} emptyText={t('awareness.emptyGratitude')} />
    </>
  );
}

export function ReflectionSection() {
  const { t } = useTranslation();
  const lang = useLang();
  const [n, setN] = useState(dayIndex() + 3);
  const prompt = pick(QUESTIONS[n % QUESTIONS.length], lang);
  return (
    <Card>
      <Body>{t('awareness.reflectionIntro')}</Body>
      <Heading>{prompt}</Heading>
      <Button variant="ghost" label={t('awareness.nextPrompt')} onPress={() => setN(n + 1)} />
      <QuickForm multiline max={LIMITS.journal} placeholder={t('self.answerPlaceholder')} submitLabel={t('common.save')}
        onSubmit={(v) => write((db) => createEntry(db, { kind: 'reflection', prompt, body: v }))} />
    </Card>
  );
}

export function HistorySection() {
  const { t } = useTranslation();
  return <JournalList kinds={['awareness', 'gratitude', 'reflection']} emptyText={t('journal.empty')} />;
}
