# Universal Links / App Links — Server Hosting

Deploy these files to your domain so iOS and Android can verify the app owns the links.

## Required URLs

| Platform | File | Must be available at |
|----------|------|----------------------|
| iOS | `apple-app-site-association` | `https://mypractice.ai/.well-known/apple-app-site-association` |
| Android | `assetlinks.json` | `https://mypractice.ai/.well-known/assetlinks.json` |

Also host the same files on `www.mypractice.ai` if you use that host.

## Before deploying

### iOS — `apple-app-site-association`

1. Replace `YOUR_APPLE_TEAM_ID` with your 10-character Apple Team ID (Developer account → Membership).
2. Final `appID` format: `ABCDE12345.com.mypractice.ai`
3. Serve with `Content-Type: application/json` (no `.json` extension in the URL).
4. No redirects on this URL.

### Android — `assetlinks.json`

1. Replace the SHA256 fingerprint with your **release** keystore fingerprint when shipping to production.
2. Debug fingerprint included is for local `debug.keystore` testing only.
3. Get fingerprint:
   ```bash
   keytool -list -v -keystore your-release.keystore -alias your-alias
   ```

## Example: Firebase Hosting

```bash
cd universal-links-hosting
firebase init hosting
# Set public directory to this folder
firebase deploy
```

## Example: Nginx

```nginx
location /.well-known/apple-app-site-association {
  default_type application/json;
  alias /var/www/mypractice/.well-known/apple-app-site-association;
}

location /.well-known/assetlinks.json {
  default_type application/json;
  alias /var/www/mypractice/.well-known/assetlinks.json;
}
```

## Verify

**Android:**
```bash
adb shell pm verify-app-links --re-verify com.mypractice.ai
adb shell pm get-app-links com.mypractice.ai
```

**iOS:** Install app on device, tap `https://mypractice.ai/signup` in Notes (not Safari address bar).

See [docs/UNIVERSAL_LINKS.md](../docs/UNIVERSAL_LINKS.md) for full setup.
