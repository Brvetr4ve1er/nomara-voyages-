/**
 * Nomara Voyages — reveal.js
 * Vanilla scroll-reveal engine + lazy-image fade. Replaces AOS (Alliance 4).
 *
 * Reveals [data-reveal] elements once as they enter the viewport:
 * fade in + 24px rise (transform 600ms / opacity 420ms ease-out, CSS-driven
 * via the .is-revealed class — see styles.css [data-reveal] block). P0-5.
 *
 * Also fades in lazy card/gallery images on decode (P0-3): adds .is-loaded
 * on `load`, and immediately for already-`complete` (cached) images. The LCP
 * hero <img> is EXCLUDED (constraint #2 — must paint immediately).
 *
 * Hard no-ops when:
 *   - prefers-reduced-motion: reduce  (shown immediately)
 *   - <body data-mode="sakina">       ("stillness is the design", §07)
 *
 * Supports data-reveal-delay="<ms>" per element.
 * Self-inits on DOMContentLoaded. Exports nothing. No deps.
 */
(function () {
  'use strict';

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isSakina = document.body.dataset.mode === 'sakina';

  function showAll(els) {
    els.forEach(function (el) {
      el.classList.add('is-revealed');
      el.style.willChange = 'auto';
    });
  }

  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    // Sakina pages and reduced-motion users: reveal everything immediately,
    // skip the observer entirely.
    if (reduced || isSakina || !('IntersectionObserver' in window)) {
      showAll(els);
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
        if (delay > 0) {
          el.style.transitionDelay = delay + 'ms';
          // Clear the delay after the transition so re-layout doesn't lag.
          setTimeout(function () { el.style.transitionDelay = ''; }, delay + 680);
        }
        el.classList.add('is-revealed');
        // P0-5: drop the promoted layer once revealed so we never leave
        // will-change alive on dozens of nodes. Wait for the transition to
        // finish so the compositor hint stays useful during the animation.
        setTimeout(function () { el.style.willChange = 'auto'; }, delay + 680);
        obs.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -12% 0px' });

    els.forEach(function (el) { obs.observe(el); });
  }

  /* ── P0-3: lazy-image fade-in ─────────────────────────────────
     Target card/gallery imgs (inside .n-card .img); EXCLUDE the LCP hero
     img (it lives in .hero__media). Sakina + reduced-motion are no-ops at
     the CSS layer (opacity forced to 1), but we still mark loaded so the
     state is consistent. */
  function markLoaded(img) { img.classList.add('is-loaded'); }

  function initImageFade() {
    var imgs = document.querySelectorAll('.n-card .img img');
    imgs.forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) {
        markLoaded(img); // cached / already decoded
      } else {
        img.addEventListener('load', function () { markLoaded(img); }, { once: true });
        // If a source errors, don't leave the card permanently blank.
        img.addEventListener('error', function () { markLoaded(img); }, { once: true });
      }
    });
  }

  function init() {
    initReveal();
    initImageFade();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
