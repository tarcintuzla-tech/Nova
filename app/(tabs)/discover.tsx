import React, { useMemo, useState } from 'react';
import { TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../src/components/Screen';
import { ContentCard, useFavorites } from '../../src/components/ContentCard';
import { EmptyState } from '../../src/components/EmptyState';
import { ModuleGrid } from '../../src/components/ModuleGrid';
import { Title } from '../../src/components/Text';
import { ALL_CARDS } from '../../src/content/cards';
import { pick } from '../../src/content/helpers';
import { useLang } from '../../src/i18n';
import { useColors } from '../../src/hooks/useColors';
import { font, radius } from '../../src/constants/theme';

export default function Discover() {
  const { t } = useTranslation();
  const lang = useLang();
  const c = useColors();
  const fav = useFavorites();
  const [q, setQ] = useState('');
  const needle = q.trim().toLocaleLowerCase(lang);
  const results = useMemo(
    () => (needle ? ALL_CARDS.filter((x) => (pick(x.title, lang) + ' ' + pick(x.body, lang)).toLocaleLowerCase(lang).includes(needle)) : []),
    [needle, lang],
  );
  return (
    <Screen tabs>
      <Title>{t('discover.title')}</Title>
      <TextInput
        value={q} onChangeText={setQ} placeholder={t('discover.search')} placeholderTextColor={c.muted} accessibilityLabel={t('discover.search')}
        style={{ minHeight: 48, borderRadius: radius.md, backgroundColor: c.surface, color: c.text, paddingHorizontal: 14, fontSize: font.body }}
      />
      {needle ? (
        results.length === 0 ? <EmptyState body={t('learning.noResults')} /> : results.map((x) => <ContentCard key={x.id} card={x} favorite={fav.ids.has(x.id)} />)
      ) : (
        <ModuleGrid />
      )}
    </Screen>
  );
}
