import { LinkingOptions } from '@react-navigation/native';
import {
  CUSTOM_SCHEME_PREFIX,
  LINKING_PREFIXES,
  UNIVERSAL_LINK_ORIGIN,
} from '@/config/deepLink';
import { RootStackParamList } from './types';

export const DEEP_LINK_PREFIX = CUSTOM_SCHEME_PREFIX;

export const DeepLinkPaths = {
  HOME: 'home',
  PROFILE: 'profile',
  SETTINGS: 'settings',
  LOGIN: 'login',
  SIGNUP: 'signup',
} as const;

export type DeepLinkPath = (typeof DeepLinkPaths)[keyof typeof DeepLinkPaths];

type BuildDeepLinkOptions = {
  /** When true (default), returns https:// URL for Universal/App Links */
  preferUniversalLink?: boolean;
};

export function buildDeepLinkUrl(
  path: DeepLinkPath | string,
  params?: { phoneNumber?: string },
  options?: BuildDeepLinkOptions,
): string {
  const preferUniversalLink = options?.preferUniversalLink ?? true;
  const cleanPath = path.replace(/^\//, '');

  if (cleanPath === 'otp' && params?.phoneNumber) {
    const segment = `otp/${encodeURIComponent(params.phoneNumber)}`;
    return preferUniversalLink
      ? `${UNIVERSAL_LINK_ORIGIN}/${segment}`
      : `${DEEP_LINK_PREFIX}${segment}`;
  }

  return preferUniversalLink
    ? `${UNIVERSAL_LINK_ORIGIN}/${cleanPath}`
    : `${DEEP_LINK_PREFIX}${cleanPath}`;
}

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [...LINKING_PREFIXES],
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
