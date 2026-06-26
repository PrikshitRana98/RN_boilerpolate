/**
 * Vapi AI configuration.
 *
 * Get your public API key and assistant ID from https://dashboard.vapi.ai
 */
export const VAPI_CONFIG = {
  API_KEY: 'YOUR_VAPI_PUBLIC_API_KEY',
  ASSISTANT_ID: 'YOUR_ASSISTANT_ID',
} as const;

export const isVapiConfigured = () =>
  VAPI_CONFIG.API_KEY !== 'YOUR_VAPI_PUBLIC_API_KEY' &&
  VAPI_CONFIG.ASSISTANT_ID !== 'YOUR_ASSISTANT_ID';
