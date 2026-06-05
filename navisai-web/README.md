# Navis AI — Web

Voice-powered WhatsApp assistant. Speak naturally, Navis finds your contact and opens WhatsApp with the message ready.

## How it works

1. Tap the mic → speak your command ("Tell John I'll be 15 minutes late")
2. Navis parses the contact name and message locally (no AI API needed)
3. Matches against contacts (demo contacts on desktop, real contacts on Chrome Android)
4. Shows a confirmation screen — edit if needed
5. Taps "Open in WhatsApp" → opens `wa.me` deep-link with message pre-filled

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> Voice input requires a browser that supports the Web Speech API (Chrome or Edge). Use HTTPS in production — mic access is blocked on HTTP.

## Deploy to Vercel (recommended)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Click Deploy — done. Vercel auto-detects Next.js.

## Deploy to GitHub Pages

Not recommended for Next.js — use Vercel instead.

## Notes

- **Desktop**: Uses demo contacts (John Tan, Sarah Wong, David Lim, etc.) since browsers don't expose the address book
- **Chrome on Android**: Can access real contacts via the Web Contact Picker API
- **WhatsApp deep-link**: Opens `https://wa.me/<phone>?text=<message>` — works on both mobile and desktop (WhatsApp Web)
