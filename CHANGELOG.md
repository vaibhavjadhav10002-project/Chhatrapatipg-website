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

## Phase 13 — Configurable Active Windows (2026-08-01)

- **Rewrote the calendar matching logic in `festival-calendar.js`**:
  every entry now activates for a window around its date, not just the
  exact day. Defaults, config-driven (not hardcoded in the engine):
  festivals ±5 days, national days ±3, remembrance days ±1, seasonal
  unchanged (0/0 — already wide ranges). Any entry can override with its
  own `preDays`/`postDays`.
- Added `getMatchingFestivals(date)` (returns every entry whose window
  covers a date, before priority resolution) — `getActiveFestival()` is
  now built on top of it, and the Phase 6 admin API's collision detector
  calls the same function, so the two can never disagree.
- Year-boundary crossing (a window spanning Dec→Jan) handled via real
  `Date` arithmetic checking the adjacent year on both sides — verified
  both directions.
- **`theme-engine.js` was not modified at all** — the priority chain
  (campaign → remembrance → national → celebration → seasonal → default)
  is unaffected; only what counts as "a match" changed, in
  `festival-calendar.js` alone.
- Rewrote `admin.PriorityManager.listFestivalCollisions()` to scan every
  day of a year (reusing `getMatchingFestivals()`/`getActiveFestival()` —
  no re-implemented matching logic) and group consecutive overlapping
  days into ranges, instead of only checking exact-date matches. Added
  `admin.PriorityManager.listSilencedEntries(year)` — finds any entry
  that never wins a single day.
- **Found and documented, not silently fixed**: with the new windows,
  2026 has 34 distinct overlapping date ranges (up from 4 known exact-day
  collisions), and two named festivals — `dussehra` and `new-years-eve`
  — never win a single day of 2026 at all, fully overlapped by a
  same-category neighbor or a higher-ranked category. An earlier attempt
  fixed this by bumping Dussehra's priority; that was reverted since
  retuning priorities wasn't part of this request and is an editorial
  call, not a code fix. See `THEME-ENGINE.md` Phase 8 for the full
  writeup and how to adjust it if desired.
- **Verified**: window boundaries exact (5th day in, 6th day out, for
  all three category defaults); year-boundary crossing both directions;
  priority/category resolution unchanged; full regression (quiet day,
  active campaign priority, all 8 admin modules) re-run clean.

## Phase 14 — Business info correction (2026-08-01)

- Added a second phone number throughout (+91 94053 34300, alongside the
  existing +91 88570 09635) — top bar, hero "Call now", and a redesigned
  Contact "Call" card showing both as separate tappable numbers.
- Added "PG Like's Home" tagline to the hero eyebrow line.
- **Added Single sharing as a third room type** (₹11,000/mo) — new room
  card using `images/cozy-room.jpg`, alongside corrected Double
  (₹6,000) and Triple (₹5,000) sharing rates. Rooms grid now shows 3
  columns on wide screens.
- Added a clear disclosure that **electricity (light) and gas bills are
  excluded** from rent and billed separately — in the rooms section
  intro and the rate-card note. This was specifically flagged as
  important by the owner.
- Corrected the address using a newly-provided, more precise Google Maps
  link: **Sharnam Sunshine, 401, Fatehgunj, Vadodara, Gujarat 390002**
  (previously 390008) — updated in the location text, list, map embed,
  and the "Open in Google Maps" link.
- Expanded Amenities from 8 to 10 curated cards to cover the owner's full
  facilities list (geysers in every washroom, RO-filtered water, fully
  loaded kitchen with LPG, washing machine connection, fridge access,
  personal locker, bed sheets/pillow covers) without turning the section
  into a 21-item checklist — grouped into sensible categories, keeping
  the premium curated feel.
- Added a "Single sharing" option to the enquiry form's sharing dropdown.
- Updated meta description for the new room mix and rate range.

## Phase 15 — Premium UI/UX Polish, Phase 1: Design Foundation (2026-08-01)

- Added premium design tokens to `css/style.css` `:root`: layered
  `--shadow-sm/md/lg/glow`, `--glass-bg/border/blur` + `.glass`/
  `.glass-dark` utilities (with a `@supports` fallback), a
  `--ease-premium` cubic-bezier motion curve, and a `--space-xs..xl`
  spacing scale. No branding tokens (ink/brass/ivory/fonts) touched.
- Bumped hero title and section heading type scale for more presence;
  bumped section vertical padding to `--space-xl` (7rem).
- Buttons, room cards, gallery items, amenity cards, and contact cards
  now share one consistent shadow + easing language
  (`--shadow-md`/`--shadow-lg` + `--ease-premium`) instead of several
  slightly different ad-hoc values.
- Nav's existing blur now uses the same `--glass-blur` token as
  everything else instead of a hardcoded value.
- Refined scroll-reveal: more travel distance, a subtle scale-in, the
  premium ease curve, and staggered `transition-delay` within grids —
  still pure `opacity`/`transform`/`box-shadow`, still the same
  `IntersectionObserver`. Room cards and the rate-card now reveal
  individually (cascading) instead of the whole Rooms section fading in
  as one block.
- **Verified**: zero changes to any `.js` theme/campaign/festival engine
  file — full regression re-run clean (quiet day → `default`, all 8
  admin modules intact). See `THEME-ENGINE.md` for full detail.

## Phase 16 — Premium UI/UX Polish, Phase 2: Hero Section (2026-08-01)

- Added a floating availability badge (glass-dark pill, pulsing status
  dot) — honest copy ("Single, Double & Triple sharing available",
  the room types, not a live-vacancy claim we can't actually verify).
  Repositions to the bottom of the hero on small screens.
- Added a scroll indicator (bouncing chevron, links to `#rooms`) at the
  bottom of the hero — real navigational value, not just decoration.
- Enhanced the scrim with a subtle radial ambient-light layer (soft
  brass-toned glow, upper-right) blended with the existing dark
  gradient — "elegant dark overlay" + "subtle background lighting" in
  one gradient definition, no extra DOM.
- Hero content now has a one-time cinematic entrance animation on load
  (fade + rise, `--ease-premium`, 1s) — separate from the scroll-reveal
  system, since the hero is visible immediately rather than scrolled to.
- Secondary hero CTA ("Call now") now has a frosted-glass base state
  (subtle translucent fill + blur) instead of a plain outline.
- **Verified**: all new animations use only `opacity`/`transform` (plus
  one `box-shadow` on button hover, scoped to the button only); all
  covered by the existing `prefers-reduced-motion` override — the
  fill-mode entrance animation degrades to "already visible" instantly
  rather than breaking. HTML tag balance re-checked (65 divs, 6
  sections, all matched). Full engine regression re-run clean — this
  phase touched only `index.html` and `css/style.css`, no `.js` engine
  file.

## Phase 17 — Premium UI/UX Polish, Phase 3: Room Showcase (2026-08-01)

- Room cards rebuilt as a premium accommodation gallery: larger photo
  area (5:4, was 4:3), a floating "Available" status badge and price
  tag directly on the photo (was a text row below it) — closer to how
  premium booking sites present room cards.
- Added an occupancy/bed-count meta row (e.g. "2 occupants · 2 beds")
  and a row of feature chips (AC, WiFi, Personal locker, Geyser) per
  card. **Deliberately did not add square-footage numbers** — there's no
  real room-size data to show, and fabricating one would be dishonest;
  noted in `README.md` as something to add if the owner provides real
  measurements.
- The "Available" badge is plain static text, not tied to any real
  inventory system — flagged in `README.md` for the owner to edit/remove
  per room type if it stops being accurate.
- **Verified**: HTML tag balance (articles, lists, divs) re-checked;
  full engine regression re-run clean — this phase touched only
  `index.html` and `css/style.css`.

## Phase 18 — Premium UI/UX Polish, Phase 4: Amenities (2026-08-01)

- Amenity cards converted to glass (`--glass-bg` + `backdrop-filter`
  blur, `@supports` fallback for older browsers) — solidify to a plain
  white card on hover for readability/emphasis.
- Added a very subtle ambient backdrop to the Amenities section itself
  (two faint radial gradients, opacity 0.04–0.07) so the glass cards
  have something gentle to blur against, rather than floating over flat
  color — kept deliberately understated, not a visible pattern.
- Refined spacing (larger icon-circle padding, more line-height on
  descriptions) and hierarchy (slightly larger heading weight/tracking).
- **Verified**: CSS brace-balanced; full engine regression clean — no
  `.js` engine file touched this phase.

## Phase 19 — Premium UI/UX Polish, Phase 5 skipped, Phase 6: Gallery + Lightbox (2026-08-01)

- Student Reviews section (originally planned Phase 5) skipped at the
  owner's request rather than filled with fabricated testimonials —
  no fake names/quotes were added anywhere.
- Gallery items converted from `<div>`s to real `<button>` elements
  (keyboard-focusable, native click semantics) and wired to a new
  lightbox: click any photo to view it full-size with prev/next
  navigation, a close button, Escape/arrow-key support, and
  click-outside-to-close. Focus returns to the exact thumbnail that was
  clicked when the lightbox closes.
- Lightbox open/close and image transitions use only `opacity` and
  `transform` (figure scales in from 0.96→1) — no layout-affecting
  animation. Background scroll is locked while open.
- **Verified**: HTML tag balance (12 buttons, 1 figure, divs) re-checked;
  full engine regression re-run clean — this phase touched
  `index.html`, `css/style.css`, and `js/script.js` only (no theme/
  campaign/festival engine file).

## Phase 20 — Premium UI/UX Polish, Phase 7: Pricing (2026-08-01)

- Rather than duplicate the Rooms & Rates content in a second "Pricing"
  section, enhanced the existing room cards: Triple sharing (already
  labeled "our most booked option" in the copy) now carries a
  `room-card--recommended` treatment — a brass border, deeper shadow,
  and a small "Most booked" ribbon on the photo. No new section, no
  duplicated pricing data.
- **Verified**: HTML tag balance re-checked (3 articles); full engine
  regression clean — `index.html`/`css/style.css` only, no engine file.

## Phase 21 — Premium UI/UX Polish, Phase 8: Contact & Map (2026-08-01)

- Map now has a premium frame (shadow) and a subtle desaturated filter
  by default (grayscale 25%, slightly muted) that returns to full color
  on hover — less "cartoonish default Google Maps," more elegant, while
  staying fully interactive underneath.
- WhatsApp — the primary enquiry channel — now visually leads the
  contact cards (dark ink card, brass icon/text, glow-shadow on hover)
  instead of matching weight with Call/Email, for clearer CTA hierarchy.
- **Note on the "transform/opacity only" rule**: this phase's map-filter
  and card-shadow transitions are paint-only (no layout reflow) but not
  fully compositor-accelerated like `transform`/`opacity` — same
  reasoning as the box-shadow hover transitions from earlier phases:
  scoped to single small elements, low cost, and there's no
  transform/opacity equivalent for "desaturate on hover" or "shadow
  depth on hover." Flagging this explicitly rather than silently
  stretching the rule's letter.
- **Verified**: CSS brace-balanced; full engine regression clean —
  `index.html`/`css/style.css` only.

## Phase 22 — Monthly Premium Themes (2026-08-01)

- New `js/monthly-themes.js`: 12 refined, muted accent themes (one per
  month), on by default (`window.PGTheme.monthlyThemesEnabled = true`,
  the one auto-on tier — campaigns and seasonal themes both stay
  opt-in/off). Added matching `monthly-january` … `monthly-december`
  entries to `theme-config.js` (accent-only, `heroDecoration: null` on
  all 12 — see the design note in `monthly-themes.js` for why).
- Priority chain now: campaign > remembrance > national > festival >
  **monthly** > season > default.
- Split `festival-calendar.js`'s single `getActiveFestival()` into
  `getActiveFestival()` (remembrance/national/celebration only) and a
  new `getActiveSeason()` (seasonal only) — both reuse the same
  `getMatchingFestivals()`, no re-implemented date logic — so Monthly
  Themes could slot in between them without `theme-engine.js` needing
  any date-matching logic of its own. `theme-engine.js`'s
  `getActiveTheme()` now checks campaign → festival → monthly → season →
  default, in order.
- **Documented, not silently patched**: with Monthly Themes on by
  default, Season themes are now unreachable in practice — Monthly
  always wins that priority tier first, on every day of the year, since
  it's unconditional whenever nothing higher-priority is active. This is
  the direct, correct consequence of the specified priority order, not a
  bug — verified and written up in `THEME-ENGINE.md`.
- **Verified**: quiet-day monthly fallback confirmed; festivals/national
  days/remembrance days confirmed to still outrank monthly on their own
  active days (Diwali, Republic Day, Martyrs' Day); campaign priority
  confirmed unaffected; Season's new reachability condition verified
  both ways; 57 total themes now registered (was 45); all 8 admin API
  modules re-verified against the restructured festival-calendar.js.

## Phase 23 — Visual direction change: maroon & gold (2026-08-01)

- Re-themed the site's core identity from ink-green/brass to deep
  maroon/gold, per a reference design the owner shared. Since the whole
  site already reads color from CSS custom properties (`--ink`,
  `--brass`, `--brass-deep`, `--brass-tint`), this was a token-value
  change in `css/style.css` `:root` — no component, layout, or markup
  changes needed anywhere else. `theme-config.js`'s `default` theme was
  updated to match (kept in sync per the "single source of truth" rule
  from Phase 1).
- Added a dedicated `--whatsapp`/`--whatsapp-deep` green token (reusing
  the existing brand-adjacent green already used for the "Available"
  badge dot) and a `.btn--whatsapp` button variant — the WhatsApp CTA
  (enquiry form submit) and the WhatsApp contact card now use this
  dedicated green instead of the general gold accent, matching how the
  reference distinguishes WhatsApp actions from the primary brand color.
- Added a stats band (500+ Happy Students, 24×7 Security & Support, 3
  Sharing Options, 100% Hygienic Food) between Amenities and Gallery.
  **Numbers are illustrative, explicitly authorized by the owner** — "3
  Sharing Options" is a real fact (Single/Double/Triple); the others are
  general trust-marketing figures, not verified claims.
- **Deliberately not done**: the reference's testimonial cards (with
  placeholder names/photos/quotes) and its specific "X minutes to
  [named real institution]" location list were not copied — the former
  is exactly the fabricated-reviews problem already declined earlier in
  this project; the latter would be a specific, checkable factual claim
  about real named places (MS University, Parul University, etc.) that
  nobody has verified — different risk profile than a generic stats
  band the owner explicitly authorized. Existing general "walkable to
  market/ATM/banks/hospital" copy (Location section) was left as-is.
- **Pending from the owner**: a real logo file (currently still the
  text monogram — swap point noted in README) and a real building
  exterior photo (hero still uses a real interior photo — the reference
  image itself can't be extracted as a usable asset, it's a screenshot
  inside a design-mockup tool).
- **Verified**: all hardcoded rgba() values matching the old ink/brass
  colors were found and updated (not just the CSS custom properties) —
  confirmed via grep, zero old-color rgba values remain. Full engine
  regression re-run: `default` theme's `ink`/`brass` now read the new
  values; festival/monthly themes confirmed to still correctly layer on
  top (Diwali still resolves to `festival-diwali`, still overrides a
  monthly theme, etc.) — this phase touched CSS/HTML plus one config
  object in `theme-config.js`, no engine logic file.

## Phase 24 — Final Mobile-First Polish + Honest Pricing Badges (2026-08-01)

- **Corrected a factual conflict in the brief**: it asked for "Food
  Included / Electricity Included / Gas Included" badges, which
  contradicts real facts already on the site (food is a ₹3,000/mo
  add-on; electricity and gas are billed separately). Did not implement
  the false version. Instead added honest transparency badges —
  "Transparent pricing", "No hidden charges", "Food available,
  +₹3,000/mo", "Electricity & gas billed separately" — to the hero and
  the Rooms & Rates section header.
- **Mobile touch-target audit** (44px minimum): found and fixed two real
  issues — the nav hamburger button was 38×34px (now 44×44px), and the
  stacked phone-number links in the Call contact card had text-only tap
  areas (now padded for a comfortable tap zone, no visual layout shift).
- Added `overflow-x: hidden` on `<body>` as a defensive safety net
  against horizontal scroll on narrow screens (360–430px) — audited for
  fixed-width/nowrap overflow risks first; found none, added as a guard
  anyway per the brief's explicit "no horizontal overflow" requirement.
- Added touch-swipe (left/right) support to the gallery lightbox —
  previously keyboard/click/button only, no touch gesture on the
  primary device type for most visitors. Ignores swipes that are
  more vertical than horizontal, so it doesn't fight a page scroll.
- Added a pressed/active state to all buttons (`transform: translateY
  scale`, GPU-only).
- **Fixed the last 3 non-transform/opacity animations flagged in Phase
  7's audit**, rather than re-documenting them as exceptions:
  - The hero badge's pulsing dot used `box-shadow` — converted to a
    `::after` ripple ring animating `transform: scale` + `opacity`.
  - The particle and stadium hero decorations used `background-position`
    — converted to an oversized background element (140% size) animated
    with `transform: translate`/`translateY` instead, looping seamlessly
    at exactly one tile period. `.hero`'s existing `overflow: hidden`
    safely clips the oversized element.
  - **All 10 keyframe animations sitewide now verified (programmatically)
    to use only `transform`/`opacity`** — zero exceptions remaining.
- **Verified**: CSS brace-balanced; HTML tag balance re-checked; full
  engine regression clean (default theme colors, all 8 admin modules);
  animation-property audit re-run clean across every `@keyframes` block
  in the file.
