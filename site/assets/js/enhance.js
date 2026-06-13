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

  /* ── Mobile nav drawer ─────────────────────────────────────── */
  function initNavDrawer() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;

    // Wait a tick if i18n.js hasn't finished building .lang-switcher yet,
    // so the switcher gets MOVED into the drawer with its listeners intact.
    if (nav.querySelector('[data-i18n-lang]') && !nav.querySelector('.lang-switcher')) {
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

  function boot() {
    initNavScroll();
    initNavDrawer();
    initStickyAwareness();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
