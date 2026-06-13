# NOMARA — "Alliance-level polish" audit & pass (2026-06-13)

Audited the shipped Nomara site against the **Alliance Travel build playbook**
(bug database §7, governance §6, trip-page anatomy §3, weight budgets §7). The
playbook is applied as *intelligence* — none of Alliance's content/data was copied.

## Verdict: the site was already structurally sound

Passed clean on the things Alliance got wrong the hard way:

| Alliance bug class (§7) | Nomara status |
|---|---|
| Trip-data drift (price ≠ card ≠ JSON-LD) | ✅ consistent (e.g. turquie 119000 in hero/meta/JSON-LD) |
| Dead selectors (silent fail) | ✅ reveal.js / enhance.js / i18n.js query live classes |
| class↔ARIA desync | ✅ toggle `aria-expanded`, theme `aria-pressed`, lang `is-active` all synced |
| Two reveal systems both `opacity:0` | ✅ one engine (reveal.js); no AOS |
| Stale hardcoded dates | ✅ dates are honest "قيد التأكيد / upcoming", not fake-current |
| Image license + **subject/geography** | ✅ azerbaijan hero = Flame Towers **Baku** (not Alliance's Samarkand bug); all 15 gallery subjects correct |
| Weight budget (AVIF<250 / LCP<200KB) | ✅ no hero AVIF over budget |
| Governance §6 (no fake scarcity/ratings) | ✅ no "+1200" count, no `aggregateRating`, "مقاعد" only in honest "contact for availability"; visa page already hedges ("القرار بيد القنصلية ولا نضمن… قيد التطوير") |

## What this pass added (the genuine gaps vs Alliance trip-page anatomy §3)

1. **"ما لا يشمله السعر" (excluded list)** on all 6 trip pages (5 leisure + omra) —
   Alliance's #1 trust element, "kills the what's-the-catch objection." Honest,
   destination-safe items; no fabricated visa/fee claims. Umrah variant is
   Umrah-specific (hady, ziyarat, official fees).
2. **Related cross-sell** on all 6 trip pages — the audit's flagged **#1 missed
   opportunity**: the Umrah↔leisure cross-pillar lifecycle. Every leisure page
   links one Umrah card; omra links back to leisure ("بعد العمرة"). Umrah cards
   stay gradient (no fake Mecca stock); Sakina applies the arch mask automatically.
3. **PWA service worker** (`site/sw.js`) — Alliance parity, conservative:
   HTML network-first (stays fresh while iterating), static stale-while-revalidate,
   precache "/" only (Alliance lesson #9), versioned cache `nomara-v1` (lesson #8:
   bump on byte change). Registered from enhance.js after `load`.
4. **Dead-weight cleanup** — `logo-full.png` (2.0MB) + `logo-mark.png` (0.88MB)
   were shipping unreferenced; moved to `brand-assets/` (repo, out of the deploy).

FR strings for the new copy were appended to the i18n literal AR→FR map; AR is
canonical, any miss falls back to AR gracefully (strategy c).

## Process note (Alliance §9 / §7-#15)

Done in **small, self-verifying, scoped commits by the main session** — not a big
background agent (the §9 lesson: background agents die on session limits mid-task,
which is exactly what bit the earlier phase-7 agent). Each wave: edit → `node --check`
/ DOM-probe render → scoped commit.

## Remaining TODO-CLIENT (unchanged, business decisions)

License number, exact email, opening hours, confirmation of prices/dates, real
guide photo, real on-site Umrah footage. None are engineering blockers.
