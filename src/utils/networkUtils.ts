import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export const getIsConnected = (state: NetInfoState) =>
  state.isConnected === true && state.isInternetReachable !== false;

export const checkIsOnline = async () => {
  const state = await NetInfo.fetch();
  return getIsConnected(state);
};
