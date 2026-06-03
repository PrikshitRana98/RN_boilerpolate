import { secureStorage } from '@/utils/secureStorage';
import {
  AuthorizationStatus,
  FirebaseMessagingTypes,
  getMessaging,
  getToken,
  requestPermission,
} from '@react-native-firebase/messaging';
import { Linking } from 'react-native';

const messagingInstance = getMessaging();

const openDeepLinkFromNotification = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
) => {
  const url = remoteMessage?.data?.deeplink;

  if (typeof url === 'string' && url.length > 0) {
    Linking.openURL(url);
  }
};

export function setupNotificationDeepLinks() {
  getMessaging()
    .getInitialNotification()
    .then(openDeepLinkFromNotification);

  const unsubscribe = getMessaging().onNotificationOpenedApp(
    openDeepLinkFromNotification,
  );

  return unsubscribe;
}

export async function requestUserPermission() {
  const authStatus = await requestPermission(messagingInstance);
  console.log('authStatus', authStatus);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFCMToken();
  }
}

const getFCMToken = async () => {
  try {

    const fcmToken = await secureStorage.getItem('FCM_TOKEN');
    console.log('fcmToken', fcmToken);
    if(!!fcmToken){
      return fcmToken;
    }
    const token = await getToken(messagingInstance);
    if(!!token){
      await secureStorage.setItem('FCM_TOKEN', token);
    } 
    return token;
  } catch (error) {
    console.log("error during generating token", error);
  }
};