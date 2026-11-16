import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Loaded } from '../../components/Loaded';
import { Body, Heading, Muted } from '../../components/Text';
import { useLang } from '../../i18n';
import { pick } from '../../content/helpers';
import { ACTIVITIES, type Activity } from '../../content/kindness';
import { useData, write } from '../../hooks/useData';
import { doneOnDay, listKindness, markKindness, unmarkKindness } from '../../db/repos/kindness';
import { dayIndex, formatDay, todayStr } from '../../utils/date';

function ActivityCard({ a, done }: { a: Activity; done: boolean }) {
  const { t } = useTranslation();
  const lang = useLang();
  const today = todayStr();
  return (
    <Card>
      <Muted>{t(`kcat.${a.category}`)}</Muted>
      <Heading style={{ fontSize: 17 }}>{pick(a.title, lang)}</Heading>
      <Body>{pick(a.body, lang)}</Body>
      <Button
        variant={done ? 'ghost' : 'primary'}
        label={done ? t('kindness.undo') : t('kindness.markDone')}
        onPress={() => write((db) => (done ? unmarkKindness(db, a.id, today) : markKindness(db, a.id, today)))}
      />
    </Card>
  );
}

export function TodaySection() {
  const { t } = useTranslation();
  const today = todayStr();
  const state = useData((db) => doneOnDay(db, today), [today]);
  const a = ACTIVITIES[dayIndex() % ACTIVITIES.length];
  return (
    <>
      <Muted>{t('kindness.privacyNote')}</Muted>
      <Loaded state={state}>{(done) => <ActivityCard a={a} done={done.includes(a.id)} />}</Loaded>
    </>
  );
}

export function IdeasSection() {
  const { t } = useTranslation();
  const today = todayStr();
  const state = useData((db) => doneOnDay(db, today), [today]);
  return (
    <Loaded state={state}>
      {(done) => <>{ACTIVITIES.map((a) => <ActivityCard key={a.id} a={a} done={done.includes(a.id)} />)}<Muted>{t('kindness.privacyNote')}</Muted></>}
    </Loaded>
  );
}

export function HistorySection() {
  const { t } = useTranslation();
  const lang = useLang();
  const state = useData((db) => listKindness(db), []);
  return (
    <Loaded state={state}>
      {(rows) =>
        rows.length === 0 ? (
          <EmptyState body={t('kindness.emptyHistory')} />
        ) : (
          <>
            <Card><Heading>{t('kindness.total', { n: rows.length })}</Heading></Card>
            {rows.map((r, i) => {
              const a = ACTIVITIES.find((x) => x.id === r.activity_id);
              return a ? (
                <Card key={i}>
                  <Muted>{formatDay(r.day, lang)}</Muted>
                  <Body>{pick(a.title, lang)}</Body>
                </Card>
              ) : null;
            })}
          </>
        )
      }
    </Loaded>
  );
}
