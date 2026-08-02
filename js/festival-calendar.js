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
 * CATEGORY PRIORITY (highest wins if two entries land on the same day)
 * -----------------------------------------------------------------------
 *   remembrance > national > celebration > seasonal
 *
 * This mirrors the priority chain specified for the overall engine
 * (campaign > remembrance > national > festivals > seasonal > default) —
 * campaigns are handled one level up, in theme-engine.js.
 *
 * Known date collisions in 2026, resolved by this ordering:
 *   - Sep 14, 2026: Hindi Diwas (national) OUTRANKS Ganesh Chaturthi
 *     (celebration) per the stated category order. If you'd rather
 *     Ganesh Chaturthi take precedence that day, either raise its
 *     `priority` and move "celebration" above "national" in
 *     CATEGORY_ORDER below, or delete/adjust the Hindi Diwas entry for
 *     that year — this file is the only place that needs to change.
 *   - Oct 2, 2026: Gandhi Jayanti and Lal Bahadur Shastri Jayanti both
 *     fall on Oct 2 and are both tagged "remembrance" — Gandhi Jayanti
 *     wins on `priority` (90 vs 80).
 *   - Nov 26, 2026: Constitution Day (national) vs the 26/11 remembrance
 *     day (remembrance) — remembrance wins by category, regardless of
 *     priority numbers.
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

  var CATEGORY_ORDER = ["remembrance", "national", "celebration", "seasonal"];

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

  /** True if `date` falls within a single-day/range match for entry `f`. */
  function entryMatchesDate(f, date, month, day, year) {
    if (f.dateRanges && f.dateRanges[year]) {
      var range = f.dateRanges[year];
      var start = new Date(year + "-" + range.start + "T00:00:00");
      var end = new Date(year + "-" + range.end + "T23:59:59");
      return date >= start && date <= end;
    }
    if (f.dates && f.dates[year]) {
      var parts = f.dates[year].split("-");
      return Number(parts[0]) === month && Number(parts[1]) === day;
    }
    if (f.month != null && f.day != null) {
      return f.month === month && f.day === day;
    }
    return false;
  }

  /**
   * Returns the single highest-priority calendar entry active on `date`,
   * or null. Resolution: gather every entry whose date matches, group by
   * category, take the highest-ranked category present (per
   * CATEGORY_ORDER — "seasonal" only considered if
   * `window.PGTheme.seasonalThemesEnabled` is true), then within that
   * category pick the highest `priority` (ties broken by array order).
   * @param {Date} [date] defaults to now
   * @returns {Object|null}
   */
  window.PGTheme.getActiveFestival = function (date) {
    date = date || new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();

    var list = window.PGTheme.festivals || [];
    var matches = [];

    for (var i = 0; i < list.length; i++) {
      var f = list[i];
      if (f.category === "seasonal" && !window.PGTheme.seasonalThemesEnabled) continue;
      if (entryMatchesDate(f, date, month, day, year)) matches.push(f);
    }

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
})();
