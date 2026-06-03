# Universal Links & Android App Links

This guide covers HTTPS universal links (`https://mypractice.ai/...`) in addition to the custom scheme (`deeplink://`).

---

## What was implemented

| Layer | File | Purpose |
|-------|------|---------|
| Config | `src/config/deepLink.ts` | Domain, origins, prefixes |
| JS routing | `src/navigation/linking.ts` | HTTPS + custom scheme prefixes |
| Android | `AndroidManifest.xml` | `autoVerify` intent filters for `https` |
| iOS | `rn_boilerplate.entitlements` | `applinks:mypractice.ai` |
| Server templates | `universal-links-hosting/.well-known/` | AASA + `assetlinks.json` |
| Share | `buildDeepLinkUrl()` | Defaults to `https://` URLs |

---

## Supported URLs

| Universal Link | Custom scheme (still works) | Screen |
|----------------|----------------------------|--------|
| `https://mypractice.ai/home` | `deeplink://home` | Home |
| `https://mypractice.ai/profile` | `deeplink://profile` | Profile |
| `https://mypractice.ai/settings` | `deeplink://settings` | Settings |
| `https://mypractice.ai/login` | `deeplink://login` | Login |
| `https://mypractice.ai/signup` | `deeplink://signup` | Signup |
| `https://mypractice.ai/otp/9876543210` | `deeplink://otp/9876543210` | OTP |

`www.mypractice.ai` is also registered on native and linking config.

---

## Step 1 — Change the domain (if needed)

Edit `src/config/deepLink.ts`:

```typescript
export const UNIVERSAL_LINK_HOST = 'mypractice.ai';
```

Then update:

- `android/app/src/main/AndroidManifest.xml` — `android:host` values
- `ios/rn_boilerplate/rn_boilerplate.entitlements` — `applinks:` entries
- Host the `.well-known` files on your real domain

---

## Step 2 — Deploy verification files

Copy `universal-links-hosting/.well-known/` to your web server.

### iOS — `apple-app-site-association`

1. Set `appID` to `{TEAM_ID}.com.mypractice.ai`
2. URL: `https://mypractice.ai/.well-known/apple-app-site-association`
3. Must return JSON, no redirect

### Android — `assetlinks.json`

1. Add your **release** signing certificate SHA256
2. URL: `https://mypractice.ai/.well-known/assetlinks.json`

See [universal-links-hosting/README.md](../universal-links-hosting/README.md).

---

## Step 3 — Apple Developer setup

1. Open [Apple Developer](https://developer.apple.com) → Identifiers → `com.mypractice.ai`
2. Enable **Associated Domains**
3. Rebuild iOS app after entitlements change

---

## Step 4 — Rebuild native apps

```bash
yarn android
yarn ios
```

Universal links do not work with JS-only reload; native config changed.

---

## Step 5 — Code usage

### Build a link

```typescript
import { buildDeepLinkUrl, DeepLinkPaths } from '@/navigation/linking';

buildDeepLinkUrl(DeepLinkPaths.SIGNUP);
// → https://mypractice.ai/signup

buildDeepLinkUrl(DeepLinkPaths.SIGNUP, undefined, { preferUniversalLink: false });
// → deeplink://signup
```

### Share (uses HTTPS by default)

```typescript
import { shareDeepLink } from '@/utils/shareDeepLink';
import { DeepLinkPaths } from '@/navigation/linking';

await shareDeepLink(DeepLinkPaths.SIGNUP);
```

### FCM push payload

```json
{
  "data": {
    "deeplink": "https://mypractice.ai/profile"
  }
}
```

---

## Testing

### After domain files are live

**Android:**
```bash
adb shell am start -a android.intent.action.VIEW -d "https://mypractice.ai/signup" com.mypractice.ai
adb shell pm get-app-links com.mypractice.ai
```

**iOS simulator:**
```bash
xcrun simctl openurl booted "https://mypractice.ai/signup"
```

**Best test:** Send yourself `https://mypractice.ai/signup` in Messages/Notes and tap the link.

### Without a live domain

Custom scheme still works for development:

```bash
adb shell am start -a android.intent.action.VIEW -d "deeplink://signup" com.mypractice.ai
```

HTTPS links require successful domain verification.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Link opens browser, not app | Deploy AASA / assetlinks; check Team ID & SHA256 |
| Android verification failed | `adb shell pm verify-app-links --re-verify com.mypractice.ai` |
| iOS does not open app | Associated Domains enabled on App ID; reinstall app |
| Logged-in user lands on Home from signup link | Auth guard in `Routes.tsx` (expected) |
| Wrong domain in app | Sync `deepLink.ts`, Manifest, entitlements |

---

## Related docs

- [DEEP_LINKING.md](./DEEP_LINKING.md) — Custom scheme, auth guards, share, FCM
