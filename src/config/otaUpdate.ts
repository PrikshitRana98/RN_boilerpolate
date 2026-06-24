/**
 * OTA update manifest URL.
 * Host a JSON file on your server with this shape:
 * {
 *   "version": 2,
 *   "downloadIosUrl": "https://your-server.com/bundles/ios-bundle.zip",
 *   "downloadAndroidUrl": "https://your-server.com/bundles/android-bundle.zip",
 *   "releaseNotes": "Bug fixes and improvements"
 * }
 */
export const OTA_UPDATE_MANIFEST_URL =
  'https://mypractice.ai/ota/update.json';
