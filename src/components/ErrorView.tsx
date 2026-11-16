import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { Body, Heading, Muted } from './Text';
import { useColors } from '../hooks/useColors';

export function ErrorView({ title, message, onRetry }: { title?: string; message?: string; onRetry?: () => void }) {
  const c = useColors();
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg, padding: 24, justifyContent: 'center', gap: 12 }}>
      <Heading>{title ?? t('errors.title')}</Heading>
      <Body>{t('errors.load')}</Body>
      {message ? <Muted>{message}</Muted> : null}
      {onRetry ? <Button label={t('errors.retry')} onPress={onRetry} /> : null}
    </View>
  );
}
