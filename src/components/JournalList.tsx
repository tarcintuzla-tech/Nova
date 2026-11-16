import React, { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2 } from 'lucide-react-native';
import { Card } from './Card';
import { EmptyState } from './EmptyState';
import { Loaded } from './Loaded';
import { QuickForm } from './QuickForm';
import { Body, Muted } from './Text';
import { useColors } from '../hooks/useColors';
import { useLang } from '../i18n';
import { useData, write } from '../hooks/useData';
import { deleteEntry, listEntries, updateEntry, type Entry } from '../db/repos/journal';
import { formatDay } from '../utils/date';
import { LIMITS } from '../utils/validation';

function Row({ entry }: { entry: Entry }) {
  const c = useColors();
  const { t } = useTranslation();
  const lang = useLang();
  const [editing, setEditing] = useState(false);

  const confirmDelete = () =>
    Alert.alert(t('common.delete'), t('journal.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: () => write((db) => deleteEntry(db, entry.id)) },
    ]);

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Muted>{formatDay(entry.day, lang)} · {t(`kind.${entry.kind}`)}</Muted>
        <View style={{ flexDirection: 'row' }}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('common.edit')} onPress={() => setEditing(!editing)} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Pencil size={18} color={c.muted} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={t('common.delete')} onPress={confirmDelete} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={18} color={c.muted} />
          </Pressable>
        </View>
      </View>
      {editing ? (
        <QuickForm
          multiline
          max={LIMITS.journal}
          initial={entry.body}
          resetOnSubmit={false}
          placeholder={t('journal.placeholder')}
          submitLabel={t('common.save')}
          onSubmit={async (v) => { await write((db) => updateEntry(db, entry.id, v)); setEditing(false); }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <Body>{entry.body}</Body>
      )}
    </Card>
  );
}

export function JournalList({ kinds, emptyText }: { kinds?: string[]; emptyText: string }) {
  const state = useData((db) => listEntries(db, kinds), [kinds?.join(',')]);
  return (
    <Loaded state={state}>
      {(entries) => (entries.length === 0 ? <EmptyState body={emptyText} /> : <>{entries.map((e) => <Row key={e.id} entry={e} />)}</>)}
    </Loaded>
  );
}
