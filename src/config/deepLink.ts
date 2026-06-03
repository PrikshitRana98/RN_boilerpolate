/**
 * Deep link & Universal Link configuration.
 * Update UNIVERSAL_LINK_HOST to your production domain and deploy files from
 * universal-links-hosting/.well-known/ to that domain.
 */
export const APP_BUNDLE_ID = 'com.mypractice.ai';

/** Production HTTPS host (no protocol, no path) */
export const UNIVERSAL_LINK_HOST = 'mypractice.ai';

export const UNIVERSAL_LINK_ORIGIN = `https://${UNIVERSAL_LINK_HOST}`;

export const UNIVERSAL_LINK_ORIGINS = [
  UNIVERSAL_LINK_ORIGIN,
  `https://www.${UNIVERSAL_LINK_HOST}`,
] as const;

export const CUSTOM_SCHEME_PREFIX = 'deeplink://';

/** All URL prefixes React Navigation should recognize */
export const LINKING_PREFIXES = [
  CUSTOM_SCHEME_PREFIX,
  ...UNIVERSAL_LINK_ORIGINS,
];
