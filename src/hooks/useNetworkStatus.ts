import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

const getIsConnected = (state: NetInfoState) =>
  state.isConnected === true && state.isInternetReachable !== false;

const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(getIsConnected(state));
    });

    NetInfo.fetch().then(state => {
      setIsConnected(getIsConnected(state));
    });

    return unsubscribe;
  }, []);

  return {
    isConnected,
    isChecking: isConnected === null,
  };
};

export default useNetworkStatus;
