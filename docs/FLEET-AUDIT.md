# Nomara Voyages — Fleet Audit (2026-06-14)

10 parallel reviewer agents (a11y, perf, SEO, CSS, JS, HTML, UX, i18n, config,
consistency) + 1 synthesis agent. 76 raw findings → **46 verified, deduped
issues**, ranked critical-first. Status legend: ✅ fixed this pass · ⛔ blocked
on client data · ⬜ open (recommended next).

## Critical
| # | Status | Issue | File |
|---|--------|-------|------|
| 1 | ⛔ | Literal `TODO-CLIENT` rendered as footer license number (15 pages) | site/index.html:595 +14 |
| 2 | ⛔ | Placeholder domain `nomaravoyages.com` hardcoded in canonical/OG/JSON-LD/sitemap/robots/sw | all pages + sitemap.xml + robots.txt + sw.js |

## High
| # | Status | Issue | File |
|---|--------|-------|------|
| 3 | ⛔ | Visible `قيد التأكيد` / `(TODO-CLIENT: …)` copy (visa, contact, a-propos, email, testimonials) | visa:163,170; contact:208; index:502,506,549 |
| 4 | ✅ | JSON-LD streetAddress `حي غزالي` ≠ visible `حي الغزالي` → fixed to match (15 pages) | index.html:63 +14 |
| 5 | ⛔ | Email shown `قيد التأكيد`; visa card provisional | index.html:549; visa card |
| 6 | ⬜ | Map-link text never matches i18n key → stays Arabic in FR | contact:203; i18n.js:489 |
| 7 | ⬜ | WhatsApp `?text=` baked Arabic, never localized to FR (11 pages) | index.html:166 +10 |
| 8 | ✅ | SW navigate branch cached redirects/non-200; `put` could throw uncaught | sw.js:45-56 |
| 9 | ✅ | Skip-link target `<main>` not focusable → added `tabindex="-1"` (16 pages) + `main:focus{outline:none}` | all pages |
| 10 | ✅ | Drawer `aria-modal` had no focus trap / no background inert → added both | enhance.js |
| 11 | ✅ | SW CACHE frozen `nomara-v1` → date-stamped, purges on release | sw.js:14 |
| 12 | ⬜ | LCP hero image not preloaded | index.html head |
| 13 | ⬜ | Google Fonts fully render-blocking; no async swap | partials/head.html:15 |
| 14 | ✅ | Trip cards: two equal CTAs → WhatsApp now dominant, details demoted to outline | styles.css card cta-row |
| 15 | ⬜ | Generators emit stale `maps.google.com` (reverts live link) | gen-*.ps1 |
| 16 | ⬜ | Re-running generators wipes per-page SEO | gen-*.ps1 |
| 17 | ⛔ | robots.txt + sitemap hardcode unconfirmed domain | robots.txt:11; sitemap.xml |

## Medium
| # | Status | Issue | File |
|---|--------|-------|------|
| 18 | ✅ | nav backdrop (z 100) under fixed top bar (z 500) → added `--z-backdrop:590` | styles.css:198,841 |
| 19 | ✅ | `will-change` on every `[data-reveal]` at parse → scoped to `:not(.is-revealed)` | styles.css reveal |
| 20 | ✅ | SW SWR overrode must-revalidate for CSS/JS → now network-first | sw.js |
| 21 | ✅ | SW could resolve `respondWith` to `undefined` offline → `Response.error()` fallback | sw.js |
| 22 | ⬜ | Empty `<a class="img">` Omra cross-sell card (blank gradient tile) | tunisie:327; turquie:298 |
| 23 | ⬜ | Heading skip h2→h4 on home/trip card titles | index.html cards |
| 24 | ⬜ | `aria-controls="nav-drawer"` references id that doesn't exist pre-JS | partials/nav.html:44 |
| 25 | ✅ | Eyebrow teal-600 12px fails 4.5:1 → teal-700 (`--color-primary-strong`) | styles.css:1137 |
| 26 | ✅ | Footer legal + disabled labels used untuned `--ink-300` in dark → re-pointed | styles.css dark root |
| 27 | ⬜ | Home star rating uses `n-chip` (no aria), inconsistent w/ trip `n-stars` | index.html:202 |
| 28 | ✅ | Hero 420px floor clipped CTAs on short portrait → `@media (max-height:600px)` relief | styles.css hero |
| 29 | ✅ | Invalid schema `priceRange:"DZD"` → `"$$"` (15 pages) | index.html:59 +14 |
| 30 | ⛔ | og:image is 1600×900 hero, not branded 1200×630; og-default never created | head |
| 31 | ⛔ | No hreflang/x-default despite AR↔FR switcher (scope decision) | head; sitemap |
| 32 | ⬜ | TravelAgency+WebSite JSON-LD duplicated verbatim on all 16 pages | all pages |
| 33 | ⬜ | Lang switcher exposes no `aria-pressed`; `lang.ar/fr` keys dead | partials/nav.html:27 |
| 34 | ✅ | initNavDrawer double-binds listeners on re-init → one-time `dataset.drawerWired` guard | enhance.js |
| 35 | ✅ | Drawer focus-on-open could target hidden/none → visible-only query + drawer fallback | enhance.js |
| 36 | ⬜ | Footer `العنوان` heading missing data-i18n (dead `footer.addressTitle`) | footer (15 pages) |
| 37 | ✅ | Manifest icons `any maskable` on same art → set `any` (avoids mask clip) | site.webmanifest |
| 38 | ⛔ | HSTS commented (deliberate deploy gate — enable once final domain serves HTTPS) | _headers:41 |
| 39 | ⬜ | FR translations drop clauses present in Arabic source | i18n.js:644,651-653 |
| 40 | ⬜ | Footer tagline + a-propos intro hardcoded, never translate | index.html:544; a-propos:174 |
| 41 | ⬜ | aria-label/title/alt Arabic-only; data-i18n-aria handlers exist but unused | chrome controls; i18n.js:834 |
| 42 | ⬜ | partials/nav.html drift vs shipped pages (CTA i18n key) | partials/nav.html:32 |

## Low
| # | Status | Issue | File |
|---|--------|-------|------|
| 43 | ⬜ | Decorative ★ glyphs not aria-hidden inside labelled n-stars | tunisie:209,214,219 |
| 44 | ⬜ | robots.txt names Cloudflare but deploy is Netlify; trailing-slash 404 risk | robots.txt:9 |
| 45 | ⬜ | Home card title non-clickable (inconsistent w/ trip related cards) | index.html:198 |
| 46 | ✅ | FAB + sticky bar stack two WhatsApp CTAs on mobile → FAB hidden where bar shows | styles.css FAB |

## Design pass (ui-ux-pro-max + aos)
- **AOS-style motion without the library.** Extended the existing vanilla
  `[data-reveal]` engine with directional/zoom variants (`fade-up/down/left/right`,
  `zoom-in/out`, `flip-up`) keyed off the attribute value — full AOS catalog,
  zero JS/library weight, RTL-aware sign flip, gentle `--ease-spring` overshoot.
  Inherits all existing reduced-motion / Sakina / `scripting:none` safety nets.
  *(reveal.js deliberately replaced AOS for perf — re-adding the CDN would undo
  that; this keeps the perf win and adds the effect richness.)*
- Applied variants on the homepage: section heads `fade-up`, trip cards
  `fade-up` (staggered), service cards `zoom-in` (staggered).
- CTA hierarchy, eyebrow contrast, dark footer tokens, FAB/sticky de-dup,
  short-viewport hero (see ✅ rows above).

## Client-data blockers (cannot fix without real values)
Final domain · license number · contact email · branded 1200×630 OG image ·
real testimonials · FR-page/hreflang scope decision · HSTS enable (post-domain).
