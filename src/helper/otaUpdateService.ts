import { OTA_UPDATE_MANIFEST_URL } from '@/config/otaUpdate';
import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import hotUpdate from 'react-native-ota-hot-update';

export interface OtaUpdateManifest {
  version: number;
  downloadIosUrl: string;
  downloadAndroidUrl: string;
  releaseNotes?: string;
}

const getBundleUrl = (manifest: OtaUpdateManifest) =>
  Platform.OS === 'ios' ? manifest.downloadIosUrl : manifest.downloadAndroidUrl;

export const checkForOtaUpdate = async () => {
  if (__DEV__) {
    return;
  }

  try {
    const currentVersion = await hotUpdate.getCurrentVersion();
    const response = await fetch(OTA_UPDATE_MANIFEST_URL);

    if (!response.ok) {
      console.warn('[OTA] Manifest request failed:', response.status);
      return;
    }

    const manifest: OtaUpdateManifest = await response.json();
    const bundleUrl = getBundleUrl(manifest);

    if (!manifest.version || !bundleUrl) {
      console.warn('[OTA] Invalid manifest');
      return;
    }

    if (manifest.version <= currentVersion) {
      console.log('[OTA] App is up to date. Current:', currentVersion);
      return;
    }

    console.log(
      '[OTA] Update available:',
      currentVersion,
      '->',
      manifest.version,
    );

    await hotUpdate.downloadBundleUri(
      ReactNativeBlobUtil,
      bundleUrl,
      manifest.version,
      {
        restartAfterInstall: true,
        restartDelay: 500,
        maxBundleVersions: 3,
        metadata: {
          releaseNotes: manifest.releaseNotes ?? '',
        },
        progress: (received, total) => {
          const percent = total ? Math.round((+received / +total) * 100) : 0;
          console.log(`[OTA] Download progress: ${percent}%`);
        },
        updateSuccess: () => {
          console.log('[OTA] Bundle installed. Restarting app...');
        },
        updateFail: message => {
          console.warn('[OTA] Update failed:', message);
        },
      },
    );
  } catch (error) {
    console.warn('[OTA] Update check failed:', error);
  }
};

export const getOtaCurrentVersion = () => hotUpdate.getCurrentVersion();

export const rollbackOtaUpdate = async () => {
  const success = await hotUpdate.rollbackToPreviousBundle();
  if (success) {
    await hotUpdate.resetApp();
  }
  return success;
};
