/**
 * theme-config.js
 * ---------------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH for every theme the site can render.
 *
 * A "theme" is a plain object with a flat `vars` map. Each key in `vars`
 * is applied as a CSS custom property of the same name on <html>, e.g.
 * `vars.ink` becomes `--ink`. theme-engine.js is the only file that reads
 * this object and turns it into CSS — nothing else should touch `:root`
 * styles at runtime.
 *
 * `window.PGTheme.config.default` below intentionally mirrors the values
 * already hardcoded in css/style.css `:root`. That's on purpose: applying
 * it changes nothing visually today. From now on, this file — not the
 * CSS — is the place to change a color, font, radius, etc.
 *
 * Phase 2 will add more entries here (one per festival theme).
 * Phase 3 will add more entries here (one per campaign theme).
 * Phase 5 documents how an Admin Panel would read/write this same shape.
 *
 * Nothing in this file executes anything — it only registers data on
 * `window.PGTheme.config`. See theme-engine.js for the logic that picks
 * and applies a theme.
 */
(function () {
  window.PGTheme = window.PGTheme || {};

  window.PGTheme.config = window.PGTheme.config || {};

  /**
   * The default theme — "Chhatrapati PG Premium".
   * Values copied 1:1 from the current css/style.css :root block, so
   * enabling the theme engine is a no-op for how the site looks today.
   */
  window.PGTheme.config.default = {
    id: "default",
    name: "Chhatrapati PG — Premium",

    // Flat CSS-custom-property map. Key "brass-deep" -> --brass-deep.
    vars: {
      ink: "#16261F",
      brass: "#B8935A",
      "brass-deep": "#96723E",
      "brass-tint": "#F1E6D3",
      ivory: "#F7F3EA",
      charcoal: "#2A2620",
      line: "#E3DCC9",
      card: "#FFFFFF",
      muted: "#75705F",

      "font-display": "'Fraunces', serif",
      "font-body": "'Manrope', sans-serif",
      "font-mono": "'IBM Plex Mono', monospace",

      radius: "16px",
      container: "1140px",
    },

    // Optional extras a theme MAY define. All null/off by default so the
    // engine and markup can safely check `theme.announcement` etc. without
    // extra guards. Festival/campaign themes (Phase 2+) fill these in.
    announcement: null, // { text, icon }
    heroDecoration: null, // e.g. "particles" | "glow" | "confetti"
    ctaVariant: "brass", // maps to the existing .btn--brass CSS, no new CSS needed
  };

  /**
   * ---------------------------------------------------------------------
   * Shared factory — used by BOTH festival themes (Phase 2) and campaign
   * themes (Phase 3), so the accent-only-override pattern is written once.
   * ---------------------------------------------------------------------
   * Every festival/campaign theme is an ACCENT-ONLY override on top of the
   * default theme: it only changes `brass` / `brass-deep` / `brass-tint`
   * (the three variables every existing button, price tag, icon circle,
   * and hover state already reads from). Branding colors (`ink`, `ivory`,
   * `charcoal`, fonts, radius) are never touched, so:
   *
   *   1. The Chhatrapati PG identity always stays recognizable.
   *   2. No new CSS classes are needed — every existing component just
   *      re-colors itself via the CSS variables it already references
   *      (see theme-engine.js `applyTheme`).
   *
   * `makeAccentTheme` exists purely to avoid repeating the same handful of
   * keys (id/name/vars/announcement/heroDecoration/ctaVariant) once per
   * festival and once per campaign.
   */
  function makeAccentTheme(opts) {
    return {
      id: opts.id,
      name: opts.name,
      vars: {
        brass: opts.brass,
        "brass-deep": opts.brassDeep,
        "brass-tint": opts.brassTint,
      },
      announcement: opts.announcement || null, // { icon, text }
      heroDecoration: opts.heroDecoration || null, // "glow" | "particles"
      ctaVariant: "brass",
    };
  }

  /**
   * ---------------------------------------------------------------------
   * PHASE 2 — Festival themes
   * ---------------------------------------------------------------------
   */
  var festivalThemes = [
    {
      id: "festival-new-year",
      name: "New Year",
      brass: "#D4AF37",
      brassDeep: "#A6841F",
      brassTint: "#F3E9C7",
      heroDecoration: "particles",
      announcement: { icon: "✨", text: "Happy New Year from Chhatrapati PG — here's to a great year ahead!" },
    },
    {
      id: "festival-makar-sankranti",
      name: "Makar Sankranti",
      brass: "#D98E3D",
      brassDeep: "#B36A24",
      brassTint: "#F5DCC0",
      heroDecoration: "particles",
      announcement: { icon: "🪁", text: "Happy Makar Sankranti! Wishing you a joyful harvest season." },
    },
    {
      id: "festival-republic-day",
      name: "Republic Day",
      brass: "#E08D3C",
      brassDeep: "#B66A25",
      brassTint: "#F6DDBF",
      heroDecoration: "glow",
      announcement: { icon: "🇮🇳", text: "Happy Republic Day! Jai Hind." },
    },
    {
      id: "festival-holi",
      name: "Holi",
      brass: "#C2578B",
      brassDeep: "#9B3F6C",
      brassTint: "#F3D9E6",
      heroDecoration: "particles",
      announcement: { icon: "🎨", text: "Happy Holi! Wishing you a colorful, joyful festival." },
    },
    {
      id: "festival-independence-day",
      name: "Independence Day",
      brass: "#DE8A33",
      brassDeep: "#B36A21",
      brassTint: "#F6DFC2",
      heroDecoration: "glow",
      announcement: { icon: "🇮🇳", text: "Happy Independence Day! Jai Hind." },
    },
    {
      id: "festival-ganesh-chaturthi",
      name: "Ganesh Chaturthi",
      brass: "#C1552C",
      brassDeep: "#96401F",
      brassTint: "#F1D9C7",
      heroDecoration: "glow",
      announcement: { icon: "🙏", text: "Ganpati Bappa Morya! Happy Ganesh Chaturthi." },
    },
    {
      id: "festival-navratri",
      name: "Navratri",
      brass: "#8B5A8C",
      brassDeep: "#6B4270",
      brassTint: "#E9DCEA",
      heroDecoration: "glow",
      announcement: { icon: "🪔", text: "Happy Navratri! Wishing you nine nights of joy and devotion." },
    },
    {
      id: "festival-dussehra",
      name: "Dussehra",
      brass: "#A6412E",
      brassDeep: "#7E2F20",
      brassTint: "#EDD6D0",
      heroDecoration: "glow",
      announcement: { icon: "🏹", text: "Happy Dussehra! Wishing you victory over every challenge." },
    },
    {
      id: "festival-diwali",
      name: "Diwali",
      brass: "#D89A3D",
      brassDeep: "#AD7522",
      brassTint: "#F6E4C4",
      heroDecoration: "particles",
      announcement: { icon: "🪔", text: "Happy Diwali from Chhatrapati PG — wishing you light and prosperity!" },
    },
    {
      id: "festival-christmas",
      name: "Christmas",
      brass: "#2F6F4E",
      brassDeep: "#245638",
      brassTint: "#D8ECE1",
      heroDecoration: "particles",
      announcement: { icon: "🎄", text: "Merry Christmas! Wishing you a warm and joyful season." },
    },
  ];

  festivalThemes.forEach(function (opts) {
    window.PGTheme.config[opts.id] = makeAccentTheme(opts);
  });

  /**
   * ---------------------------------------------------------------------
   * PHASE 3 — Campaign themes
   * ---------------------------------------------------------------------
   * One theme entry per campaign in js/campaign-config.js (matched by
   * `themeId`). Same accent-only-override pattern as festivals — see
   * `makeAccentTheme` above. Campaign scheduling (dates, priority, CTA
   * text/link, countdown) lives in campaign-config.js, NOT here; this file
   * only owns what a theme looks like.
   */
  var campaignThemes = [
    {
      id: "campaign-admission-open",
      name: "Admission Open",
      brass: "#3E7A5C",
      brassDeep: "#2E5E45",
      brassTint: "#DCEBE2",
      heroDecoration: "glow", // calm, reassuring — a steady welcome, not an alarm
    },
    {
      id: "campaign-limited-rooms",
      name: "Limited Rooms Available",
      brass: "#B8483F",
      brassDeep: "#8F372F",
      brassTint: "#EFD6D3",
      heroDecoration: "beacon", // a single, tasteful pulsing highlight — urgency without alarm
    },
    {
      id: "campaign-refer-earn",
      name: "Refer & Earn",
      brass: "#4E7FB0",
      brassDeep: "#3B6289",
      brassTint: "#DCE7F0",
      heroDecoration: "sparkle", // light, rewarding feel
    },
    {
      id: "campaign-freshers-welcome",
      name: "Freshers Welcome",
      brass: "#C97A3D",
      brassDeep: "#A05F2E",
      brassTint: "#F3E1CC",
      heroDecoration: "particles",
    },
    {
      id: "campaign-orientation-week",
      name: "Orientation Week",
      brass: "#5C7AA6",
      brassDeep: "#465F81",
      brassTint: "#DEE5EF",
      heroDecoration: "glow",
    },
    {
      id: "campaign-exam-season",
      name: "Exam Season",
      brass: "#6B6F8A",
      brassDeep: "#52556B",
      brassTint: "#E3E4EC",
      heroDecoration: null, // deliberately calm — no floating decoration during exams
    },
    {
      id: "campaign-placement-season",
      name: "Placement Season",
      brass: "#3C6E5A",
      brassDeep: "#2C5344",
      brassTint: "#DBE8E2",
      heroDecoration: "glow",
    },
    {
      id: "campaign-weekend-event",
      name: "Weekend Event",
      brass: "#B8935A",
      brassDeep: "#96723E",
      brassTint: "#F1E6D3",
      heroDecoration: "particles",
    },
    {
      id: "campaign-pizza-night",
      name: "Pizza Night",
      brass: "#C1452E",
      brassDeep: "#96341F",
      brassTint: "#F1D6C7",
      heroDecoration: "glow", // warm, single cozy light rather than a scattered effect
    },
    {
      id: "campaign-cinema-week",
      name: "Cinema Week",
      brass: "#8C6FB0",
      brassDeep: "#6C5389",
      brassTint: "#E7E0F0",
      heroDecoration: "spotlight", // a soft cinematic vignette — no posters, logos, or characters
    },
    {
      id: "campaign-cricket-fever",
      name: "Cricket Fever",
      brass: "#3E8C5A",
      brassDeep: "#2E6E45",
      brassTint: "#DCEEE2",
      heroDecoration: "stadium", // gentle horizontal floodlight bands — generic, no team/league branding
    },
    {
      id: "campaign-new-facility",
      name: "New Facility Launch",
      brass: "#3E7F8C",
      brassDeep: "#2E626C",
      brassTint: "#DCEBEE",
      heroDecoration: "spotlight", // a reveal moment — "look here"
    },
    {
      id: "campaign-anniversary",
      name: "Anniversary",
      brass: "#B8935A",
      brassDeep: "#96723E",
      brassTint: "#F1E6D3",
      heroDecoration: "sparkle", // celebratory but refined — twinkle, not confetti
    },
    {
      id: "campaign-student-festival",
      name: "Student Festival",
      brass: "#B0508C",
      brassDeep: "#893D6C",
      brassTint: "#F0DCE7",
      heroDecoration: "particles",
    },
    {
      id: "campaign-offer-week",
      name: "Offer Week",
      brass: "#C9A227",
      brassDeep: "#9C7D1E",
      brassTint: "#F3E9C0",
      heroDecoration: "beacon", // highlight the deal without shouting
    },
  ];

  campaignThemes.forEach(function (opts) {
    window.PGTheme.config[opts.id] = makeAccentTheme(opts);
  });

  /**
   * ---------------------------------------------------------------------
   * PHASE 4 — Indian Festival & National Calendar expansion
   * ---------------------------------------------------------------------
   * Three groups, same `makeAccentTheme` factory:
   *
   * 1. 13 unique festival themes — days worth their own distinct color
   *    (Maha Shivratri through New Year's Eve).
   * 2. TWO shared themes reused by many calendar days at once:
   *    - `festival-national-generic` — one dignified saffron tone for
   *      every plain "National Day" observance. Multiple days in
   *      festival-calendar.js point at this same themeId; each supplies
   *      its own `bannerText` so the greeting still differs per day even
   *      though the visual theme doesn't.
   *    - `festival-remembrance-generic` — one muted, no-decoration tone
   *      for every remembrance/martyrdom/solemn day, for the same reason.
   *      `heroDecoration: null` here is deliberate and load-bearing: no
   *      festive animation should ever appear on a remembrance day.
   * 3. 4 seasonal themes (Spring/Summer/Monsoon/Winter) — intentionally
   *    the subtlest overrides in the whole system (no announcement, no
   *    hero decoration, a barely-there accent shift) and gated off by
   *    default via `window.PGTheme.seasonalThemesEnabled` in
   *    festival-calendar.js.
   */
  var indianCalendarThemes = [
    // -- unique festival themes --
    { id: "festival-maha-shivratri", name: "Maha Shivratri", brass: "#5C7A99", brassDeep: "#455D77", brassTint: "#DCE6EE", heroDecoration: "glow" },
    { id: "festival-gudi-padwa", name: "Gudi Padwa", brass: "#D9762E", brassDeep: "#B05A20", brassTint: "#F5DEC7", heroDecoration: "particles" },
    { id: "festival-ram-navami", name: "Ram Navami", brass: "#B8622E", brassDeep: "#8F4B22", brassTint: "#F0DCC9", heroDecoration: "glow" },
    { id: "festival-hanuman-jayanti", name: "Hanuman Jayanti", brass: "#CB6A2E", brassDeep: "#A3541F", brassTint: "#F4E0C9", heroDecoration: "glow" },
    { id: "festival-buddha-purnima", name: "Buddha Purnima", brass: "#B99A5E", brassDeep: "#8F7645", brassTint: "#EFE6D2", heroDecoration: "glow" },
    { id: "festival-guru-purnima", name: "Guru Purnima", brass: "#B08A4E", brassDeep: "#8A6B3B", brassTint: "#EDE3CC", heroDecoration: null },
    { id: "festival-raksha-bandhan", name: "Raksha Bandhan", brass: "#C1584A", brassDeep: "#984538", brassTint: "#F1DAD6", heroDecoration: "particles" },
    { id: "festival-janmashtami", name: "Janmashtami", brass: "#5C5C99", brassDeep: "#454577", brassTint: "#DCDCEE", heroDecoration: "particles" },
    { id: "festival-karwa-chauth", name: "Karwa Chauth", brass: "#6E7C99", brassDeep: "#545F77", brassTint: "#E1E5EE", heroDecoration: "glow" },
    { id: "festival-bhai-dooj", name: "Bhai Dooj", brass: "#C17A6B", brassDeep: "#985F53", brassTint: "#F1DFDB", heroDecoration: "particles" },
    { id: "festival-chhath-puja", name: "Chhath Puja", brass: "#D9A13D", brassDeep: "#AD7E2E", brassTint: "#F6E7C6", heroDecoration: "glow" },
    { id: "festival-tulsi-vivah", name: "Tulsi Vivah", brass: "#7F9463", brassDeep: "#63744C", brassTint: "#E4E9DA", heroDecoration: null },
    { id: "festival-new-years-eve", name: "New Year's Eve", brass: "#D4AF37", brassDeep: "#A6841F", brassTint: "#F3E9C7", heroDecoration: "particles" },

    // -- shared: every plain "national day" observance --
    { id: "festival-national-generic", name: "National Observance", brass: "#C17F35", brassDeep: "#96631F", brassTint: "#F0DFC0", heroDecoration: "glow" },

    // -- shared: every remembrance/solemn day — no decoration, ever --
    { id: "festival-remembrance-generic", name: "Remembrance", brass: "#5B6472", brassDeep: "#434A54", brassTint: "#E2E5E9", heroDecoration: null },

    // -- seasonal (off by default) --
    { id: "festival-season-spring", name: "Spring", brass: "#7F9D6E", brassDeep: "#647D55", brassTint: "#E3EBDD", heroDecoration: null },
    { id: "festival-season-summer", name: "Summer", brass: "#D9922E", brassDeep: "#AD7422", brassTint: "#F5E1C4", heroDecoration: null },
    { id: "festival-season-monsoon", name: "Monsoon", brass: "#5C7F99", brassDeep: "#456277", brassTint: "#DCE7EE", heroDecoration: null },
    { id: "festival-season-winter", name: "Winter", brass: "#7C7F99", brassDeep: "#5F6277", brassTint: "#E3E4EE", heroDecoration: null },
  ];

  indianCalendarThemes.forEach(function (opts) {
    window.PGTheme.config[opts.id] = makeAccentTheme(opts);
  });
})();
