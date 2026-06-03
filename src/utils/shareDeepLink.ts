import { buildDeepLinkUrl, DeepLinkPath } from '@/navigation/linking';
import { Platform, Share } from 'react-native';

type ShareDeepLinkOptions = {
  title?: string;
  message?: string;
};

export async function shareDeepLink(
  path: DeepLinkPath | string,
  options?: ShareDeepLinkOptions,
) {
  const url = buildDeepLinkUrl(path);
  const message = options?.message ?? `Join me on mypractice! ${url}`;

  await Share.share(
    Platform.select({
      ios: {
        title: options?.title ?? 'mypractice',
        message,
        url,
      },
      default: {
        title: options?.title ?? 'mypractice',
        message,
      },
    })!,
  );
}
