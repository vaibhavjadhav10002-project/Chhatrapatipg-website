# Theme Engine — Architecture

Phase-wise build. This document covers **Phase 1: foundation** only —
festival themes (Phase 2), campaigns (Phase 3), campaign visuals (Phase 4),
and Admin Panel hooks (Phase 5) will extend this same structure without
changing it.

## Why this exists

Today the site has one look (`Chhatrapati PG — Premium`, ivory + brass +
ink). This engine makes "which look is active" a *data* question instead
of a *code* question — so later phases can add a Diwali theme, a Cricket
campaign, etc., by adding entries to a config array, never by editing CSS
or rewriting markup.

## Files

| File | Role |
|---|---|
| `js/theme-config.js` | **Single source of truth.** Every theme (default, and later every festival/campaign theme) is one object here: a flat `vars` map (→ CSS custom properties) plus optional `announcement`, `heroDecoration`, `ctaVariant`. |
| `js/festival-calendar.js` | Data + lookup for automatic yearly festivals. Empty array in Phase 1 — Phase 2 fills it in. `getActiveFestival(date)` returns today's festival entry, or `null`. |
| `js/campaign-config.js` | Data + lookup for manual, date-ranged campaigns. Empty array in Phase 1 — Phase 3 fills it in. `getActiveCampaign(date)` returns the live campaign, or `null`. |
| `js/theme-engine.js` | The only file that **applies** anything. Resolves priority (campaign > festival > default) and writes the winning theme's `vars` onto `<html>` as CSS custom properties. |

## How it works right now (Phase 1)

1. `festival-calendar.js` and `campaign-config.js` both have empty data
   arrays, so their lookup functions always return `null`.
2. `theme-engine.js` therefore always falls through to
   `window.PGTheme.config.default`.
3. That default object's `vars` are copied 1:1 from the values already
   hardcoded in `css/style.css`'s `:root` block — so turning the engine on
   changes nothing visually. This was verified by running the engine
   headlessly and diffing the applied `--variable` values against
   `style.css` — they match exactly.

## Priority order

```
campaign (if one is enabled and today falls in its date range)
   ↓ (else)
festival (if today matches an entry in the festival calendar)
   ↓ (else)
default theme
```

A campaign always wins over a festival, per the original spec — e.g. a
Special Sale campaign running through Diwali would show the sale theme,
not the festival theme.

## No hardcoded values

Nothing outside `theme-config.js` should ever contain a color, font, or
radius value going forward. Festival and campaign themes (Phase 2/3) will
each be a new entry in `theme-config.js`'s `config` object, referenced by
`themeId` from `festival-calendar.js` / `campaign-config.js`.

## Public API (for later phases / a future Admin Panel)

```js
window.PGTheme.getActiveTheme()   // -> { source, entry, theme } — read-only, no side effects
window.PGTheme.applyTheme(theme)  // -> writes a theme's vars to the page right now
window.PGTheme.init()             // -> full resolve + apply pass; safe to call again anytime
```

The page also dispatches a `pgtheme:applied` event on `document` (detail =
the same shape as `getActiveTheme()`) whenever a theme is applied, so a
later announcement-bar component (Phase 2) can react without re-deriving
which theme is active.

## Load order (already wired into `index.html`)

```html
<script src="js/theme-config.js"></script>
<script src="js/festival-calendar.js"></script>
<script src="js/campaign-config.js"></script>
<script src="js/theme-engine.js"></script>
<script src="js/script.js"></script>
```

The four theme files must load in this order (each depends on
`window.PGTheme` being initialized by the one before it). The engine
self-runs on `DOMContentLoaded` — no manual call needed.

## Verified for Phase 1

- [x] All 5 JS files pass `node --check` (no syntax errors).
- [x] Ran the engine headlessly — resolves to `default`, and the applied
      `--variable` values match `css/style.css` `:root` exactly, key for
      key.
- [x] No changes made to `css/style.css`, `index.html` markup, or any
      existing class — only 4 new `<script>` tags added before the
      existing `js/script.js`.
- [x] No build step introduced — plain scripts, same static-site
      deployment as before.

---

## Phase 2 — Automatic Festival Themes

10 festivals now live in `js/festival-calendar.js`, each pointing at a
theme entry in `js/theme-config.js`: New Year, Makar Sankranti, Republic
Day, Holi, Independence Day, Ganesh Chaturthi, Navratri, Dussehra, Diwali,
Christmas.

### Design principle: accent-only overrides

Every festival theme is a 3-variable override — `brass` / `brass-deep` /
`brass-tint` — on top of the default theme. `ink`, `ivory`, `charcoal`,
fonts, and radius are never touched. This is deliberate:

- **Branding always stays visible** — the Chhatrapati PG identity (dark
  ink surfaces, ivory background, Fraunces/Manrope type) never changes,
  only the accent color shifts per festival.
- **Zero new CSS classes** — every existing button, price tag, icon
  circle, and hover state already reads `var(--brass)` etc., so they
  re-color automatically. "CTA styling" in the spec is satisfied by this
  reuse, not by new campaign-specific button classes.

### New pieces, all reused by every festival (no per-festival code)

| Piece | What it is | Where |
|---|---|---|
| Announcement bar | One `#announcementBar` element, text/icon swapped in by the engine. Hidden (`hidden` attribute) whenever `theme.announcement` is `null` — true for the default theme, so nothing shows on a normal day. | `index.html` (markup), `css/style.css` `.announcement-bar*`, `js/theme-engine.js` `applyAnnouncement()` |
| Hero decoration | One `.hero__decoration` div, pure CSS. The engine only ever toggles a class (`hero--deco-glow` or `hero--deco-particles`) on `#hero` — no per-festival markup or JS. | `css/style.css` `.hero--deco-*` | 
| Footer accent | A 2px gradient line using `var(--brass)`, shown via a CSS attribute selector (`body[data-theme^="festival-"]`) — no JS needed beyond the `data-theme` attribute the engine already sets in Phase 1. | `css/style.css` footer rules |

### Festival date handling

- **Fixed solar-calendar dates** (New Year, Makar Sankranti, Republic Day,
  Independence Day, Christmas) use `month`/`day` — never change.
- **Lunar/variable dates** (Holi, Ganesh Chaturthi, Dussehra, Diwali) use a
  `dates: { <year>: "MM-DD" }` override, sourced for 2026. An unlisted year
  simply won't match — it never falls back to a guessed date.
- **Multi-day festivals** (Navratri) use `dateRanges: { <year>: { start,
  end } }`, checked with the same inclusive-range logic campaigns use.
- **Maintenance**: add next year's `dates`/`dateRanges` entries to
  `js/festival-calendar.js` before the listed year runs out — the engine
  will otherwise correctly treat an unlisted year as "not a festival day"
  rather than break.

### Verified for Phase 2

- [x] All JS files pass `node --check`.
- [x] Headless simulation across 8 dates (a normal day, Independence Day,
      Diwali, Navratri start/mid/end boundaries, the day after Navratri
      ends — confirming Dussehra takes over correctly — Christmas, and New
      Year's rollover into 2027) all resolve to the correct theme, correct
      accent color, correct announcement text, and correct hero decoration
      class.
- [x] A normal day (verified against today, 2026-08-01) still resolves to
      `default` with the exact same `--brass` etc. values as Phase 1 —
      zero visual change outside festival windows.
- [x] All new CSS animations (`heroGlowPulse`, `heroParticleDrift`)
      animate only `opacity` / `background-position` — no layout-affecting
      properties — and are disabled entirely by the existing sitewide
      `prefers-reduced-motion: reduce` rule.
- [x] Announcement bar and hero decoration add zero new DOM per festival —
      one shared element/class each, text and class toggled by the engine.
- [x] No existing class, section, or file removed/renamed; only additive
      changes to `index.html`, `css/style.css`, `js/theme-config.js`,
      `js/festival-calendar.js`, `js/theme-engine.js`.

---

## Phase 3 — Smart Campaign Engine

15 campaigns now live in `js/campaign-config.js`: Admission Open, Limited
Rooms Available, Refer & Earn, Freshers Welcome, Orientation Week, Exam
Season, Placement Season, Weekend Event, Pizza Night, Movie Night, Cricket
Fever, New Facility, Anniversary, Student Festival, Offer Week.

**Every campaign ships `enabled: false`.** This is a manual campaign
engine, not an auto-marketing one — real dates, real offers, and real
urgency messaging ("limited rooms", a countdown, etc.) should only ever go
live because the PG owner turned them on, not because a placeholder date
happened to match. `js/campaign-config.js` is the one file to edit to run
a campaign: flip `enabled: true` and set real `startDate`/`endDate` (and
`startTime`/`endTime` for a same-day event like Movie Night). Nothing else
needs to change.

### What a campaign can override (all optional, all reused, no new components)

| Field | Reuses |
|---|---|
| `themeId` → accent colors, hero decoration, footer accent | Same theme + CSS mechanism as festivals (Phase 2) — `makeAccentTheme()` in `theme-config.js` is now shared by both. |
| `bannerText` / `bannerIcon` | The same `#announcementBar` from Phase 2. A campaign's banner takes priority over a festival's generic greeting if both would otherwise apply (see `theme-engine.js` `applyTheme()`). |
| `title` / `subtitle` | The existing hero `<h1 id="heroTitle">` / `<p id="heroSub">` — text is swapped in, then restored to the real default copy the moment no campaign is active. Nothing is duplicated in markup. |
| `ctaText` / `ctaLink` | The existing primary hero button (`#heroPrimaryCta`) — same button, label/href swapped. |
| `countdown` | One shared `#countdownBadge` element, updated once a minute (not per-second — kept cheap). Hidden whenever no campaign countdown is active. |

### Priority & scheduling

- **Priority**: each campaign has a `priority` (0–100). If two campaigns'
  windows ever overlap, the higher number wins — `getActiveCampaign()`
  filters to all currently-active, enabled campaigns and sorts by
  priority, so this needs no manual ordering in the array.
- **Date + time windows**: `startDate`/`endDate` behave as before
  (inclusive days). Optional `startTime`/`endTime` ("HH:MM") add a daily
  time-of-day window on top — used by Pizza Night, Movie Night, and
  Cricket Fever, all same-day evening events.
- **`autoActivate: false`** (not used by any of today's 15, reserved for
  Phase 8): campaign never auto-triggers by date — only ever goes active
  if a future Admin Panel also flips a live switch.
- **`autoExpire: false`** (also reserved): campaign ignores `endDate` and
  stays active until a human disables it — useful for an open-ended
  campaign with no fixed end.
- **Campaign always outranks festival**: unchanged from Phase 1/2 —
  `getActiveTheme()`'s priority chain is still campaign > festival >
  default.

### Verified for Phase 3

- [x] All JS files pass `node --check`.
- [x] Headless test: two overlapping campaigns (Admission Open, priority
      60, vs Limited Rooms Available, priority 70) both enabled on the
      same date — the higher-priority one (Limited Rooms) correctly wins
      on every field (accent, banner, hero copy, CTA, decoration).
- [x] Headless test: Pizza Night's `startTime`/`endTime` window (19:00–
      22:00) correctly excludes 18:00 and 23:00 on the same day, and
      includes 20:30 — confirms time-of-day gating works, not just date
      gating.
- [x] Headless test: hero title/subtitle/CTA correctly revert to the
      real default copy the instant no campaign is active — verified by
      toggling a campaign on, then off, and checking the DOM returns to
      exactly its original state (not a stale campaign string).
- [x] Countdown badge verified in isolation: a ~3h15m target renders as
      "3h 14m" (floor-rounded), hides itself once the target passes, and
      only ticks once a minute (not per-second) to stay lightweight.
- [x] Default/baseline day still resolves to `default` with unchanged
      `--brass` etc. — zero visual difference from Phase 2, since every
      campaign ships disabled.
- [x] No new CSS component system — countdown badge and campaign
      overrides reuse existing elements/typography (`--font-mono`,
      `--brass-tint`, existing button/typography classes).

---

## Phase 4 — Indian Festival & National Calendar

`js/festival-calendar.js` now covers ~40 calendar days across four
categories, each entry tagged `category` and `priority`:

- **celebration** — festivals (the 10 from Phase 2, plus 12 new: Maha
  Shivratri, Gudi Padwa, Ram Navami, Hanuman Jayanti, Buddha Purnima, Guru
  Purnima, Raksha Bandhan, Janmashtami, Karwa Chauth, Bhai Dooj, Chhath
  Puja, Tulsi Vivah, New Year's Eve).
- **national** — plain official observances (Army Day, National Youth
  Day, Maharashtra Day, National Technology Day, International Yoga Day,
  Teacher's Day, Hindi Diwas, Indian Air Force Day, National Unity Day,
  Constitution Day, Indian Navy Day) — dignified but not festive.
- **remembrance** — solemn/memorial days (26/11 Remembrance, Pulwama
  Remembrance, Bhagat Singh/Rajguru/Sukhdev Martyrdom Day, Subhas Chandra
  Bose Jayanti, Ambedkar Jayanti, Lal Bahadur Shastri Jayanti) **plus**
  some officially-"National Day" entries that are inherently solemn
  (Martyrs' Day, Gandhi Jayanti, Kargil Vijay Diwas, Police Commemoration
  Day, Armed Forces Flag Day) — retagged to this category on purpose so
  they never get festive treatment. See the TONE NOTE in
  `festival-calendar.js`.
- **seasonal** — Spring, Summer, Monsoon, Winter. **Off by default** (see
  below).

### Category priority (resolves same-day collisions)

```
remembrance > national > celebration > seasonal
```

This matches the engine-wide chain: campaign > remembrance > national >
festivals > seasonal > default (campaigns are still resolved one level up
in `theme-engine.js` and always outrank everything here).

**Known 2026 collisions (exact-day basis), and how they resolved at the time:**

> **Superseded by Phase 8** — these entries now have multi-day active
> windows (see Phase 8 below), so this table only reflects exact-day
> collisions as they stood when Phase 4 shipped. It's kept for history;
> the full current picture is much bigger. Don't use this table to
> reason about current behavior — see Phase 8.

| Date | Entries | Winner | Why |
|---|---|---|---|
| May 1 | Buddha Purnima (celebration) vs Maharashtra Day (national) | Maharashtra Day | `national` outranks `celebration`. *(Found by the Phase 6 Priority Manager's collision detector — missed in this table when Phase 4 shipped; corrected here.)* |
| Sep 14 | Ganesh Chaturthi (celebration) vs Hindi Diwas (national) | Hindi Diwas | `national` outranks `celebration` in the stated priority chain. If this isn't the desired behavior for your calendar, `festival-calendar.js` is the only file to adjust — see the comment above `CATEGORY_ORDER`. |
| Oct 2 | Gandhi Jayanti vs Lal Bahadur Shastri Jayanti (both remembrance) | Gandhi Jayanti | Tie-broken by `priority` (90 vs 80) — both are in the same category. |
| Nov 26 | Constitution Day (national) vs 26/11 Remembrance (remembrance) | 26/11 Remembrance | `remembrance` outranks `national` regardless of priority numbers. |

Full, current list for any year is always available via
`window.PGTheme.admin.PriorityManager.listFestivalCollisions(year)` (Phase 6) —
that's now the source of truth for this table, not manual inspection.


### Shared themes (DRY, not 40 near-duplicate theme objects)

Rather than a unique theme per national/remembrance day, two shared
themes in `theme-config.js` cover ALL of them:

- `festival-national-generic` — one dignified saffron tone, subtle glow.
- `festival-remembrance-generic` — one muted grey-blue tone, **no hero
  decoration at all** — this is deliberate and load-bearing for the "no
  festive animations on remembrance days" requirement.

Each calendar entry still supplies its own `bannerText`/`bannerIcon`, so
the greeting is specific to the day even though the color/decoration is
shared. `theme-engine.js`'s announcement logic was generalized (was
campaign-only, now works for any entry) to support this — see the
"NOTE ON OVERRIDES" comment at the top of that file.

### Seasonal themes — shipped OFF by default

Spring/Summer/Monsoon/Winter cover the entire calendar year with no gaps.
Turning them on by default would mean the site is *always* in some
seasonal theme — too large a behavior change to ship silently, even
though each one is a very subtle, near-invisible accent shift with no
announcement and no decoration. Flip `window.PGTheme.seasonalThemesEnabled
= true` to turn them on; default is `false`, matching today's behavior
exactly (no festival/national/remembrance match → plain `default` theme).

### Verified for Phase 4

- [x] All JS files pass `node --check`.
- [x] Headless simulation confirms all three known 2026 collisions
      resolve exactly as documented above.
- [x] Remembrance-tagged days (tested: Martyrs' Day, Gandhi Jayanti,
      26/11 Remembrance) all show `heroDecoration: null` — zero animation,
      as required.
- [x] Existing Phase 2 festivals (tested: Republic Day, Diwali) still
      resolve correctly — no regression from the rewritten lookup logic.
- [x] Quiet/devotional festivals (Guru Purnima) correctly show no hero
      decoration despite being in the `celebration` category, per their
      individual theme's `heroDecoration: null`.
- [x] Seasonal themes confirmed OFF by default (a monsoon-season date
      resolves to plain `default`), and correctly activate only when
      `seasonalThemesEnabled` is explicitly set to `true`.
- [x] No existing file removed; `festival-calendar.js` and
      `theme-config.js` grew, `theme-engine.js`'s override logic was
      generalized (not duplicated) to serve both campaigns and festivals.

---

## Phase 5 — Premium Campaign Designs

Refined the visual treatment of 11 campaigns without touching layout,
components, or accent-color logic: Admission Open, Limited Rooms
Available, Freshers Welcome, Refer & Earn, Cricket Fever, Cinema Week
(renamed from Movie Night — same slot, `campaign-config.js` id changed
from `movie-night` to `cinema-week`), Pizza Night, Weekend Event,
Anniversary, Offer Week, New Facility Launch (renamed from New Facility,
same id).

### 4 new hero decoration types (on top of Phase 2's glow/particles)

All follow the exact same rule as the originals — one shared
`.hero__decoration` element, one toggled class, `opacity`/`transform`/
`background-position` only, disabled entirely under
`prefers-reduced-motion`:

| Type | Feel | Used by |
|---|---|---|
| `beacon` | a single soft pulsing highlight — tasteful urgency, not alarm | Limited Rooms Available, Offer Week |
| `sparkle` | small twinkling highlights (two offset layers, opposite phase) | Refer & Earn, Anniversary |
| `spotlight` | a soft cinematic vignette in one corner | Cinema Week, New Facility Launch |
| `stadium` | gentle horizontal floodlight bands, slow drift | Cricket Fever |

`theme-engine.js`'s `applyHeroDecoration()` was simplified at the same
time: instead of an if-chain per known type, it now maps any
`heroDecoration` string generically to a `hero--deco-<value>` class —
adding a 5th type in the future needs a CSS block and a config value,
zero engine changes.

### CTA shimmer (reused, not per-campaign)

A brief, infrequent sheen sweeps across the primary hero button (`.btn--
brass`) whenever ANY campaign is active — one CSS rule scoped to
`body[data-theme^="campaign-"]`, using only `transform` (fully
GPU-composited). It plays once every 5 seconds for about 0.75s and stays
off-screen the rest of the time, so it reads as a subtle premium touch
rather than a constant distraction. This is intentionally universal
across all campaigns (including the 4 not in this phase's list) rather
than duplicated per campaign — there was no reason to special-case it.

### What was deliberately NOT done

- No new decorative badges/ribbons pinned to the hero — the site's hero
  has no card element to anchor one to, and the announcement bar already
  serves that "here's what's happening" role. Adding one would have meant
  a new component, which the brief asked to avoid.
- No footer animation — the existing static gradient line (Phase 2)
  already satisfies "footer accent"; a constant sweeping animation in a
  rarely-scrolled-to section would cost more (a permanently running
  animation) than it visually earns, so it stays static.
- No accent-color changes to the 11 campaigns' existing palettes — they
  were already muted/premium from Phase 3; this phase only added
  decoration variety and the CTA shimmer.

### Verified for Phase 5

- [x] All JS files pass `node --check`.
- [x] Headless test: all 11 campaigns (including the 3 with
      `startTime`/`endTime` windows — Cricket Fever, Cinema Week, Pizza
      Night, tested at their actual active hour) resolve to the correct
      theme, correct decoration class, and correct banner text.
- [x] CTA shimmer CSS confirmed scoped to `data-theme^="campaign-"` only —
      baseline (`data-theme="default"`) does not match the selector.
- [x] Baseline still resolves to `default` with unchanged `--brass` — no
      regression from the decoration-class refactor or the renames.
- [x] No layout, section, or existing component was changed — only
      `heroDecoration` values, two campaign renames, 4 new CSS decoration
      blocks, one CSS shimmer rule, and the `applyHeroDecoration`
      generalization.

---

## Phase 6 — Future Admin Architecture (architecture only)

`js/admin-api.js` is a new, purely additive file — **zero changes** to
`theme-engine.js`, `theme-config.js`, `campaign-config.js`, or
`festival-calendar.js`. It defines the contract a future Admin Panel
would build against, today, so that contract doesn't have to be
invented later under time pressure — but it ships with **no UI, no
backend, and no persistence**, per this phase's brief.

Load order: after `theme-engine.js`, before `js/script.js` (it reads
`window.PGTheme`, which the engine populates).

### The 8 modules, under `window.PGTheme.admin`

| Module | What it does today | What it can't do yet (needs a backend) |
|---|---|---|
| `ThemeManager` | List/read every registered theme; read what's active | Create/edit a theme definition permanently |
| `CampaignManager` | List/read/validate campaigns; enable/disable/patch **in-memory** | Save that change so it survives a page reload |
| `EventCalendarManager` | List/read/patch/add festival-calendar entries **in-memory** | Same — no persistence |
| `Scheduler` | `getActiveNow()`, `getUpcoming(days)` — read-only facade over the engine | — (this one's fully functional as-is; it's a read-only facade, not a mutation) |
| `ThemePreview` | Temporarily apply any theme/campaign/festival's look, then revert via `exitPreview()` | — (fully functional; explicitly doesn't touch schedule data, just the live CSS vars) |
| `PriorityManager` | List campaign priorities; **detect same-day festival collisions for any year**; set a campaign's priority in-memory | Persisting a priority change |
| `Analytics` | `formatEvent()` — defines the exact payload shape a real analytics call should send | `trackEvent()` is an intentional no-op — there's no analytics endpoint to call yet |
| `History` | A real, working in-memory log of every theme change this session (listens to the engine's existing `pgtheme:applied` event — no engine change needed) | Surviving a page reload (would need a backend) |

### Why "in-memory only" is the right scope here

Every write method (`updateCampaign`, `updateEvent`, `setCampaignPriority`,
etc.) mutates the arrays already sitting in the page's memory for this
session — the same `window.PGTheme.campaigns` / `.festivals` the engine
itself reads. That means:

- A future Admin Panel UI can be built and wired up against these exact
  functions with **no engine changes**, and see its edits reflected live
  (call `window.PGTheme.init()` after any change to re-resolve).
- Making an edit *survive a reload* is a separate, later concern — it
  needs either a build step that writes back into `campaign-config.js`/
  `festival-calendar.js`, or moving this data into a real
  database/API. Pretending to solve that now (e.g., faking
  localStorage persistence) would be misleading busywork — "architecture
  only" means deciding the shape of the write, not building fake storage.

### `PriorityManager.listFestivalCollisions()` already found a real bug

Building this tool immediately paid for itself: it surfaced a same-day
collision (May 1 — Buddha Purnima vs Maharashtra Day) that Phase 4's
manual review had missed. The Phase 4 collision table above has been
corrected. This is now the authoritative way to check for collisions —
call `admin.PriorityManager.listFestivalCollisions(year)` for any year
instead of eyeballing the calendar.

### Verified for Phase 6

- [x] `admin-api.js` passes `node --check`.
- [x] Confirmed zero changes needed to `theme-engine.js`,
      `theme-config.js`, `campaign-config.js`, or `festival-calendar.js`
      — `admin-api.js` only reads/wraps them.
- [x] Headless test: `ThemeManager.listThemes()` returns all 45
      registered themes; `getActiveThemeInfo()` matches the engine's own
      resolution.
- [x] Headless test: `CampaignManager.validateCampaign()` correctly
      rejects an invalid date (`2026-13-40`) and an out-of-range priority
      (`200`), and correctly accepts enabling/disabling a real campaign
      in-memory.
- [x] Headless test: `ThemePreview.previewCampaign('pizza-night')`
      changes the live `--brass` value; `exitPreview()` correctly
      restores the actual scheduled theme (`default`, in the test).
- [x] Headless test: `PriorityManager.listFestivalCollisions(2026)`
      correctly respects `seasonalThemesEnabled` — returns 4 collisions
      with it off (matching real current behavior) and 5 with it on
      (adding the Jan 1 New Year/Winter overlap) — same gating rule the
      engine itself uses, not a second copy of the logic.
- [x] Headless test: `History` correctly logs a real theme-change event
      via the existing `pgtheme:applied` event, with no changes to
      `theme-engine.js` to make that work.
- [x] No UI, no backend call, no database, no routing was added anywhere
      in this phase.

---

## Phase 7 — Performance & QA

Full-project audit. Two real issues were found and fixed; everything else
was verified already correct.

### Fixed

1. **Accessibility — announcement bar text contrast.** The announcement
   bar used `color: var(--brass-deep)` on `background: var(--brass-tint)`.
   Checked programmatically across all 46 registered themes: **20 of them
   failed WCAG AA's 4.5:1 ratio for normal-size text** (as low as 2.91:1
   for New Year/New Year's Eve). Root cause: `brass`/`brass-deep`/
   `brass-tint` are the one trio that legitimately varies per theme, so a
   text color built from that trio inherits whatever contrast that
   theme's designer happened to get right — not reliable across 46
   themes. **Fix**: announcement text now uses `var(--ink)`, which never
   changes between themes and is always very dark against every theme's
   (always very light, by design) `brass-tint`. Verified programmatically:
   worst case across all 46 themes is 11.37:1 — comfortably over AA (4.5)
   and even AAA (7) for normal text. The countdown badge already used
   `--ink` correctly (Phase 3) and needed no change; the amenities-icon
   circles use `--brass-deep` on `--brass-tint` too, but for a decorative
   SVG icon (not text) — WCAG's non-text contrast minimum is 3:1, and this
   pairing is always well above that, so it was left as-is.
2. **Performance — hero image was the wrong photo for full-bleed use.**
   The hero background used `double-sharing.jpg`, a portrait-orientation
   photo (765×1020 native). Stretched across a wide desktop viewport via
   `object-fit: cover`, a photo that narrow would be upscaled 2.5×+,
   visibly softening the largest, most prominent image on the page.
   Swapped to `triple-sharing.jpg` (902×692, landscape) — still not
   large by modern standards (none of the 7 uploaded photos are), but the
   least-upscaled option available and correctly oriented for a wide
   hero. **Recommendation for the owner**: a ~1920px-wide landscape photo
   of the property, if one becomes available, would remove this
   trade-off entirely — noted in `README.md`.

### Verified, no change needed

- **GPU-friendly animations**: re-checked programmatically — all 7
  `@keyframes` blocks (`heroGlowPulse`, `heroParticleDrift`,
  `heroBeaconPulse`, `heroSparkleTwinkle`, `heroSpotlightPulse`,
  `heroStadiumSweep`, `ctaShimmer`) animate only `opacity`, `transform`,
  or `background-position` — never a layout-triggering property
  (`top`/`left`/`width`/`height`/`margin`/`padding`). All are already
  covered by the sitewide `prefers-reduced-motion: reduce` override from
  Phase 1.
- **Lazy loading**: the hero image (the page's LCP element) now has
  `loading="eager" fetchpriority="high"` — it should never be lazy. Every
  other image (both room cards, all 7 gallery photos) now explicitly has
  `loading="lazy"` — 2 room-card images were missing it and have been
  added.
- **Zero layout shift**: every image container that isn't the hero has
  a fixed `aspect-ratio` (room cards 4/3, gallery items 4/3 with tall/
  wide variants) or a fixed `min-height` (hero, 88vh) — none depend on
  the image finishing loading to know their size.
- **CSS cleanliness**: cross-referenced every class selector in
  `style.css` against actual usage in `index.html` and dynamic
  `classList` calls in the JS files — zero dead/unused CSS found. The
  4 classes that initially looked unused (`is-open`, `is-visible`,
  `reveal`, and a false-positive match on the literal text ".js") are
  all legitimately added via `classList.add()`/`.toggle()` in
  `script.js`.
- **Accessibility spot-check**: added `aria-hidden="true"` to the
  decorative `.grain` overlay div (previously missing — a screen reader
  would have skipped its empty content anyway, but this makes the intent
  explicit). All images already had meaningful `alt` text (or `alt=""`
  for the purely decorative hero background). `focus-visible` outlines
  and the map iframe's `title` were already present from earlier phases.
- **Responsiveness**: all 8 existing media query breakpoints intact,
  unchanged.
- **Font loading**: Google Fonts link already used `display=swap` — no
  invisible-text-on-load risk.

### Verified for Phase 7

- [x] All JS files pass `node --check`.
- [x] Programmatic contrast audit of all 46 themes' announcement-bar
      text: 100% now pass AA (4.5:1) — worst case 11.37:1.
- [x] Programmatic animation-property audit: 100% of keyframe rules use
      only GPU-cheap properties.
- [x] Programmatic dead-CSS audit: zero unused class selectors found.
- [x] Full regression test (Diwali festival + the entire admin API)
      re-run after the CSS/HTML changes — everything still resolves
      correctly, nothing broken.
- [x] Image ↔ reference audit: every `images/*.jpg` file is referenced
      by `index.html`, and every reference resolves to a real file.

---

## Phase 8 — Configurable Active Windows (not just the exact day)

Every calendar entry now activates for a **window** around its date, not
just the single exact day, per this brief:

| Category | Default window |
|---|---|
| Festivals (`celebration`) | 5 days before → festival day → 5 days after |
| National Days (`national`) | 3 days before → event day → 3 days after |
| Remembrance Days (`remembrance`) | 1 day before → event day → 1 day after |
| Seasonal (`seasonal`) | No expansion (0/0) — already wide date ranges by design |

### Configuration-driven, not hardcoded

- Defaults live in `festival-calendar.js`'s `CATEGORY_DEFAULT_WINDOW`
  object — **not** in `theme-engine.js`, which never changed and never
  reads a hardcoded window value.
- Any entry can override its own window by adding `preDays`/`postDays` —
  e.g. `{ id: "diwali", ..., preDays: 3, postDays: 7 }` would give Diwali
  its own 3-before/7-after window regardless of the celebration default.
  No engine change is ever needed for this — it's a config-object edit.
- Multi-day entries (`dateRanges`, e.g. Navratri) get the window applied
  to their whole range: `preDays` before the range's `start`, `postDays`
  after its `end`.

### Year-boundary handling

A window can cross into the previous or next year (e.g. New Year's
5-day pre-window starts in late December of the *previous* year). The
matching logic checks each entry's core date/range for `date`'s year AND
the two adjacent years, so this is handled automatically via real `Date`
arithmetic — verified for both directions (New Year's pre-window
starting Dec 27 of the prior year; New Year's Eve's post-window
continuing into January of the next year).

### `getMatchingFestivals()` — new, and now the shared source of truth

`festival-calendar.js` now exports `getMatchingFestivals(date)`,
returning every entry whose window covers `date`, before category/
priority resolution. `getActiveFestival(date)` is now just this plus the
existing category/priority resolution — and the Phase 6 admin API's
collision detector calls the same `getMatchingFestivals()` rather than
re-implementing date matching, so the two can never disagree about what
"overlaps."

### A real, important consequence: **wide windows mean MANY more overlaps**

With ±5-day festival windows especially, the 2026 calendar has **34
distinct overlapping date ranges** across the year (up from 4 known
exact-day collisions before this phase) — verified via
`admin.PriorityManager.listFestivalCollisions(2026)`, which now scans
day-by-day and groups consecutive days with the same overlap into
ranges, rather than checking only exact dates.

More importantly, a new diagnostic — `admin.PriorityManager
.listSilencedEntries(year)` — found that **two named festivals never
win a single day of 2026 at all**: `dussehra` and `new-years-eve`. Their
entire windows are always overlapped by a same-category neighbor with
earlier array position (Navratri; New Year) or a higher-ranked category
(Police Commemoration Day, Oct 20–22, sitting right on top of Dussehra's
own exact day). This isn't a bug — the resolution rule did exactly what
it's specified to do — but it's very likely not the intended outcome for
two festivals that were explicitly configured. **This was deliberately
left as a flagged finding, not silently fixed** — an earlier draft of
this phase bumped Dussehra's `priority` to "solve" it, which was reverted
because retuning priorities wasn't asked for and is a real editorial
decision (which festival should visually "win" a shared week) that
belongs to you, not to an unrequested code change. Fixes are a data-only
edit in `festival-calendar.js` — raise `priority`, shrink `preDays`/
`postDays`, or reorder the array — verify with
`listSilencedEntries()` afterward.

(The other 3 entries in that same silenced list —
`lal-bahadur-shastri-jayanti` and all 4 `season-*` entries — aren't new
findings: Lal Bahadur Shastri Jayanti losing to Gandhi Jayanti was
already documented in Phase 4, and the seasonal entries are *expected*
to never win while `seasonalThemesEnabled` is `false`.)

### Verified for Phase 8

- [x] All JS files pass `node --check`.
- [x] Window boundaries verified precisely: a festival's exact 5th day
      before/after is included, the 6th day before/after is not (tested
      on Diwali); same pattern verified for national's ±3 (Hindi Diwas)
      and remembrance's ±1 (Martyrs' Day).
- [x] Year-boundary crossing verified both directions: New Year's
      pre-window correctly starts Dec 27 of the *previous* year; New
      Year's Eve's post-window correctly continues into January of the
      *next* year, and correctly stops on day 6.
- [x] Priority/category resolution reconfirmed unchanged and correct
      under the new windowed matches (remembrance still always outranks
      national/celebration; national still outranks celebration; same-
      category ties still broken by `priority` then array order).
- [x] Full regression: a quiet day with no nearby entries still resolves
      to `default` (unchanged); an active campaign still outranks every
      festival/national/remembrance window (unchanged); all 8 Phase 6
      admin modules still load and function correctly against the new
      matching logic.
- [x] No hardcoded window values in `theme-engine.js` — confirmed by
      inspection; it was not modified at all in this phase.
- [x] `dussehra`/`new-years-eve` silencing found, verified, and
      documented rather than silently patched.

---

## Premium UI/UX Polish — Phase 1: Design Foundation

First phase of a separate, larger visual-polish initiative (not a
content/branding redesign — see CHANGELOG for the full brief). This
phase only adds design *tokens* and applies them to existing components;
no new sections, no copy changes, no engine changes.

### New tokens (`css/style.css` `:root`)

- `--shadow-sm/md/lg/glow` — layered, soft shadows (multiple stops) for
  a more premium sense of depth than the old single flat shadow.
- `--glass-bg`/`--glass-border`/`--glass-blur` and `.glass`/`.glass-dark`
  utility classes — `backdrop-filter` blur, with a `@supports` fallback
  for browsers without it. Applied so far only to the nav (already had
  ad-hoc blur; now uses the same tokens as everything else).
- `--ease-premium` — a `cubic-bezier(0.16, 1, 0.3, 1)` "soft deceleration"
  curve (the same family Apple/Linear-style sites use) for hovers and
  reveals, replacing plain `ease`.
- `--space-xs/sm/md/lg/xl` — a spacing scale; section padding now uses
  `--space-xl` (7rem, up from a flat 6rem) for more breathing room.

### Applied so far

- Section heading scale bumped (`clamp(2rem, 3.8vw, 3rem)`, was
  `clamp(1.9rem, 3.4vw, 2.6rem)`) and hero title scale bumped
  (`clamp(2.6rem, 7vw, 4.6rem)`, was `clamp(2.4rem, 6.2vw, 4rem)`) for
  more presence — same fonts, same copy, just larger/more confident.
- Buttons, room cards, gallery items, amenity cards, and contact cards
  all now use `--shadow-md`/`--shadow-lg` on hover (was a single flat
  `rgba` shadow per component, inconsistent between them) and
  `var(--ease-premium)` for the hover transition — one consistent depth
  + motion language sitewide instead of several slightly different ones.
- Scroll-reveal (`.reveal` in `css/style.css`, driven by `script.js`)
  now travels further (28px, was 18px) with a subtle scale-in
  (0.985→1) and the premium ease curve, and cascades with staggered
  `transition-delay` within grids (amenities, room cards, gallery) —
  still pure `opacity`/`transform`, still the same `IntersectionObserver`
  in `script.js`, just tuned. Room cards and the rate-card were added to
  the reveal target list (previously the whole Rooms section faded in
  as one block; now each card cascades in individually).

### Verified

- [x] All JS files pass `node --check`; CSS brace-balanced.
- [x] Theme engine regression check: a quiet day still resolves to
      `default`; all 8 admin API modules still load — this phase touched
      no `.js` theme/campaign/festival logic at all, only `style.css`
      and the `script.js` reveal-target selector list.
- [x] All new animations (`.reveal`, card hovers, button hovers) confirmed
      to animate only `opacity`/`transform`/`box-shadow` — `box-shadow`
      isn't compositor-accelerated like `transform`/`opacity`, so hover-
      triggered shadow transitions are scoped to individual small
      cards/buttons (never the whole page) to keep repaint cost low.
- [x] `prefers-reduced-motion` override (Phase 1 of the theme engine,
      untouched) still catches all of the above automatically.

---

## Premium UI/UX Polish — Phases 2-8 (Hero, Rooms, Amenities, Reviews-skipped, Gallery, Pricing, Contact)

Summary (full detail in CHANGELOG.md per phase):

- **Hero**: full-bleed photo, floating availability badge (honest copy —
  room types, not a fabricated live-vacancy claim), scroll indicator
  linking to Rooms, ambient radial light blended into the scrim, one-time
  cinematic entrance animation, frosted-glass secondary CTA.
- **Rooms**: larger photo-first cards, floating "Available" badge + price
  tag on the photo, occupancy/bed-count meta (no fabricated square
  footage — flagged in README for the owner to supply if wanted), feature
  chips, a "Most booked" recommended ribbon on Triple sharing.
- **Amenities**: converted to glass cards over a subtle ambient section
  backdrop.
- **Student Reviews**: skipped at the owner's explicit request rather
  than filled with fabricated testimonials.
- **Gallery**: photos are now real `<button>`s wired to a full lightbox
  (prev/next, Escape/arrows, click-outside, focus return).
- **Pricing**: no duplicate section — reused the Rooms cards instead.
- **Contact/Map**: map gets a premium frame + hover-reveals-color filter;
  WhatsApp (the real enquiry channel) now visually leads as the primary
  CTA.

All of the above are additive to `index.html`/`css/style.css`/
`js/script.js` only — no theme/campaign/festival engine file was touched
until the Monthly Themes work below.

---

## Monthly Premium Themes

New automatic fallback tier, sitting between Festival and Season:

```
campaign > remembrance > national > festival > MONTHLY > season > default
```

### New file: `js/monthly-themes.js`

Same shape as the other data files — one array (`window.PGTheme
.monthlyThemes`, 12 entries, one per month) plus a lookup function
(`getActiveMonthlyTheme(date)`). 12 matching theme entries live in
`theme-config.js` (`monthly-january` … `monthly-december`), using the
same accent-only-override factory as everything else — muted, tonal
palettes, deliberately never bright ("Do NOT make the website colorful"
from the brief). Every monthly theme has `heroDecoration: null` on
purpose — see the design note at the top of `monthly-themes.js`: this
tier is live most days of the year, so a permanent animation running
365 days would fight the "never flashy" goal for no real benefit.

### On by default — the one tier that is

Campaigns and seasonal themes both default to `false` (opt-in). Monthly
Themes default to `true` (`window.PGTheme.monthlyThemesEnabled`) because
the brief explicitly asks for automatic behavior: *"If a month has no
active campaign, remembrance day, national day or festival theme,
automatically apply a premium monthly seasonal theme."* Set the flag to
`false` to turn it off.

### Engine change: `festival-calendar.js` split in two

To let Monthly Themes sit between "festival" and "season" without
theme-engine.js hardcoding any date logic, `festival-calendar.js`'s
single `getActiveFestival()` was split:

- `getActiveFestival(date)` — now only resolves remembrance/national/
  celebration (seasonal explicitly excluded).
- `getActiveSeason(date)` — new, resolves only seasonal entries (still
  gated by `seasonalThemesEnabled`), reusing the exact same
  `getMatchingFestivals()` data — no re-implemented date matching.

`theme-engine.js`'s `getActiveTheme()` now calls, in order: campaign →
`getActiveFestival()` → `getActiveMonthlyTheme()` → `getActiveSeason()`
→ default.

### Important, documented consequence: Season is now unreachable by default

Because Monthly Themes match unconditionally on every single day
(whenever nothing higher-priority is active) and rank ABOVE Season,
**enabling `seasonalThemesEnabled` now has no visible effect** as long as
`monthlyThemesEnabled` stays at its default (`true`) — Monthly always
wins that tier first. This is the direct, unavoidable result of the
exact priority order specified, not a bug. Verified programmatically: a
monsoon-season date with `seasonalThemesEnabled = true` shows
`monthly-july`; only after also setting `monthlyThemesEnabled = false`
does it show `festival-season-monsoon`.

### Verified

- [x] All JS files pass `node --check` (including the two restructured
      functions in `festival-calendar.js`).
- [x] Quiet days with no campaign/festival correctly resolve to the
      current month's theme (tested June, and confirmed January/November
      "quiet" dates actually still show a festival, because those
      festivals' wide windows are still active — correct per the
      existing priority, not a monthly-theme bug).
- [x] Festivals/national days/remembrance days confirmed to still
      outrank monthly on their actual active days (Diwali, Republic Day,
      Martyrs' Day all still resolve to their own theme, not that
      month's).
- [x] Campaign confirmed to still outrank monthly.
- [x] Season's new unreachable-by-default status verified both ways:
      visible only when `monthlyThemesEnabled` is explicitly set `false`.
- [x] Disabling monthly (with season also off) correctly falls through
      to `default`.
- [x] Total registered themes: 57 (up from 45) — 12 new monthly themes
      added, zero existing themes removed or renamed.
- [x] All 8 Phase 6 admin API modules still load and function against
      the restructured festival-calendar.js.
