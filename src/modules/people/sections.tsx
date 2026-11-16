import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { ContentCard, useFavorites } from '../../components/ContentCard';
import { JournalList } from '../../components/JournalList';
import { QuickForm } from '../../components/QuickForm';
import { Quiz } from '../../components/Quiz';
import { Body, Heading, Muted } from '../../components/Text';
import { radius } from '../../constants/theme';
import { useColors } from '../../hooks/useColors';
import { useLang } from '../../i18n';
import { pick } from '../../content/helpers';
import { PEOPLE_CARDS, PEOPLE_CATEGORIES } from '../../content/cards';
import { PEOPLE_PROMPTS, SCENARIOS } from '../../content/people';
import { write } from '../../hooks/useData';
import { createEntry } from '../../db/repos/journal';
import { LIMITS } from '../../utils/validation';

export function CardsSection() {
  const { t } = useTranslation();
  const fav = useFavorites();
  const [cat, setCat] = useState<string | null>(null);
  const list = PEOPLE_CARDS.filter((c) => !cat || c.category === cat);
  return (
    <>
      <Muted>{t('people.caution')}</Muted>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Chip label={t('learning.all')} selected={cat === null} onPress={() => setCat(null)} />
        {PEOPLE_CATEGORIES.map((k) => <Chip key={k} label={t(`categories.${k}`)} selected={cat === k} onPress={() => setCat(cat === k ? null : k)} />)}
      </View>
      {list.map((card) => <ContentCard key={card.id} card={card} favorite={fav.ids.has(card.id)} />)}
    </>
  );
}

export function ScenariosSection() {
  const { t } = useTranslation();
  const lang = useLang();
  const c = useColors();
  const [picked, setPicked] = useState<Record<string, number>>({});
  return (
    <>
      <Muted>{t('people.scenarioIntro')}</Muted>
      {SCENARIOS.map((s) => (
        <Card key={s.id}>
          <Heading style={{ fontSize: 17 }}>{pick(s.text, lang)}</Heading>
          {s.options.map((o, i) => (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityLabel={pick(o.text, lang)}
              onPress={() => setPicked({ ...picked, [s.id]: i })}
              style={{ minHeight: 48, justifyContent: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.md, borderWidth: 1.5, borderColor: picked[s.id] === i ? c.accent : c.border }}
            >
              <Body>{pick(o.text, lang)}</Body>
            </Pressable>
          ))}
          {picked[s.id] !== undefined ? <Muted>{pick(s.options[picked[s.id]].note, lang)}</Muted> : null}
        </Card>
      ))}
    </>
  );
}

export function ReflectionSection() {
  const { t } = useTranslation();
  const lang = useLang();
  const [i, setI] = useState(0);
  const p = PEOPLE_PROMPTS[i % PEOPLE_PROMPTS.length];
  const prompt = pick(p.text, lang);
  return (
    <>
      <Card>
        <Heading>{prompt}</Heading>
        <Chip label={t('awareness.nextPrompt')} selected={false} onPress={() => setI(i + 1)} />
        <QuickForm multiline max={LIMITS.journal} placeholder={t('self.answerPlaceholder')} submitLabel={t('common.save')}
          onSubmit={(v) => write((db) => createEntry(db, { kind: 'reflection', prompt, body: v }))} />
      </Card>
      <Muted>{t('people.privacy')}</Muted>
      <JournalList kinds={['reflection']} emptyText={t('journal.empty')} />
    </>
  );
}

export const QuizSection = () => <Quiz module="people" />;
