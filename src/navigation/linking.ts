import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const DEEP_LINK_PREFIX = 'deeplink://';

export const DeepLinkPaths = {
  HOME: 'home',
  PROFILE: 'profile',
  SETTINGS: 'settings',
  LOGIN: 'login',
  SIGNUP: 'signup',
} as const;

export type DeepLinkPath = (typeof DeepLinkPaths)[keyof typeof DeepLinkPaths];

export function buildDeepLinkUrl(
  path: DeepLinkPath | string,
  params?: { phoneNumber?: string },
): string {
  if (path === 'otp' && params?.phoneNumber) {
    return `${DEEP_LINK_PREFIX}otp/${encodeURIComponent(params.phoneNumber)}`;
  }

  return `${DEEP_LINK_PREFIX}${path.replace(/^\//, '')}`;
}

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [DEEP_LINK_PREFIX],
  config: {
    screens: {
      Main: {
        screens: {
          Home: 'home',
          Profile: 'profile',
          Settings: 'settings',
        },
      },
      Auth: {
        screens: {
          Login: 'login',
          Signup: 'signup',
          OTPVerification: {
            path: 'otp/:phoneNumber',
            parse: {
              phoneNumber: (value: string) => decodeURIComponent(value),
            },
          },
        },
      },
    },
  },
};
