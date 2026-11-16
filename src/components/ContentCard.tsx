import React, { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react-native';
import { Card } from './Card';
import { Body, Heading, Muted } from './Text';
import { radius } from '../constants/theme';
import { useColors } from '../hooks/useColors';
import { useLang } from '../i18n';
import type { Card as CardData } from '../content/cards';
import { pick } from '../content/helpers';
import { useData, write } from '../hooks/useData';
import { listFavoriteIds, markRead, toggleFavorite } from '../db/repos/favorites';

export function useFavorites() {
  const state = useData(listFavoriteIds);
  return { ids: new Set(state.data ?? []), list: state.data ?? [], state };
}

export function ContentCard({ card, favorite, defaultOpen = false }: { card: CardData; favorite: boolean; defaultOpen?: boolean }) {
  const c = useColors();
  const { t } = useTranslation();
  const lang = useLang();
  const [open, setOpen] = useState(defaultOpen);
  const marked = useRef(false);

  useEffect(() => {
    if (open && !marked.current) {
      marked.current = true;
      write((db) => markRead(db, card.id));
    }
  }, [open, card.id]);

  const title = pick(card.title, lang);
  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          accessibilityLabel={title}
          onPress={() => setOpen(!open)}
          style={{ flex: 1, minHeight: 44, gap: 6, justifyContent: 'center' }}
        >
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <View style={{ backgroundColor: c.soft, borderRadius: radius.md, paddingHorizontal: 10, paddingVertical: 3 }}>
              <Muted style={{ color: c.accent }}>{t(`categories.${card.category}`)}</Muted>
            </View>
            <Muted>{t(`home.${card.kind}`)}</Muted>
          </View>
          <Heading style={{ fontSize: 17 }}>{title}</Heading>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={favorite ? t('learning.removeFav') : t('learning.addFav')}
          accessibilityState={{ selected: favorite }}
          onPress={() => write((db) => toggleFavorite(db, card.id))}
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
        >
          <Heart size={22} color={favorite ? c.danger : c.muted} fill={favorite ? c.danger : 'transparent'} />
        </Pressable>
        {open ? <ChevronUp size={20} color={c.muted} /> : <ChevronDown size={20} color={c.muted} />}
      </View>
      {open ? <Body>{pick(card.body, lang)}</Body> : null}
    </Card>
  );
}
