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

## Phase 4 — Exact location (2026-07-31)

- Location section and map now use the confirmed address: Sharnam
  Sunshine, Fatehgunj, Vadodara, Gujarat 390008.
- Added a direct "Open in Google Maps" link alongside the embedded map.

## Phase 5 — Premium visual redesign (2026-07-31)

- **New palette**: deep bottle-green/ink (`--ink`) + warm brass accent
  (`--brass`) + ivory background — moved away from the indigo/marigold
  combo, which read more "craft/quirky" than premium.
- **Typography**: body font switched from Work Sans to Manrope for a
  cleaner, more upscale feel; Fraunces retained for headings; IBM Plex
  Mono retained for prices and data.
- **Hero rebuilt**: full-bleed real photo background with a dark-to-ink
  gradient scrim and overlaid headline/CTA, replacing the small tilted
  photo card — a more editorial, boutique-hotel-style opening.
- **Rooms & Rates**: removed the pinned/tilted "notice board" look (it
  read as handmade rather than premium). Room photo cards are now clean
  and precisely aligned with a hover zoom on the photo; the food add-on
  is now a refined dark "rate card" panel instead of a paper-pin board.
- **Nav**: circular monogram mark, underline-on-hover nav links, brass
  accent buttons throughout.
- **Amenities**: icons now sit in soft brass-tinted circles for a more
  polished, less flat look.
- **Gallery**: same 7 real photos, refined hover-zoom interaction.
- Footer switched to a dark ink band to bookend the page with the hero.

## Phase 6 — Theme Engine Foundation (2026-08-01)

- Added a modular, reusable theme engine (see `THEME-ENGINE.md` for full
  architecture):
  - `js/theme-config.js` — single source of truth for theme definitions.
    Contains the `default` theme, with `vars` copied 1:1 from the existing
    `css/style.css` `:root` block.
  - `js/festival-calendar.js` — schema + lookup helper for automatic
    festival themes. Empty data array — populated in Phase 2 of the
    theme engine roadmap.
  - `js/campaign-config.js` — schema + lookup helper for manual campaigns.
    Empty data array — populated in Phase 3 of the theme engine roadmap.
  - `js/theme-engine.js` — resolves priority (campaign > festival >
    default) and applies the winning theme's CSS variables to `<html>` on
    load. Exposes `window.PGTheme.getActiveTheme()` / `.applyTheme()` /
    `.init()` for later phases and a future Admin Panel.
- **Zero visual change**: verified headlessly that the engine's applied
  variables match `css/style.css` exactly, key for key. No existing CSS,
  markup, or class was modified — only 4 new `<script>` tags added before
  `js/script.js`.
- No build step introduced; still a plain static site.

## Phase 7 — Automatic Festival Themes (2026-08-01)

- Populated `js/festival-calendar.js` with 10 festivals: New Year, Makar
  Sankranti, Republic Day, Holi, Independence Day, Ganesh Chaturthi,
  Navratri, Dussehra, Diwali, Christmas. Fixed-date festivals use
  `month`/`day`; lunar/variable festivals use per-year `dates` (2026
  sourced); Navratri uses a `dateRanges` window (multi-day support added
  to the lookup helper).
- Added 10 matching theme entries to `js/theme-config.js` — each is an
  **accent-only** override (`brass`/`brass-deep`/`brass-tint`) on top of
  the default theme, so branding (ink/ivory/charcoal/fonts) never changes.
- Extended `js/theme-engine.js`'s `applyTheme()` (no new engine file) to
  also drive:
  - an announcement bar (`#announcementBar` — one shared element, hidden
    unless the active theme sets `announcement`)
  - a hero decoration (`hero--deco-glow` / `hero--deco-particles` — one
    shared CSS-only effect per hero, toggled by class, no new markup)
  - a festive footer accent line (pure CSS, keyed off the `data-theme`
    attribute the engine already set in Phase 1 — no JS change needed)
- CTA buttons need no new styling — they already read `var(--brass)`, so
  they re-color automatically with the rest of the accent trio.
- **Verified**: headless simulation across 8 representative dates
  (normal day, Independence Day, Diwali, Navratri start/mid/end
  boundaries, the Dussehra handoff right after Navratri, Christmas, and
  the New Year rollover into 2027) all resolved correctly — right theme,
  right accent, right announcement text, right hero decoration. A normal
  day still matches the exact Phase 1 baseline (zero visual change outside
  festival windows). New CSS animations only touch `opacity` /
  `background-position` and are disabled under `prefers-reduced-motion`.
  See `THEME-ENGINE.md` for full detail.

## Phase 8 — Smart Campaign Engine (2026-08-01)

- Populated `js/campaign-config.js` with 15 campaigns: Admission Open,
  Limited Rooms Available, Refer & Earn, Freshers Welcome, Orientation
  Week, Exam Season, Placement Season, Weekend Event, Pizza Night, Movie
  Night, Cricket Fever, New Facility, Anniversary, Student Festival, Offer
  Week. **All ship `enabled: false`** with placeholder dates — this file
  is the one place to flip a campaign on with real dates; nothing else in
  the codebase changes.
- Rich per-campaign schema: `priority` (for overlap resolution),
  `startDate`/`endDate` + optional `startTime`/`endTime` (for same-day
  evening events), `autoActivate`/`autoExpire` (reserved for a future
  Admin Panel manual-override mode), `title`/`subtitle`/`bannerText`/
  `bannerIcon`/`ctaText`/`ctaLink`/`countdown` overrides.
- Added 15 matching campaign theme entries to `js/theme-config.js`,
  reusing the same accent-only-override factory as festivals (renamed
  `makeFestivalTheme` → `makeAccentTheme`, now shared by both — removes
  the duplication that would've come from two near-identical factories).
- Extended `js/theme-engine.js` (still the only file that touches the
  DOM) to also drive, all reusing existing elements — no new markup
  duplicated per campaign:
  - hero title/subtitle override (`#heroTitle`/`#heroSub`), with the real
    default copy captured once and restored whenever no campaign is live
  - primary CTA text/link override (`#heroPrimaryCta`)
  - a countdown badge (`#countdownBadge`), updating once a minute
  - a campaign's own banner text takes priority over a festival's generic
    greeting on the shared announcement bar, if both would otherwise apply
- **Verified**: overlapping-campaign priority resolution, same-day
  start/end **time** windows (not just dates), full hero-copy restoration
  after a campaign ends, and the countdown badge's formatting/hide
  behavior — all confirmed via headless simulation. Baseline (everything
  disabled) still matches Phase 2 exactly. See `THEME-ENGINE.md` for full
  detail and the complete test list.

## Phase 9 — Indian Festival & National Calendar (2026-08-01)

- Expanded `js/festival-calendar.js` from 10 to ~40 calendar days:
  12 new festivals (Maha Shivratri, Gudi Padwa, Ram Navami, Hanuman
  Jayanti, Buddha Purnima, Guru Purnima, Raksha Bandhan, Janmashtami,
  Karwa Chauth, Bhai Dooj, Chhath Puja, Tulsi Vivah, New Year's Eve),
  11 national observances (Army Day, National Youth Day, Maharashtra Day,
  National Technology Day, International Yoga Day, Teacher's Day, Hindi
  Diwas, Indian Air Force Day, National Unity Day, Constitution Day,
  Indian Navy Day), 11 remembrance/solemn days (26/11 Remembrance,
  Pulwama Remembrance, Bhagat Singh/Rajguru/Sukhdev Martyrdom Day, Subhas
  Chandra Bose Jayanti, Ambedkar Jayanti, Lal Bahadur Shastri Jayanti,
  Martyrs' Day, Gandhi Jayanti, Kargil Vijay Diwas, Police Commemoration
  Day, Armed Forces Flag Day), and 4 seasonal themes (Spring, Summer,
  Monsoon, Winter — shipped OFF by default via
  `window.PGTheme.seasonalThemesEnabled`).
- Every entry now carries `category` (`remembrance`/`national`/
  `celebration`/`seasonal`) and `priority`; `getActiveFestival()` was
  rewritten to resolve same-day collisions by category order first, then
  priority — verified against all 3 known 2026 date collisions (Sep 14,
  Oct 2, Nov 26). Full detail and rationale in `THEME-ENGINE.md`.
- Added 2 shared themes to `js/theme-config.js` —
  `festival-national-generic` and `festival-remembrance-generic` — reused
  by all 11+11 national/remembrance days respectively, instead of 22
  near-duplicate theme objects. `festival-remembrance-generic` has
  `heroDecoration: null`, deliberately: no festive animation ever appears
  on a remembrance day. Added 13 unique festival themes for the new
  celebration-tier days, plus 4 seasonal themes.
- Generalized `theme-engine.js`'s announcement + content-override logic
  (previously campaign-only) so any calendar entry — festival or
  campaign — can supply its own `bannerText`/`bannerIcon` on top of a
  shared theme, with zero duplicated logic between the two entry types.
- **Verified**: all 3 known date collisions resolve as documented;
  remembrance-tagged days confirmed to render with no hero decoration;
  existing Phase 2 festivals (Republic Day, Diwali) regression-checked;
  seasonal themes confirmed off by default and correctly activate only
  when explicitly enabled. See `THEME-ENGINE.md` for the complete
  verification list.

## Phase 10 — Premium Campaign Designs (2026-08-01)

- Refined 11 campaigns' visual treatment: Admission Open, Limited Rooms
  Available, Freshers Welcome, Refer & Earn, Cricket Fever, Cinema Week,
  Pizza Night, Weekend Event, Anniversary, Offer Week, New Facility
  Launch. Renamed `movie-night` → `cinema-week` and "New Facility" →
  "New Facility Launch" (same campaign slot in `campaign-config.js`, new
  id/name/copy for the former).
- Added 4 new hero decoration types to `css/style.css` and
  `theme-engine.js`: `beacon` (Limited Rooms, Offer Week), `sparkle`
  (Refer & Earn, Anniversary), `spotlight` (Cinema Week, New Facility
  Launch), `stadium` (Cricket Fever) — all reuse the single shared
  `.hero__decoration` element, animate only `opacity`/`transform`/
  `background-position`, and are disabled under
  `prefers-reduced-motion`, same as Phase 2's glow/particles.
- Simplified `theme-engine.js`'s `applyHeroDecoration()` to map any
  `heroDecoration` string generically to a `hero--deco-<value>` class,
  instead of an if-chain per known type — adding a future decoration type
  needs a CSS block and a config value, no engine change.
- Added a subtle CTA shimmer (`.btn--brass::after`, `transform`-only,
  GPU-composited) that plays briefly once every 5 seconds while any
  campaign is active — one CSS rule scoped to
  `body[data-theme^="campaign-"]`, reused across all campaigns rather
  than duplicated per campaign.
- Deliberately did NOT add new decorative badges/ribbons (no card
  element in the hero to anchor one to — the announcement bar already
  covers that role) or footer animation (existing static accent line
  already covers "footer accent" without a permanently-running
  animation in a rarely-viewed section).
- **Verified**: all 11 campaigns (including the 3 with same-day
  start/end time windows, tested at their actual active hour) resolve to
  the correct theme, decoration class, and banner text; CTA shimmer
  confirmed scoped to campaign days only; baseline unchanged. See
  `THEME-ENGINE.md` for full detail.

## Phase 11 — Future Admin Architecture (2026-08-01)

- Added `js/admin-api.js` — a new, purely additive file with **zero
  changes** to the existing theme engine, config, festival, or campaign
  files. Defines 8 modules under `window.PGTheme.admin`, all documented
  in `THEME-ENGINE.md`:
  - `ThemeManager` — list/read themes, read active theme
  - `CampaignManager` — list/read/validate campaigns; enable/disable/
    patch **in-memory** (not persisted — see docs)
  - `EventCalendarManager` — list/read/patch/add festival-calendar
    entries **in-memory**
  - `Scheduler` — read-only `getActiveNow()` / `getUpcoming(days)` facade
  - `ThemePreview` — apply any theme/campaign/festival temporarily,
    `exitPreview()` to revert to what's actually scheduled
  - `PriorityManager` — campaign priority list/set; **collision detector**
    for same-day festival-calendar entries in any year
  - `Analytics` — defines the event payload shape (`formatEvent()`); no
    real tracking yet (`trackEvent()` is an intentional no-op — no
    backend to send to)
  - `History` — real, working in-memory audit log of theme changes this
    session, via the engine's existing `pgtheme:applied` event (no
    engine change needed to support it)
- **Bug found and fixed by this phase's own tooling**: building
  `PriorityManager.listFestivalCollisions()` surfaced a real same-day
  collision Phase 4 had missed (May 1 — Buddha Purnima vs Maharashtra
  Day). The Phase 4 collision table in `THEME-ENGINE.md` has been
  corrected. Also fixed the collision detector itself to respect
  `seasonalThemesEnabled` the same way the engine does (it was initially
  flagging seasonal-vs-festival "collisions" that can't actually happen
  while seasonal themes are off).
- No UI, no backend, no database, no routing changes — all in-memory,
  read-mostly, purely additive.
- **Verified**: all 8 modules exercised headlessly (list/read/validate/
  enable/disable/preview/collision-detection/history-logging); confirmed
  zero changes required to any existing engine file. See
  `THEME-ENGINE.md` for the full test list.

## Phase 12 — Performance & QA (2026-08-01)

- **Fixed a real accessibility bug**: the announcement bar's text color
  (`var(--brass-deep)` on `var(--brass-tint)`) failed WCAG AA's 4.5:1
  contrast ratio on 20 of the 46 registered themes (as low as 2.91:1) —
  found via a programmatic contrast audit, not manual inspection. Fixed
  by switching the text color to `var(--ink)`, which never varies
  between themes and passes AA on every single one (worst case 11.37:1,
  verified programmatically). The countdown badge already did this
  correctly; the amenities-icon circles use the old pairing too but for
  a decorative icon, not text, where the bar is 3:1 non-text contrast —
  left as-is.
- **Fixed a real image-quality issue**: the hero's full-bleed background
  photo was a portrait-orientation image (765×1020), meaning it got
  upscaled 2.5×+ on wide desktop viewports. Swapped to the best
  available landscape-oriented photo (902×692). Added a README note
  recommending a ~1920px-wide photo if the owner has one, for a fully
  crisp hero on large screens.
- Hero image now marked `loading="eager" fetchpriority="high"` (it's the
  page's LCP element — should never be lazy). Added `loading="lazy"` to
  2 room-card images that were missing it (all 7 gallery images already
  had it).
- Added `aria-hidden="true"` to the decorative `.grain` texture overlay.
- **Verified, no changes needed**: all 7 CSS `@keyframes` animations
  confirmed (programmatically) to animate only `opacity`/`transform`/
  `background-position` — zero layout-triggering properties anywhere;
  all covered by the existing `prefers-reduced-motion` override. Every
  non-hero image container has a fixed `aspect-ratio` or the hero has a
  fixed `min-height` — no layout-shift risk. Cross-referenced every CSS
  class selector against actual HTML/JS usage — zero dead CSS found. All
  8 responsive breakpoints intact. Google Fonts already used
  `display=swap`.
- Full regression test (a live festival + the entire Phase 6 admin API)
  re-run after these changes — nothing broken. See `THEME-ENGINE.md` for
  the complete audit and verification list.
