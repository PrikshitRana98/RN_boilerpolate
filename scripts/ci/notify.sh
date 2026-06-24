#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=slack.config.sh
source "${SCRIPT_DIR}/slack.config.sh"

PIPELINE_NAME="${PIPELINE_NAME:-CI/CD Pipeline}"
QUALITY_RESULT="${QUALITY_RESULT:-skipped}"
ANDROID_RESULT="${ANDROID_RESULT:-skipped}"
IOS_RESULT="${IOS_RESULT:-skipped}"
OTA_RESULT="${OTA_RESULT:-skipped}"

overall_status="success"
for job_result in "$QUALITY_RESULT" "$ANDROID_RESULT" "$IOS_RESULT" "$OTA_RESULT"; do
  if [ "$job_result" = "failure" ] || [ "$job_result" = "cancelled" ]; then
    overall_status="failure"
    break
  fi
done

if [ "$overall_status" = "success" ]; then
  title="${PIPELINE_NAME} succeeded"
  color="#2EB886"
  emoji="✅"
else
  title="${PIPELINE_NAME} failed"
  color="#E01E5A"
  emoji="❌"
fi

short_sha="${COMMIT_SHA:0:7}"
message="${COMMIT_MESSAGE:-No commit message}"
message="${message//$'\n'/ }"
message="${message:0:180}"

summary="${emoji} *${title}*
• Branch: \`${BRANCH}\`
• Triggered by: ${ACTOR}
• Commit: \`${short_sha}\` — ${message}
• Lint/Test: ${QUALITY_RESULT}
• Android: ${ANDROID_RESULT}
• iOS: ${IOS_RESULT}
• OTA bundles: ${OTA_RESULT}
• Workflow: ${RUN_URL}"

send_slack_via_bot() {
  local response
  response=$(curl -sS -X POST https://slack.com/api/chat.postMessage \
    -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
    -H 'Content-Type: application/json; charset=utf-8' \
    -d "$(jq -n \
      --arg channel "$SLACK_CHANNEL_ID" \
      --arg text "$summary" \
      --arg color "$color" \
      --arg channel_url "${SLACK_WORKSPACE_URL}/archives/${SLACK_CHANNEL_ID}" \
      '{
        channel: $channel,
        text: $text,
        attachments: [{
          color: $color,
          text: ("Notifications are posted to <" + $channel_url + "|#mypractice-ci>"),
          footer: "GitHub Actions"
        }]
      }')")

  if echo "$response" | jq -e '.ok == true' > /dev/null; then
    echo "Slack notification sent to channel ${SLACK_CHANNEL_ID}."
    return 0
  fi

  echo "Slack API error: $(echo "$response" | jq -c '.')"
  return 1
}

send_slack_via_webhook() {
  curl -sS -X POST "$SLACK_WEBHOOK_URL" \
    -H 'Content-Type: application/json' \
    -d "$(jq -n \
      --arg text "$summary" \
      --arg color "$color" \
      '{text: $text, attachments: [{color: $color, text: "Download builds from GitHub Actions artifacts."}]}')"
  echo "Slack webhook notification sent."
}

if [ -n "${SLACK_BOT_TOKEN:-}" ]; then
  send_slack_via_bot
elif [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
  send_slack_via_webhook
else
  echo "Set SLACK_BOT_TOKEN (recommended) or SLACK_WEBHOOK_URL for Slack."
  echo "Target channel: ${SLACK_WORKSPACE_URL}/archives/${SLACK_CHANNEL_ID}"
fi

if [ -n "${TEAMS_WEBHOOK_URL:-}" ]; then
  curl -sS -X POST "$TEAMS_WEBHOOK_URL" \
    -H 'Content-Type: application/json' \
    -d "$(jq -n \
      --arg title "$title" \
      --arg color "$color" \
      --arg branch "$BRANCH" \
      --arg actor "$ACTOR" \
      --arg sha "$short_sha" \
      --arg msg "$message" \
      --arg quality "$QUALITY_RESULT" \
      --arg android "$ANDROID_RESULT" \
      --arg ios "$IOS_RESULT" \
      --arg ota "$OTA_RESULT" \
      --arg url "$RUN_URL" \
      '{
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": $color,
        "summary": $title,
        "sections": [{
          "activityTitle": $title,
          "facts": [
            {"name": "Branch", "value": $branch},
            {"name": "Triggered by", "value": $actor},
            {"name": "Commit", "value": ($sha + " - " + $msg)},
            {"name": "Lint/Test", "value": $quality},
            {"name": "Android", "value": $android},
            {"name": "iOS", "value": $ios},
            {"name": "OTA bundles", "value": $ota}
          ],
          "markdown": true
        }],
        "potentialAction": [{
          "@type": "OpenUri",
          "name": "Open workflow run",
          "targets": [{"os": "default", "uri": $url}]
        }]
      }')"
  echo "Teams notification sent."
else
  echo "TEAMS_WEBHOOK_URL not set. Skipping Teams."
fi

if [ -n "${TWILIO_ACCOUNT_SID:-}" ] && [ -n "${TWILIO_AUTH_TOKEN:-}" ] && [ -n "${TWILIO_WHATSAPP_FROM:-}" ] && [ -n "${TWILIO_WHATSAPP_TO:-}" ]; then
  whatsapp_body="${emoji} ${title}
Branch: ${BRANCH}
By: ${ACTOR}
Commit: ${short_sha}
Android: ${ANDROID_RESULT}
iOS: ${IOS_RESULT}
OTA: ${OTA_RESULT}
${RUN_URL}"

  curl -sS -X POST "https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json" \
    -u "${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}" \
    --data-urlencode "From=${TWILIO_WHATSAPP_FROM}" \
    --data-urlencode "To=${TWILIO_WHATSAPP_TO}" \
    --data-urlencode "Body=${whatsapp_body}"
  echo "WhatsApp notification sent."
else
  echo "Twilio WhatsApp secrets not fully set. Skipping WhatsApp."
fi

if [ "$overall_status" != "success" ]; then
  exit 1
fi
