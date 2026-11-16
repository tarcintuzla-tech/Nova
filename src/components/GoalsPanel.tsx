import React from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from './Card';
import { CheckRow } from './Check';
import { EmptyState } from './EmptyState';
import { Loaded } from './Loaded';
import { QuickForm } from './QuickForm';
import { useData, write } from '../hooks/useData';
import { createGoal, deleteGoal, listGoals, toggleGoal } from '../db/repos/goals';
import { LIMITS } from '../utils/validation';

/** Personal goals; shared by Self Discovery and Personal Development. */
export function GoalsPanel() {
  const { t } = useTranslation();
  const state = useData(listGoals);
  const confirmDelete = (id: number) =>
    Alert.alert(t('common.delete'), t('goals.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: () => write((db) => deleteGoal(db, id)) },
    ]);
  return (
    <>
      <Card>
        <QuickForm max={LIMITS.short} placeholder={t('goals.placeholder')} submitLabel={t('common.add')} onSubmit={(v) => write((db) => createGoal(db, v))} />
      </Card>
      <Loaded state={state}>
        {(goals) =>
          goals.length === 0 ? (
            <EmptyState body={t('goals.empty')} />
          ) : (
            <Card>
              {goals.map((g) => (
                <CheckRow key={g.id} label={g.title} checked={!!g.done} deleteLabel={t('common.delete')}
                  onToggle={() => write((db) => toggleGoal(db, g.id))} onDelete={() => confirmDelete(g.id)} />
              ))}
            </Card>
          )
        }
      </Loaded>
    </>
  );
}
