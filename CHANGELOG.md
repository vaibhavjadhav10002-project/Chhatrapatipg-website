# Changelog

## Phase 1 — Initial build (2026-07-31)

- New standalone static site, separate from the pg-manager SaaS project.
- Built with plain HTML/CSS/JS (no framework, no build step) for simple
  Vercel deployment straight from GitHub.
- Content and structure based on the reference site (chhatrapatipg.vercel.app):
  same name, Fatehganj location, double/triple sharing for males & females,
  food/AC/WiFi — with pricing updated to the ₹5,000–10,000/month range.
- Original visual design (not copied from the reference site):
  - Palette: deep indigo (`--ink`), teal, marigold accent, warm paper
    background — avoids generic "AI template" look.
  - Type: Fraunces (display) + Work Sans (body) + IBM Plex Mono (rates,
    tags, data).
  - Signature element: a "tariff board" — rooms & rates styled like a
    pinned notice board, grounded in how PG rate cards are actually
    displayed in real hostels.
- Sections: sticky nav, hero, tariff board, amenities grid, gallery
  (placeholder blocks — swap for real photos), location, contact
  (call / WhatsApp / email cards), footer.
- Mobile-first responsive layout, keyboard focus states, reduced-motion
  support, scroll-reveal animation on section entry.
- Contact details (phone, WhatsApp, email) are placeholders — see README
  for exactly what to replace before going live.

## Phase 2 (2026-07-31)

- Contact details set for real: phone/WhatsApp `+91 88570 09635`, email
  `pgchatrapati@gmail.com`.
- Gallery rebuilt to load real photos from an `images/` folder (see its
  README for exact filenames) — falls back to the placeholder pattern for
  any photo not yet added, so nothing breaks with photos missing.
- Location section now embeds a real Google Map (no API key required)
  instead of the illustrated SVG placeholder.
- Added a working enquiry form (name, phone, sharing type, gender) that
  opens WhatsApp with the details pre-filled as a message — no backend
  needed.

### Next phase ideas (not built yet)
- Pin the map to the exact building address once available.
- Add real photos into `images/` (structure is ready, just drop files in).

## Phase 3 — Real photos + premium redesign (2026-07-31)

- **Rates corrected**: Triple sharing ₹5,000/mo, Double sharing ₹6,000/mo,
  food now shown as an optional +₹3,000/mo add-on instead of bundled into
  the rent (previous male/female price split removed since it no longer
  applied).
- **Real photos added**: 7 of the uploaded property photos are now live —
  hero image, two room-type photo cards, and a 7-photo gallery grid.
  3 uploaded photos were left out (visible personal items/luggage in
  frame) since this is a public site.
- **Premium visual pass**, inspired by the reference site screenshot:
  - Added a slim top utility bar (phone/email) above the main nav.
  - Hero now shows an actual room photo in a tilted framed card with a
    floating "Starting ₹5,000/mo" price badge, instead of the flat SVG
    illustration.
  - Rooms & Rates section leads with two photo-based room cards (image +
    price badge + description) before the tariff-board food add-on note —
    closer to how the reference site presents its "Rooms" section, while
    keeping the site's own tariff-board signature for the food pricing.
- Location map now embeds real Google Maps (Fatehganj, Vadodara) instead
  of the illustrated placeholder — exact address pin still pending.

### Next phase ideas (not built yet)
- Pin the map to the exact building once the address is confirmed.
- Swap in the 3 excluded photos if cleaner versions become available.
- Testimonials / reviews section, if wanted (seen on the reference site).
