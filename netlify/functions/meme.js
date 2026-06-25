exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Parse the URL-encoded body from Slack
  const params = new URLSearchParams(event.body);
  const text = (params.get("text") || "").trim().toLowerCase();
  const token = params.get("token");

  // Verify Slack verification token
  const SLACK_VERIFICATION_TOKEN = process.env.SLACK_VERIFICATION_TOKEN;
  if (SLACK_VERIFICATION_TOKEN && token !== SLACK_VERIFICATION_TOKEN) {
    return { statusCode: 403, body: "Forbidden" };
  }

  const BASE_URL = process.env.BASE_URL; // e.g. https://your-site.netlify.app

  const memes = {
    ownership: {
      url: `${BASE_URL}/gifs/ownership.gif`,
      title: "Take Ownership",
    },
    agency: {
      url: `${BASE_URL}/gifs/agency.gif`,
      title: "Act With Agency",
    },
    future: {
      url: `${BASE_URL}/gifs/future.gif`,
      title: "Focus on the Future",
    },
    "one-team": {
      url: `${BASE_URL}/gifs/one-team.gif`,
      title: "One Team, One System",
    },
    ship: {
      url: `${BASE_URL}/gifs/ship.gif`,
      title: "Ship Great Things",
    },
    truth: {
      url: `${BASE_URL}/gifs/truth.gif`,
      title: "Truth Over Comfort",
    },
  };

  // No argument — show help list
  if (!text) {
    const list = Object.keys(memes)
      .map((k) => `• \`/meme ${k}\` — ${memes[k].title}`)
      .join("\n");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        response_type: "ephemeral",
        text: `*Available memes:*\n${list}`,
      }),
    };
  }

  const meme = memes[text];

  // Unknown meme name
  if (!meme) {
    const list = Object.keys(memes).join(", ");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        response_type: "ephemeral",
        text: `Unknown meme \`${text}\`. Available: ${list}`,
      }),
    };
  }

  // Post the meme to the channel
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      response_type: "in_channel",
      blocks: [
        {
          type: "image",
          image_url: meme.url,
          alt_text: meme.title,
        },
      ],
    }),
  };
};
