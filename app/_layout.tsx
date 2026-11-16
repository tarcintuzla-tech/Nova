import '../src/i18n';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import i18n from '../src/i18n';
import { usePrefs } from '../src/store/preferences';
import { useColors } from '../src/hooks/useColors';
import { ErrorView } from '../src/components/ErrorView';
import { scheduleReminder } from '../src/utils/notifications';

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => Promise<void> }) {
  return <ErrorView title={i18n.t('errors.boundaryTitle')} message={error.message} onRetry={retry} />;
}

export default function RootLayout() {
  const c = useColors();
  const { ready, error, language, notifications, theme } = usePrefs();
  const init = usePrefs((s) => s.init);

  useEffect(() => { init(); }, [init]);
  useEffect(() => {
    if (!ready) return;
    i18n.changeLanguage(language).then(() => {
      if (notifications) scheduleReminder().catch((e) => console.warn('Reminder reschedule failed', e));
    });
  }, [ready, language, notifications]);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: '#294C3B', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#F5F3EA" />
      </View>
    );
  }
  if (error) return <ErrorView message={error} onRetry={() => { usePrefs.setState({ ready: false }); init(); }} />;
  return (
    <SafeAreaProvider>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }} />
    </SafeAreaProvider>
  );
}
