/**
 * Nomara Voyages — track.js
 * Privacy-light conversion tracking. NO cookies, NO PII, no library, no backend.
 *
 * Captures the funnel's only real conversion events — clicks on WhatsApp, the
 * phone (tel:), and the Google-Maps link — and:
 *   1. pushes them to window.dataLayer (GTM-compatible, harmless if unused),
 *   2. dispatches a `nomara:convert` DOM event (for any listener),
 *   3. forwards to Cloudflare Web Analytics if its beacon is loaded,
 *   4. POSTs a sendBeacon to window.NOMARA_BEACON if one is configured.
 *
 * No-op-safe: with no analytics wired it just fills dataLayer (useful for QA).
 * Loaded with `defer`. Delegated listener → works for cards injected later.
 */
(function () {
  'use strict';
  window.dataLayer = window.dataLayer || [];

  function track(type, href) {
    var payload = { event: 'nomara_convert', type: type, page: location.pathname, ts: Date.now() };
    window.dataLayer.push(payload);
    try {
      document.dispatchEvent(new CustomEvent('nomara:convert', { detail: { type: type, href: href, page: payload.page } }));
    } catch (e) {}
    // Cloudflare Web Analytics custom event (only if its beacon is present)
    if (window.__cfBeacon && typeof window.cloudflare === 'object' &&
        window.cloudflare && typeof window.cloudflare.trackEvent === 'function') {
      try { window.cloudflare.trackEvent('convert_' + type); } catch (e) {}
    }
    // Optional first-party beacon endpoint (set window.NOMARA_BEACON to enable)
    if (window.NOMARA_BEACON && navigator.sendBeacon) {
      try { navigator.sendBeacon(window.NOMARA_BEACON, JSON.stringify(payload)); } catch (e) {}
    }
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me') !== -1 || href.indexOf('api.whatsapp') !== -1) track('whatsapp', href);
    else if (href.indexOf('tel:') === 0) track('call', href);
    else if (href.indexOf('maps.app.goo.gl') !== -1 || href.indexOf('maps.google') !== -1) track('map', href);
  }, { passive: true, capture: true });
})();
