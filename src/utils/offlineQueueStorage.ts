import { QueuedPostItem } from '@/models/OfflineQueue';
import { createMMKV } from 'react-native-mmkv';

const OFFLINE_QUEUE_KEY = 'offline_post_queue';

const storage = createMMKV({
  id: 'offline-storage',
});

const readQueue = (): QueuedPostItem[] => {
  const raw = storage.getString(OFFLINE_QUEUE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as QueuedPostItem[];
  } catch {
    return [];
  }
};

const writeQueue = (queue: QueuedPostItem[]) => {
  storage.set(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
};

export const offlineQueueStorage = {
  getQueue() {
    return readQueue();
  },

  getQueueCount() {
    return readQueue().length;
  },

  addToQueue(item: QueuedPostItem) {
    const queue = readQueue();
    writeQueue([...queue, item]);
  },

  removeFromQueue(id: string) {
    const queue = readQueue().filter(item => item.id !== id);
    writeQueue(queue);
  },
};
