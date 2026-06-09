import { subscribeToQueue } from '@/helper/offlineSyncService';
import { useEffect, useState } from 'react';

const useOfflineQueue = () => {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => subscribeToQueue(setPendingCount), []);

  return { pendingCount };
};

export default useOfflineQueue;
