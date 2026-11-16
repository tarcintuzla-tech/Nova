import React, { useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ContentCard, useFavorites } from '../../components/ContentCard';
import { Chip } from '../../components/Chip';
import { EmptyState } from '../../components/EmptyState';
import { Loaded } from '../../components/Loaded';
import { Quiz } from '../../components/Quiz';
import { Muted } from '../../components/Text';
import { LEARNING_CARDS, LEARNING_CATEGORIES, findCard } from '../../content/cards';
import { pick } from '../../content/helpers';
import { useLang } from '../../i18n';
import { useColors } from '../../hooks/useColors';
import { useData } from '../../hooks/useData';
import { listHistory } from '../../db/repos/favorites';
import { dayIndex } from '../../utils/date';
import { font, radius } from '../../constants/theme';

export function TodaySection() {
  const fav = useFavorites();
  const card = LEARNING_CARDS[dayIndex() % LEARNING_CARDS.length];
  return <ContentCard card={card} favorite={fav.ids.has(card.id)} defaultOpen />;
}

export function LibrarySection() {
  const { t } = useTranslation();
  const lang = useLang();
  const c = useColors();
  const fav = useFavorites();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string | null>(null);
  const results = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase(lang);
    return LEARNING_CARDS.filter((card) =>
      (!cat || card.category === cat) &&
      (!needle || (pick(card.title, lang) + ' ' + pick(card.body, lang)).toLocaleLowerCase(lang).includes(needle)));
  }, [q, cat, lang]);
  return (
    <>
      <TextInput
        value={q} onChangeText={setQ} placeholder={t('learning.search')} placeholderTextColor={c.muted} accessibilityLabel={t('learning.search')}
        style={{ minHeight: 48, borderRadius: radius.md, backgroundColor: c.surface, color: c.text, paddingHorizontal: 14, fontSize: font.body }}
      />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Chip label={t('learning.all')} selected={cat === null} onPress={() => setCat(null)} />
        {LEARNING_CATEGORIES.map((k) => <Chip key={k} label={t(`categories.${k}`)} selected={cat === k} onPress={() => setCat(cat === k ? null : k)} />)}
      </View>
      {results.length === 0 ? <EmptyState body={t('learning.noResults')} /> : results.map((card) => <ContentCard key={card.id} card={card} favorite={fav.ids.has(card.id)} />)}
    </>
  );
}

export function FavoritesSection({ prefix = 'l-' }: { prefix?: string }) {
  const { t } = useTranslation();
  const fav = useFavorites();
  const cards = fav.list.filter((id) => id.startsWith(prefix)).map(findCard).filter((x): x is NonNullable<typeof x> => !!x);
  return (
    <Loaded state={fav.state}>
      {() => (cards.length === 0 ? <EmptyState body={t('learning.emptyFavorites')} /> : <>{cards.map((card) => <ContentCard key={card.id} card={card} favorite />)}</>)}
    </Loaded>
  );
}

export function HistorySection() {
  const { t } = useTranslation();
  const fav = useFavorites();
  const state = useData((db) => listHistory(db), []);
  return (
    <Loaded state={state}>
      {(rows) => {
        const cards = rows.map((r) => findCard(r.content_id)).filter((x): x is NonNullable<typeof x> => !!x);
        return cards.length === 0 ? (
          <EmptyState body={t('learning.emptyHistory')} />
        ) : (
          <>
            <Muted>{t('learning.historyCount', { n: cards.length })}</Muted>
            {cards.map((card) => <ContentCard key={card.id} card={card} favorite={fav.ids.has(card.id)} />)}
          </>
        );
      }}
    </Loaded>
  );
}

export const QuizSection = () => <Quiz module="learning" />;
