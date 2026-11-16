import React from 'react';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { Loaded } from '../../src/components/Loaded';
import { Bars } from '../../src/components/Bars';
import { EmptyState } from '../../src/components/EmptyState';
import { Title, Heading, Body } from '../../src/components/Text';
import { useData } from '../../src/hooks/useData';
import { activityByDay, totals } from '../../src/db/repos/stats';
import { lastDays, weekdayLabel } from '../../src/utils/date';

export default function Progress() {
  const { t, i18n } = useTranslation();
  const days = lastDays(7);
  const state = useData(async (db) => ({ tot: await totals(db), act: await activityByDay(db, days) }), []);
  return (
    <Screen tabs>
      <Title>{t('progress.title')}</Title>
      <Loaded state={state}>
        {({ tot, act }) => {
          const week = days.map((d) => Object.values(act[d]).reduce((a, b) => a + b, 0));
          const empty = Object.values(tot).every((v) => v === 0);
          if (empty) return <EmptyState title={t('progress.emptyTitle')} body={t('progress.emptyBody')} />;
          return (
            <>
              <Card>
                <Heading>{t('progress.week')}</Heading>
                <Bars values={week} labels={days.map((d) => weekdayLabel(d, i18n.language))} />
              </Card>
              <Card>
                <Heading>{t('progress.totals')}</Heading>
                <Body>{t('progress.journal', { n: tot.journal })}</Body>
                <Body>{t('progress.habits', { n: tot.habits })}</Body>
                <Body>{t('progress.tasks', { n: tot.tasks })}</Body>
                <Body>{t('progress.goals', { n: tot.goals })}</Body>
                <Body>{t('progress.kindness', { n: tot.kindness })}</Body>
                <Body>{t('progress.reads', { n: tot.reads })}</Body>
                <Body>{t('progress.quizzes', { n: tot.quizzes })}</Body>
              </Card>
            </>
          );
        }}
      </Loaded>
    </Screen>
  );
}
