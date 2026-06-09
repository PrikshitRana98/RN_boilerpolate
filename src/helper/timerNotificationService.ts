import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  EventType,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import { AppState, Platform } from 'react-native';

export const TIMER_NOTIFICATION_ID = 'timer-running-notification';
const TIMER_CHANNEL_ID = 'timer-running-channel';
const TIMER_UPDATE_TYPE = 'timer-update';

let channelReady = false;

export const formatTimerDisplay = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (num: number) => String(num).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
};

const computeElapsed = (baseElapsed: number, runningSince: number): number =>
  baseElapsed + Math.floor((Date.now() - runningSince) / 1000);

const ensureChannel = async () => {
  if (channelReady || Platform.OS !== 'android') {
    return;
  }

  await notifee.createChannel({
    id: TIMER_CHANNEL_ID,
    name: 'Timer',
    importance: AndroidImportance.HIGH,
    vibration: false,
  });

  channelReady = true;
};

export const ensureTimerNotificationPermission = async () => {
  const settings = await notifee.requestPermission();
  await ensureChannel();
  return settings;
};

const hasNotificationPermission = async () => {
  const settings = await notifee.getNotificationSettings();

  return (
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
  );
};

const buildNotificationPayload = (
  baseElapsed: number,
  runningSince: number,
) => {
  const elapsed = computeElapsed(baseElapsed, runningSince);
  const formattedTime = formatTimerDisplay(elapsed);

  return {
    id: TIMER_NOTIFICATION_ID,
    title: 'Timer',
    body: formattedTime,
    data: {
      type: TIMER_UPDATE_TYPE,
      baseElapsed: String(baseElapsed),
      runningSince: String(runningSince),
    },
    android: {
      channelId: TIMER_CHANNEL_ID,
      ongoing: true,
      onlyAlertOnce: true,
      autoCancel: false,
      showChronometer: true,
      chronometerDirection: 'up' as const,
      timestamp: Date.now() - elapsed * 1000,
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      interruptionLevel: 'timeSensitive' as const,
      foregroundPresentationOptions: {
        alert: true,
        badge: false,
        sound: false,
      },
    },
  };
};

const scheduleIosTimerUpdate = async (
  baseElapsed: number,
  runningSince: number,
) => {
  if (Platform.OS !== 'ios' || AppState.currentState === 'active') {
    return;
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() + 1000,
  };

  await notifee.createTriggerNotification(
    {
      ...buildNotificationPayload(baseElapsed, runningSince),
      id: `${TIMER_NOTIFICATION_ID}-trigger-${Date.now()}`,
    },
    trigger,
  );
};

export const showRunningTimerNotification = async (
  baseElapsed: number,
  runningSince: number,
) => {
  try {
    await ensureTimerNotificationPermission();

    const allowed = await hasNotificationPermission();
    if (!allowed) {
      console.warn('Timer notification permission denied');
      return;
    }

    await notifee.displayNotification(
      buildNotificationPayload(baseElapsed, runningSince),
    );

    if (Platform.OS === 'ios') {
      await scheduleIosTimerUpdate(baseElapsed, runningSince);
    }
  } catch (error) {
    console.error('Failed to show timer notification:', error);
  }
};

export const updateRunningTimerNotification = async (
  baseElapsed: number,
  runningSince: number,
) => {
  if (AppState.currentState === 'active') {
    return;
  }

  try {
    await notifee.displayNotification(
      buildNotificationPayload(baseElapsed, runningSince),
    );
  } catch (error) {
    console.error('Failed to update timer notification:', error);
  }
};

export const dismissRunningTimerNotification = async () => {
  try {
    await notifee.cancelNotification(TIMER_NOTIFICATION_ID);
    await notifee.cancelTriggerNotifications();
  } catch (error) {
    console.error('Failed to dismiss timer notification:', error);
  }
};

export const handleTimerNotificationBackgroundEvent = async ({
  type,
  detail,
}: {
  type: EventType;
  detail: {
    notification?: {
      id?: string;
      data?: Record<string, string>;
    };
  };
}) => {
  if (type !== EventType.DELIVERED && type !== EventType.TRIGGER_NOTIFICATION_CREATED) {
    return;
  }

  const notificationData = detail.notification?.data;
  if (notificationData?.type !== TIMER_UPDATE_TYPE) {
    return;
  }

  const baseElapsed = parseInt(notificationData.baseElapsed || '0', 10);
  const runningSince = parseInt(notificationData.runningSince || '0', 10);

  if (!runningSince) {
    return;
  }

  if (
    detail.notification?.id &&
    detail.notification.id !== TIMER_NOTIFICATION_ID &&
    detail.notification.id.startsWith(`${TIMER_NOTIFICATION_ID}-trigger`)
  ) {
    await notifee.cancelNotification(detail.notification.id);
  }

  if (AppState.currentState === 'active') {
    await dismissRunningTimerNotification();
    return;
  }

  await notifee.displayNotification(
    buildNotificationPayload(baseElapsed, runningSince),
  );

  await scheduleIosTimerUpdate(baseElapsed, runningSince);
};
