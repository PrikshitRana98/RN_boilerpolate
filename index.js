/**
 * @format
 */

import 'react-native-get-random-values';

import notifee, {EventType} from '@notifee/react-native';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {handleTimerNotificationBackgroundEvent} from './src/helper/timerNotificationService';

notifee.onBackgroundEvent(async event => {
  await handleTimerNotificationBackgroundEvent(event);
});

notifee.onForegroundEvent(async event => {
  if (
    event.type === EventType.DELIVERED ||
    event.type === EventType.TRIGGER_NOTIFICATION_CREATED
  ) {
    await handleTimerNotificationBackgroundEvent(event);
  }
});

AppRegistry.registerComponent(appName, () => App);
