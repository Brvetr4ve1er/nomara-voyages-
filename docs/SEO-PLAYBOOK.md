# NOMARA VOYAGES — SEO & DEPLOY-INFRA PLAYBOOK

> **Lane 4 deliverable** (per `docs/PLAN.md` §2). Authored alongside the active page-build lane
> **without touching any page HTML** — so it covers the file-based SEO/deploy infra and provides
> *ready-to-paste* per-page `<head>` blocks for the page lane to apply, rather than editing pages directly.
>
> Canonical inputs: `docs/BUSINESS-AUDIT.md` (content/NAP), `docs/design-system.html` (brand), `docs/PLAN.md` (decisions).
> Keyword terms web-validated June 2026. Structured data self-validated against schema.org.

## 0 · What shipped vs. what the page lane still applies

**Shipped in this lane (new files, zero overlap with page HTML):**

| File | Purpose | State |
|---|---|---|
| `site/robots.txt` | crawl-all + sitemap pointer | ✅ done |
| `site/sitemap.xml` | 15 indexable URLs (404 excluded) | ✅ done |
| `site/_headers` | Cloudflare Pages: caching + security headers | ✅ done |
| `site/_redirects` | Cloudflare Pages: 301 canonical aliases | ✅ done |
| `docs/SEO-PLAYBOOK.md` | this document | ✅ done |

**Still to apply by the PAGE lane** (into the `<!-- SEO: … (Agent 4) -->` slot of each page's `<head>`,
i.e. the placeholder already present in `partials/head.html`). Deliberately *not* applied here to avoid
colliding with the in-progress page edits:

1. **§3 per-page meta & Open Graph** — one block per page.
2. **§4 JSON-LD structured data** — `TravelAgency` + `WebSite` sitewide, plus per-page `TouristTrip` /
   `BreadcrumbList` / `FAQPage` / `Person` as noted per page.

> Apply order per page: paste the §3 meta block first, then the relevant §4 `<script type="application/ld+json">`
> block(s) immediately after, all inside `<head>` after the existing partial.

## 1 · Locked SEO decisions (do not re-litigate)

- **AR is canonical**, indexed, default (`<html lang="ar" dir="rtl">`). **FR is a runtime switcher only** —
  single URL space, **no `/fr/` paths → NO `hreflang`, no per-URL `inLanguage` split.** FR keyword capture
  rides on mixed-script on-page copy (see §2), not alternate URLs.
- **Domain is a placeholder.** `https://nomaravoyages.com` appears in robots, sitemap, every canonical, every
  `og:url`, and every JSON-LD `@id`/`url`/`item`. **Find-replace at deploy** (see §6). `TODO-CLIENT`.
- **All prices are `TODO-CLIENT`** (audit-observed, not client-confirmed). Egypt price is genuinely `null` → no offer emitted.
- **`404.html` is excluded from the sitemap** (Cloudflare Pages serves it automatically).
- **CSP ships Report-Only** at launch (pages have inline scripts) — and with **no reporting endpoint**, so it's a
  console-only smoke test, not collected monitoring. Enforced CSP needs per-request nonces (a Pages Function), which
  conflicts with the no-build/no-backend lock → Report-Only is the realistic ceiling. See §5.
  **HSTS is added at deploy**, not now (placeholder domain).
- **Caching defaults on `/*`** so every pretty-URL directory page (`/omra/`, `/contact/`, …) revalidates; the old
  `/*.html` + `/` rules silently missed 13 of 15 pages (C1 fix). Asset rules under `/assets/*` override. See §5.
- **Honesty:** license number, email, exact Facebook URL, exact departure dates, final prices, and the
  visa offering = `TODO-CLIENT`. Never fabricated. The OG image + brand logo/og assets are `TODO-CLIENT`.

---

## 2 · Keyword & content map

> Grounded in BUSINESS-AUDIT.md §6. Terms web-validated (June 2026) against live Algerian SERPs and agency listings. Algeria is a Franco-Arabic code-mixing market: indexed copy is Arabic-canonical, but French and Latin-script brand/destination tokens ("Voyage Organisé", "Djerba", "Bakou", "Omra") are how a huge share of buyers actually type — so the AR `<h1>`/body must carry the AR keyword while the visible Latin destination word and the `<title>`/`alt`/anchor text deliberately echo the FR token. No `/fr/` URL space exists (strategy c), so FR keywords are won via mixed-script on-page copy, not separate pages.

### 2.1 · The 15-page keyword table

| Page | Primary keyword (AR) | Primary keyword (FR) | Secondary terms (AR + FR + code-mix) | Intent |
|---|---|---|---|---|
| `/` Home | نومارا للسياحة والأسفار | Nomara Voyages agence | وكالة سياحة وأسفار عين مليلة · رحلات منظمة من قسنطينة · عمرة ورحلات سياحية · voyage organisé Constantine · "Travel Like a Nomad" · حداد يوسف إسلام | Mixed (brand/navigational + transactional) |
| `/omra/` Umrah & Hajj hub | عمرة من مطار قسنطينة 2026 | Omra Constantine prix 2026 | أسعار عمرة 2026 الجزائر · عمرة شوال · عمرة جوان (16 جوان) · عمرة طيران مباشر قسنطينة · فنادق قرب الحرم · خدمات الحج · Omra vol direct Constantine · عمرة شاملة الطيران والفندق والمرافقة | Transactional |
| `/voyages/` Tours catalog | رحلات منظمة من الجزائر 2026 | voyage organisé depuis Constantine | برامج سياحية · رحلة منظمة عائلية · عروض سفر الجزائر · voyage organisé Algérie 2026 · circuits depuis Constantine · سفر من قسنطينة | Transactional |
| `/tunisie/` Tunisia | رحلة منظمة إلى تونس من قسنطينة | voyage organisé Djerba / Sousse | جربة سيدي منصور · سوسة · أسعار رحلة تونس 2026 · رحلة تونس عائلية · voyage organisé Tunisie prix · séjour Djerba depuis Constantine · من 36000 دج شامل | Transactional |
| `/turquie/` Turkey/Istanbul | رحلة منظمة إلى تركيا اسطنبول | voyage organisé Istanbul depuis Constantine | اسطنبول · أسعار رحلة تركيا 2026 · رحلة اسطنبول 8 أيام · circuit Istanbul prix DZD · séjour Turquie Constantine · 119000 دج شامل الطيران والفندق | Transactional |
| `/azerbaidjan/` Azerbaijan/Baku | رحلة منظمة إلى أذربيجان باكو | voyage organisé Bakou Azerbaïdjan | باكو · رحلة أذربيجان من الجزائر · فيزا أذربيجان إلكترونية · e-visa Azerbaïdjan · offre spéciale Bakou · 119000 دج | Transactional |
| `/malaisie/` Malaysia | رحلة منظمة إلى ماليزيا | voyage organisé Malaisie depuis Algérie | كوالالمبور · رحلة ماليزيا من قسنطينة · سياحة ماليزيا · circuit Malaisie Kuala Lumpur · voyage Malaisie Algérie · 199000 دج | Transactional |
| `/egypte/` Egypt | رحلة منظمة إلى مصر القاهرة | voyage organisé Égypte Le Caire / Hurghada | الغردقة · القاهرة والغردقة · رحلة مصر البحر الأحمر · Collection Mirage -25% · circuit Caire Hurghada · séjour Égypte depuis Algérie | Transactional |
| `/services/` Services overview | خدمات نومارا للسفر | services agence de voyage | حجز فنادق · تذاكر طيران · مرافقة عمرة · خدمات سياحية شاملة · services voyage Constantine | Mixed (informational → transactional) |
| `/services/visa/` Visa assistance | المساعدة في استخراج التأشيرة `TODO-CLIENT` | assistance visa / aide au visa `TODO-CLIENT` | تأشيرة سياحية · وثائق الفيزا المطلوبة · فيزا تركيا / أذربيجان · obtention visa touristique · documents visa | Mixed (informational + transactional) — low-confidence offering |
| `/services/hotellerie/` Hotel reservation | حجز فنادق | réservation d'hôtel | حجز فندق قرب الحرم · حجز إقامة · فنادق تركيا/تونس · réservation hôtel Constantine · booking hôtel | Transactional |
| `/services/vols/` Flight ticketing | حجز تذاكر طيران | billet d'avion / réservation de vol | تذاكر طيران من قسنطينة · حجز طيران الخطوط الجوية الجزائرية · رحلات مباشرة · billet avion Constantine · réservation vol | Transactional |
| `/a-propos/` About + guide | وكالة سياحية معتمدة عين مليلة | agence de voyage agréée Aïn M'Lila | حداد يوسف إسلام · رخصة الوكالة `TODO-CLIENT` · آراء العملاء · تقييمات · à propos Nomara · guide Haddad Youssef Islam | Informational (trust) |
| `/faq/` FAQ | شروط ووثائق العمرة من الجزائر | FAQ visa, paiement, documents | وثائق العمرة المطلوبة · الدفع بالتقسيط / العربون · ماذا أحضر للعمرة · شروط تأشيرة العمرة 2026 · acompte / paiement · checklist عمرة | Informational |
| `/contact/` Contact | اتصل بنومارا حجز عمرة ورحلات | contact / réservation WhatsApp | رقم هاتف وكالة عين مليلة · واتساب حجز · العنوان حي غزالي · ساعات العمل · contact agence Constantine · احجز مقعدك | Transactional (navigational) |

**On-page placement rule per row:** AR primary → `<h1>` + first 100 words + AR `<title>` lead; FR primary → visible destination/Latin label, `<title>` tail, image `alt`, and internal anchor text; secondary terms → H2/H3, FAQ blocks, and the "السعر شامل: الطيران + الفندق + المرافقة" trust line (never "à partir de / starting from", per pricing rule). Western numerals everywhere.

### 2.2 · Content gaps to win

These are the unmet-intent gaps surfacing in live Algerian SERPs that competitors leave thin — each is a page section or schema block Nomara can own:

1. **Umrah price + departure calendar page** — "أسعار عمرة 2026 الجزائر" / "Omra Constantine prix" pulls heavy volume but results are aggregators and Moroccan agencies. Win it with a transparent tiered table (198k / 219k / 235k by hotel distance to Haram) + a Shawwal / 16 جوان departure calendar. Exact dates = `TODO-CLIENT` ("upcoming" placeholder).
2. **Per-destination guides (one per SKU)** — for Djerba, Istanbul, Bakou, Malaisie, Le Caire/Hurghada: "what's included, hotel, sample itinerary, best season, what to pack." SERPs return foreign (FR/MA) sites with no Constantine-departure angle — the "depuis Constantine / من قسنطينة" framing is the differentiator and is barely contested.
3. **Visa & document FAQ** — high informational pull on "وثائق العمرة المطلوبة", "شروط تأشيرة العمرة 2026", "e-visa Azerbaïdjan", "visa Turquie". Build an Umrah-document checklist + a per-country tourist-visa note (Azerbaijan ASAN e-visa, Turkey). Flag the visa *service* itself `TODO-CLIENT` (low-confidence offering) but the *informational* FAQ is safe and ranks.
4. **Packing / preparation lists** — "ماذا أحضر للعمرة" / Umrah packing checklist and a leisure-trip packing note. Pure informational top-of-funnel that feeds the Umrah and Tunisia pages.
5. **Payment / deposit explainer** — "الدفع بالتقسيط", "العربون / acompte" answers the audit's #1 hidden need (deposit-based payment, fear of hidden costs). No local competitor surfaces this clearly.
6. **Reviews / trust surface** — "آراء العملاء" / "avis" tied to the named guide. Review count = `TODO-CLIENT`; do not fabricate.

### 2.3 · Local SEO / off-site note

- **Google Business Profile = top priority (currently missing).** This is the single highest-ROI off-site action: it unlocks the Map Pack and "وكالة عمرة عين مليلة / agence de voyage Aïn M'Lila" local intent that the site alone cannot capture. Create + verify the GBP for the Cité Ghazali, Aïn M'Lila address; set category "Travel agency", add Constantine-departure service area, post the Umrah/leisure offers, and seed real photos + the named guide.
- **NAP consistency (Name-Address-Phone) — exact-match across every surface.** Use one canonical string everywhere: *Nomara Voyages / نومارا للسياحة والأسفار · Cité Ghazali, Aïn M'Lila, Oum El Bouaghi 04003 · 0661 45 70 25*. Mirror it byte-for-byte in the site footer, `LocalBusiness` schema (`tel:+213661457025`), GBP, Instagram bio, and Facebook "About". Inconsistent NAP is the most common local-rank killer.
- **Social signals already live — link and align.** Instagram `@nomara.voyages` is real (link it). Facebook page exists but exact URL = `TODO-CLIENT` (do not invent). Ensure both bios carry the canonical NAP + the `https://nomaravoyages.com` placeholder (`TODO-CLIENT` — find-replace at deploy).
- **Citations/directories:** list on Algerian travel directories (e.g. Ouedkniss "سياحة و سفر", adresse-algerie / voyage directories) with the identical NAP to compound local authority, since regional competitors in Aïn M'Lila already appear there.
- **SEO consequence reminder:** single-URL-space (AR canonical, FR runtime switcher) → **no hreflang**; do not emit alternates. FR keyword capture rides entirely on mixed-script on-page copy.

Sources: [أسعار العمرة في الجزائر 2026](https://umrah-prices.com/%D8%B3%D8%B9%D8%B1-%D8%A7%D9%84%D8%B9%D9%85%D8%B1%D8%A9-%D9%81%D9%8A-%D8%A7%D9%84%D8%AC%D8%B2%D8%A7%D8%A6%D8%B1/) · [وكالة سياحة وأسفار في عين مليلة (adresse-algerie)](https://voyage.adresse-algerie.com/ar/guide/باركور-للسياحة-و-الأسفار/) · [Voyage Organisé Istanbul (ipro-booking.dz)](https://www.ipro-booking.dz/voyages-organises/voyage-organise-istanbul-2) · [Voyage Organisé Azerbaïdjan Bakou (Resalgerie)](https://www.resalgerie.com/tour/voyage-organise-azerbaidjan-bakou/) · [Voyage Organisé Malaisie (Resalgerie)](https://www.resalgerie.com/tour/voyage-organise-malaisie/) · [voyage organisé Djerba (Ouedkniss)](https://www.ouedkniss.com/s/1?keywords=voyage-organise-djerba) · [العمرة من الجزائر: الشروط والإجراءات (Wego)](https://rahhal.wego.com/blog/%D8%A7%D9%84%D8%B9%D9%85%D8%B1%D8%A9-%D9%85%D9%86-%D8%A7%D9%84%D8%AC%D8%B2%D8%A7%D8%A6%D8%B1-%D8%A7%D9%84%D8%B4%D8%B1%D9%88%D8%B7-%D9%88%D8%A7%D9%84%D8%A5%D8%AC%D8%B1%D8%A7%D8%A1%D8%A7%D8%AA/) · [دليل تأشيرة العمرة 2026 (Almosafer)](https://blog.almosafer.com/umrah-visa-requirements-applications-1) · [E-visa Azerbaïdjan ASAN (Ambassade de France à Bakou)](https://az.ambafrance.org/Formalites-d-entree-et-de-sejour-en-Azerbaidjan) · [Egypte Le Caire + Hurghada circuit (Logitravel)](https://www.logitravel.fr/circuits/afrique/egypte/multi-destinations/sur-mesure-avec-sejour-a-la-plage/egypte-le-caire-et-hurghada-8-jours.html) · [حجز طيران الخطوط الجوية الجزائرية (Wego)](https://dz.wego.com/ar/flights)

---

## 3 · Per-page meta & Open Graph

These blocks paste directly **after** the existing `partials/head.html` content (into the `<!-- SEO: ... (Agent 4) -->` slot). Document head is already `<html lang="ar" dir="rtl">`. Per strategy (c) single-URL-space, **no `hreflang`** appears anywhere. The `/omra/` page is the **only** `data-mode="sakina"` page — that toggle lives on `<body>`, not in `<head>`, so it is noted in prose only. Domain `https://nomaravoyages.com` is a **TODO-CLIENT placeholder** (find-replace at deploy). `og:image` `/assets/images/og/og-default.jpg` is **TODO-CLIENT** (see spec at the end). All `og:type` = `website` (no blog). All `og:locale` = `ar_DZ` (Arabic — Algeria; not the invalid `ar_AR`).

---

### /

```html
<title>نومارا للسياحة والأسفار | عمرة ورحلات منظمة</title>
<meta name="description" content="نومارا للسياحة والأسفار: عمرة وحج ورحلات منظمة إلى تونس وتركيا وأذربيجان وماليزيا ومصر، طيران مباشر من قسنطينة. السعر شامل الطيران والفندق والمرافقة — احجز عبر واتساب.">
<link rel="canonical" href="https://nomaravoyages.com/">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="نومارا للسياحة والأسفار">
<meta property="og:locale" content="ar_DZ">
<meta property="og:url" content="https://nomaravoyages.com/">
<meta property="og:title" content="نومارا للسياحة والأسفار | عمرة ورحلات منظمة">
<meta property="og:description" content="عمرة وحج ورحلات منظمة من قسنطينة — السعر شامل الطيران والفندق والمرافقة. احجز رحلتك مع نومارا عبر واتساب.">
<meta property="og:image" content="https://nomaravoyages.com/assets/images/og/og-default.jpg">
<meta name="twitter:card" content="summary_large_image">
```
JSON-LD: include **TravelAgency + WebSite** (root identity + search/site entity; no breadcrumb on home).

---

### /omra/

> Reminder: this is the **only** page rendered with `<body data-mode="sakina">`. The head block itself is identical in structure to the others.

```html
<title>العمرة والحج مع نومارا | طيران مباشر من قسنطينة</title>
<meta name="description" content="باقات العمرة والحج مع نومارا: فنادق قريبة من الحرم، طيران مباشر من قسنطينة، ومرافقة لا تتركك وحدك. السعر شامل الطيران والفندق والمرافقة — للتفاصيل تواصل عبر واتساب.">
<link rel="canonical" href="https://nomaravoyages.com/omra/">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="نومارا للسياحة والأسفار">
<meta property="og:locale" content="ar_DZ">
<meta property="og:url" content="https://nomaravoyages.com/omra/">
<meta property="og:title" content="العمرة والحج مع نومارا | طيران مباشر من قسنطينة">
<meta property="og:description" content="عمرة وحج بفنادق قريبة من الحرم ومرافقة كاملة، انطلاقًا من قسنطينة. السعر شامل الطيران والفندق والمرافقة.">
<meta property="og:image" content="https://nomaravoyages.com/assets/images/og/og-default.jpg">
<meta name="twitter:card" content="summary_large_image">
```
JSON-LD: include **TravelAgency + WebSite + BreadcrumbList** (الرئيسية ← العمرة والحج). *(Optionally a `Service`/`Offer` block for the Umrah packages if section 4 defines one; prices remain TODO-CLIENT.)*

---

### /voyages/

```html
<title>الرحلات المنظمة | نومارا للسياحة والأسفار</title>
<meta name="description" content="كل الرحلات المنظمة مع نومارا: تونس وتركيا وأذربيجان وماليزيا ومصر، طيران مباشر من قسنطينة. السعر شامل الطيران والفندق والمرافقة — احجز وجهتك عبر واتساب.">
<link rel="canonical" href="https://nomaravoyages.com/voyages/">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="نومارا للسياحة والأسفار">
<meta property="og:locale" content="ar_DZ">
<meta property="og:url" content="https://nomaravoyages.com/voyages/">
<meta property="og:title" content="الرحلات المنظمة | نومارا للسياحة والأسفار">
<meta property="og:description" content="رحلات منظمة بالكامل من قسنطينة إلى تونس وتركيا وأذربيجان وماليزيا ومصر. السعر شامل الطيران والفندق والمرافقة.">
<meta property="og:image" content="https://nomaravoyages.com/assets/images/og/og-default.jpg">
<meta name="twitter:card" content="summary_large_image">
```
JSON-LD: include **TravelAgency + WebSite + BreadcrumbList** (الرئيسية ← الرحلات المنظمة). *(Catalog may add `ItemList` of the 5 destinations if section 4 specifies it.)*

---

### /tunisie/

```html
<title>رحلة تونس المنظمة | من قسنطينة مع نومارا</title>
<meta name="description" content="رحلة تونس المنظمة مع نومارا: جربة وسوسة، 7 ليالٍ، طيران مباشر من قسنطينة. السعر شامل الطيران والفندق والمرافقة ابتداءً من 36000 دج — احجز عبر واتساب.">
<link rel="canonical" href="https://nomaravoyages.com/tunisie/">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="نومارا للسياحة والأسفار">
<meta property="og:locale" content="ar_DZ">
<meta property="og:url" content="https://nomaravoyages.com/tunisie/">
<meta property="og:title" content="رحلة تونس المنظمة | من قسنطينة مع نومارا">
<meta property="og:description" content="جربة وسوسة لمدة 7 ليالٍ، طيران مباشر من قسنطينة. السعر شامل الطيران والفندق والمرافقة — 36000 دج فأكثر.">
<meta property="og:image" content="https://nomaravoyages.com/assets/images/og/og-default.jpg">
<meta name="twitter:card" content="summary_large_image">
```
JSON-LD: include **TravelAgency + WebSite + TouristTrip(tunisie) + BreadcrumbList** (الرئيسية ← الرحلات المنظمة ← تونس). Price 36000 DZD is TODO-CLIENT.

---

### /turquie/

```html
<title>رحلة إسطنبول المنظمة | من قسنطينة مع نومارا</title>
<meta name="description" content="رحلة إسطنبول المنظمة مع نومارا: فندق 4 نجوم وجولات سياحية، 7 ليالٍ، طيران مباشر من قسنطينة. السعر شامل الطيران والفندق والمرافقة 119000 دج — احجز عبر واتساب.">
<link rel="canonical" href="https://nomaravoyages.com/turquie/">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="نومارا للسياحة والأسفار">
<meta property="og:locale" content="ar_DZ">
<meta property="og:url" content="https://nomaravoyages.com/turquie/">
<meta property="og:title" content="رحلة إسطنبول المنظمة | من قسنطينة مع نومارا">
<meta property="og:description" content="إسطنبول 7 ليالٍ بفندق 4 نجوم وجولات سياحية، طيران مباشر من قسنطينة. السعر شامل الطيران والفندق والمرافقة 119000 دج.">
<meta property="og:image" content="https://nomaravoyages.com/assets/images/og/og-default.jpg">
<meta name="twitter:card" content="summary_large_image">
```
JSON-LD: include **TravelAgency + WebSite + TouristTrip(turquie) + BreadcrumbList** (الرئيسية ← الرحلات المنظمة ← تركيا). Price 119000 DZD is TODO-CLIENT.

---

### /azerbaidjan/

```html
<title>رحلة باكو المنظمة | أذربيجان من قسنطينة</title>
<meta name="description" content="رحلة باكو (أذربيجان) المنظمة مع نومارا: فندق 4 نجوم وجولات، 7 ليالٍ، طيران مباشر من قسنطينة. السعر شامل الطيران والفندق والمرافقة 119000 دج — احجز عبر واتساب.">
<link rel="canonical" href="https://nomaravoyages.com/azerbaidjan/">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="نومارا للسياحة والأسفار">
<meta property="og:locale" content="ar_DZ">
<meta property="og:url" content="https://nomaravoyages.com/azerbaidjan/">
<meta property="og:title" content="رحلة باكو المنظمة | أذربيجان من قسنطينة">
<meta property="og:description" content="باكو 7 ليالٍ بفندق 4 نجوم وجولات سياحية، طيران مباشر من قسنطينة. السعر شامل الطيران والفندق والمرافقة 119000 دج.">
<meta property="og:image" content="https://nomaravoyages.com/assets/images/og/og-default.jpg">
<meta name="twitter:card" content="summary_large_image">
```
JSON-LD: include **TravelAgency + WebSite + TouristTrip(azerbaidjan) + BreadcrumbList** (الرئيسية ← الرحلات المنظمة ← أذربيجان). Price 119000 DZD is TODO-CLIENT.

---

### /malaisie/

```html
<title>رحلة ماليزيا المنظمة | من قسنطينة مع نومارا</title>
<meta name="description" content="رحلة ماليزيا المنظمة مع نومارا: كوالالمبور والجزر السياحية، 8 ليالٍ، طيران مباشر من قسنطينة. السعر شامل الطيران والفندق والمرافقة 199000 دج — احجز عبر واتساب.">
<link rel="canonical" href="https://nomaravoyages.com/malaisie/">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="نومارا للسياحة والأسفار">
<meta property="og:locale" content="ar_DZ">
<meta property="og:url" content="https://nomaravoyages.com/malaisie/">
<meta property="og:title" content="رحلة ماليزيا المنظمة | من قسنطينة مع نومارا">
<meta property="og:description" content="ماليزيا 8 ليالٍ بين كوالالمبور والجزر، طيران مباشر من قسنطينة. السعر شامل الطيران والفندق والمرافقة 199000 دج.">
<meta property="og:image" content="https://nomaravoyages.com/assets/images/og/og-default.jpg">
<meta name="twitter:card" content="summary_large_image">
```
JSON-LD: include **TravelAgency + WebSite + TouristTrip(malaisie) + BreadcrumbList** (الرئيسية ← الرحلات المنظمة ← ماليزيا). Price 199000 DZD is TODO-CLIENT.

---

### /egypte/

```html
<title>رحلة مصر المنظمة | القاهرة والغردقة من قسنطينة</title>
<meta name="description" content="رحلة مصر المنظمة مع نومارا: القاهرة والأهرامات ومنتجع الغردقة Collection Mirage بتخفيض 25٪، طيران مباشر من قسنطينة. السعر شامل الطيران والفندق والمرافقة — احجز عبر واتساب.">
<link rel="canonical" href="https://nomaravoyages.com/egypte/">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="نومارا للسياحة والأسفار">
<meta property="og:locale" content="ar_DZ">
<meta property="og:url" content="https://nomaravoyages.com/egypte/">
<meta property="og:title" content="رحلة مصر المنظمة | القاهرة والغردقة من قسنطينة">
<meta property="og:description" content="القاهرة والأهرامات ومنتجع الغردقة Collection Mirage بتخفيض 25٪، طيران مباشر من قسنطينة. السعر شامل الطيران والفندق والمرافقة.">
<meta property="og:image" content="https://nomaravoyages.com/assets/images/og/og-default.jpg">
<meta name="twitter:card" content="summary_large_image">
```
JSON-LD: include **TravelAgency + WebSite + TouristTrip(egypte) + BreadcrumbList** (الرئيسية ← الرحلات المنظمة ← مصر). Price is **null / TODO-CLIENT** — omit any `priceSpecification` for this trip; do not emit a price.

---

### /services/

```html
<title>خدماتنا | نومارا للسياحة والأسفار</title>
<meta name="description" content="خدمات نومارا: العمرة والحج، الرحلات المنظمة، حجز الفنادق، حجز تذاكر الطيران من قسنطينة، وخدمات التأشيرة. كل ما تحتاجه لسفرك في مكان واحد — تواصل عبر واتساب.">
<link rel="canonical" href="https://nomaravoyages.com/services/">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="نومارا للسياحة والأسفار">
<meta property="og:locale" content="ar_DZ">
<meta property="og:url" content="https://nomaravoyages.com/services/">
<meta property="og:title" content="خدماتنا | نومارا للسياحة والأسفار">
<meta property="og:description" content="العمرة والحج، الرحلات المنظمة، حجز الفنادق والتذاكر، وخدمات التأشيرة — كل خدمات سفرك مع نومارا في مكان واحد.">
<meta property="og:image" content="https://nomaravoyages.com/assets/images/og/og-default.jpg">
<meta name="twitter:card" content="summary_large_image">
```
JSON-LD: include **TravelAgency + WebSite + BreadcrumbList** (الرئيسية ← خدماتنا). *(May add `ItemList` of the 6 offerings if section 4 specifies it.)*

---

### /services/visa/

```html
<title>خدمات التأشيرة | نومارا للسياحة والأسفار</title>
<meta name="description" content="نساعدك في تحضير ملف التأشيرة وترتيب الوثائق المطلوبة لوجهتك مع نومارا — نرافقك في كل خطوة بصدق ووضوح دون وعود لا نملكها. للاستفسار تواصل معنا عبر واتساب.">
<link rel="canonical" href="https://nomaravoyages.com/services/visa/">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="نومارا للسياحة والأسفار">
<meta property="og:locale" content="ar_DZ">
<meta property="og:url" content="https://nomaravoyages.com/services/visa/">
<meta property="og:title" content="خدمات التأشيرة | نومارا للسياحة والأسفار">
<meta property="og:description" content="مساعدة في تحضير ملف التأشيرة وترتيب الوثائق لوجهتك مع نومارا، بصدق ووضوح. للاستفسار تواصل عبر واتساب.">
<meta property="og:image" content="https://nomaravoyages.com/assets/images/og/og-default.jpg">
<meta name="twitter:card" content="summary_large_image">
```
JSON-LD: include **TravelAgency + WebSite + BreadcrumbList** (الرئيسية ← خدماتنا ← خدمات التأشيرة). Note: this offering is **LOW-CONFIDENCE / TODO-CLIENT** — keep any `Service` block (if section 4 defines one) descriptive only, with no guarantees or price.

---

### /services/hotellerie/

```html
<title>حجز الفنادق | نومارا للسياحة والأسفار</title>
<meta name="description" content="نحجز لك الغرفة المناسبة في أي وجهة بأسعار تفاوضنا عليها لك مع نومارا — تصلك التفاصيل والتأكيد عبر واتساب دون عناء البحث. خدمة حجز فنادق سريعة وشفافة.">
<link rel="canonical" href="https://nomaravoyages.com/services/hotellerie/">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="نومارا للسياحة والأسفار">
<meta property="og:locale" content="ar_DZ">
<meta property="og:url" content="https://nomaravoyages.com/services/hotellerie/">
<meta property="og:title" content="حجز الفنادق | نومارا للسياحة والأسفار">
<meta property="og:description" content="حجز الغرفة المناسبة في أي وجهة بأسعار تفاوضنا عليها لك، مع تأكيد عبر واتساب دون عناء البحث.">
<meta property="og:image" content="https://nomaravoyages.com/assets/images/og/og-default.jpg">
<meta name="twitter:card" content="summary_large_image">
```
JSON-LD: include **TravelAgency + WebSite + BreadcrumbList** (الرئيسية ← خدماتنا ← حجز الفنادق).

---

### /services/vols/

```html
<title>حجز تذاكر الطيران | نومارا للسياحة والأسفار</title>
<meta name="description" content="نقارن لك بين شركات الطيران ونجد أفضل سعر لرحلتك انطلاقًا من قسنطينة مع نومارا — تذاكر مؤكدة وأسعار شفافة دون مفاجآت. احجز تذكرتك عبر واتساب.">
<link rel="canonical" href="https://nomaravoyages.com/services/vols/">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="نومارا للسياحة والأسفار">
<meta property="og:locale" content="ar_DZ">
<meta property="og:url" content="https://nomaravoyages.com/services/vols/">
<meta property="og:title" content="حجز تذاكر الطيران | نومارا للسياحة والأسفار">
<meta property="og:description" content="مقارنة شركات الطيران وأفضل سعر لرحلتك من قسنطينة، بتذاكر مؤكدة وأسعار شفافة. احجز عبر واتساب.">
<meta property="og:image" content="https://nomaravoyages.com/assets/images/og/og-default.jpg">
<meta name="twitter:card" content="summary_large_image">
```
JSON-LD: include **TravelAgency + WebSite + BreadcrumbList** (الرئيسية ← خدماتنا ← حجز التذاكر).

---

### /a-propos/

```html
<title>من نحن | نومارا للسياحة والأسفار</title>
<meta name="description" content="تعرّف على نومارا للسياحة والأسفار ومرافقكم حداد يوسف إسلام — وكالة في عين مليلة، أم البواقي، نرافقكم في العمرة والرحلات المنظمة من قسنطينة بصدق وخبرة. تواصلوا عبر واتساب.">
<link rel="canonical" href="https://nomaravoyages.com/a-propos/">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="نومارا للسياحة والأسفار">
<meta property="og:locale" content="ar_DZ">
<meta property="og:url" content="https://nomaravoyages.com/a-propos/">
<meta property="og:title" content="من نحن | نومارا للسياحة والأسفار">
<meta property="og:description" content="نومارا ومرافقكم حداد يوسف إسلام، وكالة في عين مليلة — العمرة والرحلات المنظمة من قسنطينة بصدق وخبرة.">
<meta property="og:image" content="https://nomaravoyages.com/assets/images/og/og-default.jpg">
<meta name="twitter:card" content="summary_large_image">
```
JSON-LD: include **TravelAgency + WebSite + BreadcrumbList** (الرئيسية ← من نحن). License number is TODO-CLIENT — omit from any `TravelAgency`/about markup until provided. If section 4 defines `AggregateRating`/`Review`, only include with real review data.

---

### /faq/

```html
<title>الأسئلة الشائعة | نومارا للسياحة والأسفار</title>
<meta name="description" content="إجابات نومارا عن أكثر الأسئلة شيوعًا: التأشيرات، الدفع والعربون، وتجهيزات العمرة. كل ما تحتاج معرفته قبل حجز رحلتك من قسنطينة — وللمزيد تواصل عبر واتساب.">
<link rel="canonical" href="https://nomaravoyages.com/faq/">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="نومارا للسياحة والأسفار">
<meta property="og:locale" content="ar_DZ">
<meta property="og:url" content="https://nomaravoyages.com/faq/">
<meta property="og:title" content="الأسئلة الشائعة | نومارا للسياحة والأسفار">
<meta property="og:description" content="إجابات عن التأشيرات والدفع والعربون وتجهيزات العمرة — كل ما تحتاج معرفته قبل الحجز مع نومارا.">
<meta property="og:image" content="https://nomaravoyages.com/assets/images/og/og-default.jpg">
<meta name="twitter:card" content="summary_large_image">
```
JSON-LD: include **TravelAgency + WebSite + FAQPage + BreadcrumbList** (الرئيسية ← الأسئلة الشائعة). `FAQPage` Q&A pairs must mirror the on-page visible questions/answers exactly.

---

### /contact/

```html
<title>اتصل بنا | نومارا للسياحة والأسفار</title>
<meta name="description" content="تواصل مع نومارا للسياحة والأسفار: هاتف 0661 45 70 25، واتساب، وعنواننا في حي غزالي، عين مليلة، أم البواقي. راسلنا للحجز والاستفسار عن العمرة والرحلات المنظمة من قسنطينة.">
<link rel="canonical" href="https://nomaravoyages.com/contact/">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="نومارا للسياحة والأسفار">
<meta property="og:locale" content="ar_DZ">
<meta property="og:url" content="https://nomaravoyages.com/contact/">
<meta property="og:title" content="اتصل بنا | نومارا للسياحة والأسفار">
<meta property="og:description" content="هاتف 0661 45 70 25 وواتساب وعنواننا في حي غزالي، عين مليلة، أم البواقي. راسلنا للحجز والاستفسار.">
<meta property="og:image" content="https://nomaravoyages.com/assets/images/og/og-default.jpg">
<meta name="twitter:card" content="summary_large_image">
```
JSON-LD: include **TravelAgency + WebSite + BreadcrumbList** (الرئيسية ← اتصل بنا). The `TravelAgency` block here is the natural place for `telephone +213661457025`, `address` (Cité Ghazali / حي غزالي, Aïn M'Lila, Oum El Bouaghi, 04003, DZ), and `sameAs` (Instagram only — Facebook URL is TODO-CLIENT, do **not** invent it). Email is TODO-CLIENT — omit. **Phone forms (N1):** the canonical visible NAP string is the spaced `0661 45 70 25` (use it byte-for-byte in copy/footer/GBP, per §2.3); the schema/`tel:` form is the E.164 `+213661457025`. Same number, two presentations — keep both consistent.

---

### OG image spec (TODO-CLIENT)

A single shared default OG image (`/assets/images/og/og-default.jpg`) is referenced by all 15 pages and must be produced before launch.

- **Dimensions:** 1200 × 630 px (1.91:1), `.jpg`, < 200 KB, safe margins of ~80 px so nothing critical is clipped in cropped previews.
- **Layout direction:** RTL-aware composition — logo lockup weighted to the right, Arabic slogan reading right-to-left.
- **Brand mark:** Nomara Voyages logo + Arabic wordmark «نومارا للسياحة والأسفار».
- **Motif:** the brand arch / Moorish-arch silhouette with the coral accent against the teal base (`theme-color #1F8A7A` as the dominant field) to match the site's Rihla mode palette.
- **Slogan (AR):** «اكتشف العالم مع نومارا» as the headline; optional small Latin sub-line «Travel Like a Nomad».
- **Contrast/legibility:** large bold Changa weight for the Arabic headline; ensure WCAG-level contrast of text over the teal field for thumbnail readability.
- **Optional Sakina variant (nice-to-have, not required):** a calmer green/gold `data-mode="sakina"` variant scoped only to `/omra/` could be added later as `/assets/images/og/og-omra.jpg`; if produced, swap only the `/omra/` `og:image`. For v1 a single default is sufficient. Both assets remain **TODO-CLIENT** until the brand logo file is finalized.

---

## 4 · JSON-LD structured-data library

> All blocks are static and require no JS. Each is wrapped in `<script type="application/ld+json"> … </script>` when pasted into `<head>`. The `@id` anchors (`#travelagency`, `#website`) are reused across pages so other blocks can reference the agency without re-declaring it (`"provider": { "@id": "https://nomaravoyages.com/#travelagency" }`).
> **DOMAIN is a placeholder** `https://nomaravoyages.com` everywhere → find-replace at deploy (**TODO-CLIENT**).
> **No `hreflang` / no `inLanguage`-per-URL split** — single-URL-space strategy (c); FR is a runtime switcher only.
> **All prices are TODO-CLIENT** (audit-observed, not client-confirmed). They are emitted so the markup is complete, but must be re-validated before launch.

---

### Block 1 — TravelAgency (SITEWIDE — paste on EVERY page)

Apply to: ALL 15 pages (`/`, `/omra/`, `/voyages/`, `/tunisie/`, `/turquie/`, `/azerbaidjan/`, `/malaisie/`, `/egypte/`, `/services/`, `/services/visa/`, `/services/hotellerie/`, `/services/vols/`, `/a-propos/`, `/faq/`, `/contact/`)

```json
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": "https://nomaravoyages.com/#travelagency",
  "name": "نومارا للسياحة والأسفار",
  "alternateName": ["Nomara Voyages", "نومارا للسياحة وخدمات الحج والعمرة"],
  "url": "https://nomaravoyages.com/",
  "telephone": "+213661457025",
  "logo": "https://nomaravoyages.com/assets/images/logo.svg",
  "image": "https://nomaravoyages.com/assets/images/logo.svg",
  "slogan": "اكتشف العالم مع نومارا",
  "priceRange": "36000–235000 DZD",
  "knowsLanguage": ["ar", "fr"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "حي غزالي",
    "addressLocality": "عين مليلة",
    "addressRegion": "أم البواقي",
    "postalCode": "04003",
    "addressCountry": "DZ"
  },
  "areaServed": [
    { "@type": "Country", "name": "الجزائر" },
    { "@type": "AdministrativeArea", "name": "قسنطينة وشرق الجزائر" }
  ],
  "founder": {
    "@type": "Person",
    "name": "حداد يوسف إسلام",
    "alternateName": "Haddad Youssef Islam",
    "jobTitle": "مرافق ومرشد سياحي"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+213661457025",
    "contactType": "customer service",
    "availableLanguage": ["ar", "fr"]
  },
  "sameAs": [
    "https://instagram.com/nomara.voyages"
  ]
}
```
<!-- sameAs: Facebook page exists ("Nomara voyages – نومارا للسياحة و الأسفار") but exact URL = TODO-CLIENT — DO NOT add until confirmed -->
<!-- email: TODO-CLIENT — add as "email": "<gmail>" once confirmed -->
<!-- license / registration number: TODO-CLIENT — add as a GovernmentService or identifier once confirmed -->
<!-- logo + image both point to the real generated /assets/images/logo.svg (W2 fix); confirm it ships at deploy -->

---

### Block 2 — WebSite (SITEWIDE — paste on EVERY page, or at least on `/`)

Apply to: ALL 15 pages (minimum: `/`)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://nomaravoyages.com/#website",
  "name": "نومارا للسياحة والأسفار",
  "alternateName": "Nomara Voyages",
  "url": "https://nomaravoyages.com/",
  "inLanguage": "ar",
  "publisher": { "@id": "https://nomaravoyages.com/#travelagency" }
}
```
<!-- NO SearchAction emitted on purpose: the static site has no internal search endpoint. Adding one would be fabrication. -->

---

### Block 3 — BreadcrumbList (reusable TEMPLATE)

Apply to: every page EXCEPT `/` (Home has no breadcrumb). Worked example below is for `/tunisie/`.

**Template (replace the bracketed tokens per page):**

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://nomaravoyages.com/" },
    { "@type": "ListItem", "position": 2, "name": "[PARENT_NAME_AR]", "item": "https://nomaravoyages.com/[PARENT_SLUG]/" },
    { "@type": "ListItem", "position": 3, "name": "[PAGE_NAME_AR]", "item": "https://nomaravoyages.com/[PAGE_SLUG]/" }
  ]
}
```

> Parent map: trip pages (`/tunisie/`, `/turquie/`, `/azerbaidjan/`, `/malaisie/`, `/egypte/`) → parent = `الرحلات المنظمة` `/voyages/`. Service sub-pages (`/services/visa/`, `/services/hotellerie/`, `/services/vols/`) → parent = `الخدمات` `/services/`. Top-level pages (`/omra/`, `/voyages/`, `/services/`, `/a-propos/`, `/faq/`, `/contact/`) use a 2-item list (الرئيسية → page).

**Worked example — Apply to: `/tunisie/`** (Home › الرحلات المنظمة › تونس)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://nomaravoyages.com/" },
    { "@type": "ListItem", "position": 2, "name": "الرحلات المنظمة", "item": "https://nomaravoyages.com/voyages/" },
    { "@type": "ListItem", "position": 3, "name": "تونس", "item": "https://nomaravoyages.com/tunisie/" }
  ]
}
```

---

### Block 4 — Person: Haddad Youssef Islam

Apply to: `/a-propos/`

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://nomaravoyages.com/a-propos/#guide",
  "name": "حداد يوسف إسلام",
  "alternateName": "Haddad Youssef Islam",
  "jobTitle": "مرافق ومرشد سياحي",
  "worksFor": { "@id": "https://nomaravoyages.com/#travelagency" },
  "url": "https://nomaravoyages.com/a-propos/",
  "knowsLanguage": ["ar", "fr"]
}
```

---

### Block 5 — TouristTrip × 5 countries

> NOTE: **ALL `price` / `lowPrice` / `highPrice` values below are TODO-CLIENT** (audit-observed). `priceCurrency` is `"DZD"` everywhere. Price framing on-page is "السعر شامل: الطيران + الفندق + المرافقة" — never "starting from".

**5a — Apply to: `/tunisie/`** (hotel tiers → AggregateOffer lowPrice/highPrice 36000–55000)

```json
{
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  "@id": "https://nomaravoyages.com/tunisie/#trip",
  "name": "رحلة تونس المنظمة",
  "description": "رحلة منظمة بالكامل إلى تونس (٧ ليالٍ) تنطلق من مطار قسنطينة — تشمل تذكرة الطيران ذهابًا وإيابًا والإقامة والنقل ومرافقة فريق نومارا.",
  "touristType": ["عائلات", "أزواج", "سياحة ترفيهية"],
  "provider": { "@id": "https://nomaravoyages.com/#travelagency" },
  "departureLocation": { "@type": "Airport", "name": "مطار قسنطينة" },
  "subTrip": [
    { "@type": "TouristTrip", "name": "جربة — فندق سيدي منصور (إقامة كاملة)" },
    { "@type": "TouristTrip", "name": "سوسة بالاس (نصف إقامة)" },
    { "@type": "TouristTrip", "name": "سوسة مانتاغو (نصف إقامة)" }
  ],
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "DZD",
    "lowPrice": 36000,
    "highPrice": 55000,
    "offerCount": 3,
    "availability": "https://schema.org/InStock"
  }
}
```
<!-- prices TODO-CLIENT (Sousse Mantago 36000 / Sousse Palace 40000 / Djerba Sidi Mansour 55000) -->

**5b — Apply to: `/turquie/`** (single price 119000 → Offer)

```json
{
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  "@id": "https://nomaravoyages.com/turquie/#trip",
  "name": "رحلة إسطنبول المنظمة",
  "description": "رحلة منظمة إلى إسطنبول (٧ ليالٍ) من مطار قسنطينة — طيران ذهابًا وإيابًا، فندق ٤ نجوم مع الفطور، جولات سياحية، ومرافقة فريق نومارا.",
  "touristType": ["عائلات", "أزواج", "سياحة ترفيهية"],
  "provider": { "@id": "https://nomaravoyages.com/#travelagency" },
  "departureLocation": { "@type": "Airport", "name": "مطار قسنطينة" },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "DZD",
    "lowPrice": 119000,
    "highPrice": 119000,
    "offerCount": 1,
    "availability": "https://schema.org/InStock"
  }
}
```
<!-- price 119000 TODO-CLIENT -->

**5c — Apply to: `/azerbaidjan/`** (single price 119000)

```json
{
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  "@id": "https://nomaravoyages.com/azerbaidjan/#trip",
  "name": "رحلة باكو المنظمة",
  "description": "رحلة منظمة إلى باكو (أذربيجان، ٧ ليالٍ) من مطار قسنطينة — طيران ذهابًا وإيابًا، فندق ٤ نجوم مع الفطور، جولات في باكو وضواحيها، ومرافقة فريق نومارا.",
  "touristType": ["عائلات", "أزواج", "سياحة ترفيهية"],
  "provider": { "@id": "https://nomaravoyages.com/#travelagency" },
  "departureLocation": { "@type": "Airport", "name": "مطار قسنطينة" },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "DZD",
    "lowPrice": 119000,
    "highPrice": 119000,
    "offerCount": 1,
    "availability": "https://schema.org/InStock"
  }
}
```
<!-- price 119000 TODO-CLIENT -->

**5d — Apply to: `/malaisie/`** (single price 199000)

```json
{
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  "@id": "https://nomaravoyages.com/malaisie/#trip",
  "name": "رحلة ماليزيا المنظمة",
  "description": "رحلة منظمة إلى ماليزيا (٨ ليالٍ) من مطار قسنطينة — طيران ذهابًا وإيابًا، فندق ٤ نجوم مع الفطور، جولات بين كوالالمبور والجزر السياحية، ومرافقة فريق نومارا.",
  "touristType": ["عائلات", "أزواج", "سياحة ترفيهية"],
  "provider": { "@id": "https://nomaravoyages.com/#travelagency" },
  "departureLocation": { "@type": "Airport", "name": "مطار قسنطينة" },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "DZD",
    "lowPrice": 199000,
    "highPrice": 199000,
    "offerCount": 1,
    "availability": "https://schema.org/InStock"
  }
}
```
<!-- price 199000 TODO-CLIENT -->

**5e — Apply to: `/egypte/`** (price = null → OMIT offers entirely)

```json
{
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  "@id": "https://nomaravoyages.com/egypte/#trip",
  "name": "رحلة مصر المنظمة",
  "description": "رحلة منظمة إلى مصر (٧ ليالٍ) من مطار قسنطينة — القاهرة التاريخية والأهرامات، ومنتجع الغردقة Collection Mirage على البحر الأحمر — طيران وإقامة وجولات ومرافقة كاملة. المواعيد والأسعار قيد التأكيد.",
  "touristType": ["عائلات", "أزواج", "سياحة ترفيهية"],
  "provider": { "@id": "https://nomaravoyages.com/#travelagency" },
  "departureLocation": { "@type": "Airport", "name": "مطار قسنطينة" },
  "subTrip": [
    { "@type": "TouristTrip", "name": "رحلة القاهرة" },
    { "@type": "TouristTrip", "name": "الغردقة — Collection Mirage" }
  ]
}
```
<!-- offers OMITTED — price TODO-CLIENT (null). Do NOT emit an empty/zero AggregateOffer. Re-add offers once price is confirmed. -->

---

### Block 6 — Umrah (TouristTrip for /omra/)

Apply to: `/omra/`  (mode = sakina)

> `TouristTrip` chosen over `Product` so it parallels the leisure trips and keeps `provider` semantics. AggregateOffer reflects the tiered-by-hotel-distance pricing.

```json
{
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  "@id": "https://nomaravoyages.com/omra/#trip",
  "name": "عمرة من مطار قسنطينة",
  "description": "رحلة عمرة منظمة بطيران مباشر من مطار قسنطينة، فنادق مصنّفة بحسب القرب من الحرم، ومرافقة كاملة خطوة بخطوة. الأسعار متدرجة حسب الفندق والمسافة إلى الحرم.",
  "touristType": ["معتمرون", "سياحة دينية"],
  "provider": { "@id": "https://nomaravoyages.com/#travelagency" },
  "departureLocation": { "@type": "Airport", "name": "مطار قسنطينة" },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "DZD",
    "lowPrice": 198000,
    "highPrice": 235000,
    "offerCount": 3,
    "availability": "https://schema.org/InStock"
  }
}
```
<!-- prices TODO-CLIENT — tiered by hotel distance to the Haram (≈198000 / 219000 / 235000). Umrah June (16 جوان) ≈190000+ not modeled separately; widen lowPrice to 190000 if June dates are published. -->

---

### Block 7 — FAQPage (TEMPLATE, 2 example Q&A in Arabic)

Apply to: `/faq/`  (populate from final /faq/ copy — these 2 are placeholders)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://nomaravoyages.com/faq/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "هل تساعدوننا في إجراءات التأشيرة؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "نعم، نرافقك في تحضير ملف التأشيرة وترتيب الوثائق المطلوبة حسب وجهتك، ونوضّح لك الخطوات بصدق دون وعود لا نملكها. (نص نهائي يُحدَّث من صفحة الأسئلة الشائعة.)"
      }
    },
    {
      "@type": "Question",
      "name": "كيف تتم عملية الدفع وهل يكفي دفع عربون للحجز؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "يتم تأكيد الحجز بدفع عربون عبر التواصل المباشر معنا على واتساب، ثم يُسدَّد باقي المبلغ قبل الرحلة. السعر شامل: الطيران + الفندق + المرافقة. (نص نهائي يُحدَّث من صفحة الأسئلة الشائعة.)"
      }
    }
  ]
}
```
<!-- TEMPLATE: replace with the exact final Q&A pairs from /faq/ copy (visa, payment/deposit, Umrah packing). Every Question MUST keep a single acceptedAnswer. -->

---

### Validation notes

**Adjusted / decided for schema.org validity:**
- **`@id` graph references.** Used a sitewide `@id` (`#travelagency`, `#website`) so trips, the guide Person, and the WebSite publisher reference the agency by `{ "@id": … }` instead of re-declaring it — valid and avoids duplicate-entity warnings.
- **`addressCountry`** uses ISO code `"DZ"` (valid). Locality/region given in Arabic per the Arabic-first mandate; Google accepts localized address text.
- **`AggregateOffer` for single-price trips.** Spec-wise an `AggregateOffer` is meant for ≥1 offers; I set `lowPrice = highPrice` and `offerCount: 1`. This validates, and keeps every trip block structurally uniform for the page lane. (If you prefer, a plain `Offer` with `"price"` is equally valid for single-price trips — swap if the page lane wants it.)
- **`availability`** uses the full enum URL `https://schema.org/InStock` (valid enum value). Bare `"InStock"` also validates but the URL form is safest.
- **`touristType`** is free-text per schema.org (`Text` or `Audience`); Arabic strings are acceptable.
- **`departureLocation` / `Airport`.** `departureLocation` is a valid TouristTrip property; `Airport` is a valid sub-type of Place. Used name-only (no geo) to avoid fabricating coordinates.
- **Egypt — no offers.** Per instruction, `offers` is omitted entirely (price null). No empty or zero-priced AggregateOffer emitted, which would be invalid/misleading.
- **WebSite — no `SearchAction`.** Deliberately omitted (no real search endpoint). `inLanguage: "ar"` set once on the site entity, not per-URL.
- **No `hreflang` and no per-language URL alternates** anywhere — single-URL-space strategy (c); `inLanguage` declared only at the WebSite level as the canonical/default language.

**Fields left TODO-CLIENT (intentionally NOT emitted, or emitted as placeholders):**
- `sameAs` Facebook URL — page exists but exact URL unknown → **omitted** (HTML comment flags it). Instagram is the only real `sameAs`.
- `email` on TravelAgency — **omitted** (Gmail address unconfirmed).
- **License / registration number** — **omitted** (no `identifier`/badge fabricated).
- **Final domain** — `https://nomaravoyages.com` is a placeholder in every `url`/`item`/`@id`; **find-replace at deploy**.
- **All prices** (`price`/`lowPrice`/`highPrice` in Blocks 5a–5d and 6) are audit-observed → **TODO-CLIENT**; re-validate before launch. Egypt price is genuinely null → no offer.
- **Image/logo asset paths** in Block 1 now both point to the shipped `/assets/images/logo.svg` (W2 fix — was a non-existent `brand/nomara-og.jpg` + `brand/nomara-logo.png`). Confirm `logo.svg` is deployed; both props are optional and may be dropped if the asset is not ready.
- **FAQPage** content is a 2-item placeholder template → populate from final `/faq/` copy (visa, payment/deposit, Umrah packing).
- **Exact trip/departure dates** — not modeled as `TouristTrip.itinerary` legs or `Offer.validThrough` because dates are TODO-CLIENT ("upcoming"). Add `startDate`/`endDate` per departure once published.

---

## 5 · Deploy infra — Cloudflare Pages (_headers / _redirects)

Both files go at the **deploy-root** of the published output (the directory you point Cloudflare Pages at — i.e. wherever the live `index.html`, `/assets/`, `/omra/`, etc. sit). No extension, no leading content, LF line endings. Cloudflare reads them at the edge — no build step, which matches this site's vanilla/no-bundler model.

Two facts drive the whole caching design:

1. **There is no asset hashing/fingerprinting.** `styles.css` is always literally `/assets/css/styles.css` — the filename never changes when its contents change. So the cache key is stable across deploys, which means *the cache lifetime is the only lever that controls how fast an edit reaches a returning visitor.*
2. Therefore `immutable` is **safe** for things whose bytes effectively never change (images, fonts, favicons) and **dangerous** for CSS/JS (the files you'll actually keep editing). `immutable` tells the browser "do not even revalidate until max-age expires" — a returning visitor would be pinned to a stale `styles.css` for up to a year with no way to bust it short of renaming the file (which we don't do). That is exactly the failure mode to avoid here.

---

### A) `_headers`

```
# ============================================================
#  Nomara Voyages — Cloudflare Pages _headers
#  Place at the DEPLOY ROOT (alongside index.html, /assets/, …)
#  No build step / no asset hashing → cache lifetimes are the
#  ONLY way edits reach returning visitors. See rationale below.
# ============================================================
#  Rule ordering: LEAST-specific (/*) FIRST, MOST-specific asset
#  rules LAST. Cloudflare applies the MOST-specific matching rule
#  for a given header, so /assets/* overrides the /* default.

# --- 1. Global security headers + DEFAULT cache (every response) ---
# /* default Cache-Control covers ALL pretty-URL directory pages
# (/omra/, /contact/, /tunisie/, /services/visa/ …) whose path is
# "/omra/" etc. — these match neither "/*.html" nor "/".
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=(), browsing-topics=()
  Cross-Origin-Opener-Policy: same-origin
  # CSP in REPORT-ONLY first — site has inline <script>/<style> + inline SVG.
  # NO report-to/report-uri endpoint → violations surface only in the visitor's
  # console (not collected). Enforced CSP needs per-request nonces (a Pages
  # Function), which conflicts with the no-build/no-backend lock → report-only ceiling.
  Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests
  # TODO-CLIENT: add HSTS at deploy once HTTPS is clean.
  Cache-Control: public, max-age=0, must-revalidate

# --- 2. CSS / JS — SHORT cache + revalidation (NOT immutable) ---
# Filenames are unhashed, so 'immutable' would strand returning visitors on a
# stale styles.css for up to a year. max-age=0 + must-revalidate forces a cheap
# conditional GET (304 if unchanged); SWR lets the edge serve instantly while
# refreshing. Edits to CSS/JS go live on next request.
/assets/css/*
  Cache-Control: public, max-age=0, must-revalidate, stale-while-revalidate=86400

/assets/js/*
  Cache-Control: public, max-age=0, must-revalidate, stale-while-revalidate=86400

# --- 3. Long, immutable cache for content that ~never changes ---
# Images + favicons (generated assets, content stable). Safe to pin a year.
/assets/images/*
  Cache-Control: public, max-age=31536000, immutable

# Self-hosted fonts, if/when any are added under /assets/fonts/.
# (Google Fonts are served from fonts.gstatic.com and cached by Google's own
#  far-future headers — this rule only covers fonts you host yourself.)
/assets/fonts/*
  Cache-Control: public, max-age=31536000, immutable
```

**Notes on the header choices**

- **Caching applies to ALL pages now (C1 fix).** The earlier version scoped the HTML revalidate rule to `/*.html` + `/`. Those match only the bare root and literal `.html` URLs — but every interior page is a **pretty-URL directory** whose request path is `/omra/`, `/contact/`, `/tunisie/`, `/services/visa/` … which matches *neither* pattern. Result: 13 of 15 pages shipped with **no `Cache-Control`** and could serve stale prices. The fix moves the revalidate default onto `/*` (least-specific, so it covers every page) and lets the more-specific `/assets/*` rules override it. Cloudflare applies the **most-specific matching rule** for a given header, so asset rules still win where they match. **Verify post-deploy with `curl -I`:** `/omra/` → expect `must-revalidate`; `/assets/images/logo.svg` → expect `immutable`.
- **`Permissions-Policy`** disables sensors/capabilities the site never uses. `interest-cohort=()` opts out of FLoC; `browsing-topics=()` opts out of the **Topics API** that replaced it (FLoC is dead, Topics is the current Privacy-Sandbox mechanism — both are now set). Kept conservative and additive — none of these break WhatsApp/`tel:` deep-links (those are plain `<a href>` navigations, not gated permissions).
- **`X-Frame-Options: SAMEORIGIN`** plus CSP `frame-ancestors 'self'` is belt-and-braces clickjacking defence. (If you only want one, `frame-ancestors` is the modern form, but XFO costs nothing and helps old crawlers.)
- **No `Strict-Transport-Security` here on purpose.** The production domain is still **TODO-CLIENT** (`nomaravoyages.com` is a placeholder). Adding HSTS — especially `preload` — before the final apex + all subdomains are confirmed on HTTPS can lock users out. **Add HSTS at deploy** once the real domain is live and serving HTTPS cleanly: `Strict-Transport-Security: max-age=31536000; includeSubDomains` (add `; preload` only after deliberate decision).
- **CSP is Report-Only by design.** `partials/head.html` loads CSS from `fonts.googleapis.com`, fonts from `fonts.gstatic.com`, uses `data:`/inline SVG favicons, and pages carry inline `<script>`/`<style>`. The Report-Only policy above **allows exactly those origins** and `'unsafe-inline'`, so it will fire *zero* violations on a healthy page while you watch the reports — it can't break anything because it doesn't enforce.
  - **Honesty (W5):** the Report-Only header has **no `report-to`/`report-uri` directive**, so violations are **not collected anywhere** — they appear only in each individual visitor's browser console, which nobody on our side sees aggregated. "Watching the reports" really means manually opening DevTools on a few pages, not a reporting pipeline. Wiring a real collector would need an HTTPS reporting endpoint (a Pages Function or a third-party report sink), which is out of scope for the locked no-backend architecture. So Report-Only without an endpoint is a deliberate, low-cost smoke test, not active monitoring.
  - **Path to enforced CSP (do later, not at launch):** move inline `<script>`/`<style>` to per-response **nonces** (`script-src 'self' 'nonce-…'`) and drop `'unsafe-inline'`. That requires generating a nonce per request — i.e. a Pages Function or edge middleware — which **directly conflicts with the locked no-build / no-backend static architecture**. So enforced CSP is not a free header flip; it's an architecture change. Until that's deliberately taken on, **Report-Only is the realistic security ceiling**. Do **not** flip the header name to enforcing `Content-Security-Policy` while `'unsafe-inline'` is still present (that would give you the breakage risk without the security benefit).
- **Caveat (from Cloudflare docs):** `_headers` rules are **not** applied to responses generated by Pages Functions. This site is pure static, so that's a non-issue today — but if a contact-form Function is ever added, its security headers must be set in code.

---

### B) `_redirects`

Cloudflare Pages already does two things for you, so we deliberately **don't** restate them:
- It auto-serves `/404.html` for unmatched paths (your 404 page — kept out of the sitemap as specified).
- It auto-normalises trailing slashes (a request to `/contact` 308-redirects to `/contact/`). So there's no need to author slash rules.

This file therefore contains **only canonical convenience aliases** — friendly/legacy paths a user might type or that might get linked, all **301 (permanent)** so SEO equity consolidates onto the canonical AR-default URLs:

```
# ============================================================
#  Nomara Voyages — Cloudflare Pages _redirects
#  Place at the DEPLOY ROOT. All 301 (permanent).
#  Only canonical conveniences — CF already handles 404.html
#  and trailing-slash normalisation, so those are omitted.
#  Static rules first; order matters (top-most wins).
# ============================================================

# Home aliases
/home            /            301
/index.html      /            301
/index           /            301

# About
/about           /a-propos/   301
/about-us        /a-propos/   301
/a-propos.html   /a-propos/   301

# Services — top-level + the three confirmed sub-offerings
/services.html   /services/            301
/visa            /services/visa/       301
/hotellerie      /services/hotellerie/301
/hotel           /services/hotellerie/ 301
/vols            /services/vols/       301
/flights         /services/vols/       301

# Umrah / Hajj hub (English & common alt spellings → canonical /omra/)
/umrah           /omra/       301
/omra.html       /omra/       301
/hajj            /omra/       301

# Tours catalogue + a couple of English destination aliases
/voyages.html    /voyages/    301
/tours           /voyages/    301
/turkey          /turquie/    301
/tunisia         /tunisie/    301
/egypt           /egypte/     301
/malaysia        /malaisie/   301
/azerbaijan      /azerbaidjan/ 301

# Contact / FAQ
/contact.html    /contact/    301
/faq.html        /faq/        301
```

**Notes on the redirect choices**

- **All 301**, not 302 — these are permanent canonicalisations; you want browsers and crawlers to cache them and pass link equity to the AR-default URL. (Use 302 only for genuinely temporary detours; none here are.)
- **`/index.html → /` and `/<page>.html → /<page>/`** matter specifically because this is a no-build static site: people copy raw `.html` paths. The 301 keeps a single canonical form and avoids duplicate-content split between `/about.html` and `/a-propos/`.
- **English destination aliases** (`/turkey`, `/egypt`, …) are a low-cost hedge: French/Arabic slugs are canonical, but an English-typed guess still lands correctly rather than 404-ing.
- **No `hreflang`/locale redirects** — per the locked language strategy, `fr` is a **runtime switcher with no `/fr/` URL space** (single-URL strategy (c)), so there is nothing to route by locale and **no hreflang to emit**. Keeping locale logic out of `_redirects` is consistent with that.
- **Order:** every rule above is static (no `:splat`/placeholder), and there are no overlapping sources, so ordering is safe as written; if you later add a wildcard catch-all, it must go **last**.
- **Deploy reminder (TODO-CLIENT):** these are all **relative-path** redirects, so they're domain-agnostic and need no edit when the real domain replaces the `nomaravoyages.com` placeholder. The one thing to revisit at deploy is the **`_headers` HSTS line** (add it then) and pointing Cloudflare Pages at the correct production hostname.

---

**Sources**
- [Cloudflare Pages — Headers docs](https://developers.cloudflare.com/pages/configuration/headers/)
- [Cloudflare Pages — Redirects docs](https://developers.cloudflare.com/pages/configuration/redirects/)
- [How to configure browser caching in Cloudflare Pages (randombits.dev)](https://randombits.dev/articles/tips/cloudflare-pages-caching)
- [Cloudflare Pages Security: Headers & CSP Guide 2026 (ZeriFlow)](https://zeriflow.com/blog/cloudflare-pages-security-guide)
- [Cloudflare Pages forces trailing-slash 308 (Cloudflare Community)](https://community.cloudflare.com/t/cloudflare-pages-disable-non-trailing-slash-308-redirect/316995)

---

## 6 · Launch & deploy runbook (go-live checklist)

Run top-to-bottom when the client signs off and the real domain is known.

### 6.1 — Replace the placeholder domain (do this FIRST)
Replace `nomaravoyages.com` with the production domain across all SEO surfaces:

```bash
# from repo root — preview every occurrence first
grep -rn "nomaravoyages.com" site/ docs/SEO-PLAYBOOK.md
# then replace (PowerShell example; swap REALDOMAIN.tld):
#   Get-ChildItem -Recurse site\ -Include *.html,*.xml,robots.txt |
#     ForEach-Object { (Get-Content $_ -Raw) -replace 'nomaravoyages\.com','REALDOMAIN.tld' | Set-Content $_ -NoNewline }
```
Surfaces that contain it: `site/robots.txt`, `site/sitemap.xml`, every page `<link rel="canonical">` + `og:url`,
and every JSON-LD `@id`/`url`/`item` once §4 is pasted in.

### 6.2 — Apply on-page SEO (page lane)
- [ ] Paste each **§3** meta block into the matching page `<head>`.
- [ ] Paste the **§4** JSON-LD block(s) per page (sitewide `TravelAgency`+`WebSite` everywhere; per-page extras as noted).
- [ ] Confirm `/omra/` keeps `<body data-mode="sakina">` (head is identical to other pages).
- [ ] Ensure each page's visible `<h1>` carries its **§2** AR primary keyword; Latin destination word echoed in `<title>`/`alt`/anchors.

### 6.3 — Produce brand/OG assets (`TODO-CLIENT`)
- [ ] `/assets/images/og/og-default.jpg` — 1200×630, RTL-aware, teal `#1F8A7A` field, arch + coral motif,
      «اكتشف العالم مع نومارا» headline (full spec at end of §3).
- [ ] Confirm `logo`/`image` paths in the §4 `TravelAgency` block exist, or drop those optional props.

### 6.4 — Cloudflare Pages config
- [ ] Output/root directory = `site/` (so `_headers`, `_redirects`, `robots.txt`, `sitemap.xml` sit at the deploy root).
- [ ] After first deploy, verify headers: `curl -I https://REALDOMAIN.tld/assets/css/styles.css` (expect `must-revalidate`),
      and `curl -I https://REALDOMAIN.tld/assets/images/logo.svg` (expect `immutable`).
- [ ] **C1 regression check (critical):** `curl -I https://REALDOMAIN.tld/omra/` MUST return `Cache-Control: public, max-age=0, must-revalidate`. A pretty-URL directory page with *no* `Cache-Control` means the `/*` default isn't matching — the exact bug this fix closes. Spot-check one more (e.g. `/contact/` or `/services/visa/`).
- [ ] Add **HSTS** to `site/_headers` once HTTPS is confirmed clean: `Strict-Transport-Security: max-age=31536000; includeSubDomains`.
- [ ] CSP-Report-Only has **no reporting endpoint** — violations show only in each visitor's console (not collected). To "watch" them, open DevTools on a few pages manually. Wiring a real report sink, like enforced CSP, needs a Pages Function (conflicts with the no-backend lock).

### 6.5 — Search & validation
- [ ] Google Search Console: verify domain, submit `https://REALDOMAIN.tld/sitemap.xml`.
- [ ] Validate JSON-LD via the Rich Results Test / Schema Markup Validator (every template + one real page each).
- [ ] Validate `sitemap.xml` (XML well-formed, namespace `http://www.sitemaps.org/schemas/sitemap/0.9`).
- [ ] Lighthouse SEO pass at 375px on home + one trip page.

### 6.6 — Off-site (highest local-SEO ROI — see §2.3)
- [ ] **Create + verify the Google Business Profile** (Cité Ghazali, Aïn M'Lila; category "Travel agency"; Constantine service area). This is the #1 off-site action.
- [ ] Align NAP byte-for-byte across footer / GBP / Instagram bio / Facebook About.
- [ ] Add Instagram (`@nomara.voyages`) to `sameAs`; add the Facebook URL **only once confirmed** (`TODO-CLIENT`).

### 6.7 — Remaining `TODO-CLIENT` to chase before/at launch
License/registration number · email · exact Facebook URL · exact departure dates · final confirmed prices · OG + logo assets.

---

*End of playbook. File-based infra (§ robots/sitemap/_headers/_redirects) is live now; §3–§4 are the page lane's paste-in payload.*
