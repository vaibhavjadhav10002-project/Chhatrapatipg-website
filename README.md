# Chhatrapati PG — Landing Page

Standalone marketing website for Chhatrapati PG, Fatehganj. Plain HTML/CSS/JS
— no build step, so it deploys to Vercel as-is.

## Still to do

- **More photos** — the gallery uses 7 of your uploaded photos (see
  below). Send more any time and they can be dropped straight into
  `images/`.

## Rooms & rates (as of this build)

| Sharing | Rent | + Food (optional) |
|---|---|---|
| Double sharing | ₹6,000/mo | +₹3,000/mo |
| Triple sharing | ₹5,000/mo | +₹3,000/mo |

Food is shown as an optional add-on, not bundled into the rent. To change
any of these numbers, edit the `.room-card` blocks (photo cards) and the
`.board__row` (food add-on row) in the Rooms section of `index.html`.

## Gallery / room photos

Real photos are now wired in from the `images/` folder:

- `images/double-sharing.jpg` — used in the hero photo and the Double
  sharing room card
- `images/triple-sharing.jpg` — used in the Triple sharing room card
- `images/triple-sharing-alt.jpg`, `images/twin-room.jpg`,
  `images/cozy-room.jpg`, `images/study-desk.jpg`, `images/kitchen.jpg` —
  used in the Gallery section

Three of your uploaded photos weren't used (the ones with visible personal
items/luggage in frame) since this is a public-facing site — happy to swap
in any of them, or new photos, whenever you send them.

## Enquiry form

The Contact section has a small form (name, phone, sharing type, gender)
that opens WhatsApp with those details pre-filled as a message — no
backend or database needed. If the WhatsApp number ever changes, update
`WHATSAPP_NUMBER` in `js/script.js` as well as the WhatsApp card in
`index.html`.

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
├── index.html         # all page sections
├── css/style.css      # design tokens + styles
├── js/script.js       # nav toggle, scroll reveal, footer year, enquiry form
├── images/            # real property photos
└── CHANGELOG.md
```
