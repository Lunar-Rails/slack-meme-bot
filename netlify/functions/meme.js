exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const params = new URLSearchParams(event.body);
  const text = (params.get("text") || "").trim().toLowerCase();

  const BASE_URL = process.env.BASE_URL;

  const memes = {
    ownership: { url: `${BASE_URL}/gifs/ownership.gif`, title: "Take Ownership" },
    agency: { url: `${BASE_URL}/gifs/agency.gif`, title: "Act With Agency" },
    future: { url: `${BASE_URL}/gifs/future.gif`, title: "Focus on the Future" },
    team: {
      title: "One Team, One System",
      variants: {
        "one-team": `${BASE_URL}/gifs/one-team.gif`,
        amigos: `${BASE_URL}/gifs/amigos.png`,
      },
    },
    ship: { url: `${BASE_URL}/gifs/ship.gif`, title: "Ship Great Things" },
    truth: { url: `${BASE_URL}/gifs/truth.gif`, title: "Truth Over Comfort" },
    ludicrous: { url: `${BASE_URL}/gifs/ludicrous.gif`, title: "Ludicrous Speed" },
  };

  if (!text) {
    const list = Object.keys(memes)
      .map((k) => {
        const variants = memes[k].variants;
        const hint = variants ? ` [${Object.keys(variants).join(" / ")}]` : "";
        return `• \`/meme ${k}${hint}\` — ${memes[k].title}`;
      })
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

  const [key, variantKey] = text.split(/\s+/);
  const meme = memes[key];

  if (!meme) {
    const list = Object.keys(memes).join(", ");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        response_type: "ephemeral",
        text: `Unknown meme \`${key}\`. Available: ${list}`,
      }),
    };
  }

  let url = meme.url;
  if (meme.variants) {
    const variantKeys = Object.keys(meme.variants);
    if (variantKey && !meme.variants[variantKey]) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response_type: "ephemeral",
          text: `Unknown variant \`${variantKey}\` for \`${key}\`. Available: ${variantKeys.join(", ")}`,
        }),
      };
    }
    url = meme.variants[variantKey || variantKeys[Math.floor(Math.random() * variantKeys.length)]];
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      response_type: "in_channel",
      blocks: [
        {
          type: "image",
          image_url: url,
          alt_text: meme.title,
        },
      ],
    }),
  };
};
