import { Redirect } from 'expo-router';
import { usePrefs } from '../src/store/preferences';

export default function Index() {
  const onboarded = usePrefs((s) => s.onboarded);
  return <Redirect href={onboarded ? '/(tabs)/home' : '/onboarding'} />;
}
