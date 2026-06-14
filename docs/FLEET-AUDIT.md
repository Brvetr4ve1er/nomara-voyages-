# Nomara Voyages — Fleet Audit (2026-06-14)

10 parallel reviewer agents (a11y, perf, SEO, CSS, JS, HTML, UX, i18n, config,
consistency) + 1 synthesis agent. 76 raw findings → **46 verified, deduped
issues**, ranked critical-first.

**Result: 40 / 46 fixed.** Remaining 6 are blocked on client data or a deliberate
keep (listed at the bottom). Status: ✅ fixed · ⛔ blocked on client data · 🔒 deliberate keep.

> A startup investigation also ran — see the bottom section.

## Critical
| # | Status | Issue |
|---|--------|-------|
| 1 | ✅ | Literal `TODO-CLIENT` license number — degraded to `وكالة سياحية مرخّصة` site-wide (real number still needed) |
| 2 | ⛔ | Placeholder domain `nomaravoyages.com` in canonical/OG/JSON-LD/sitemap/robots/sw — needs final domain |

## High
| # | Status | Issue |
|---|--------|-------|
| 3 | ✅ | Visible `قيد التأكيد`/`TODO-CLIENT` copy — stripped from visa, contact, a-propos, footer email, testimonials |
| 4 | ✅ | JSON-LD streetAddress now matches visible `حي الغزالي` (15 pages + meta descriptions) |
| 5 | ⛔ | Real email + visa service scope still need client confirmation (placeholders removed in the meantime) |
| 6 | ✅ | Map-link i18n key fixed — now translates to FR |
| 7 | ✅ | WhatsApp `?text=` localizes to a French greeting in FR mode |
| 8 | ✅ | SW navigate branch guards redirects/non-200 + `.catch` |
| 9 | ✅ | `<main tabindex="-1">` + `main:focus{outline:none}` (16 pages) — skip link moves focus |
| 10 | ✅ | Drawer focus trap + background inert |
| 11 | ✅ | SW CACHE date-stamped → purges on release |
| 12 | ✅ | LCP hero preloaded (per-page, media+type mirror of `<picture>` — no double-download) |
| 13 | ✅ | Google Fonts non-blocking (preload + media-swap + noscript) |
| 14 | ✅ | Trip-card CTA hierarchy — WhatsApp dominant |
| 15 | ✅ | Generators guarded — refuse to run without explicit opt-in (stop SEO/maps revert) |
| 16 | ✅ | Same guard covers the per-page SEO clobber |
| 17 | ⛔ | robots/sitemap host — needs final domain (same blocker as #2) |

## Medium
| # | Status | Issue |
|---|--------|-------|
| 18 | ✅ | `--z-backdrop:590` — scrim now covers the top bar |
| 19 | ✅ | `will-change` JIT (`:not(.is-revealed)`) |
| 20 | ✅ | SW network-first for CSS/JS (respects must-revalidate) |
| 21 | ✅ | SW never resolves `respondWith` to undefined |
| 22 | ✅ | Empty Omra cross-sell card → branded icon tile (5 pages) |
| 23 | ✅ | Card titles h4→h3 (no heading-level skip) |
| 24 | ✅ | `aria-controls` set in JS once drawer exists; removed dangling static ref |
| 25 | ✅ | Eyebrow contrast → teal-700 (AA) |
| 26 | ✅ | Dark footer legal/disabled token re-pointed |
| 27 | ✅ | Home star rating → `n-stars` role=img + aria |
| 28 | ✅ | Short-portrait hero relief (`max-height:600px`) |
| 29 | ✅ | `priceRange` "DZD"→"$$" (15 pages) |
| 30 | ⛔ | Branded 1200×630 OG image — needs the asset created |
| 31 | ⛔ | hreflang/FR static pages — scope decision (FR is currently a runtime guest) |
| 32 | 🔒 | JSON-LD org node duplicated per page — kept (valid; search engines dedupe by @id; low ROI vs blast radius) |
| 33 | ✅ | Lang switcher `aria-pressed` (JS + static) |
| 34 | ✅ | Drawer listeners one-time guard (no double-bind) |
| 35 | ✅ | Drawer focus targets visible elements, falls back to drawer |
| 36 | ✅ | Footer address heading wired to `footer.addressTitle` |
| 37 | ✅ | Manifest icons `any` (no mask clip) |
| 38 | ⛔ | HSTS — deliberately gated on final domain serving HTTPS |
| 39 | ✅ | FR FAQ/service parity clauses restored |
| 40 | ✅ | Footer tagline / a-propos intro already translate via STATIC_TEXT_FR (verified) |
| 41 | ✅ | `data-i18n-aria` wired to theme toggle + map link (handler no longer dead) |
| 42 | ✅ | `partials/nav.html` synced to shipped form (data-i18n on span, not the `<a>`) |

## Low
| # | Status | Issue |
|---|--------|-------|
| 43 | ✅ | Star glyphs `aria-hidden` inside labelled `n-stars` |
| 44 | ✅ | robots.txt comment Cloudflare→Netlify |
| 45 | ✅ | Home card titles clickable to destination |
| 46 | ✅ | FAB hidden on mobile when sticky bar present |

## Design pass (ui-ux-pro-max + aos)
AOS-style motion **without the library** — extended the vanilla `[data-reveal]`
engine with `fade-up/down/left/right`, `zoom-in/out`, `flip-up` variants keyed off
the attribute value (RTL-aware, `--ease-spring` overshoot, inherits all
reduced-motion / Sakina / `scripting:none` safety nets). reveal.js deliberately
replaced AOS for perf — re-adding the CDN would undo that. Plus CTA hierarchy,
eyebrow contrast, dark-footer tokens, clickable card titles, FAB/sticky de-dup.

## Startup investigation
- **Runtime:** `python -m http.server 8732 --directory site` (`.claude/launch.json`).
- Python resolves in PowerShell/cmd (`C:\Python314`); the Claude Bash tool's PATH
  lacked it (exit 127) — environment quirk, not an app bug. `launch.json` is correct.
- Verified live: all 9 sampled routes return **200**; CSS braces balanced, all 3 JS
  files + both generators parse clean, all JSON-LD blocks + manifest valid; the
  round-2 fixes confirmed in the served HTML.

## Still blocked on client data
Final domain (#2/#17) · contact email + visa scope (#5) · branded 1200×630 OG
image (#30) · hreflang/FR-page decision (#31) · HSTS enable post-domain (#38).
