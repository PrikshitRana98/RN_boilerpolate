import { createMMKV } from 'react-native-mmkv';

const OFFLINE_DATA_KEY = 'offline_data';

const storage = createMMKV({
  id: 'offline-storage',
});

export const offlineStorage = {
  saveData(value: string) {
    storage.set(OFFLINE_DATA_KEY, value);
  },

  getData() {
    return storage.getString(OFFLINE_DATA_KEY) ?? null;
  },

  clearData() {
    storage.remove(OFFLINE_DATA_KEY);
  },
};
