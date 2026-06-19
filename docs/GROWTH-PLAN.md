# NOMARA VOYAGES — GROWTH & OPTIMIZATION PLAN

> Consolidates four asks: (1) a conversion-experiment backlog, (2) an AEO / AI-SEO plan,
> (3) a measurement plan, (4) a best-/worst-case design roadmap. Tailored to what Nomara
> actually is: a **pre-launch, static, Arabic-first, WhatsApp-checkout** travel brochure
> (no backend, no traffic, no analytics yet). Reality check up front: **you cannot run a
> live A/B test today** — there is no deployment, no traffic, and no measurement. Section 3
> (measurement) is therefore the unlock for Section 1 (experiments). Sequence: deploy →
> measure → drive traffic → test.

---

## 1 · CONVERSION EXPERIMENT BACKLOG

**The one metric that matters:** clicks on `wa.me/213661457025…` and `tel:` links — the
funnel's key event (WhatsApp *is* checkout). Everything below optimizes WhatsApp/Call CTR.
Secondary: scroll-depth to price, trip-page reach. Guardrail: bounce rate, time-to-first-CTA.

**Prioritization (ICE — Impact·Confidence·Ease, 1–5):**

| # | Experiment | I | C | E | Score | Run when |
|---|---|---|---|---|---|---|
| E1 | Persistent sticky WhatsApp+Call bar on **every** page (not just trip pages) | 5 | 4 | 5 | **14** | at launch (ship as default, A/B later) |
| E2 | Hero CTA copy: «احجز مقعدك» vs lower-commitment «استفسر مجانًا — نرد بسرعة» | 4 | 3 | 5 | 12 | ~1k trip-page visits |
| E3 | Price reveal: keep inline vs add «ما الذي يشمله السعر؟» expandable inclusions | 4 | 3 | 4 | 11 | ~1k |
| E4 | Guide photo + license badge **above** the fold (companion trust) vs current | 4 | 3 | 3 | 10 | needs real guide photo |
| E5 | Égypte card: «السعر عند الطلب» vs an honest «انطلاقًا من … دج* (يُؤكَّد)» indicative price | 3 | 3 | 4 | 10 | once a real floor price exists |
| E6 | Departure-calendar lead capture («وصول مواعيد الانطلاق») via WhatsApp keyword | 4 | 2 | 3 | 9 | post-launch, with WA Business |
| E7 | Real seat-scarcity counter (HONEST count only) on filling departures | 3 | 3 | 3 | 9 | only with real seat data |

**Experiment brief — E1 (the first one to ship):**
- *Because* WhatsApp is the only checkout and it currently appears only in-section on some
  pages, *we believe* a persistent sticky WhatsApp+Call bar on all conversion pages *will
  lift* WhatsApp/Call CTR *for* mobile visitors. *We'll know* when WA-link CTR (clicks /
  unique visitors) rises with no bounce-rate regression.
- Primary: WA+Call CTR. Secondary: trip-page → WA rate. Guardrail: bounce, accidental taps.
- MDE 15% relative lift. At a ~4% baseline CTR you need ≈9k visitors/variant (Evan Miller,
  95%/80%) — i.e. this is a **post-traffic** test; ship the bar as default first, test
  variants once traffic supports it.
- Variant tooling: PostHog (free tier, client-side feature flag) or a hand-rolled 50/50
  `localStorage` bucket — no backend needed for client-side variant assignment.

**Honesty guardrails (non-negotiable, from the brand audit):** never fabricate scarcity,
counts, ratings, or dates to "win" a test. A test that requires inventing social proof is
disqualified. Every test must produce a learning even when the variant loses.

---

## 2 · AEO / AI-SEO PLAN  (get ChatGPT / Perplexity / Google AI Overviews to cite Nomara)

Nomara owns a precise, under-served query space: **"عمرة من مطار قسنطينة سعر", "voyage
organisé depuis Constantine", "وكالة عمرة عين مليلة"**. Answer engines reward structured,
factual, entity-clear pages — exactly the transparent-pricing content Nomara already has.

**Already in place (good):** TravelAgency + WebSite + BreadcrumbList JSON-LD, per-page
canonical/OG, CollectionPage+ItemList on /voyages/, consistent NAP, founder entity, AR-canonical.

**Gaps to close (all static-friendly, no backend):**
1. **FAQPage schema** on `/faq/` — wrap each Q&A in `Question`/`acceptedAnswer`. This is the
   single highest-leverage AEO win: it makes the FAQ directly extractable into AI answers and
   Google "People also ask". (Code increment — see §4 / Wave 3.)
2. **TouristTrip + Offer** schema per trip page (name, `itinerary`, `offers.price` +
   `priceCurrency: DZD`, `includesObject`). Lets an engine answer "how much is the Istanbul
   trip from Constantine?" *with Nomara's number*. Mark price `TODO-CLIENT`-confirmed before
   asserting a hard `Offer.price`; until confirmed use `priceSpecification` ranges, never a
   fabricated exact number.
3. **Question-shaped H2s** on trip + FAQ pages: «كم سعر العمرة من قسنطينة؟», «ماذا يشمل سعر
   رحلة تونس؟», «هل أحتاج تأشيرة لـ…؟». Answer in the first sentence after the heading
   (answer-engine extraction pattern).
4. **`speakable` schema** on the price/inclusions blocks for voice assistants.
5. **`llms.txt`** at site root — a plain-text map of the agency, destinations, price ranges,
   contact, and "what's included" policy, for LLM crawlers.
6. **Entity consistency**: ensure the Arabic name, Latin "Nomara Voyages", phone, and Aïn
   M'Lila address are byte-identical across JSON-LD, footer, and GBP (when created). One
   `sameAs` per real profile (IG present; add FB/GBP when live).
7. **Off-site (highest real-world impact):** a **Google Business Profile** for Aïn M'Lila —
   the audit flagged this as missing and top-priority. AI Overviews lean heavily on GBP for
   local "وكالة عمرة قربي" intent. This is a client task, not a code task.

---

## 3 · MEASUREMENT PLAN  (the prerequisite for §1)

You can't optimize what you don't measure, and today **nothing is measured**. The funnel's
key event — WhatsApp/Call clicks — has zero tracking. This touches the locked "no backend /
WhatsApp-only" decision, so here are the options ranked by how little they bend it:

| Option | Footprint | Cookies/PII | Cost | Verdict |
|---|---|---|---|---|
| **Cloudflare Web Analytics** | 1 async beacon script | none (privacy-first) | free | **Recommended** — fits CF Pages, GDPR-clean, no backend |
| Plausible / Fathom | 1 script | none | paid | good, but paid for a pre-revenue site |
| Self-host (umami) | needs a DB/worker | none | low | violates "no backend" |
| GA4 | 1 script | cookies + consent banner needed | free | heaviest; consent burden in DZ/EU diaspora |

**Plus a zero-dependency click-event hook** (ships regardless of which analytics): a ~15-line
vanilla delegated listener on `a[href^="https://wa.me"]`, `a[href^="tel:"]`, and `.map-link`
that pushes a `dataLayer`/custom event (and `navigator.sendBeacon` if an endpoint exists).
No PII, no library, reversible. This is the canonical conversion event for every §1 test.
**This is implementable now** as a Wave-3 increment (`assets/js/track.js`, gated behind a
`data-analytics` flag so it's a true no-op until you opt in).

**Decision needed from you:** add Cloudflare Web Analytics at deploy? (one script tag,
no cookies). If yes, I wire it + the click hook. If you'd rather stay 100% script-free,
the click hook can still log to console / `dataLayer` for manual QA and future wiring.

---

## 4 · DESIGN ROADMAP — best case / worst case

What the UI test pass this session established (so the roadmap is grounded, not guessed):
**verified healthy** — grids fill their rows (no empty cells), no horizontal overflow at
375/1280, no broken images, hero subjects correct, price block fixed (no number-split,
aligned across cards), a11y solid (alt/names/contrast/headings/touch/modal). The remaining
work is *craft elevation*, not bug-fixing.

Each item below has a **worst-case** (minimal, near-zero regression risk, ship anytime) and a
**best-case** (ambitious, higher craft, more surface area / risk).

| Area | Worst case (safe floor) | Best case (ceiling) | Risk |
|---|---|---|---|
| **Itinerary** (trip pages) | keep the 3 "departure/stay/return" cards, tighten copy | a real connected **vertical timeline** with day markers + RTL connectors — the biggest "human-designed" signal left | med (6 pages) |
| **Hero** | current centered hero + directional scrim (done) | asymmetric composition with an overlapping price/trust card; per-destination accent | med |
| **Brand soul** | khatam + girih already shipped | one **Amiri pull-quote band** (a reverent du'a/slogan moment) bridging Caregiver↔Explorer on home | low |
| **Guide trust** | monogram placeholder (done) | real **guide photo** of Haddad Youssef Islam near every CTA (audit: the core trust asset) | low (needs asset) |
| **Sakina/omra** | arch frame present (1/viewport) | richer arch usage + calmer motion-free reveal choreography | low |
| **Micro-interactions** | hover lift + button press (done) | tasteful card image parallax, price count-up on reveal (Rihla only, reduced-motion-safe) | med |
| **Catalog** | 2×3 balanced grid (done) | optional price **sort/filter** ("الأرخص أولًا") — pure CSS/JS, helps "exploring prices" flow | med |
| **Dark mode** | logo theme-swap + contrast pass (done) | audit every section's dark surface for depth (girih is footer/Sakina only today) | low |

**Recommended sequence:** Amiri pull-quote (low risk, high brand) → itinerary timeline (high
craft) → guide photo (needs client asset) → catalog price sort. Each ships + verifies
independently (per the session-limit lesson — no mega-agent).

**Worst-case fallback if time/budget is tight:** the site as it stands is already
launch-ready (grids, price, a11y, perf, governance all verified). None of the best-case items
are blockers — they're upside.

---

## SEQUENCING (how it all fits)

1. **Pre-launch (now):** finish design floor; add the click-event hook (no-op until opted in);
   add FAQPage + TouristTrip schema (AEO §2.1–2.2).
2. **Launch:** deploy to CF Pages; turn on Cloudflare Web Analytics; create the GBP.
3. **First 4–6 weeks:** accumulate traffic; ship sticky-bar (E1) as default; watch WA CTR.
4. **Once ~1k trip-visits:** begin the A/B backlog (E2, E3) one at a time, pre-registered.
5. **Ongoing:** AEO content (question-H2s, llms.txt), review-generation, cross-pillar nurture.

*Owner: client + Nomara. Code increments (click hook, FAQ/Trip schema) are ready to build on
request — see Wave 3.*
