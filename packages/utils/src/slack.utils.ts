export async function sendSlackMessage({
  channel,
  username = "alert-bot",
  message,
  iconEmoji = ":ghost:",
}: {
  message: string;
  channel: string;
  username?: string;
  iconEmoji?: string;
}) {
  const url = process.env.SLACK_WEBHOOK_URL;

  if (!url) {
    console.error("SLACK_WEBHOOK_URL is not set");
    return;
  }

  const payload = {
    channel: channel,
    username: username,
    text: message,
    icon_emoji: iconEmoji,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `payload=${encodeURIComponent(JSON.stringify(payload))}`,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Slack message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
  }
}
