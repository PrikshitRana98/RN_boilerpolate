import React, { useMemo } from 'react';
import {
  NavigationContainer,
  getStateFromPath as defaultGetStateFromPath,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import AuthStack from './AuthStack';
import { MainStack } from './MainStack';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { linking } from './linking';
import { navigationRef } from './navigationRef';

const Stack = createNativeStackNavigator<RootStackParamList>();

type RoutesProps = {
  isAppReady: boolean;
};

export const Routes = ({ isAppReady }: RoutesProps) => {
  const { isFirstTime } = useSelector((state: RootState) => state.auth);

  const deepLinking = useMemo(
    () => ({
      ...linking,
      enabled: isAppReady,
      getStateFromPath(path: string, options?: Parameters<typeof defaultGetStateFromPath>[1]) {
        const state = defaultGetStateFromPath(path, options);

        if (!state) {
          return state;
        }

        const routeNames = state.routes.map((route) => route.name);
        const wantsMain = routeNames.includes('Main');
        const wantsAuth = routeNames.includes('Auth');

        if (!isFirstTime && wantsMain) {
          return defaultGetStateFromPath('login', options);
        }

        if (isFirstTime && wantsAuth) {
          return defaultGetStateFromPath('home', options);
        }

        return state;
      },
    }),
    [isAppReady, isFirstTime],
  );

  return (
    <NavigationContainer ref={navigationRef} linking={deepLinking}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isFirstTime ? 'Main' : 'Auth'}
        id={undefined}
      >
        <Stack.Screen name="Main" component={MainStack} />
        <Stack.Screen name="Auth" component={AuthStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
