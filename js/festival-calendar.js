/**
 * festival-calendar.js
 * ---------------------------------------------------------------------------
 * Registry of automatic calendar themes (festivals, national observances,
 * remembrance days, seasonal ambience) + the lookup helper theme-engine.js
 * uses to ask "what does today's calendar say?".
 *
 * -----------------------------------------------------------------------
 * ENTRY SCHEMA
 * -----------------------------------------------------------------------
 *   {
 *     id: "diwali",
 *     name: "Diwali",
 *     category: "celebration",   // "remembrance" | "national" | "celebration" | "seasonal"
 *     priority: 50,              // 0-100 tie-break WITHIN the same category on the same day
 *
 *     month: 10, day: 24,        // fixed Gregorian date, OR:
 *     dates: { 2026: "11-08" },  // single-day lunar/variable override, "MM-DD", OR:
 *     dateRanges: { 2026: { start: "10-11", end: "10-19" } }, // multi-day window
 *
 *     themeId: "festival-diwali",   // key into window.PGTheme.config
 *     bannerText: "",                // OPTIONAL per-entry announcement override —
 *     bannerIcon: "",                // lets many calendar days SHARE one theme
 *                                    // (color/decoration) while each still showing
 *                                    // its own greeting. Falls back to the theme's
 *                                    // own `announcement` if omitted.
 *   }
 *
 * -----------------------------------------------------------------------
 * CATEGORY PRIORITY (highest wins if two entries' windows overlap)
 * -----------------------------------------------------------------------
 *   remembrance > national > celebration > seasonal
 *
 * This mirrors the priority chain specified for the overall engine
 * (campaign > remembrance > national > festivals > seasonal > default) —
 * campaigns are handled one level up, in theme-engine.js.
 *
 * -----------------------------------------------------------------------
 * ACTIVE WINDOWS (not just the exact day)
 * -----------------------------------------------------------------------
 * Every entry activates for a WINDOW around its date, not just the exact
 * day: `preDays` before it starts, `postDays` after it ends (both
 * inclusive). Defaults are per-category (see CATEGORY_DEFAULT_WINDOW
 * below) — festivals get ±5 days, national days ±3, remembrance days ±1,
 * seasonal themes get no extra expansion (they're already wide ranges).
 * Any entry can override its window by adding its own `preDays`/
 * `postDays` — no engine change needed, ever; the engine only ever reads
 * this file's data, never a hardcoded number.
 *
 * Because windows are wide (festivals especially), MANY entries now
 * overlap across the year — far more than the handful of exact-day
 * collisions in earlier versions of this file. Category order still
 * resolves every overlap the same way it always has (remembrance >
 * national > celebration > seasonal, then `priority`, then array order).
 * Call `window.PGTheme.admin.PriorityManager.listFestivalCollisions(year)`
 * (Phase 6) for the full, current, exact list for any year — it's now
 * long enough (30+ overlapping stretches in 2026) that maintaining a
 * hand-written table here would drift out of date immediately.
 *
 * Two entries are worth flagging by name because they're worth
 * reconsidering, not just noting: with the 2026 dates and default
 * windows as configured, **`dussehra` and `new-years-eve` never win a
 * single day of 2026** — their entire windows are always overlapped by
 * an earlier-in-array same-category neighbor (Navratri; New Year) or a
 * higher-ranked category (Police Commemoration Day). This isn't a bug —
 * the resolution rule is doing exactly what it's supposed to — but it
 * likely isn't what you want for two named festivals. Fixes are entirely
 * data changes in this file, e.g.: give `dussehra`/`new-years-eve` a
 * higher `priority` than their neighbor, shrink their `preDays`/
 * `postDays` so the overlap shrinks or disappears, or move them earlier
 * in the array (ties break by array order). Call
 * `admin.PriorityManager.listSilencedEntries(year)` to check for this
 * after any calendar edit.
 *
 * -----------------------------------------------------------------------
 * TONE NOTE
 * -----------------------------------------------------------------------
 * A handful of days are officially listed as "National Days" but are
 * inherently solemn rather than celebratory (Martyrs' Day, Gandhi
 * Jayanti, Kargil Vijay Diwas, Police Commemoration Day, Armed Forces
 * Flag Day). These are tagged `category: "remembrance"` here regardless
 * of which list they came from, specifically so they NEVER get festive
 * decoration (glow/particles) or bright colors — see the shared
 * `festival-remembrance-generic` theme in theme-config.js.
 *
 * -----------------------------------------------------------------------
 * SEASONAL THEMES ARE OFF BY DEFAULT
 * -----------------------------------------------------------------------
 * Spring/Summer/Monsoon/Winter cover the entire year with no gaps, so
 * turning them on means the site is *always* in some seasonal theme
 * (though each one is a very small, subtle accent shift — see
 * theme-config.js). That's too big a behavior change to ship silently.
 * Flip `window.PGTheme.seasonalThemesEnabled = true` (e.g. in a small
 * script tag after this file, or from a future Admin Panel) to turn it
 * on; it defaults to `false`, so today's behavior (no seasonal layer,
 * `default` theme shows on any day with no festival/national/remembrance
 * entry) is unchanged.
 */
(function () {
  window.PGTheme = window.PGTheme || {};

  window.PGTheme.seasonalThemesEnabled = window.PGTheme.seasonalThemesEnabled || false;

  var CATEGORY_ORDER = ["remembrance", "national", "celebration"];

  /**
   * -------------------------------------------------------------------
   * ACTIVE WINDOWS (configuration-driven — nothing below is read by the
   * engine as a hardcoded number; it only reads THIS object, or an
   * entry's own `preDays`/`postDays` override).
   * -------------------------------------------------------------------
   * Every entry gets a window around its actual date, not just the exact
   * day: `preDays` before, `postDays` after (both inclusive). Defaults
   * are per-category here; any entry can override by adding its own
   * `preDays`/`postDays` — no engine change needed for that, ever.
   *
   * Rationale for the defaults below: bigger, once-a-year festivals
   * benefit from a longer lead-in/wind-down (decor, mood) than a solemn
   * remembrance day, which should be brief and precise. Seasonal themes
   * already ARE wide date ranges by design, so they get no additional
   * expansion (0/0) — expanding a season further would be meaningless.
   */
  var CATEGORY_DEFAULT_WINDOW = {
    celebration: { preDays: 5, postDays: 5 },
    national: { preDays: 3, postDays: 3 },
    remembrance: { preDays: 1, postDays: 1 },
    seasonal: { preDays: 0, postDays: 0 },
  };

  /** @returns {number} */
  function resolvePreDays(f) {
    if (f.preDays != null) return f.preDays;
    var def = CATEGORY_DEFAULT_WINDOW[f.category];
    return def ? def.preDays : 0;
  }
  /** @returns {number} */
  function resolvePostDays(f) {
    if (f.postDays != null) return f.postDays;
    var def = CATEGORY_DEFAULT_WINDOW[f.category];
    return def ? def.postDays : 0;
  }

  window.PGTheme.festivals = [
    // -----------------------------------------------------------------
    // CELEBRATION — festivals (Phase 2 + Phase 4 additions)
    // -----------------------------------------------------------------
    { id: "new-year", name: "New Year", category: "celebration", priority: 50, month: 1, day: 1, themeId: "festival-new-year" },
    { id: "makar-sankranti", name: "Makar Sankranti", category: "celebration", priority: 50, month: 1, day: 14, themeId: "festival-makar-sankranti" },
    { id: "maha-shivratri", name: "Maha Shivratri", category: "celebration", priority: 50, dates: { 2026: "02-15" }, themeId: "festival-maha-shivratri", bannerText: "Happy Maha Shivratri — wishing you peace and devotion." },
    { id: "holi", name: "Holi", category: "celebration", priority: 50, dates: { 2026: "03-04" }, themeId: "festival-holi" },
    { id: "gudi-padwa", name: "Gudi Padwa", category: "celebration", priority: 50, dates: { 2026: "03-19" }, themeId: "festival-gudi-padwa", bannerText: "Happy Gudi Padwa — wishing you a prosperous new year!" },
    { id: "ram-navami", name: "Ram Navami", category: "celebration", priority: 50, dates: { 2026: "03-26" }, themeId: "festival-ram-navami", bannerText: "Happy Ram Navami!" },
    { id: "hanuman-jayanti", name: "Hanuman Jayanti", category: "celebration", priority: 50, dates: { 2026: "04-02" }, themeId: "festival-hanuman-jayanti", bannerText: "Happy Hanuman Jayanti!" },
    { id: "buddha-purnima", name: "Buddha Purnima", category: "celebration", priority: 50, dates: { 2026: "05-01" }, themeId: "festival-buddha-purnima", bannerText: "Happy Buddha Purnima — wishing you peace." },
    { id: "guru-purnima", name: "Guru Purnima", category: "celebration", priority: 50, dates: { 2026: "07-29" }, themeId: "festival-guru-purnima", bannerText: "Happy Guru Purnima — gratitude to all our teachers." },
    { id: "raksha-bandhan", name: "Raksha Bandhan", category: "celebration", priority: 50, dates: { 2026: "08-28" }, themeId: "festival-raksha-bandhan", bannerText: "Happy Raksha Bandhan!" },
    { id: "independence-day", name: "Independence Day", category: "celebration", priority: 50, month: 8, day: 15, themeId: "festival-independence-day" },
    { id: "janmashtami", name: "Janmashtami", category: "celebration", priority: 50, dates: { 2026: "09-04" }, themeId: "festival-janmashtami", bannerText: "Happy Janmashtami!" },
    { id: "ganesh-chaturthi", name: "Ganesh Chaturthi", category: "celebration", priority: 50, dates: { 2026: "09-14" }, themeId: "festival-ganesh-chaturthi" },
    { id: "navratri", name: "Navratri", category: "celebration", priority: 50, dateRanges: { 2026: { start: "10-11", end: "10-19" } }, themeId: "festival-navratri" },
    { id: "karwa-chauth", name: "Karwa Chauth", category: "celebration", priority: 50, dates: { 2026: "10-28" }, themeId: "festival-karwa-chauth", bannerText: "Happy Karwa Chauth!" },
    { id: "dussehra", name: "Dussehra", category: "celebration", priority: 50, dates: { 2026: "10-20" }, themeId: "festival-dussehra" },
    { id: "diwali", name: "Diwali", category: "celebration", priority: 50, dates: { 2026: "11-08" }, themeId: "festival-diwali" },
    { id: "bhai-dooj", name: "Bhai Dooj", category: "celebration", priority: 50, dates: { 2026: "11-11" }, themeId: "festival-bhai-dooj", bannerText: "Happy Bhai Dooj!" },
    { id: "chhath-puja", name: "Chhath Puja", category: "celebration", priority: 50, dates: { 2026: "11-15" }, themeId: "festival-chhath-puja", bannerText: "Happy Chhath Puja!" },
    { id: "tulsi-vivah", name: "Tulsi Vivah", category: "celebration", priority: 50, dates: { 2026: "11-21" }, themeId: "festival-tulsi-vivah", bannerText: "Happy Tulsi Vivah." },
    { id: "christmas", name: "Christmas", category: "celebration", priority: 50, month: 12, day: 25, themeId: "festival-christmas" },
    { id: "new-years-eve", name: "New Year's Eve", category: "celebration", priority: 50, month: 12, day: 31, themeId: "festival-new-years-eve", bannerText: "Happy New Year's Eve from Chhatrapati PG!" },

    // -----------------------------------------------------------------
    // NATIONAL — official observances, dignified-but-not-mournful tone
    // -----------------------------------------------------------------
    { id: "national-youth-day", name: "National Youth Day", category: "national", priority: 50, month: 1, day: 12, themeId: "festival-national-generic", bannerIcon: "🇮🇳", bannerText: "National Youth Day — honoring Swami Vivekananda's birth anniversary." },
    { id: "army-day", name: "Army Day", category: "national", priority: 50, month: 1, day: 15, themeId: "festival-national-generic", bannerIcon: "🇮🇳", bannerText: "Army Day — honoring the Indian Army." },
    { id: "republic-day", name: "Republic Day", category: "celebration", priority: 50, month: 1, day: 26, themeId: "festival-republic-day" },
    { id: "maharashtra-day", name: "Maharashtra Day", category: "national", priority: 50, month: 5, day: 1, themeId: "festival-national-generic", bannerIcon: "🇮🇳", bannerText: "Happy Maharashtra Day!" },
    { id: "national-technology-day", name: "National Technology Day", category: "national", priority: 50, month: 5, day: 11, themeId: "festival-national-generic", bannerIcon: "🇮🇳", bannerText: "National Technology Day." },
    { id: "international-yoga-day", name: "International Yoga Day", category: "national", priority: 50, month: 6, day: 21, themeId: "festival-national-generic", bannerIcon: "🧘", bannerText: "International Yoga Day — take a mindful moment today." },
    { id: "teachers-day", name: "Teacher's Day", category: "national", priority: 50, month: 9, day: 5, themeId: "festival-national-generic", bannerIcon: "🇮🇳", bannerText: "Happy Teacher's Day to all our teachers!" },
    { id: "hindi-diwas", name: "Hindi Diwas", category: "national", priority: 50, month: 9, day: 14, themeId: "festival-national-generic", bannerIcon: "🇮🇳", bannerText: "Hindi Diwas." },
    { id: "indian-air-force-day", name: "Indian Air Force Day", category: "national", priority: 50, month: 10, day: 8, themeId: "festival-national-generic", bannerIcon: "🇮🇳", bannerText: "Indian Air Force Day — honoring the IAF." },
    { id: "national-unity-day", name: "National Unity Day", category: "national", priority: 50, month: 10, day: 31, themeId: "festival-national-generic", bannerIcon: "🇮🇳", bannerText: "National Unity Day — honoring Sardar Vallabhbhai Patel." },
    { id: "constitution-day", name: "Constitution Day", category: "national", priority: 50, month: 11, day: 26, themeId: "festival-national-generic", bannerIcon: "🇮🇳", bannerText: "Constitution Day." },
    { id: "indian-navy-day", name: "Indian Navy Day", category: "national", priority: 50, month: 12, day: 4, themeId: "festival-national-generic", bannerIcon: "🇮🇳", bannerText: "Indian Navy Day — honoring the Indian Navy." },

    // -----------------------------------------------------------------
    // REMEMBRANCE — respectful visuals only, no festive decoration
    // (includes some officially "National Day" entries that are
    // inherently solemn — see the TONE NOTE above)
    // -----------------------------------------------------------------
    { id: "subhas-chandra-bose-jayanti", name: "Subhas Chandra Bose Jayanti", category: "remembrance", priority: 50, month: 1, day: 23, themeId: "festival-remembrance-generic", bannerIcon: "🇮🇳", bannerText: "Remembering Netaji Subhas Chandra Bose." },
    { id: "martyrs-day", name: "Martyrs' Day", category: "remembrance", priority: 50, month: 1, day: 30, themeId: "festival-remembrance-generic", bannerText: "Martyrs' Day — remembering those who gave their lives for the nation." },
    { id: "pulwama-remembrance", name: "Pulwama Remembrance", category: "remembrance", priority: 50, month: 2, day: 14, themeId: "festival-remembrance-generic", bannerText: "Remembering the Pulwama martyrs." },
    { id: "bhagat-singh-rajguru-sukhdev-martyrdom-day", name: "Bhagat Singh, Rajguru & Sukhdev Martyrdom Day", category: "remembrance", priority: 50, month: 3, day: 23, themeId: "festival-remembrance-generic", bannerText: "Remembering Bhagat Singh, Rajguru & Sukhdev." },
    { id: "ambedkar-jayanti", name: "Ambedkar Jayanti", category: "remembrance", priority: 50, month: 4, day: 14, themeId: "festival-remembrance-generic", bannerText: "Remembering Dr. B. R. Ambedkar." },
    { id: "kargil-vijay-diwas", name: "Kargil Vijay Diwas", category: "remembrance", priority: 50, month: 7, day: 26, themeId: "festival-remembrance-generic", bannerText: "Kargil Vijay Diwas — honoring our soldiers." },
    { id: "gandhi-jayanti", name: "Gandhi Jayanti", category: "remembrance", priority: 90, month: 10, day: 2, themeId: "festival-remembrance-generic", bannerText: "Gandhi Jayanti — remembering Mahatma Gandhi." },
    { id: "lal-bahadur-shastri-jayanti", name: "Lal Bahadur Shastri Jayanti", category: "remembrance", priority: 80, month: 10, day: 2, themeId: "festival-remembrance-generic", bannerText: "Remembering Lal Bahadur Shastri." },
    { id: "police-commemoration-day", name: "Police Commemoration Day", category: "remembrance", priority: 50, month: 10, day: 21, themeId: "festival-remembrance-generic", bannerText: "Police Commemoration Day — honoring fallen police personnel." },
    { id: "26-11-remembrance", name: "26/11 Mumbai Terror Attack Remembrance", category: "remembrance", priority: 50, month: 11, day: 26, themeId: "festival-remembrance-generic", bannerText: "Remembering the victims of the 26/11 Mumbai attacks." },
    { id: "armed-forces-flag-day", name: "Armed Forces Flag Day", category: "remembrance", priority: 50, month: 12, day: 7, themeId: "festival-remembrance-generic", bannerText: "Armed Forces Flag Day — honoring our armed forces." },

    // -----------------------------------------------------------------
    // SEASONAL — off by default (window.PGTheme.seasonalThemesEnabled)
    // -----------------------------------------------------------------
    { id: "season-spring", name: "Spring", category: "seasonal", priority: 10, dateRanges: { 2026: { start: "02-01", end: "03-15" } }, themeId: "festival-season-spring" },
    { id: "season-summer", name: "Summer", category: "seasonal", priority: 10, dateRanges: { 2026: { start: "03-16", end: "06-15" } }, themeId: "festival-season-summer" },
    { id: "season-monsoon", name: "Monsoon", category: "seasonal", priority: 10, dateRanges: { 2026: { start: "06-16", end: "09-30" } }, themeId: "festival-season-monsoon" },
    { id: "season-winter-1", name: "Winter", category: "seasonal", priority: 10, dateRanges: { 2026: { start: "10-01", end: "12-31" } }, themeId: "festival-season-winter" },
    { id: "season-winter-2", name: "Winter", category: "seasonal", priority: 10, dateRanges: { 2026: { start: "01-01", end: "01-31" } }, themeId: "festival-season-winter" },
  ];

  /**
   * Returns entry `f`'s "core" date/range (before window expansion) for
   * the given `yearLabel`, or null if `f` has no data for that label
   * (only possible for `dates`/`dateRanges` entries — fixed `month`/`day`
   * entries always have a core for any label).
   * @returns {{start: Date, end: Date}|null}
   */
  function getCoreWindow(f, yearLabel) {
    if (f.dateRanges) {
      if (!f.dateRanges[yearLabel]) return null;
      var r = f.dateRanges[yearLabel];
      return {
        start: new Date(yearLabel + "-" + r.start + "T00:00:00"),
        end: new Date(yearLabel + "-" + r.end + "T23:59:59"),
      };
    }
    if (f.dates) {
      if (!f.dates[yearLabel]) return null;
      var d = new Date(yearLabel + "-" + f.dates[yearLabel] + "T00:00:00");
      var dEnd = new Date(yearLabel + "-" + f.dates[yearLabel] + "T23:59:59");
      return { start: d, end: dEnd };
    }
    if (f.month != null && f.day != null) {
      return {
        start: new Date(yearLabel, f.month - 1, f.day, 0, 0, 0),
        end: new Date(yearLabel, f.month - 1, f.day, 23, 59, 59),
      };
    }
    return null;
  }

  /** Expands a core {start,end} window by preDays/postDays (handles month/year rollover automatically via Date arithmetic). */
  function expandWindow(core, preDays, postDays) {
    var start = new Date(core.start.getTime());
    start.setDate(start.getDate() - preDays);
    start.setHours(0, 0, 0, 0);
    var end = new Date(core.end.getTime());
    end.setDate(end.getDate() + postDays);
    end.setHours(23, 59, 59, 999);
    return { start: start, end: end };
  }

  /**
   * True if `date` falls within entry `f`'s active window (its core
   * date/range, expanded by preDays/postDays — see CATEGORY_DEFAULT_WINDOW
   * and resolvePreDays/resolvePostDays above). Checks the core for
   * `date`'s year AND the adjacent years, so a window that spans a
   * year boundary (e.g. New Year's 5-day pre-window starting in late
   * December of the PREVIOUS year) is still caught correctly.
   */
  function entryActiveOn(f, date) {
    var year = date.getFullYear();
    var preDays = resolvePreDays(f);
    var postDays = resolvePostDays(f);

    for (var offset = -1; offset <= 1; offset++) {
      var core = getCoreWindow(f, year + offset);
      if (!core) continue;
      var expanded = expandWindow(core, preDays, postDays);
      if (date >= expanded.start && date <= expanded.end) return true;
    }
    return false;
  }

  /**
   * Returns EVERY calendar entry whose active window covers `date`
   * (before category/priority resolution) — used both by
   * getActiveFestival() below and by the Phase 6 admin API's collision
   * detector, so the two never disagree about what "matches".
   * @param {Date} [date] defaults to now
   * @returns {Array<Object>}
   */
  window.PGTheme.getMatchingFestivals = function (date) {
    date = date || new Date();
    var list = window.PGTheme.festivals || [];
    var matches = [];
    for (var i = 0; i < list.length; i++) {
      var f = list[i];
      if (f.category === "seasonal" && !window.PGTheme.seasonalThemesEnabled) continue;
      if (entryActiveOn(f, date)) matches.push(f);
    }
    return matches;
  };

  /**
   * Returns the single highest-priority calendar entry active on `date`
   * within remembrance/national/celebration, or null. Deliberately
   * excludes "seasonal" — see getActiveSeason() below. This split exists
   * so a future tier (Monthly Themes) can sit between "festival" and
   * "season" in the overall engine priority without this file needing
   * to know anything about that tier — theme-engine.js just calls
   * getActiveFestival(), then its own monthly-theme check, then
   * getActiveSeason(), in that order.
   * Resolution: gather every entry whose ACTIVE WINDOW covers `date`
   * (via getMatchingFestivals), group by category, take the
   * highest-ranked category present, then within that category pick the
   * highest `priority` (ties broken by array order).
   * @param {Date} [date] defaults to now
   * @returns {Object|null}
   */
  window.PGTheme.getActiveFestival = function (date) {
    date = date || new Date();
    var matches = window.PGTheme.getMatchingFestivals(date).filter(function (m) {
      return m.category !== "seasonal";
    });
    if (matches.length === 0) return null;

    for (var c = 0; c < CATEGORY_ORDER.length; c++) {
      var inCategory = matches.filter(function (m) {
        return m.category === CATEGORY_ORDER[c];
      });
      if (inCategory.length > 0) {
        inCategory.sort(function (a, b) {
          return (b.priority || 0) - (a.priority || 0);
        });
        return inCategory[0];
      }
    }
    return null;
  };

  /**
   * Returns the active seasonal entry, or null — null immediately if
   * `window.PGTheme.seasonalThemesEnabled` is false. Split out from
   * getActiveFestival() so Monthly Themes can rank above seasonal in the
   * overall priority chain (campaign > festival > monthly > season >
   * default) without this file needing any monthly-theme awareness.
   * Reuses getMatchingFestivals() — no re-implemented date matching.
   * @param {Date} [date] defaults to now
   * @returns {Object|null}
   */
  window.PGTheme.getActiveSeason = function (date) {
    date = date || new Date();
    if (!window.PGTheme.seasonalThemesEnabled) return null;
    var matches = window.PGTheme.getMatchingFestivals(date).filter(function (m) {
      return m.category === "seasonal";
    });
    if (matches.length === 0) return null;
    matches.sort(function (a, b) { return (b.priority || 0) - (a.priority || 0); });
    return matches[0];
  };
})();
