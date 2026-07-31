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
