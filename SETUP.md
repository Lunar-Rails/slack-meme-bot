# Slack Meme Bot — Setup Guide

## Repo Structure

```
slack-meme-bot/
├── netlify/
│   └── functions/
│       └── meme.js          # Slash command handler
├── public/
│   └── gifs/
│       ├── ownership.gif
│       ├── agency.gif
│       ├── future.gif
│       ├── one-team.gif
│       ├── ship.gif
│       └── truth.gif
├── netlify.toml
├── package.json
└── .gitignore
```

---

## Step 1 — Deploy to Netlify

1. Push this repo to GitHub
2. Connect repo to Netlify (Add new site > Import from Git)
3. Build settings are auto-detected from `netlify.toml`
4. Deploy — note your site URL (e.g. `https://lunar-memes.netlify.app`)

---

## Step 2 — Set Environment Variables in Netlify

In Netlify dashboard → Site → Environment Variables, add:

| Key | Value |
|-----|-------|
| `BASE_URL` | `https://your-site.netlify.app` |
| `SLACK_VERIFICATION_TOKEN` | (from Slack app config — see Step 3) |

---

## Step 3 — Create the Slack App

1. Go to https://api.slack.com/apps
2. Click **Create New App** > **From scratch**
3. Name it `Meme Bot`, select your workspace
4. Go to **Basic Information** > copy the **Verification Token**
   - Paste it into Netlify env var `SLACK_VERIFICATION_TOKEN`
5. Go to **Slash Commands** > **Create New Command**

| Field | Value |
|-------|-------|
| Command | `/meme` |
| Request URL | `https://your-site.netlify.app/meme` |
| Short Description | `Post a company values meme` |
| Usage Hint | `[ownership / agency / future / one-team / ship / truth]` |

6. Go to **OAuth & Permissions** > **Scopes** > add `commands`
7. Click **Install App to Workspace**

---

## Step 4 — Test It

In any Slack channel type:

```
/meme ownership
/meme truth
/meme future
```

Type `/meme` with no argument to see the full list.

---

## Adding More Memes Later

1. Drop the new `.gif` into `public/gifs/`
2. Add an entry to the `memes` object in `netlify/functions/meme.js`:

```js
newname: {
  url: `${BASE_URL}/gifs/newname.gif`,
  title: "Your Meme Title",
},
```

3. Push to GitHub — Netlify auto-deploys.
