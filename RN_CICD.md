# React Native CI/CD (GitHub Actions)

## Branch strategy

| Branch | Purpose | Pipeline |
|--------|---------|----------|
| `main` | Production / live app | (add production workflow later) |
| `staging` | QA before public release | **Staging Build** + notifications |
| `feature/*`, `fix/*` | Development | **CI** on push |
| PR → `main` / `staging` | Code review | **CI** on pull request |

## Workflows

### 1. `ci.yml` — Pull request checks

**Triggers:** PR to `main` or `staging`, push to `feature/**` or `fix/**`

| Job | What it does |
|-----|----------------|
| Lint, Test & Typecheck | `npm run lint`, `npm run typecheck`, `npm test` |
| Android Compile Check | `assembleDebug` to catch native breakages |

### 2. `staging-build.yml` — Staging release builds

**Triggers:** Push/merge to `staging`, manual `workflow_dispatch`

| Job | What it does |
|-----|----------------|
| Lint & Test | Quality gate |
| Android Release APK | `app-release.apk` artifact |
| iOS Simulator Build | `.zip` simulator app artifact |
| OTA JS Bundles | `android-bundle.zip` + `ios-bundle.zip` for OTA updates |
| Notify Team | Slack / Teams / WhatsApp |

## Download builds

1. GitHub → **Actions** → latest **Staging Build** run
2. **Artifacts** section:
   - `android-staging-apk` — install on Android device
   - `ios-staging-simulator` — iOS Simulator `.app` (zipped)
   - `ota-staging-bundles` — OTA zip files for hot update server

Artifacts kept for **14 days**.

## GitHub secrets

**Repository → Settings → Secrets and variables → Actions**

### Slack — [code-brew-group channel](https://code-brew-group.slack.com/archives/C0BCTR34Z89)

Channel ID: `C0BCTR34Z89`

**Option A — Bot token (recommended)**

1. Go to [Slack API Apps](https://api.slack.com/apps) → **Create New App** → From scratch
2. Workspace: **code-brew-group**
3. **OAuth & Permissions** → add scopes:
   - `chat:write`
   - `chat:write.public` (if bot is not yet in the channel)
4. Install app to workspace → copy **Bot User OAuth Token** (`xoxb-...`)
5. In Slack, open [your CI channel](https://code-brew-group.slack.com/archives/C0BCTR34Z89) → invite the bot: `/invite @YourAppName`
6. Add GitHub secret:

| Secret | Value |
|--------|--------|
| `SLACK_BOT_TOKEN` | `xoxb-...` |

**Option B — Incoming Webhook**

1. [Slack API Apps](https://api.slack.com/apps) → your app → **Incoming Webhooks** → ON
2. **Add New Webhook to Workspace** → select channel [C0BCTR34Z89](https://code-brew-group.slack.com/archives/C0BCTR34Z89)
3. Copy webhook URL (`https://hooks.slack.com/services/...`)
4. Add GitHub secret:

| Secret | Value |
|--------|--------|
| `SLACK_WEBHOOK_URL` | `https://hooks.slack.com/services/...` |

> The channel link (`/archives/C0BCTR34Z89`) is **not** the webhook URL. You need either `SLACK_BOT_TOKEN` or `SLACK_WEBHOOK_URL`.

### Microsoft Teams (optional)

| Secret | Channel |
|--------|---------|
| `TEAMS_WEBHOOK_URL` | Microsoft Teams Incoming Webhook |

### WhatsApp (optional, via Twilio)

| Secret | Example |
|--------|---------|
| `TWILIO_ACCOUNT_SID` | Twilio console |
| `TWILIO_AUTH_TOKEN` | Twilio console |
| `TWILIO_WHATSAPP_FROM` | `whatsapp:+14155238886` |
| `TWILIO_WHATSAPP_TO` | `whatsapp:+91XXXXXXXXXX` |

## Setup checklist

- [ ] Create `staging` branch: `git checkout -b staging && git push -u origin staging`
- [ ] Add `SLACK_BOT_TOKEN` (or `SLACK_WEBHOOK_URL`) in GitHub Secrets for [CI channel](https://code-brew-group.slack.com/archives/C0BCTR34Z89)
- [ ] Merge a PR into `staging` and verify Actions run
- [ ] Confirm notification in Slack/Teams
- [ ] Download APK from artifacts and test on device

## Manual trigger

**Actions → Staging Build → Run workflow** → select `staging` branch.

## OTA bundles in CI

Staging pipeline builds OTA zip files automatically. Upload them to your server and update `ota/update.json`:

```json
{
  "version": 2,
  "downloadIosUrl": "https://mypractice.ai/ota/ios-bundle.zip",
  "downloadAndroidUrl": "https://mypractice.ai/ota/android-bundle.zip",
  "releaseNotes": "Staging build"
}
```

## Before public release (`main`)

Staging uses **debug keystore** for Android (internal QA only). For production:

1. Create Android **release keystore** + GitHub secrets
2. Add Apple **distribution certificate** + provisioning profile
3. Add `production-release.yml` workflow for `main` branch
4. Use OTA artifacts for JS-only updates between store releases

## iOS note

Staging builds an **iOS Simulator** app (no Apple signing required). TestFlight/device IPA needs signing secrets on a production workflow.

## Local scripts

```bash
npm run lint
npm run typecheck
npm test
npm run bundle:ota:android
npm run bundle:ota:ios

```



* Git workflow : for large team 
    branch:
    main (hotfixes)
    staging
    feature

* Trunk base development: small team
    branch:
    main (hotfixes)
    features

* fork development: for contibution or cointract based
    - private repo
