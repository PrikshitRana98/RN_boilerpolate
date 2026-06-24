/* eslint-env jest */
jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn(),
}));

jest.mock('@/helper/notifciationService', () => ({
  requestUserPermission: jest.fn(),
  setupNotificationDeepLinks: jest.fn(),
}));

jest.mock('@/helper/offlineSyncService', () => ({
  startOfflineSyncListener: jest.fn(),
}));

jest.mock('@/helper/otaUpdateService', () => ({
  checkForOtaUpdate: jest.fn(),
}));

jest.mock('@/helper/timerNotificationService', () => ({
  showTimerNotification: jest.fn(),
  cancelTimerNotification: jest.fn(),
}));

jest.mock('@/navigation/Routes', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => React.createElement(View, { testID: 'routes' });
});

jest.mock('@/utils/checkStorage', () => ({
  getLocalItem: jest.fn().mockResolvedValue(null),
}));

jest.mock('@/utils/secureStorage', () => ({
  secureStorage: {
    getObject: jest.fn().mockResolvedValue(null),
    setObject: jest.fn().mockResolvedValue(undefined),
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));
