import { Alert } from 'react-native';
import i18n from '../i18n';
import { usePrefs } from '../store/preferences';
import { disableReminder, enableReminder } from '../utils/notifications';

export function useReminderToggle() {
  const update = usePrefs((s) => s.update);
  return async (on: boolean) => {
    try {
      if (on) {
        const ok = await enableReminder();
        if (!ok) {
          update({ notifications: false });
          Alert.alert(i18n.t('errors.title'), i18n.t('profile.notifDenied'));
          return;
        }
      } else {
        await disableReminder();
      }
      update({ notifications: on });
    } catch (e) {
      console.warn('Reminder error', e);
      update({ notifications: false });
      Alert.alert(i18n.t('errors.title'), i18n.t('profile.notifDenied'));
    }
  };
}
