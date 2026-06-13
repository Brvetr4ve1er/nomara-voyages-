/**
 * Nomara Voyages — enhance.js
 * Site UX enhancements. Vanilla, no deps. Loaded with `defer`.
 *
 *   - Mobile nav drawer (Alliance S3): MOVES (not clones) .nav-links,
 *     .lang-switcher and .nav-cta into a fixed slide-in panel so their
 *     event listeners survive. Backdrop, body scroll-lock, Esc to close,
 *     close on link tap, focus management.
 *   - .site-nav gets .is-scrolled after 8px of scroll.
 *   - FAB / sticky-bar lift is handled in CSS via body:has(.n-sticky-bar)
 *     (Alliance S7); JS only ensures the FAB sits above the bar when both
 *     exist and keeps the bar in sync if it's injected late.
 *
 * Respects prefers-reduced-motion (transitions are killed in CSS).
 */
(function () {
  'use strict';

  /* Re-sync .lang-switcher active state to the live <html lang> within a
     scope. Mirrors i18n.applyLang's sync without touching its strategy or
     dictionary — used after the switcher is moved into the drawer. */
  function syncLangSwitcher(scope) {
    var root = scope || document;
    var lang = document.documentElement.getAttribute('lang') || 'ar';
    root.querySelectorAll('.lang-switcher [data-i18n-lang]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-i18n-lang') === lang);
    });
  }

  /* ── Mobile nav drawer ─────────────────────────────────────── */
  var navDrawerRetries = 0;
  function initNavDrawer() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;

    // Defensive ordering guard: i18n.js wires (does NOT build) the static
    // .lang-switcher. In normal markup the switcher is already present, so
    // we move straight through. If a page emits the lang buttons before
    // their .lang-switcher wrapper, wait a tick so the WHOLE wrapper (with
    // its surviving listeners) gets MOVED into the drawer — never split.
    // Capped so a malformed page can never loop forever.
    if (nav.querySelector('[data-i18n-lang]') &&
        !nav.querySelector('.lang-switcher') &&
        navDrawerRetries < 10) {
      navDrawerRetries++;
      return setTimeout(initNavDrawer, 50);
    }

    /* 1. Toggle button (hamburger) — expected to exist in the markup, but
          create it if a page forgot to include it. */
    var toggle = nav.querySelector('.nav-toggle');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.className = 'nav-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-label', 'القائمة');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', 'nav-drawer');
      toggle.innerHTML =
        '<svg class="icon-menu" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
        '<svg class="icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      nav.appendChild(toggle);
    }

    /* 2. Drawer container */
    var drawer = nav.querySelector('.nav-drawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.className = 'nav-drawer';
      drawer.id = 'nav-drawer';
      drawer.setAttribute('role', 'dialog');
      drawer.setAttribute('aria-modal', 'true');
      drawer.setAttribute('aria-label', 'قائمة التنقّل');
      drawer.setAttribute('aria-hidden', 'true');

      // MOVE (not clone) the right-side controls in so listeners survive.
      ['.nav-links', '.lang-switcher', '.nav-cta'].forEach(function (sel) {
        var el = nav.querySelector(':scope > ' + sel);
        if (el) drawer.appendChild(el);
      });
      nav.appendChild(drawer);

      // The switcher now lives inside .nav-drawer. Re-sync its active state
      // to the language i18n already applied (covers the case where i18n
      // ran applyLang() before this move, or markup shipped a stale flag).
      // NOMARA_setLang re-syncs on every later switch via a global
      // descendant selector, so in-drawer switching stays correct too.
      syncLangSwitcher(drawer);
    }

    /* 3. Backdrop */
    var backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);
    }

    /* 4. Open / close */
    function setOpen(open) {
      nav.classList.toggle('nav-open', open);
      backdrop.classList.toggle('is-visible', open);
      document.body.classList.toggle('nav-scroll-lock', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'القائمة');
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');

      if (open) {
        var first = drawer.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
        requestAnimationFrame(function () { if (first) first.focus({ preventScroll: true }); });
      } else {
        toggle.focus({ preventScroll: true });
      }
    }

    /* 5. Wire events */
    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('nav-open'));
    });
    backdrop.addEventListener('click', function () { setOpen(false); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) setOpen(false);
    });

    // Close when a nav LINK is tapped, but keep the drawer open for the
    // lang-switcher so users can switch language without it disappearing.
    drawer.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (link && !link.closest('.lang-switcher')) {
        setTimeout(function () { setOpen(false); }, 180);
      }
    });

    // Close if the viewport widens past the breakpoint while open.
    var resizeRaf;
    window.addEventListener('resize', function () {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(function () {
        if (window.innerWidth > 900 && nav.classList.contains('nav-open')) setOpen(false);
      });
    });
  }

  /* ── Theme toggle (dark / light) ───────────────────────────────
     The anti-FOUC inline script in <head> has ALREADY set
     document.documentElement[data-theme] before paint. This only wires
     the toggle button, persists the choice, and keeps the system-theme
     listener alive for users who have not made an explicit choice.
     Storage key + values are fixed by the shared contract:
       localStorage 'nomara-theme' -> 'light' | 'dark'. */
  var THEME_KEY = 'nomara-theme';

  function themeStore() {
    return {
      get: function () { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } },
      set: function (v) { try { localStorage.setItem(THEME_KEY, v); } catch (e) {} }
    };
  }

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  // Remember the page's authored (light) theme-color so we can restore the
  // brand chrome exactly, instead of guessing a generic light value.
  var lightThemeColor = (function () {
    var m = document.querySelector('meta[name="theme-color"]');
    return m ? m.getAttribute('content') : null;
  })();

  function applyTheme(theme) {
    var html = document.documentElement;
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      // light is the absence of the attribute (contract default)
      html.removeAttribute('data-theme');
    }
    // Keep <meta name="theme-color"> in step (nice-to-have, defensive).
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta && lightThemeColor != null) {
      meta.setAttribute('content', theme === 'dark' ? '#0f1419' : lightThemeColor);
    }
  }

  function initThemeToggle() {
    var btn = document.querySelector('button[data-theme-toggle]');
    if (!btn) return; // no-op if the page omitted the button

    var store = themeStore();

    function syncButton(theme) {
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }

    // Reflect the state the anti-FOUC script already painted.
    syncButton(currentTheme());

    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      syncButton(next);
      store.set(next); // explicit choice — stops the system listener below
    });

    // Re-apply the OS theme on change, but ONLY while the user has made no
    // explicit choice (no stored value). Once they click, their choice wins.
    var mq;
    try { mq = window.matchMedia('(prefers-color-scheme: dark)'); } catch (e) { mq = null; }
    if (mq) {
      var onSystemChange = function (e) {
        if (store.get()) return; // user has chosen — ignore OS changes
        var sys = e.matches ? 'dark' : 'light';
        applyTheme(sys);
        syncButton(sys);
      };
      if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', onSystemChange);
      } else if (typeof mq.addListener === 'function') {
        mq.addListener(onSystemChange); // older Safari
      }
    }
  }

  /* ── Nav shadow on scroll ──────────────────────────────────── */
  function initNavScroll() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;
    var ticking = false;
    function update() {
      ticking = false;
      nav.classList.toggle('is-scrolled', (window.scrollY || 0) > 8);
    }
    update();
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
  }

  /* ── FAB ⇄ sticky-bar coexistence ──────────────────────────────
     The lift itself is pure CSS (body:has(.n-sticky-bar), Alliance S7).
     This only guarantees body carries a marker class for browsers/older
     selectors and keeps the FAB visible. Safe no-op when absent. */
  function initStickyAwareness() {
    var hasBar = !!document.querySelector('.n-sticky-bar');
    document.body.classList.toggle('has-sticky-bar', hasBar);
  }

  /* ── One-shot load-in entrances (P0-4 hero text, P1-5 FAB + sticky) ──
     CSS owns the actual animation; JS just flips two marker classes after
     first paint so the entrances fire ONCE on load (not on scroll). Both
     entrances are CSS no-ops under Sakina (overlay stillness is forced) and
     under reduced-motion (the global kill switch zeroes the durations), so
     this is safe to run unconditionally. We add the classes on the next
     frame so the initial (hidden) state is painted first and the transition
     actually plays. */
  function initEntrances() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        // P0-4: hero text-overlay entrance (image untouched).
        if (document.querySelector('.hero__inner')) {
          document.body.classList.add('hero-ready');
        }
        // P1-5: FAB fade+rise and sticky-bar slide-up.
        document.body.classList.add('chrome-ready');
      });
    });
  }

  /* ── PWA service worker — offline shell + fast repeat visits on mobile.
     The worker keeps HTML network-first (always fresh online) and SWRs
     static assets; registered after load so it never competes with paint. */
  function initServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    function register() {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    }
    // Register when the browser is idle (after first paint) rather than on
    // `load` — `load` can stall indefinitely behind slow third-party fonts and
    // never fire, which would silently skip registration.
    if ('requestIdleCallback' in window) {
      requestIdleCallback(register, { timeout: 3000 });
    } else {
      setTimeout(register, 1200);
    }
  }

  function boot() {
    initServiceWorker();
    initThemeToggle();
    initNavScroll();
    initNavDrawer();
    initStickyAwareness();
    initEntrances();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
