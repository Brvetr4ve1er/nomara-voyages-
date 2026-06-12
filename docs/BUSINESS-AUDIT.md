# NOMARA VOYAGES — BUSINESS INTELLIGENCE DOSSIER (source of truth for all copy/content)

> Confidence: company facts, contacts, location, product list, and pricing = HIGH (directly observed).
> Personas, sentiment, competitor names, team size = MEDIUM/LOW inference.
> NEVER fabricate verifiable claims (license numbers, review counts, exact dates) — mark `TODO-CLIENT` instead.

## 1 · Identity

- **Name:** Nomara Voyages — Arabic: نومارا للسياحة و الأسفار / نومارا للسياحة و خدمات الحج و العمرة
- **Category:** Travel agency (hybrid: Hajj & Umrah + leisure organized tours)
- **Base:** Ghazali district (غزالي), Aïn M'Lila, Oum El Bouaghi, Algeria, 04003
- **Departure hub:** Constantine Airport (مطار قسنطينة) — "direct flights from Constantine"
- **Phone / WhatsApp:** 0661 45 70 25 → `wa.me/213661457025`
- **Email:** Gmail address (exact address TODO-CLIENT)
- **Socials:** Instagram @nomara.voyages (835) · Facebook "Nomara voyages – نومارا للسياحة و الأسفار" (8.2K)
- **Guide / founder:** Haddad Youssef Islam — the visible, named guide; the brand's core trust asset
- **Languages:** Arabic-first (Algerian dialect + MSA) with French code-mixing ("Voyage Organisé", "Djerba", "Malaisie")
- **Slogans:** «اكتشف العالم مع نومارا» (Discover the world with Nomara) · «نومارا رفيقك في طاعتك» (Your companion in worship) · "Travel Like a Nomad"
- **Maturity:** early-growth, founder-led SME, regionally strong in eastern Algeria

## 2 · Brand

- **Archetypes:** Caregiver (primary — Umrah) × Explorer (secondary — leisure) × Everyman trace
- **Personality:** human/approachable 60%, friendly 20%, faith-rooted 15%, light premium gloss 5%. NOT corporate, NOT luxury.
- **Values:** faith/spiritual service · affordability ("عروض وأسعار تنافسية") · convenience ("حجز سهل وسريع", local departures) · trust & companionship · discovery
- **Voice:** warm, direct, motivational, first-person plural ("نرافقك"). High emotional intensity on religious content, upbeat on leisure. Urgency framing only in leisure (one per page max).

## 3 · Audience

- **Persona A — "Hajj Hopeful Hakim" (45–60):** devout, Umrah as spiritual milestone; fears scams/visa complexity; wants a smooth dignified pilgrimage with a knowledgeable guide.
- **Persona B — "Value Voyager Amina" (28–40):** family/couple, affordable organized holiday; fears hidden costs; wants price clarity and "it just works."
- **Emotional drivers ranked:** 1) trust/safety 2) belonging/spiritual fulfillment 3) convenience 4) status/aspiration 5) value.
- **Hidden needs:** legitimacy proof before paying large sums; visa/document/inclusion clarity; deposit-based payment; one accountable human throughout.

## 4 · Product catalog (observed, prices in DZD)

| Trip | Pillar | Price | Notes |
|---|---|---|---|
| Umrah Shawwal (عمرة شوال) | Sakina flagship | 235 000 | direct ex-Constantine, tiered hotels near Haram (e.g. 198k / 219k / 235k by hotel distance) |
| Umrah June (عمرة جوان — 16 جوان) | Sakina flagship | ~190 000+ | multiple departure dates, tiered hotel grid |
| Hajj services (خدمات الحج) | Sakina | — | guidance through rites, live on-site coverage heritage |
| Djerba — Hôtel Sidi Mansour ★★★★ | Rihla core | 55 000 | organized tour, full board |
| Sousse Palace ★★★★ | Rihla core | 40 000 | |
| Sousse Mantago | Rihla entry | 36 000 | lowest-priced SKU |
| Egypt — Cairo (رحلة مصر) | Rihla core | — | multiple departures (spring dates observed; shift to upcoming TODO-CLIENT) |
| Hurghada "Collection Mirage" | Rihla promo | −25% | Red Sea resort promo |
| Baku / Azerbaijan | Rihla premium | ~119 000 | "Offre spéciale" |
| Istanbul | Rihla premium | 119 000 | |
| Malaysia (Malaisie) | Rihla premium | 199 000 | highest-priced SKU |

Hierarchy: Entry = Sousse 36k · Core = Tunisia/Egypt 40–55k · Premium = Istanbul/Baku/Malaysia 119–199k · Flagship = Umrah 190–235k.

## 5 · Conversion architecture (what the site must do)

- **Primary CTA:** "احجز مقعدك" (Reserve your seat) → pre-filled WhatsApp deep link (trip name + date) + call button. WhatsApp IS checkout — no fake e-commerce.
- **Secondary CTA:** "التفاصيل" / check availability / departures calendar.
- **Trust elements near every CTA:** licensed-agency badge (license number TODO-CLIENT), named guide, real footage, transparent fixed prices ("السعر شامل" — price includes flight + hotel + accompaniment; NEVER "starting from…").
- **Funnel:** Reel/Ad → trip detail page → WhatsApp lead → deposit → trip → review request → cross-pillar remarketing (Umrah ↔ leisure).
- **Friction to kill:** DM-only sales, no published itineraries/FAQ, no reviews surface.

## 6 · SEO opportunity (Phase 11)

High-intent keywords (AR + FR):
- وكالة عمرة عين مليلة / وكالة عمرة قسنطينة
- عمرة من مطار قسنطينة · أسعار عمرة 2026 الجزائر
- voyage organisé Djerba depuis Constantine · omra constantine prix
- voyage Malaisie / Bakou / Istanbul Algérie
Intent: transactional (price/date) + informational (visa, requirements, packing).
Content gaps: Umrah price/calendar pages, per-destination guides, visa & document FAQs, packing lists.
Local SEO: Google Business Profile missing = top priority (off-site task).

## 7 · Page requirements (Phase 10)

Home · Umrah & Hajj hub (Sakina) with package sub-sections · Organized Tours catalog (filterable) · Trip detail pages (itinerary, hotel, inclusions, dates, price, gallery) · About/Our Guide (humanize Haddad Youssef Islam + license) · Reviews/Testimonials · FAQ (visas, payments, Umrah packing) · Contact/Book · 404.

## 8 · Design mandate (see docs/design-system.html — canonical)

- Dual-mode token system: **Rihla** (رحلة — leisure, coral accent, Changa headings, bright sand) vs **Sakina** (سكينة — Umrah/Hajj, gold accent, Amiri headings, calmer sand-50, arch image mask, NO scroll animation).
- Arabic-first RTL native (`<html lang="ar" dir="rtl">`), French as runtime guest. Logical CSS properties ONLY.
- Fonts: Changa (display + ALL prices in both modes) · Readex Pro (body, AR line-height ≥1.7) · Amiri (Sakina headings/quotes only).
- Mobile-first, LCP < 2.5s on 3G, touch ≥48px, contrast ≥4.5:1, prefers-reduced-motion respected.
- WhatsApp green functional only. Emoji in Rihla promo badges only. Western numerals everywhere. Never letterspace Arabic.
