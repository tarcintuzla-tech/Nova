import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import i18n from '../i18n';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false,
  }),
});

const CHANNEL = 'daily';

async function ensureChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: i18n.t('profile.notifications'),
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

/** One local reminder per day at 20:00. No server, no push token. */
export async function scheduleReminder() {
  await ensureChannel();
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: { title: i18n.t('notif.title'), body: i18n.t('notif.body') },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 20, minute: 0, channelId: CHANNEL },
  });
}

export async function enableReminder(): Promise<boolean> {
  await ensureChannel();
  let granted = (await Notifications.getPermissionsAsync()).granted;
  if (!granted) granted = (await Notifications.requestPermissionsAsync()).granted;
  if (!granted) return false;
  await scheduleReminder();
  return true;
}

export async function disableReminder() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
