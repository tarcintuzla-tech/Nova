import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from './Card';
import { Button } from './Button';
import { Body } from './Text';
import { useColors } from '../hooks/useColors';

type S<T> = { data: T | null; loading: boolean; error: string | null; retry: () => void };

/** Renders loading / error / content states for a useData result. */
export function Loaded<T>({ state, children }: { state: S<T>; children: (data: T) => React.ReactNode }) {
  const c = useColors();
  const { t } = useTranslation();
  if (state.data === null && state.loading) {
    return <View style={{ padding: 24 }} accessibilityLabel={t('common.loading')}><ActivityIndicator color={c.accent} /></View>;
  }
  if (state.data === null) {
    return (
      <Card>
        <Body>{t('errors.load')}</Body>
        <Button label={t('errors.retry')} onPress={state.retry} />
      </Card>
    );
  }
  return <>{children(state.data)}</>;
}
