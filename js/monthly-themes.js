/**
 * monthly-themes.js
 * ---------------------------------------------------------------------------
 * Automatic monthly accent theme — one per calendar month, applied whenever
 * no campaign/remembrance/national/festival is active. Sits between
 * "Festival" and "Season" in the overall priority chain:
 *
 *   campaign > remembrance > national > festival > MONTHLY > season > default
 *
 * -----------------------------------------------------------------------
 * ON BY DEFAULT — unlike campaigns (off) and seasonal themes (off)
 * -----------------------------------------------------------------------
 * This tier is explicitly meant to "automatically apply" whenever nothing
 * higher-priority is active, so `window.PGTheme.monthlyThemesEnabled`
 * defaults to `true`. Set it to `false` (e.g. in a small script tag after
 * this file) to fall through to Season/Default instead.
 *
 * -----------------------------------------------------------------------
 * PRACTICAL EFFECT ON SEASONAL THEMES
 * -----------------------------------------------------------------------
 * Because every single day of the year belongs to exactly one month,
 * Monthly Themes match unconditionally whenever nothing higher-priority is
 * active — which is also exactly when Season would otherwise apply. With
 * Monthly Themes on (the default), Season themes (festival-calendar.js)
 * will never actually be shown, even if `seasonalThemesEnabled` is `true` —
 * Monthly always wins that tier first. This isn't a bug — it's the
 * direct, unavoidable consequence of putting an unconditional monthly
 * fallback ABOVE season in the priority chain, exactly as specified. If
 * you want Season to ever be visible, set `monthlyThemesEnabled = false`.
 *
 * -----------------------------------------------------------------------
 * DESIGN NOTE — deliberately no hero decoration
 * -----------------------------------------------------------------------
 * Every monthly theme has `heroDecoration: null`. This tier is live most
 * days of the year by design, so a permanent glow/particle animation
 * running 365 days a year would work against "never make the site feel
 * flashy" and cost a little idle GPU time for no real benefit. Monthly
 * Themes only ever shift the accent color — same reasoning as the
 * "accent-only" pattern used for festivals/campaigns, just with even more
 * restraint since this layer is the most-often-visible one.
 */
(function () {
  window.PGTheme = window.PGTheme || {};

  window.PGTheme.monthlyThemesEnabled =
    window.PGTheme.monthlyThemesEnabled !== false; // default true

  /**
   * One entry per month (1-12). `themeId` points into
   * window.PGTheme.config (see theme-config.js for the actual colors).
   * @type {Array<{month: number, name: string, themeId: string}>}
   */
  window.PGTheme.monthlyThemes = [
    { month: 1, name: "January — Frost Blue & Gold", themeId: "monthly-january" },
    { month: 2, name: "February — Warm Rose & Cream", themeId: "monthly-february" },
    { month: 3, name: "March — Fresh Green", themeId: "monthly-march" },
    { month: 4, name: "April — Soft Orange", themeId: "monthly-april" },
    { month: 5, name: "May — Golden Summer", themeId: "monthly-may" },
    { month: 6, name: "June — Rain Blue", themeId: "monthly-june" },
    { month: 7, name: "July — Deep Monsoon", themeId: "monthly-july" },
    { month: 8, name: "August — Saffron & Navy", themeId: "monthly-august" },
    { month: 9, name: "September — Emerald", themeId: "monthly-september" },
    { month: 10, name: "October — Royal Gold", themeId: "monthly-october" },
    { month: 11, name: "November — Deep Maroon", themeId: "monthly-november" },
    { month: 12, name: "December — Winter Silver", themeId: "monthly-december" },
  ];

  /**
   * Returns this month's theme entry, or null if the tier is disabled.
   * @param {Date} [date] defaults to now
   * @returns {{month: number, name: string, themeId: string}|null}
   */
  window.PGTheme.getActiveMonthlyTheme = function (date) {
    if (!window.PGTheme.monthlyThemesEnabled) return null;
    date = date || new Date();
    var month = date.getMonth() + 1;
    var list = window.PGTheme.monthlyThemes || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].month === month) return list[i];
    }
    return null;
  };
})();
