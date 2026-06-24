module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-redux|@reduxjs|i18next|react-i18next|react-native-reanimated|react-native-safe-area-context|react-native-bootsplash|react-native-mmkv|react-native-nitro-modules|@notifee|react-native-ota-hot-update|@react-native-community)/)',
  ],
  setupFiles: ['./jest.setup.js'],
};
