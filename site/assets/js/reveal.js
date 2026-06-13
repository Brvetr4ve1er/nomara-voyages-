/**
 * Nomara Voyages — reveal.js
 * Vanilla scroll-reveal engine. Replaces AOS (Alliance lesson 4).
 *
 * Reveals [data-reveal] elements once as they enter the viewport:
 * fade in + 16px rise, 240ms ease-out (CSS-driven via the .is-revealed
 * class — see styles.css [data-reveal] block).
 *
 * Hard no-ops when:
 *   - prefers-reduced-motion: reduce  (elements shown immediately)
 *   - <body data-mode="sakina">       ("stillness is the design", §07)
 *
 * Supports data-reveal-delay="<ms>" per element.
 * Self-inits on DOMContentLoaded. Exports nothing. No deps.
 */
(function () {
  'use strict';

  function showAll(els) {
    els.forEach(function (el) { el.classList.add('is-revealed'); });
  }

  function init() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    var reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isSakina = document.body.dataset.mode === 'sakina';

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
          setTimeout(function () { el.style.transitionDelay = ''; }, delay + 280);
        }
        el.classList.add('is-revealed');
        obs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    els.forEach(function (el) { obs.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
