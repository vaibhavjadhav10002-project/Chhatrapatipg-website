/**
 * theme-engine.js
 * ---------------------------------------------------------------------------
 * Auto theme loader. This is the ONLY file that writes CSS custom properties
 * and theme-driven markup at runtime — theme-config.js / festival-calendar.js
 * / campaign-config.js are pure data + lookup helpers, this file is the one
 * piece of logic that turns "which theme/entry is active" into "what the
 * page actually looks like".
 *
 * Priority (highest wins): active campaign > active calendar entry > default.
 * (Within "calendar entry", festival-calendar.js itself resolves
 * remembrance > national > celebration > seasonal — see that file.)
 *
 * Load order required in index.html (all four before this file):
 *   theme-config.js, festival-calendar.js, campaign-config.js, theme-engine.js
 *
 * Usage from other scripts / a future Admin Panel:
 *   window.PGTheme.getActiveTheme()  -> { source, entry, theme }
 *   window.PGTheme.applyTheme(theme, source, entry) -> re-applies on demand
 *   window.PGTheme.init()            -> re-runs full resolution + apply
 *   document listens for "pgtheme:applied" (detail = getActiveTheme() result)
 *
 * NOTE ON OVERRIDES: `applyContentOverrides` below reads `entry.title` /
 * `entry.subtitle` / `entry.ctaText` / `entry.ctaLink` / `entry.countdown` /
 * `entry.bannerText` generically, regardless of whether `entry` came from
 * campaign-config.js or festival-calendar.js. Campaigns are the only ones
 * that currently set title/subtitle/CTA/countdown; festivals are the only
 * ones that commonly set a per-day `bannerText` on top of a shared theme's
 * generic announcement (see the "national"/"remembrance" shared themes in
 * theme-config.js). One override path serves both — no per-source branching.
 */
(function () {
  window.PGTheme = window.PGTheme || {};

  var HERO_DECORATION_CLASSES = [
    "hero--deco-glow",
    "hero--deco-particles",
    "hero--deco-beacon",
    "hero--deco-sparkle",
    "hero--deco-spotlight",
    "hero--deco-stadium",
  ];
  var countdownIntervalId = null;

  // Captured once, lazily, the first time an entry overrides them — so we
  // can always restore the real default copy when nothing is active.
  var originals = {
    captured: false,
    titleHTML: "",
    subText: "",
    ctaText: "",
    ctaHref: "",
  };

  /**
   * Resolves which theme should be active right now, without applying it.
   * @param {Date} [date] defaults to now
   * @returns {{source: 'campaign'|'festival'|'default', entry: Object|null, theme: Object}}
   */
  function getActiveTheme(date) {
    var config = window.PGTheme.config || {};
    var fallback = config.default;

    var campaign =
      typeof window.PGTheme.getActiveCampaign === "function"
        ? window.PGTheme.getActiveCampaign(date)
        : null;
    if (campaign) {
      return {
        source: "campaign",
        entry: campaign,
        theme: config[campaign.themeId] || fallback,
      };
    }

    var festival =
      typeof window.PGTheme.getActiveFestival === "function"
        ? window.PGTheme.getActiveFestival(date)
        : null;
    if (festival) {
      return {
        source: "festival",
        entry: festival,
        theme: config[festival.themeId] || fallback,
      };
    }

    return { source: "default", entry: null, theme: fallback };
  }

  /**
   * Shows/hides and fills the announcement bar. Reuses the single
   * #announcementBar element — no per-entry markup, ever.
   * @param {{icon: string, text: string}|null} announcement
   */
  function applyAnnouncement(announcement) {
    var bar = document.getElementById("announcementBar");
    if (!bar) return;
    var iconEl = document.getElementById("announcementIcon");
    var textEl = document.getElementById("announcementText");

    if (announcement && announcement.text) {
      if (iconEl) iconEl.textContent = announcement.icon || "";
      if (textEl) textEl.textContent = announcement.text;
      bar.hidden = false;
    } else {
      bar.hidden = true;
    }
  }

  /**
   * Toggles the hero's decoration class based on `theme.heroDecoration`.
   * The actual visuals are pure CSS (see css/style.css) — this only ever
   * adds/removes one class, never inline styles or new DOM.
   * @param {string|null} heroDecoration one of HERO_DECORATION_CLASSES's
   *   suffixes ("glow" | "particles" | "beacon" | "sparkle" | "spotlight" |
   *   "stadium"), or null/anything else for no decoration.
   */
  function applyHeroDecoration(heroDecoration) {
    var hero = document.getElementById("hero");
    if (!hero) return;
    hero.classList.remove.apply(hero.classList, HERO_DECORATION_CLASSES);
    if (heroDecoration && HERO_DECORATION_CLASSES.indexOf("hero--deco-" + heroDecoration) !== -1) {
      hero.classList.add("hero--deco-" + heroDecoration);
    }
  }

  /** Captures the real default hero copy exactly once, before any override. */
  function captureOriginals() {
    if (originals.captured) return;
    var titleEl = document.getElementById("heroTitle");
    var subEl = document.getElementById("heroSub");
    var ctaEl = document.getElementById("heroPrimaryCta");
    if (titleEl) originals.titleHTML = titleEl.innerHTML;
    if (subEl) originals.subText = subEl.textContent;
    if (ctaEl) {
      originals.ctaText = ctaEl.textContent;
      originals.ctaHref = ctaEl.getAttribute("href") || "";
    }
    originals.captured = true;
  }

  /** Formats milliseconds remaining as "Xd Yh Zm" (drops leading zero units). */
  function formatRemaining(ms) {
    if (ms <= 0) return "0m";
    var totalMinutes = Math.floor(ms / 60000);
    var days = Math.floor(totalMinutes / (60 * 24));
    var hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    var minutes = totalMinutes % 60;
    var parts = [];
    if (days) parts.push(days + "d");
    if (hours || days) parts.push(hours + "h");
    parts.push(minutes + "m");
    return parts.join(" ");
  }

  /**
   * Starts (or stops) the countdown badge. Updates once a minute — a
   * countdown doesn't need per-second precision and this keeps it cheap.
   * @param {{label: string, targetDate: string}|null} countdown
   */
  function applyCountdown(countdown) {
    var badge = document.getElementById("countdownBadge");
    if (!badge) return;

    if (countdownIntervalId) {
      clearInterval(countdownIntervalId);
      countdownIntervalId = null;
    }

    if (!countdown || !countdown.targetDate) {
      badge.hidden = true;
      return;
    }

    var target = new Date(countdown.targetDate);
    var label = countdown.label || "Ends in";

    function tick() {
      var remaining = target - new Date();
      if (remaining <= 0) {
        badge.hidden = true;
        clearInterval(countdownIntervalId);
        countdownIntervalId = null;
        return;
      }
      badge.hidden = false;
      badge.textContent = label + ": " + formatRemaining(remaining);
    }

    tick();
    countdownIntervalId = setInterval(tick, 60000);
  }

  /**
   * Applies (or clears) the entry-level overrides: hero title/subtitle,
   * primary CTA text/link, and the countdown badge. These fields only
   * ever appear on campaign entries today, so this is a no-op (restores
   * originals) for festivals/default — but it's written generically so a
   * festival entry could set them too, with zero engine changes needed.
   * @param {Object|null} entry the active entry (campaign or festival), if any
   */
  function applyContentOverrides(entry) {
    captureOriginals();

    var titleEl = document.getElementById("heroTitle");
    var subEl = document.getElementById("heroSub");
    var ctaEl = document.getElementById("heroPrimaryCta");

    if (titleEl) {
      titleEl.innerHTML = entry && entry.title ? entry.title : originals.titleHTML;
    }
    if (subEl) {
      subEl.textContent = entry && entry.subtitle ? entry.subtitle : originals.subText;
    }
    if (ctaEl) {
      ctaEl.textContent = entry && entry.ctaText ? entry.ctaText : originals.ctaText;
      ctaEl.setAttribute("href", entry && entry.ctaLink ? entry.ctaLink : originals.ctaHref);
    }

    applyCountdown(entry ? entry.countdown : null);
  }

  /**
   * Applies a theme object's `vars` as CSS custom properties on <html>,
   * stamps `data-theme` on <body> (so CSS can target a theme directly —
   * see the footer accent rule in css/style.css), and syncs the
   * announcement bar + hero decoration + content overrides to match.
   *
   * An entry's own bannerText/bannerIcon (if set — used by both
   * campaigns and by festival-calendar.js entries that share a generic
   * theme) takes priority over the theme's generic `announcement`, since
   * a specific day's message is usually more precise than a shared
   * theme's default greeting.
   * @param {Object} theme
   * @param {string} [source]
   * @param {Object|null} [entry]
   */
  function applyTheme(theme, source, entry) {
    if (!theme || !theme.vars) return;
    var root = document.documentElement;
    Object.keys(theme.vars).forEach(function (key) {
      root.style.setProperty("--" + key, theme.vars[key]);
    });
    if (document.body) {
      document.body.setAttribute("data-theme", theme.id || "default");
    }

    var announcement =
      entry && entry.bannerText
        ? { icon: entry.bannerIcon, text: entry.bannerText }
        : theme.announcement;

    applyAnnouncement(announcement);
    applyHeroDecoration(theme.heroDecoration);
    applyContentOverrides(entry);
  }

  /**
   * Full resolve + apply pass. Safe to call more than once (e.g. after an
   * Admin Panel changes a config value at runtime).
   * @returns {{source: string, entry: Object|null, theme: Object}}
   */
  function init() {
    var active = getActiveTheme();
    applyTheme(active.theme, active.source, active.entry);
    if (typeof CustomEvent === "function") {
      document.dispatchEvent(new CustomEvent("pgtheme:applied", { detail: active }));
    }
    return active;
  }

  window.PGTheme.getActiveTheme = getActiveTheme;
  window.PGTheme.applyTheme = applyTheme;
  window.PGTheme.init = init;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
