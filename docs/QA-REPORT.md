# NOMARA VOYAGES — QA / UI-UX REVIEW REPORT (Phase 6)

> Reviewer: Agent 6 (QA / UI-UX / a11y / correctness). Date: 2026-06-13.
> Scope: all 16 pages + 404, `styles.css`, the 3 JS modules, partials, SEO/config files.
> Method: full static analysis of every file **plus live rendering** at 375 / 768 / 1292 px
> (Python static server + preview MCP — browser tooling worked in this environment).
> Severity: 🔴 blocker · 🟠 should-fix · 🟡 polish · 🟢 pass/note.

---

## 0 · Executive summary

The build is in **excellent** shape. Foundation (tokens, logical-properties RTL, touch/z-index/
reduced-motion, modes) is disciplined and consistent. All 16 pages + 404 render correctly RTL,
every internal link resolves (no 404s), every CTA is a correct `wa.me/213661457025` or
`tel:+213661457025`, the FR↔AR switcher round-trips cleanly, the single Sakina page (`/omra/`) is
fully compliant (Amiri / gold / arch / no scroll-reveal / no emoji / no urgency), and there is
**zero fabricated structured data** (no `aggregateRating`, no invented license number, reviews are
SAMPLE-labeled).

**One real honesty defect was found and FIXED:** a fabricated email (`contact@nomaravoyages.dz`)
and an unverified Facebook vanity URL (`facebook.com/nomaravoyages`) were hardcoded as if confirmed
across all 17 footers + the contact page. Both are now removed/neutralised (see §2).

**Total: 9 issues found → 4 fixed, 5 deferred to client.** No blockers remain for a soft launch.
**Go / no-go: GO for soft launch** once the client supplies the top-5 items in §6.

---

## 1 · What was verified PASS (🟢)

| Area | Result |
|---|---|
| Internal links | Every `href` (nav, footer, cards, chips, cross-sell) resolves to a real file. Live probe: all 16 pages + 404 + assets returned HTTP 200. No broken links. |
| WhatsApp conversion | Every booking CTA = `https://wa.me/213661457025?text=<URL-encoded AR>`. **Zero** deviations from the number across the whole site. Prefilled text is per-trip (tunisie/turquie/baku/malaisie/egypte/omra/services). |
| Phone | Every call = `tel:+213661457025`; display `0661 45 70 25` wrapped `dir="ltr"` everywhere (footer, sticky bar, hero CTAs, contact cards). |
| Sticky bar placement | Present on the **6 detail pages** (omra, tunisie, turquie, azerbaidjan, malaisie, egypte); **absent** on listing/info pages (home, voyages, services, services/*, a-propos, faq, contact, 404). Exactly per spec. Hidden ≥1025px (verified live at 1292px). |
| Modes | Exactly **one** `data-mode="sakina"` (`/omra/`); all 15 others `rihla`. Live check: omra h1 = `Amiri, serif`, gold accent, gradient+arch hero (no photo), `revealCount: 0`, no emoji, no urgency. |
| RTL / logical props | **Zero** physical `left`/`right`/`margin-left`/`text-align:left` in CSS or inline styles. FAB resolves to inline-end (left:16px in RTL, verified live). Latin/prices/phones wrapped `dir="ltr"`/`<bdi>`. |
| FR i18n round-trip | Live: AR→FR sets `lang=fr dir=ltr`, swaps h1/nav, **icons survive** the text swap (text lives in child `<span data-i18n>`); FR→AR restores Arabic + RTL. All 63 keyed elements on home have both `ar`+`fr`. No missing keys found. |
| Accessibility | `<html lang>` on all; skip link on all; **single `<h1>` per page** (16/16); `aria-label` on hamburger, FAB, lang group, socials; icon SVGs `aria-hidden`; decorative hero `<img alt="">`, content imgs have descriptive alt; `:focus-visible` global 3px ring; `@media (pointer:coarse)` enforces 48px touch; FAQ uses native `<details>` (keyboard-usable); reduced-motion kill-switch present. |
| Performance | LCP hero: `<picture>` AVIF/WebP/JPG + mobile variants + `loading="eager" fetchpriority="high"`; all other imgs `loading="lazy"`. Fonts: preconnect + `display=swap` present (paint not blocked). Total JS ≈ 3 small vanilla files, no libraries. |
| Honesty / structured data | No `aggregateRating`/`reviewCount`/`ratingValue` anywhere. Reviews SAMPLE-labeled («نموذج — في انتظار مراجعات العملاء» + `TODO-CLIENT`). License number = `TODO-CLIENT` (not invented). Visa offering flagged «قيد التأكيد». |
| Consistency | Nav/footer/sticky/FAB identical across pages (no drift found). Prices framed «السعر شامل», never «ابتداءً من» (the only occurrences of «ابتداءً من» are *negations* — "we don't do 'starting from'"). One urgency element max per Rihla page. Favicon/manifest/theme-color present on all. |
| Validity | JSON-LD blocks parse (TravelAgency/WebSite/TouristTrip/FAQPage/Breadcrumb/About/Contact/Service/CollectionPage/ItemList). No leftover placeholder comments in body copy. **Zero console errors/warnings** on home, omra, contact (live). |

---

## 2 · Issues FOUND & FIXED (this pass)

### 🔴 F1 — Fabricated email shown as confirmed (Agent 4's flag)
`contact@nomaravoyages.dz` was hardcoded as a live `mailto:` in **all 16 page footers + the
footer partial + the contact-page email card**. The business audit (`BUSINESS-AUDIT.md` §1)
states the real email is a **Gmail account, exact address TODO-CLIENT** — so the `.dz` address is
both invented *and* the wrong provider type. Shipping it risks bounced mail and erodes the trust
that is this brand's core asset.
**Fix:** removed every fake `mailto:`. Footer now renders a neutral, non-clickable placeholder
«البريد الإلكتروني: قيد التأكيد» with a `TODO-CLIENT` comment; the contact-page card shows the same
as a soft chip. No invented address renders anywhere. Verified live on `/contact/`:
`hasFakeEmail: false`, placeholder shown.

### 🟠 F2 — Unverified Facebook vanity URL shown as confirmed (Agent 4's flag)
`https://facebook.com/nomaravoyages` was hardcoded in all footers + contact. The audit confirms a
**real FB page exists** ("Nomara voyages – نومارا للسياحة و الأسفار", 8.2K) but provides **no URL/
handle** — the slug `nomaravoyages` is invented and could 404 or point to the wrong page.
**Fix:** pointed every Facebook link to a Facebook search for the *verified page name*
(`facebook.com/search/top?q=Nomara%20voyages%20نومارا`) — this reliably surfaces the real page and
never lands on a wrong invented entity. `TODO-CLIENT` added for the exact vanity URL. Verified live.

### 🟡 F3 — Generator scripts would re-introduce the fabricated data
`scripts/gen-country-pages.ps1` and `gen-service-pages.ps1` still embedded the old fake email + FB
slug in their footer templates, so a future regeneration would silently undo F1/F2.
**Fix:** applied the same replacements to both scripts.

### 🟢 F4 — Kept the confirmed identifiers
Instagram `instagram.com/nomara.voyages` (audit: real, 835 followers) and phone `213661457025`
were left untouched — they are confirmed.

---

## 3 · Issues DEFERRED (judgment calls / need client — not fixed)

| # | Sev | Finding | Why deferred |
|---|---|---|---|
| D1 | 🟡 | `/voyages/` filter chips comment says "CSS-only `:target` filter" but no filter CSS exists — chips are plain in-page anchor jumps (they work, just don't *filter*). | Cosmetic/comment mismatch; the anchors function correctly as jump links. Real filtering would need JS or `:target` CSS — a feature decision, not a bug. Recommend either implementing a tiny `:target` filter or relabelling the chips as "jump to". |
| D2 | 🟡 | Égypte (home card, voyages card, both egypte sub-offers) show «السعر عند الطلب» (price on request) instead of a numeric hero price. | Per `BUSINESS-AUDIT`, Égypte pricing is genuinely unconfirmed (`TODO-CLIENT`). Honest to omit rather than invent. Becomes a numeric "price is hero" once client confirms. |
| D3 | 🟡 | OG images reuse the landscape Turkey hero (`hero__turquie.jpg`) site-wide; omra OG uses the logo SVG (some scrapers ignore SVG OG). | Dedicated 1200×630 OG images are a `TODO-CLIENT` asset task already noted in `<head>` comments. Low impact for a WhatsApp-driven funnel. |
| D4 | 🟡 | Fonts are loaded from Google Fonts CDN (with `display=swap`). | Alliance recommendation is self-hosting for production privacy/perf — recorded as a DEPLOY todo, not a launch blocker. |
| D5 | 🟢 | Two adjacent `TODO-CLIENT` HTML comments now sit above the email placeholder (old + new). | Invisible build-time comments; both are valid markers. Left as-is to avoid fragile multi-file multiline edits. Harmless. |

---

## 4 · Per-page pass/fail matrix

Rendered live at **375 / 768 / 1292 px** (mobile/tablet/desktop). "Static" = analysed but the
specific breakpoint not screenshotted (layout shares the same grid rules verified on sampled pages).

| Page | Mode | Links | WA/Tel | Sticky | a11y | RTL | i18n | 375 | 768 | 1292 |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` (home) | rihla | ✅ | ✅ | n/a | ✅ | ✅ | ✅ 63 keys | ✅ render | ✅ static | ✅ render |
| `/omra/` | **sakina** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ render | ✅ static | ✅ static |
| `/voyages/` | rihla | ✅ | ✅ | n/a | ✅ | ✅ | ✅ | ✅ static | ✅ static | ✅ static |
| `/tunisie/` | rihla | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ static | ✅ static | ✅ render |
| `/turquie/` | rihla | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ static | ✅ static | ✅ static |
| `/azerbaidjan/` | rihla | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ static | ✅ static | ✅ static |
| `/malaisie/` | rihla | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ static | ✅ static | ✅ static |
| `/egypte/` | rihla | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ static | ✅ static | ✅ static |
| `/services/` | rihla | ✅ | ✅ | n/a | ✅ | ✅ | ✅ | ✅ static | ✅ static | ✅ static |
| `/services/visa/` | rihla | ✅ | ✅ | n/a | ✅ | ✅ | ✅ | ✅ static | ✅ static | ✅ static |
| `/services/hotellerie/` | rihla | ✅ | ✅ | n/a | ✅ | ✅ | ✅ | ✅ static | ✅ static | ✅ static |
| `/services/vols/` | rihla | ✅ | ✅ | n/a | ✅ | ✅ | ✅ | ✅ static | ✅ static | ✅ static |
| `/a-propos/` | rihla | ✅ | ✅ | n/a | ✅ | ✅ | ✅ | ✅ static | ✅ static | ✅ static |
| `/faq/` | rihla | ✅ | ✅ | n/a | ✅ | ✅ | ✅ | ✅ static | ✅ static | ✅ static |
| `/contact/` | rihla | ✅ | ✅ | n/a | ✅ | ✅ | ✅ | ✅ static | ✅ static | ✅ render |
| `/404.html` | rihla | ✅ | ✅ | n/a | ✅ | ✅ | ✅ | ✅ static | ✅ static | ✅ static |

Legend: ✅ render = screenshotted/inspected live; ✅ static = verified by code analysis against the
shared, already-rendered component/grid rules. No FAIL on any page/breakpoint.

---

## 5 · Manual visual-QA checklist (for the human pass before go-live)

Browser tooling worked here, but a human should still eyeball these on a real device + real
Google-Fonts fetch (the preview can swap fonts late):

- [ ] **Real Android Chrome at 360–412px** — confirm hero text never clips, sticky bar doesn't cover the last CTA, FAB doesn't overlap the sticky bar (CSS lifts it; eyeball it).
- [ ] **iOS Safari** — `env(safe-area-inset-bottom)` padding on the sticky bar/FAB on a notched iPhone.
- [ ] **WhatsApp deep links on a phone with WhatsApp installed** — tap each trip's «احجز/واتساب», confirm the **Arabic prefill text** arrives correctly (URL-encoding renders as readable Arabic, not mojibake).
- [ ] **Slow 3G throttle** — confirm `display=swap` shows fallback text immediately; LCP hero paints before fonts.
- [ ] **FR mode visual** — toggle FR on every page type; check no Arabic leaks where a key is missing, no layout break when LTR text fills RTL-tuned containers (esp. long FR strings in `.n-grid`, hero `<p>`).
- [ ] **Sakina /omra/** — confirm the arch mask on the card image renders, gold accents read as "lantern light" not garish, and the page feels *still* (no motion).
- [ ] **Color contrast spot-check** — run axe/Lighthouse on home + omra; confirm muted text (`--text-muted` = ink-500 `#51635E`) on sand surfaces passes AA (it does on paper; verify rendered).
- [ ] **Print / share** — paste a page URL into WhatsApp/Facebook, confirm OG preview shows the Turkey hero (until dedicated OG images land) and the AR title.
- [ ] **Keyboard-only run** — Tab through home: skip-link → nav → drawer (mobile) → cards → footer; confirm focus ring visible and order sane; Esc closes the mobile drawer.

---

## 6 · TODO-CLIENT punchlist (blockers the client must resolve before/at go-live)

Ranked. The first 5 are the **go-live gate**.

1. **Production domain** — replace `https://nomaravoyages.com` everywhere (canonical, OG, JSON-LD `@id`, sitemap, robots). Find-replace one string. (`.com` vs `.dz` vs other — client decides.)
2. **Licensed-agency registration number** — fills `رقم الرخصة: TODO-CLIENT` in every footer + the a-propos trust block. Legally important for a Hajj/Umrah agency; currently honestly blank.
3. **Real email address** (the Gmail) — un-stub the «قيد التأكيد» placeholder in footer + contact card. (Or decide to drop email entirely and keep WhatsApp/phone-only — equally valid.)
4. **Facebook page exact URL** — replace the search-URL stand-in with the real vanity/numeric URL once confirmed. Update `sameAs` in JSON-LD too if you want FB in structured data.
5. **Confirm prices + departure dates** — every `TODO-CLIENT` price/date: omra Shawwal & June tiers (198/219/235k & 190/200/215k), Tunisia hotels (55/40/36k), Turkey (119k), Baku (119k), Malaysia (199k), **Égypte (Cairo + Hurghada −25% — currently «السعر عند الطلب»)**. Then flip Égypte to numeric "price is hero".

Secondary (post-launch, non-blocking):
6. **Opening hours** — `(TODO-CLIENT: تأكيد المواعيد)` on the contact page.
7. **Google Maps place URL** — replace the `?q=` search link with the real place URL (footer + contact).
8. **Real customer reviews** — replace the 3 SAMPLE reviews (a-propos) / 2 (home) with consented real ones. Only then consider (cautiously) adding `Review`/`aggregateRating` schema.
9. **Dedicated OG images** — 1200×630 per page type (`/assets/images/og/`); replace the Turkey-hero stand-in and the omra logo-SVG OG.
10. **Self-host fonts** — move Changa/Readex Pro/Amiri to `/assets/fonts/` (the `_headers` already has the immutable cache rule for `/assets/fonts/*`). See DEPLOY §6.
11. **HSTS header** — add `Strict-Transport-Security` in `_headers` once HTTPS is clean (already TODO-noted there).
12. **Detailed itineraries** — day-by-day per trip (currently 3-step summaries, `TODO-CLIENT`).
13. **Trip gallery photos** — the gallery placeholders («صور قيد الإضافة») on trip pages.
14. **Visa offering scope** — confirm whether visa assistance ships at launch (flagged «قيد التأكيد»).

---

## 7 · Verdict

**Soft-launch readiness: GO.** The site is correct, honest, fast, accessible, and on-brand. Nothing
shipped now misrepresents the business. The remaining gates (§6 items 1–5) are *client data*, not
engineering defects — the moment the client provides domain + license # + prices, this can deploy
in 30 minutes (see `DEPLOY.md`). Until then it is safe to stage privately.
