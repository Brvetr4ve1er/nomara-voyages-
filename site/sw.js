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

/* #11: BUMP this on every release (unhashed asset paths have no other
   eviction path). A date/build stamp guarantees activate() purges old caches
   so PWA users never get stranded on a stale styles.css / *.js. */
var CACHE = 'nomara-2026-06-14';

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

  // #8: only cache real, non-redirected 200s. Cache.put() THROWS a TypeError
  // on redirected responses (Netlify trailing-slash 301s are common) and we
  // never want a 404/500 stored as the offline shell — so guard + swallow.
  function cachePut(request, res) {
    if (!res || !res.ok || res.redirected) return;
    var copy = res.clone();
    caches.open(CACHE).then(function (c) { c.put(request, copy); }).catch(function () {});
  }

  // HTML navigations: network-first so pages stay fresh; cache as offline shell.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        cachePut(req, res);
        return res;
      }).catch(function () {
        return caches.match(req).then(function (r) {
          return r || caches.match('/').then(function (shell) {
            return shell || Response.error();
          });
        });
      })
    );
    return;
  }

  // #20: CSS/JS are unhashed and governed by must-revalidate headers, so SWR
  // would pin one stale paint on installed PWAs. Serve them network-first
  // (fall back to cache offline) and reserve stale-while-revalidate for the
  // truly immutable image assets.
  var networkFirst = /\/assets\/(css|js)\//.test(url.pathname);
  if (networkFirst) {
    e.respondWith(
      fetch(req).then(function (res) {
        cachePut(req, res);
        return res;
      }).catch(function () {
        return caches.match(req).then(function (r) { return r || Response.error(); });
      })
    );
    return;
  }

  // Other same-origin static assets (images, fonts, manifest): stale-while-revalidate.
  e.respondWith(
    caches.match(req).then(function (cached) {
      var network = fetch(req).then(function (res) {
        cachePut(req, res);
        return res;
      }).catch(function () { return cached; });
      // #21: never resolve respondWith to undefined (offline + uncached).
      return cached || network.then(function (r) { return r || Response.error(); });
    })
  );
});
