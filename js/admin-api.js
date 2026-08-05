/**
 * admin-api.js
 * ---------------------------------------------------------------------------
 * PHASE 6 — Future Admin Architecture (architecture only, no UI, no backend)
 *
 * This file adds ZERO changes to theme-engine.js, theme-config.js,
 * campaign-config.js, or festival-calendar.js. It's a purely additive layer
 * that a future Admin Panel would call into — every function here either:
 *
 *   (a) reads the existing data structures (window.PGTheme.config /
 *       .campaigns / .festivals) and the existing engine functions
 *       (getActiveTheme / applyTheme / init), or
 *   (b) mutates those same in-memory arrays/objects directly (no new
 *       storage layer), or
 *   (c) is explicitly marked NOT IMPLEMENTED where real persistence
 *       (writing back to these files, or a database/API) is required —
 *       that's out of scope for "architecture only".
 *
 * Nothing in this file is wired into any UI. It exists so that Phase 7+
 * (an actual Admin Panel) has a stable, documented contract to build
 * against, and so the shape of that contract is decided now — while the
 * Theme Engine itself never has to change to accommodate it.
 *
 * Load this AFTER theme-engine.js (it reads window.PGTheme, which
 * theme-engine.js creates/populates).
 *
 * IMPORTANT — in-memory only: every "write" method here (updateCampaign,
 * updateEvent, setCampaignPriority, etc.) mutates the arrays that are
 * already in the page's memory for this session. None of it is saved
 * anywhere — reloading the page reverts to whatever's hardcoded in
 * campaign-config.js / festival-calendar.js. A real Admin Panel needs a
 * persistence step (write back to these files via a build step, or move
 * this data to a database/API) — that is Phase 6+'s next increment, not
 * built here.
 */
(function () {
  window.PGTheme = window.PGTheme || {};
  window.PGTheme.admin = window.PGTheme.admin || {};

  // =========================================================================
  // 1. THEME MANAGER — inspect and (in-memory) adjust theme definitions
  // =========================================================================
  var ThemeManager = {
    /** @returns {Array<{id: string, name: string}>} every registered theme */
    listThemes: function () {
      var config = window.PGTheme.config || {};
      return Object.keys(config).map(function (id) {
        return { id: id, name: config[id].name || id };
      });
    },

    /** @param {string} id @returns {Object|null} the raw theme object */
    getTheme: function (id) {
      var config = window.PGTheme.config || {};
      return config[id] || null;
    },

    /** @returns {{source: string, entry: Object|null, theme: Object}} what's live right now */
    getActiveThemeInfo: function () {
      return window.PGTheme.getActiveTheme ? window.PGTheme.getActiveTheme() : null;
    },
  };

  // =========================================================================
  // 2. CAMPAIGN MANAGER — inspect and (in-memory) edit campaigns
  // =========================================================================
  var CampaignManager = {
    /** @returns {Array<Object>} all campaign entries (live reference — copy before mutating externally) */
    listCampaigns: function () {
      return window.PGTheme.campaigns || [];
    },

    /** @param {string} id @returns {Object|null} */
    getCampaign: function (id) {
      return this.listCampaigns().find(function (c) { return c.id === id; }) || null;
    },

    /**
     * Validates a campaign entry's shape (see the schema doc at the top
     * of campaign-config.js). Read-only — does not mutate anything.
     * @param {Object} entry
     * @returns {{valid: boolean, errors: string[]}}
     */
    validateCampaign: function (entry) {
      var errors = [];
      if (!entry || typeof entry !== "object") return { valid: false, errors: ["entry must be an object"] };
      if (!entry.id) errors.push("id is required");
      if (!entry.themeId) errors.push("themeId is required");

      function isValidDate(str) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(str || "")) return false;
        var d = new Date(str + "T00:00:00");
        return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === str;
      }
      if (!isValidDate(entry.startDate)) errors.push("startDate must be a valid YYYY-MM-DD date");
      if (!isValidDate(entry.endDate)) errors.push("endDate must be a valid YYYY-MM-DD date");
      if (entry.startTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(entry.startTime)) errors.push("startTime must be a valid HH:MM (24h)");
      if (entry.endTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(entry.endTime)) errors.push("endTime must be a valid HH:MM (24h)");
      if (entry.priority != null && (entry.priority < 0 || entry.priority > 100)) errors.push("priority must be 0-100");
      if (entry.themeId && !window.PGTheme.config[entry.themeId]) errors.push("themeId '" + entry.themeId + "' is not a registered theme");
      return { valid: errors.length === 0, errors: errors };
    },

    /**
     * In-memory patch of an existing campaign. NOT PERSISTED — see file
     * header. Returns false if the campaign id doesn't exist.
     * @param {string} id
     * @param {Object} patch fields to shallow-merge onto the campaign entry
     * @returns {boolean} whether the update was applied
     */
    updateCampaign: function (id, patch) {
      var campaign = this.getCampaign(id);
      if (!campaign) return false;
      Object.keys(patch || {}).forEach(function (key) {
        campaign[key] = patch[key];
      });
      return true;
    },

    /** @param {string} id @returns {boolean} */
    enableCampaign: function (id) {
      return this.updateCampaign(id, { enabled: true });
    },

    /** @param {string} id @returns {boolean} */
    disableCampaign: function (id) {
      return this.updateCampaign(id, { enabled: false });
    },
  };

  // =========================================================================
  // 3. EVENT CALENDAR MANAGER — inspect and (in-memory) edit festival-calendar.js entries
  // =========================================================================
  var EventCalendarManager = {
    /**
     * @param {{category?: string}} [filter]
     * @returns {Array<Object>} matching calendar entries
     */
    listEvents: function (filter) {
      var list = window.PGTheme.festivals || [];
      if (filter && filter.category) {
        return list.filter(function (f) { return f.category === filter.category; });
      }
      return list;
    },

    /** @param {string} id @returns {Object|null} */
    getEvent: function (id) {
      return this.listEvents().find(function (f) { return f.id === id; }) || null;
    },

    /**
     * In-memory patch of an existing calendar entry. NOT PERSISTED.
     * @param {string} id
     * @param {Object} patch
     * @returns {boolean}
     */
    updateEvent: function (id, patch) {
      var entry = this.getEvent(id);
      if (!entry) return false;
      Object.keys(patch || {}).forEach(function (key) {
        entry[key] = patch[key];
      });
      return true;
    },

    /**
     * Appends a new calendar entry in-memory. NOT PERSISTED — a real
     * addition needs to also be written into festival-calendar.js so it
     * survives a page reload.
     * @param {Object} entry see the schema doc atop festival-calendar.js
     * @returns {boolean} whether it was added (false if id already exists)
     */
    addEvent: function (entry) {
      if (!entry || !entry.id || this.getEvent(entry.id)) return false;
      window.PGTheme.festivals = window.PGTheme.festivals || [];
      window.PGTheme.festivals.push(entry);
      return true;
    },
  };

  // =========================================================================
  // 4. SCHEDULER — "what's active / what's coming up" facade
  // =========================================================================
  var Scheduler = {
    /** @param {Date} [date] @returns {Object} same shape as getActiveTheme() */
    getActiveNow: function (date) {
      return window.PGTheme.getActiveTheme ? window.PGTheme.getActiveTheme(date) : null;
    },

    /**
     * Lists campaigns and festivals whose window STARTS within the next
     * `days` days (does not include ones already active today). Useful
     * for an admin "what's coming up" view. Read-only.
     * @param {number} [days] defaults to 30
     * @param {Date} [from] defaults to now
     * @returns {Array<{kind: 'campaign'|'festival', id: string, name: string, startsOn: string}>}
     */
    getUpcoming: function (days, from) {
      days = days || 30;
      from = from || new Date();
      var horizon = new Date(from.getTime() + days * 86400000);
      var results = [];

      (window.PGTheme.campaigns || []).forEach(function (c) {
        if (!c.enabled) return;
        var start = new Date(c.startDate + "T00:00:00");
        if (start >= from && start <= horizon) {
          results.push({ kind: "campaign", id: c.id, name: c.name, startsOn: c.startDate });
        }
      });

      // Festivals with a fixed month/day are checked against `from`'s year
      // (and next year, for anything within `days` that crosses New Year).
      [from.getFullYear(), from.getFullYear() + 1].forEach(function (year) {
        (window.PGTheme.festivals || []).forEach(function (f) {
          var mmdd = null;
          if (f.dates && f.dates[year]) mmdd = f.dates[year];
          else if (f.dateRanges && f.dateRanges[year]) mmdd = f.dateRanges[year].start;
          else if (f.month != null && f.day != null) {
            mmdd = String(f.month).padStart(2, "0") + "-" + String(f.day).padStart(2, "0");
          }
          if (!mmdd) return;
          var start = new Date(year + "-" + mmdd + "T00:00:00");
          if (start >= from && start <= horizon) {
            results.push({ kind: "festival", id: f.id, name: f.name, startsOn: year + "-" + mmdd });
          }
        });
      });

      results.sort(function (a, b) { return new Date(a.startsOn) - new Date(b.startsOn); });
      return results;
    },
  };

  // =========================================================================
  // 5. THEME PREVIEW — apply a theme/campaign/festival temporarily, without
  //    changing what's actually scheduled, then revert
  // =========================================================================
  var ThemePreview = {
    _active: false,

    /** @param {string} themeId @returns {boolean} whether preview started */
    previewTheme: function (themeId) {
      var theme = ThemeManager.getTheme(themeId);
      if (!theme || !window.PGTheme.applyTheme) return false;
      window.PGTheme.applyTheme(theme, "preview", null);
      this._active = true;
      return true;
    },

    /** @param {string} campaignId @returns {boolean} */
    previewCampaign: function (campaignId) {
      var campaign = CampaignManager.getCampaign(campaignId);
      if (!campaign) return false;
      var theme = ThemeManager.getTheme(campaign.themeId);
      if (!theme || !window.PGTheme.applyTheme) return false;
      window.PGTheme.applyTheme(theme, "preview", campaign);
      this._active = true;
      return true;
    },

    /** @param {string} festivalId @returns {boolean} */
    previewFestival: function (festivalId) {
      var festival = EventCalendarManager.getEvent(festivalId);
      if (!festival) return false;
      var theme = ThemeManager.getTheme(festival.themeId);
      if (!theme || !window.PGTheme.applyTheme) return false;
      window.PGTheme.applyTheme(theme, "preview", festival);
      this._active = true;
      return true;
    },

    /** Restores whatever is actually scheduled right now. */
    exitPreview: function () {
      if (window.PGTheme.init) window.PGTheme.init();
      this._active = false;
    },

    /** @returns {boolean} whether a preview is currently showing */
    isPreviewing: function () {
      return this._active;
    },
  };

  // =========================================================================
  // 6. PRIORITY MANAGER — inspect/adjust priority, surface collisions
  // =========================================================================
  var PriorityManager = {
    /** @returns {Array<{id: string, name: string, priority: number}>} sorted high to low */
    listCampaignPriorities: function () {
      return CampaignManager.listCampaigns()
        .map(function (c) { return { id: c.id, name: c.name, priority: c.priority || 0 }; })
        .sort(function (a, b) { return b.priority - a.priority; });
    },

    /**
     * @param {string} id
     * @param {number} value 0-100
     * @returns {boolean} whether it was applied (false if out of range or id unknown)
     */
    setCampaignPriority: function (id, value) {
      if (value < 0 || value > 100) return false;
      return CampaignManager.updateCampaign(id, { priority: value });
    },

    /**
     * Finds every stretch of consecutive days in `year` where 2+
     * calendar entries' ACTIVE WINDOWS overlap (not just the same exact
     * date — festivals/national/remembrance days all now have pre/post
     * windows, see festival-calendar.js), and reports which entry wins
     * each stretch. Reuses the engine's own `getMatchingFestivals()` /
     * `getActiveFestival()` day-by-day — this file never re-implements
     * the category/priority resolution rule, so it can never disagree
     * with what the site actually shows.
     * @param {number} year
     * @returns {Array<{startDate: string, endDate: string, entryIds: string[], winnerId: string}>}
     */
    listFestivalCollisions: function (year) {
      var ranges = [];
      var current = null;
      var day = new Date(year, 0, 1);

      while (day.getFullYear() === year) {
        var matches = window.PGTheme.getMatchingFestivals(day);
        if (matches.length > 1) {
          var ids = matches.map(function (m) { return m.id; }).sort();
          var key = ids.join(",");
          var winner = window.PGTheme.getActiveFestival(day);
          var dateStr = day.toISOString().slice(0, 10);

          if (current && current.key === key && current.winnerId === (winner ? winner.id : null)) {
            current.endDate = dateStr;
          } else {
            if (current) ranges.push(current);
            current = { key: key, entryIds: ids, winnerId: winner ? winner.id : null, startDate: dateStr, endDate: dateStr };
          }
        } else if (current) {
          ranges.push(current);
          current = null;
        }
        day.setDate(day.getDate() + 1);
      }
      if (current) ranges.push(current);

      return ranges.map(function (r) {
        return { startDate: r.startDate, endDate: r.endDate, entryIds: r.entryIds, winnerId: r.winnerId };
      });
    },

    /**
     * Finds every calendar entry that NEVER actually wins a single day
     * in `year` — fully overlapped-and-outranked all year by some
     * combination of a wider/earlier-priority neighbor (same category)
     * or a higher-ranked category. This can happen innocently once
     * festivals have multi-day windows: e.g. a festival sandwiched
     * between two others with earlier array position, or a short
     * festival whose entire window falls inside a remembrance day's
     * window. Not necessarily wrong — sometimes the calendar really is
     * that packed — but worth knowing about. Excludes seasonal entries
     * while `seasonalThemesEnabled` is false (they're EXPECTED to never
     * win in that case, not a real collision problem).
     * @param {number} year
     * @returns {string[]} entry ids that never won a single day
     */
    listSilencedEntries: function (year) {
      var winCounts = {};
      (window.PGTheme.festivals || []).forEach(function (f) {
        if (f.category === "seasonal" && !window.PGTheme.seasonalThemesEnabled) return;
        winCounts[f.id] = 0;
      });

      var day = new Date(year, 0, 1);
      while (day.getFullYear() === year) {
        var active = window.PGTheme.getActiveFestival(day);
        if (active && winCounts.hasOwnProperty(active.id)) winCounts[active.id]++;
        day.setDate(day.getDate() + 1);
      }

      return Object.keys(winCounts).filter(function (id) { return winCounts[id] === 0; });
    },
  };

  // =========================================================================
  // 7. ANALYTICS — event shape + hook point only (no backend to send to yet)
  // =========================================================================
  var Analytics = {
    /**
     * Formats a getActiveTheme()-style result into the shape a future
     * analytics backend should receive. Does NOT send anything anywhere —
     * there's no backend to send it to yet. A real implementation would
     * call this from a "pgtheme:applied" listener (see below) and POST
     * the result to an analytics endpoint.
     * @param {{source: string, entry: Object|null, theme: Object}} active
     * @returns {{timestamp: string, source: string, entryId: string|null, themeId: string, themeName: string}}
     */
    formatEvent: function (active) {
      return {
        timestamp: new Date().toISOString(),
        source: active.source,
        entryId: active.entry ? active.entry.id : null,
        themeId: active.theme.id,
        themeName: active.theme.name,
      };
    },

    /**
     * NOT IMPLEMENTED — requires a backend/analytics endpoint to send to.
     * Documented here so the call site is decided: a future implementation
     * would replace this function body with a `fetch()`/`sendBeacon()` call.
     * @param {Object} formattedEvent see formatEvent()
     */
    trackEvent: function (formattedEvent) {
      // Intentionally a no-op placeholder. See docstring.
    },
  };

  // =========================================================================
  // 8. HISTORY — in-memory audit trail of theme changes this session
  // =========================================================================
  // Safe to actually implement (no backend/DB involved — it's just an
  // array in memory, lost on reload) by listening to the engine's existing
  // "pgtheme:applied" event. Zero changes to theme-engine.js needed.
  var HISTORY_LIMIT = 50;
  var historyLog = [];

  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("pgtheme:applied", function (event) {
      var active = event.detail;
      if (!active) return;
      historyLog.push(Analytics.formatEvent(active));
      if (historyLog.length > HISTORY_LIMIT) historyLog.shift();
    });
  }

  var History = {
    /**
     * @returns {Array<Object>} up to the last HISTORY_LIMIT theme changes
     *   this session, oldest first. Cleared on page reload — a future
     *   implementation that needs it to survive a reload must persist
     *   this to a backend/database.
     */
    getHistory: function () {
      return historyLog.slice();
    },

    /** Clears the in-memory log (does not affect any future persistence layer). */
    clearHistory: function () {
      historyLog = [];
    },
  };

  // =========================================================================
  window.PGTheme.admin = {
    ThemeManager: ThemeManager,
    CampaignManager: CampaignManager,
    EventCalendarManager: EventCalendarManager,
    Scheduler: Scheduler,
    ThemePreview: ThemePreview,
    PriorityManager: PriorityManager,
    Analytics: Analytics,
    History: History,
  };
})();
