/* Nomara Voyages — service worker.
   Alliance lessons baked in:
     #9 precache "/" only (atomic addAll never 404s the whole install).
     #8 bump CACHE when bytes change at a stable path (styles.css, *.js).
   Strategy:
     - HTML navigations  -> network-first (always fresh while online),
                            fall back to cache, then to "/" (offline shell).
     - same-origin static -> stale-while-revalidate (fast + self-healing).
     - cross-origin (Google Fonts/CDN) -> passthrough (HTTP cache handles it).
   No opaque-response caching; no aggressive HTML caching (avoids the
   "why didn't my change show" footgun during iteration). */
'use strict';

var CACHE = 'nomara-v1';

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.add('/'); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          if (k !== CACHE) return caches.delete(k);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return; // fonts/CDN: leave to network

  // HTML navigations: network-first so pages stay fresh; cache as offline shell.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (r) { return r || caches.match('/'); });
      })
    );
    return;
  }

  // Same-origin static assets: stale-while-revalidate.
  e.respondWith(
    caches.match(req).then(function (cached) {
      var network = fetch(req).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return cached; });
      return cached || network;
    })
  );
});
