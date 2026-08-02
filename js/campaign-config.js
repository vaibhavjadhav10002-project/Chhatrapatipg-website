/**
 * campaign-config.js
 * ---------------------------------------------------------------------------
 * Registry of manual, date-ranged campaigns + the lookup helper
 * theme-engine.js uses to ask "is a campaign live right now?".
 *
 * Campaigns always outrank festival themes (see theme-engine.js priority
 * chain: campaign > festival > default).
 *
 * -----------------------------------------------------------------------
 * ENTRY SCHEMA
 * -----------------------------------------------------------------------
 *   {
 *     id: "admission-open",        // unique id
 *     name: "Admission Open",      // display name (for docs/future admin UI)
 *     themeId: "campaign-admission-open", // key into window.PGTheme.config
 *
 *     enabled: false,               // manual on/off switch — the master kill switch
 *     priority: 50,                 // 0-100, higher wins if 2+ campaigns overlap
 *
 *     startDate: "2026-06-01",      // "YYYY-MM-DD", inclusive
 *     endDate:   "2026-06-15",      // "YYYY-MM-DD", inclusive
 *     startTime: null,              // OPTIONAL "HH:MM" 24h — restricts to a
 *     endTime:   null,              // daily time window within the date range
 *                                   // (e.g. Cinema Week: startTime "20:00")
 *
 *     autoActivate: true,           // true = turn on automatically once
 *                                   // `enabled` and the date/time window match.
 *                                   // false = only ever active while a human
 *                                   // (future Admin Panel) also flips a live
 *                                   // switch — placeholder for Phase 8.
 *     autoExpire: true,             // true = turn off automatically once
 *                                   // endDate/endTime passes, even if still
 *                                   // `enabled`. false = stays on until a
 *                                   // human disables it (ignores endDate).
 *
 *     title: "",                    // hero headline override (blank = keep default copy)
 *     subtitle: "",                 // hero sub-headline override
 *     bannerText: "",               // announcement-bar text
 *     bannerIcon: "",               // announcement-bar icon/emoji
 *
 *     ctaText: "",                  // primary hero button label override
 *     ctaLink: "",                  // primary hero button href override
 *
 *     countdown: null,              // null, or { label: "Offer ends in", targetDate: "2026-06-15T23:59:59" }
 *   }
 *
 * `vars` / `heroDecoration` / footer accent are NOT set here — they live on
 * the theme object in theme-config.js (`themeId` points to it), so a
 * campaign's visual identity and its scheduling never duplicate each other.
 *
 * "Mobile optimization" and "accessibility" are not per-campaign toggles:
 * every campaign reuses the same responsive, accessible shared components
 * (announcement bar, hero decoration, buttons) built in Phase 1/2, so those
 * guarantees are structural, not configuration.
 *
 * -----------------------------------------------------------------------
 * All 15 campaigns below ship with `enabled: false` and placeholder dates.
 * This file is intentionally the ONLY place you need to edit to run one:
 * flip `enabled` to `true` and set real `startDate`/`endDate` (and
 * `startTime`/`endTime` if it's a same-day event). Nothing else in the
 * codebase needs to change.
 */
(function () {
  window.PGTheme = window.PGTheme || {};

  window.PGTheme.campaigns = [
    {
      id: "admission-open",
      name: "Admission Open",
      themeId: "campaign-admission-open",
      enabled: false,
      priority: 60,
      startDate: "2026-06-01",
      endDate: "2026-07-15",
      startTime: null,
      endTime: null,
      autoActivate: true,
      autoExpire: true,
      title: "Admissions are open at Chhatrapati PG",
      subtitle: "Book your room for the new academic year — limited seats across double and triple sharing.",
      bannerText: "Admissions Open for the new academic year — enquire now.",
      bannerIcon: "📖",
      ctaText: "Check room availability",
      ctaLink: "#rooms",
      countdown: null,
    },
    {
      id: "limited-rooms",
      name: "Limited Rooms Available",
      themeId: "campaign-limited-rooms",
      enabled: false,
      priority: 70,
      startDate: "2026-06-01",
      endDate: "2026-06-30",
      startTime: null,
      endTime: null,
      autoActivate: true,
      autoExpire: true,
      title: "Only a few rooms left this month",
      subtitle: "Double and triple sharing are filling up fast — enquire today to hold your spot.",
      bannerText: "Limited rooms available this month — enquire soon.",
      bannerIcon: "⏳",
      ctaText: "Enquire now",
      ctaLink: "#contact",
      countdown: null,
    },
    {
      id: "refer-earn",
      name: "Refer & Earn",
      themeId: "campaign-refer-earn",
      enabled: false,
      priority: 40,
      startDate: "2026-06-01",
      endDate: "2026-06-30",
      startTime: null,
      endTime: null,
      autoActivate: true,
      autoExpire: true,
      title: "Refer a friend, both of you save",
      subtitle: "Bring a friend to Chhatrapati PG this month and you'll both get a rent discount on move-in.",
      bannerText: "Refer & Earn is on — refer a friend and both of you save.",
      bannerIcon: "🤝",
      ctaText: "Learn how it works",
      ctaLink: "#contact",
      countdown: null,
    },
    {
      id: "freshers-welcome",
      name: "Freshers Welcome",
      themeId: "campaign-freshers-welcome",
      enabled: false,
      priority: 55,
      startDate: "2026-06-15",
      endDate: "2026-07-05",
      startTime: null,
      endTime: null,
      autoActivate: true,
      autoExpire: true,
      title: "Welcome, freshers!",
      subtitle: "New to Fatehgunj? Chhatrapati PG is fully furnished and five minutes from college — move in stress-free.",
      bannerText: "Welcome, freshers! Ask us about first-year move-in support.",
      bannerIcon: "🎓",
      ctaText: "See rooms & rates",
      ctaLink: "#rooms",
      countdown: null,
    },
    {
      id: "orientation-week",
      name: "Orientation Week",
      themeId: "campaign-orientation-week",
      enabled: false,
      priority: 45,
      startDate: "2026-06-15",
      endDate: "2026-06-22",
      startTime: null,
      endTime: null,
      autoActivate: true,
      autoExpire: true,
      title: "Orientation week at Chhatrapati PG",
      subtitle: "Settling in? We're here to help with anything you need this week.",
      bannerText: "Orientation Week — reach out any time, we're here to help.",
      bannerIcon: "🧭",
      ctaText: "Contact us",
      ctaLink: "#contact",
      countdown: null,
    },
    {
      id: "exam-season",
      name: "Exam Season",
      themeId: "campaign-exam-season",
      enabled: false,
      priority: 65,
      startDate: "2026-11-20",
      endDate: "2026-12-10",
      startTime: null,
      endTime: null,
      autoActivate: true,
      autoExpire: true,
      title: "",
      subtitle: "",
      bannerText: "Exam season — quiet hours in effect. All the best!",
      bannerIcon: "📚",
      ctaText: "",
      ctaLink: "",
      countdown: null,
    },
    {
      id: "placement-season",
      name: "Placement Season",
      themeId: "campaign-placement-season",
      enabled: false,
      priority: 50,
      startDate: "2026-01-15",
      endDate: "2026-03-15",
      startTime: null,
      endTime: null,
      autoActivate: true,
      autoExpire: true,
      title: "",
      subtitle: "",
      bannerText: "Placement season — good luck to everyone interviewing!",
      bannerIcon: "💼",
      ctaText: "",
      ctaLink: "",
      countdown: null,
    },
    {
      id: "weekend-event",
      name: "Weekend Event",
      themeId: "campaign-weekend-event",
      enabled: false,
      priority: 35,
      startDate: "2026-06-06",
      endDate: "2026-06-07",
      startTime: null,
      endTime: null,
      autoActivate: true,
      autoExpire: true,
      title: "",
      subtitle: "",
      bannerText: "This weekend at Chhatrapati PG — ask a warden for details.",
      bannerIcon: "🎈",
      ctaText: "",
      ctaLink: "",
      countdown: null,
    },
    {
      id: "pizza-night",
      name: "Pizza Night",
      themeId: "campaign-pizza-night",
      enabled: false,
      priority: 30,
      startDate: "2026-06-06",
      endDate: "2026-06-06",
      startTime: "19:00",
      endTime: "22:00",
      autoActivate: true,
      autoExpire: true,
      title: "",
      subtitle: "",
      bannerText: "🍕 Pizza Night tonight, 7–10 PM in the common area.",
      bannerIcon: "🍕",
      ctaText: "",
      ctaLink: "",
      countdown: { label: "Pizza Night ends in", targetDate: "2026-06-06T22:00:00" },
    },
    {
      id: "cinema-week",
      name: "Cinema Week",
      themeId: "campaign-cinema-week",
      enabled: false,
      priority: 30,
      startDate: "2026-06-13",
      endDate: "2026-06-13",
      startTime: "20:00",
      endTime: "23:00",
      autoActivate: true,
      autoExpire: true,
      title: "",
      subtitle: "",
      bannerText: "🎬 Cinema Week tonight, 8 PM — common area.",
      bannerIcon: "🎬",
      ctaText: "",
      ctaLink: "",
      countdown: { label: "Cinema Week starts in", targetDate: "2026-06-13T20:00:00" },
    },
    {
      id: "cricket-fever",
      name: "Cricket Fever",
      themeId: "campaign-cricket-fever",
      enabled: false,
      priority: 30,
      startDate: "2026-06-01",
      endDate: "2026-06-01",
      startTime: "19:00",
      endTime: "23:30",
      autoActivate: true,
      autoExpire: true,
      title: "",
      subtitle: "",
      bannerText: "🏏 Match screening tonight in the common area — come cheer along.",
      bannerIcon: "🏏",
      ctaText: "",
      ctaLink: "",
      countdown: { label: "Screening starts in", targetDate: "2026-06-01T19:00:00" },
    },
    {
      id: "new-facility",
      name: "New Facility Launch",
      themeId: "campaign-new-facility",
      enabled: false,
      priority: 40,
      startDate: "2026-06-01",
      endDate: "2026-06-21",
      startTime: null,
      endTime: null,
      autoActivate: true,
      autoExpire: true,
      title: "",
      subtitle: "",
      bannerText: "Now available: a new facility at Chhatrapati PG — ask us for details.",
      bannerIcon: "🆕",
      ctaText: "",
      ctaLink: "",
      countdown: null,
    },
    {
      id: "anniversary",
      name: "Anniversary",
      themeId: "campaign-anniversary",
      enabled: false,
      priority: 55,
      startDate: "2026-06-01",
      endDate: "2026-06-07",
      startTime: null,
      endTime: null,
      autoActivate: true,
      autoExpire: true,
      title: "",
      subtitle: "",
      bannerText: "🎉 Celebrating another year of Chhatrapati PG — thank you for being part of it.",
      bannerIcon: "🎉",
      ctaText: "",
      ctaLink: "",
      countdown: null,
    },
    {
      id: "student-festival",
      name: "Student Festival",
      themeId: "campaign-student-festival",
      enabled: false,
      priority: 35,
      startDate: "2026-06-01",
      endDate: "2026-06-02",
      startTime: null,
      endTime: null,
      autoActivate: true,
      autoExpire: true,
      title: "",
      subtitle: "",
      bannerText: "Student festival happening this weekend — ask a warden for the schedule.",
      bannerIcon: "🎊",
      ctaText: "",
      ctaLink: "",
      countdown: null,
    },
    {
      id: "offer-week",
      name: "Offer Week",
      themeId: "campaign-offer-week",
      enabled: false,
      priority: 65,
      startDate: "2026-06-01",
      endDate: "2026-06-07",
      startTime: null,
      endTime: null,
      autoActivate: true,
      autoExpire: true,
      title: "",
      subtitle: "",
      bannerText: "Offer week is on — enquire before it ends.",
      bannerIcon: "🏷️",
      ctaText: "Enquire now",
      ctaLink: "#contact",
      countdown: { label: "Offer ends in", targetDate: "2026-06-07T23:59:59" },
    },
  ];

  /**
   * Combines a "YYYY-MM-DD" date with an optional "HH:MM" time into a Date.
   * @param {string} dateStr
   * @param {string|null} timeStr
   * @param {string} fallbackTime "00:00:00" for range start, "23:59:59" for range end
   * @returns {Date}
   */
  function combine(dateStr, timeStr, fallbackTime) {
    var time = timeStr ? timeStr + ":00" : fallbackTime;
    return new Date(dateStr + "T" + time);
  }

  /**
   * Returns the highest-priority enabled campaign whose date (and, if set,
   * time-of-day) window covers `date`, or null if none is active.
   * @param {Date} [date] defaults to now
   * @returns {Object|null}
   */
  window.PGTheme.getActiveCampaign = function (date) {
    date = date || new Date();

    var candidates = [];
    var list = window.PGTheme.campaigns || [];

    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (!c.enabled) continue;
      if (c.autoActivate === false) continue; // reserved for a future manual/admin trigger

      var start = combine(c.startDate, c.startTime, "00:00:00");
      var end = c.autoExpire === false
        ? new Date(8640000000000000) // never expires while enabled
        : combine(c.endDate, c.endTime, "23:59:59");

      if (date < start || date > end) continue;

      candidates.push(c);
    }

    if (candidates.length === 0) return null;

    candidates.sort(function (a, b) {
      return (b.priority || 0) - (a.priority || 0);
    });
    return candidates[0];
  };
})();
