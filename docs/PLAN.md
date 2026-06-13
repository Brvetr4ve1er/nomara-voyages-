# NOMARA VOYAGES — MASTER BUILD PLAN

> Build protocol for the Nomara Voyages website. Fuses the **Alliance Travel playbook**
> (`C:\Users\ROG STRIX\Documents\alliance travel\docs\LESSONS.md` — read it) with the
> **«الرفيق» design system** (`docs/design-system.html` — canonical tokens) and the
> **business audit** (`docs/BUSINESS-AUDIT.md` — canonical content).

## 0 · Architecture decision

**Static vanilla HTML/CSS/JS. No build step. No frameworks. No external JS libraries.**

The design-system doc §10 suggests Next.js + Tailwind; we deliberately override it, because the
Alliance project proved (LESSONS.md §Experience 1–4) that for this exact site profile —
small static catalog, Algerian 3G mobile traffic, WhatsApp checkout, free CDN hosting —
vanilla static ships faster, performs better, and has zero supply-chain/maintenance burden.
Deploy target: Cloudflare Pages (same loop as Alliance: edit → push → live).

### CONFIRMED DECISIONS (locked 2026-06-13)
- **Stack:** vanilla static, no build step, no libraries. Deploy: Cloudflare Pages (domain TODO-CLIENT).
- **Languages:** AR canonical (indexed/default) + FR runtime switcher with AR fallback. One URL space, no `/fr/`.
- **Trip pages:** GROUPED BY COUNTRY (not per-destination). Tunisie = Djerba + Sousse; Égypte = Cairo + Hurghada.
- **Assets:** generate SVG logo from brand desc; reuse Alliance's optimized destination heroes; Umrah = gradient+arch (no fake Mecca stock). All tagged TODO-CLIENT.
- **Pricing/dates:** audit prices used as-is, tagged TODO-CLIENT in trips.json; dates = placeholder "upcoming" chips.
- **Booking:** WhatsApp deep-link + call only. No backend, no form server.
- **Reviews:** structure built, filled with clearly-labeled SAMPLE placeholders + TODO-CLIENT (only 2 real reviews exist — never fabricate).
- **Blog:** skipped at launch. FAQ is the content/SEO surface.
- **Contact:** phone 0661 45 70 25 live; email, hours, license number = TODO-CLIENT.

```
site/
  index.html                ← Home (Rihla, with one Sakina section for Umrah)
  omra/index.html           ← Umrah & Hajj hub (SAKINA mode) — Shawwal + June, tiered hotel grids
  voyages/index.html        ← all-tours catalog + country filter chips (Rihla)
  tunisie/index.html        ← Tunisia (Rihla) — Djerba/Sidi Mansour 55 000 · Sousse Palace 40 000 · Sousse Mantago 36 000
  turquie/index.html        ← Turkey/Istanbul (Rihla)        119 000
  azerbaidjan/index.html    ← Azerbaijan/Baku (Rihla)        119 000
  malaisie/index.html       ← Malaysia (Rihla)               199 000
  egypte/index.html         ← Egypt: Cairo + Hurghada "Collection Mirage" −25% (Rihla)
  services/index.html       ← Services overview — 6 parallel cards (Rihla). Flagships deep-link to /omra & /voyages
  services/visa/index.html      ← Visa assistance (Rihla)
  services/hotellerie/index.html ← Hotel reservation (Rihla)
  services/vols/index.html      ← Flight ticketing (Rihla)
  a-propos/index.html       ← agency + guide (Haddad Youssef Islam) + license + reviews
  faq/index.html            ← visas, payment/deposit, Umrah packing
  contact/index.html        ← phone/WA/address/hours/socials
  404.html
  robots.txt · sitemap.xml · _headers · _redirects · site.webmanifest
  assets/css/styles.css     ← ONE file: tokens → foundation → components → pages
  assets/js/enhance.js      ← nav drawer, sticky bar, FAB, misc UX
  assets/js/reveal.js       ← vanilla scroll-reveal engine (~90 lines, replaces AOS)
  assets/js/i18n.js         ← runtime AR↔FR switcher (strategy c, AR canonical)
  assets/images/…           ← heroes (copied from Alliance pipeline), logo, favicon
data/trips.json             ← single source of truth for trip data
docs/                       ← this plan, audit, design system, QA report
partials/                   ← canonical nav/footer/head snippets pages copy from
```

**Hero reuse map (Alliance → Nomara):** tunisie→`hero__tunisie`, turquie→`hero__istanbul`, azerbaidjan→`hero__azerbaidjan`, malaisie→`hero__kuala-lumpur`, egypte→`hero__cairo-sharm`. Umrah→gradient+arch, no photo.

### Service catalog (the 6 parallel offerings — Aya Booking pattern, B2C-adapted)
| Service (AR / FR) | Pillar | Destination |
|---|---|---|
| عمرة و حج · Omra & Hajj | flagship | → /omra/ (Sakina hub) |
| رحلات منظمة · Voyages Organisés | flagship | → /voyages/ + country pages |
| حجز الفنادق · Hôtellerie | ancillary | /services/hotellerie/ |
| حجز التذاكر · Billetterie / Vols | ancillary | /services/vols/ |
| خدمات التأشيرة · Visa | ancillary | /services/visa/ (mark TODO-CLIENT — Low-confidence offering) |

**Patterns lifted from the Aya Booking teardown** (`docs/the map of the site i want .md`):
- **One reusable service-description block** authored once, reused on Home strip + /services/ overview (single source of copy).
- **Persistent dual CTA** on every major section: primary `احجز مقعدك` + `تواصل واتساب`. Conversion always one tap away.
- **Footer = full contact/trust block:** phone, email, Ghazali/Aïn M'Lila address, IG+FB links, Google Maps link, license line.
- **Clean slug namespace:** `/services/{slug}/` with short FR/AR-neutral slugs; UI labels Arabic-first.
- (NOT lifted: Aya's SPA/auth-gating — Nomara is a public static B2C site.)

## 1 · Non-negotiable conventions (every agent)

1. **Tokens only.** Copy the CSS token block (Layers 1–3) from `docs/design-system.html`
   verbatim to the top of `styles.css`. Zero raw hex outside tokens — the ONLY exception is
   photo-overlay legibility locks (Alliance S5): elements over photographs get
   `background:rgba(0,0,0,.6)!important; color:#fff!important` with a comment.
2. **Logical properties only.** `margin-inline-start`, `inset-inline-end`, `text-align:start`.
   Zero `left/right` in CSS. Phone numbers and Latin names inside Arabic: `dir="ltr"` / `<bdi>`.
3. **Modes:** `<body data-mode="rihla">` everywhere except `/omra/` → `data-mode="sakina"`.
   Never user-toggled. Sakina = Amiri headings, gold accent, arch image mask, NO scroll reveal,
   max ONE arch-framed element per viewport.
4. **Prices are heroes.** Always Changa 700, always visible, دج baseline-aligned at ~40% size,
   always framed "السعر شامل: الطيران + الفندق + المرافقة". Never "starting from".
5. **WhatsApp is checkout.** Every trip CTA → `https://wa.me/213661457025?text=<URL-encoded AR
   message with trip name + date>`. Plus `tel:+213661457025`. Sticky conversion bar on trip
   pages; WhatsApp FAB sitewide lifted via `body:has(.n-sticky-bar)` (Alliance S7).
6. **Foundation before components** (Alliance S4): spacing-8 scale, z-index ladder, touch tokens
   (`--touch-min:48px` enforced via `@media (pointer:coarse)`), reduced-motion kill switch
   (`*{animation-duration:.01ms!important;…}`) — at the TOP of styles.css, day 1.
7. **No AOS, no libraries** (Alliance Experience 4 + DS §10 perf budget). `reveal.js` =
   IntersectionObserver, `data-reveal` attributes, fade + 16px rise, once, 240ms ease-out,
   disabled when `[data-mode="sakina"]` or `prefers-reduced-motion`.
8. **Images:** `<picture>` AVIF+WebP+JPG, mobile variants, `loading="eager" fetchpriority="high"`
   for the LCP hero only, everything else lazy (Alliance S6). Reuse Alliance's already-optimized
   heroes for Istanbul/Baku/Malaysia/Egypt/Tunisia. Sakina/Umrah imagery = CSS gradient + arch
   (per design system §05) — no fake Mecca stock.
9. **i18n strategy (c)** (Alliance S10, inverted for Nomara): **AR is canonical** for SEO,
   French is a runtime switcher (`data-i18n` keys, FR dictionary in i18n.js, missing keys fall
   back to AR). No `/fr/` URL space. Document the trigger to upgrade: >15% FR WhatsApp inbound.
10. **Honesty:** no fabricated license numbers, review counts, or dates — mark `TODO-CLIENT`.
11. **Git:** commit after every deliverable (`git add -A && git commit` from repo root —
    repo is scoped to the project folder). Message prefix `phase-N:`. Never leave work uncommitted.
12. **375px is the audit, not the afterthought** (Alliance Experience 8). Every page must be
    designed mobile-first and verified at 375px.

## 2 · Agent lanes (sequential — Alliance A3: no parallel writes, each commits before next)

| # | Agent / facet | Owns (exclusive while running) | Delivers |
|---|---|---|---|
| 1 | **Foundation** | styles.css, all JS, partials/, assets/images, scaffolding | tokens + foundation CSS, components (§06 reference set), nav drawer (S3), sticky bar, FAB, reveal.js, i18n.js skeleton, logo/favicon SVG, hero images copied |
| 2 | **Pages & trips** (/ux-copy populate) | data/trips.json + data/services.json + all site/**/*.html | all 16 pages + 404, real AR copy drafted from audit, correct modes, prefilled WA links, services catalog |
| 3 | **Copywriting & i18n** (/copywriting) | text inside existing HTML + i18n.js dictionary | voice-table compliance (§09), Sakina vs Rihla registers, microcopy, full FR dictionary |
| 4 | **SEO** | <head> blocks, sitemap/robots/_headers/_redirects/manifest, JSON-LD | AR-canonical meta, OG, TravelAgency/TouristTrip/FAQPage schema, docs/SEO-PLAYBOOK.md |
| 5 | **Animations** (/aos facet, vanilla) | data-reveal attributes, reveal.js tuning, motion CSS | DS §07 motion spec wired on Rihla pages, Sakina stillness verified, reduced-motion verified |
| 6 | **QA / UI-UX review** (/ui-ux-pro-max) | read-everything, fix-anything | 375/768/1440 screenshot review, console/link/contrast audit, fixes, docs/QA-REPORT.md |

## 3 · Definition of done

- All 16 pages + 404 (home, omra, voyages, tunisie, turquie, azerbaidjan, malaisie, egypte, services, services/visa, services/hotellerie, services/vols, a-propos, faq, contact, 404) render correctly RTL at 375px / 768px / 1440px, zero console errors.
- Every trip card + sticky bar opens WhatsApp with correct prefilled AR text.
- `/omra/` is fully Sakina (Amiri, gold, arch, still); all else Rihla.
- FR switcher flips `lang`/`dir` and translates nav + key surfaces; AR fallback works.
- Lighthouse-style sanity: total JS < 60KB, LCP image < 110KB mobile, fonts preconnected.
- sitemap.xml lists all pages; JSON-LD validates; docs complete (PLAN, AUDIT, SEO-PLAYBOOK, QA-REPORT).
