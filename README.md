# Chhatrapati PG — Landing Page

Standalone marketing website for Chhatrapati PG, Fatehganj. Plain HTML/CSS/JS
— no build step, so it deploys to Vercel as-is.

## Before you deploy — remaining items

Phone (`+91 88570 09635`), WhatsApp, and email (`pgchatrapati@gmail.com`) are
already set in `index.html`. Still to do:

1. **Photos** — see "Gallery photos" below.
2. **Exact map pin** — the Location section now embeds a real Google Map
   (no API key needed), currently centered on "Fatehganj, Vadodara". If you
   want it pinned to your exact building, replace the `q=Fatehganj%2C%20Vadodara`
   part of the iframe `src` in `index.html` with your precise address
   (URL-encoded), or paste in the `src` from Google Maps' own "Share → Embed
   a map" option for full accuracy.

## Gallery photos

The gallery now loads real images from the `images/` folder. Add your
photos there using these exact filenames:

- `images/double-room.jpg`
- `images/dining.jpg`
- `images/study-corner.jpg`
- `images/triple-room.jpg`
- `images/building.jpg`

Any spot without a matching file just shows a plain placeholder pattern —
nothing breaks, and photos appear automatically as you add them, no code
changes needed.

## Enquiry form

The Contact section now has a small form (name, phone, sharing type,
gender) that opens WhatsApp with those details pre-filled as a message —
no backend or database needed. If your WhatsApp number ever changes, update
`WHATSAPP_NUMBER` in `js/script.js` as well as the WhatsApp card in
`index.html`.

## Rooms & rates shown

| Sharing | For | Rate |
|---|---|---|
| Double | Male | ₹8,500/mo |
| Double | Female | ₹10,000/mo |
| Triple | Male | ₹6,000/mo |
| Triple | Female | ₹5,000/mo |

These sit inside the overall ₹5,000–10,000 range you asked for — adjust the
exact numbers in the `.board__row` blocks in `index.html` any time.

## Deploy to Vercel

Since this is a static site (no `package.json`, no build step):

1. Push this folder to a new GitHub repo.
2. In Vercel: **Add New → Project → Import** your repo.
3. Framework preset: choose **Other** (or leave auto-detect — Vercel will
   serve `index.html` as-is).
4. Deploy. No environment variables or build command needed.

## Local preview (on a phone)

Any app that can open a local `index.html` in a browser works, or push to
GitHub and use Vercel's preview URL for every commit — no local server
required.

## Structure

```
chhatrapati-pg/
├── index.html        # all page sections
├── css/style.css      # design tokens + styles
├── js/script.js       # nav toggle, scroll reveal, footer year
└── CHANGELOG.md
```
