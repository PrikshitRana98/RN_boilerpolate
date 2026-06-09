import { PostPayload, QueuedPostItem } from '@/models/OfflineQueue';
import { offlineQueueStorage } from '@/utils/offlineQueueStorage';
import { checkIsOnline, getIsConnected } from '@/utils/networkUtils';
import NetInfo from '@react-native-community/netinfo';

const POST_API_URL = 'https://jsonplaceholder.typicode.com/posts';

type QueueListener = (pendingCount: number) => void;

let isSyncing = false;
const listeners = new Set<QueueListener>();

const notifyListeners = () => {
  const count = offlineQueueStorage.getQueueCount();
  listeners.forEach(listener => listener(count));
};

const createQueueItem = (payload: PostPayload): QueuedPostItem => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  url: POST_API_URL,
  payload: {
    ...payload,
    timestamp: Date.now(),
  },
  createdAt: Date.now(),
});

const sendPostRequest = async (item: QueuedPostItem) => {
  console.log('[OfflineSync] POST API called');
  console.log('[OfflineSync] URL:', item.url);
  console.log('[OfflineSync] Payload:', JSON.stringify(item.payload, null, 2));

  // Replace with real API when ready:
  // await apiInstance.post(item.url, item.payload);
};

export const subscribeToQueue = (listener: QueueListener) => {
  listeners.add(listener);
  listener(offlineQueueStorage.getQueueCount());

  return () => {
    listeners.delete(listener);
  };
};

export const processOfflineQueue = async () => {
  if (isSyncing) {
    return;
  }

  const isOnline = await checkIsOnline();
  if (!isOnline) {
    return;
  }

  const queue = offlineQueueStorage.getQueue();
  if (queue.length === 0) {
    return;
  }

  isSyncing = true;

  try {
    for (const item of queue) {
      const stillOnline = await checkIsOnline();
      if (!stillOnline) {
        break;
      }

      await sendPostRequest(item);
      offlineQueueStorage.removeFromQueue(item.id);
      notifyListeners();
    }
  } finally {
    isSyncing = false;
  }
};

export const submitPostData = async (
  payload: PostPayload,
): Promise<'sent' | 'queued'> => {
  const item = createQueueItem(payload);
  const isOnline = await checkIsOnline();

  if (isOnline) {
    await sendPostRequest(item);
    return 'sent';
  }

  offlineQueueStorage.addToQueue(item);
  notifyListeners();
  return 'queued';
};

export const startOfflineSyncListener = () => {
  const unsubscribe = NetInfo.addEventListener(state => {
    if (getIsConnected(state)) {
      processOfflineQueue();
    }
  });

  processOfflineQueue();

  return unsubscribe;
};
