# NOMARA VOYAGES — UX / MOTION CRITIQUE & MOTION-PASS LOG

> **Origin / status (added 2026-06-13):** auto-generated during the dark-theme + responsive-nav agent
> pass via live render. NOT an official project phase. The original "MUST FIX" critique text below
> predates the implementation that the same pass then shipped — read it as a log, not an open to-do list.
>
> ✅ **IMPLEMENTED in the theme/responsive/motion commit:** P0-1 (trip-card image `display:block` +
> aspect-ratio), P0-2 (mobile drawer un-trapped — `backdrop-filter` removed from `.site-nav`), P0-3
> (lazy-image fade via `reveal.js`), P0-4 (hero text-overlay entrance), P0-5 (reveal timing/threshold
> tuning + `will-change` cleanup), P1-3 (button `:active` press), P1-4 (drawer slide + shadow), P1-5
> (FAB + sticky entrance; FAB hover-scale dropped), P1-6 (card image hover zoom), P2-2 (scrolled-nav
> hairline). A `@media (scripting: none)` safety net was added so these JS-revealed elements degrade
> gracefully if JS fails to load.
>
> ⏳ **NOT YET DONE — backlog:** P0-6 (Égypte price empty-state restyle — keep `TODO-CLIENT`, no
> fabrication), P1-1 (directional hero scrim), P1-2 (visible Arch motif on `/omra/`), P1-7 (stagger
> delay collision), P1-8 (`/voyages/` filter chips), P1-9 (Sakina price weight), P1-10 (body-copy
> measure cap), P1-11 (focus-ring contrast on coral/gold), P2-1 & P2-3…P2-9.

---

## (original critique — verbatim)

> Reviewer: Adversarial senior UI/UX + motion critic. Date: 2026-06-13. READ-ONLY pass.
> Method: full source read of `styles.css`, `reveal.js`, `enhance.js`, `i18n.js`, `design-system.html`,
> home / omra / tunisie / voyages / contact / faq, BUSINESS-AUDIT + QA-REPORT — **plus live render**
> via Claude_Preview MCP on the running server (port 8732) at **375 / 768 / 1440 px**.
> Rendered & screenshotted: home (AR mobile, FR mobile, desktop grid), omra/Sakina (mobile hero + price grid).
> Computed-style probes used to confirm pixel-level defects. Screenshot capture wedged on the Google-Fonts
> fetch after ~12 captures (a known preview quirk); FR/LTR and tablet judgments are backed by the FR screenshot
> taken first + `getComputedStyle` measurements rather than a fresh image (noted inline).
>
> This report deliberately does **not** re-litigate the QA-REPORT (links, honesty, a11y floor, mode compliance —
> all verified PASS there). It goes after **craft, motion, and delight**, and it found **two render-level P0 bugs
> the static QA pass missed** because they only surface in a real browser.

---

## 0 · Overall verdict — honest

**The foundation is genuinely excellent; the surface is half-finished.**

What is *genuinely good* (not flattery — measured): the token architecture is disciplined and real (zero raw hex
leakage outside the documented locks); the dual-mode system *works* — Sakina renders Amiri + gold + gradient hero
with **zero `[data-reveal]` nodes in the markup** (stillness is built in, not bolted on); the Rihla hero is the
strongest screen on the site — scrim-backed white Changa over the Istanbul photo is legible and confident, CTAs are
prominent and thumb-reachable; the Umrah price grid reads cleanly with gold Changa numerals; RTL logical-properties
discipline holds up under live inspection; the FR↔AR switch round-trips `lang`/`dir`/text correctly.

What is *mediocre*: the motion layer is **timid and incomplete** — it does the one thing (scroll-reveal body
content) competently and then stops. There is **no hero entrance, no lazy-image fade (pop-in), no drawer-slide
polish you can actually see, no button press feedback, no FAB/sticky entrance**. For a brief whose #1 stated
priority is *motion and smoothness*, the site currently feels static-with-a-fade, not crafted. The hero scrim is a
flat full-cover darkening rather than a composed gradient. The Sakina "Arch" — the brand's one ownable signature
device — **never actually appears to the user** on the one Sakina page, because omra has no card images above the
fold and the hero is gradient-only.

What is *weak / broken* (the part that makes this "not shippable as-is" despite the QA GO): **the primary content
component — the trip card — is visually broken on every listing page**, and **the mobile nav drawer is broken on
every page**. Both are CSS-cascade defects invisible to static analysis and to a screenshot that doesn't probe
geometry. Details in P0 below. These two alone outrank every polish item.

**Priority counts:** P0 = 6 · P1 = 11 · P2 = 9.

---

## P0 — MUST FIX (hurts UX / conversion / brand *now*)

### P0-1 🔴 Trip-card images render ~500–620px tall instead of 180px — every card on every listing is broken
**Page+element:** home `#featured-trips` `.n-card .img`, `/voyages/` `.n-card .img` (and any trip-detail gallery
using the pattern). **Render-confirmed** at 375 (img 503px), 768 (img 623px), 1440 (tall portrait blocks).
**Problem:** the card image wrapper is `<a class="img">`. Anchors are `display:inline` by default, and the
`.n-card .img { height:180px; overflow:hidden }` rule **never sets `display:block`**, so on an inline box the
`height` and `overflow` are *ignored*. The inner `<img width="800" height="450">` then resolves its own
aspect-ratio (800/450) to the card width → 503px at mobile, 623px at tablet. The image fills the entire card;
the title, price, chips and CTA are **pushed completely below the visible card** (probe: image bottom == card
bottom). The design-system demo never caught this because the demo used `<div class="img">` (a block); the real
pages swapped to `<a class="img">` for click-through and silently broke the component. **This destroys the
"price is the #1 signal" thesis — the price is off-screen on every card.**
**Fix:** in `styles.css`, make the image wrapper a block and re-assert the clip:
`.n-card .img { display:block; height:180px; overflow:hidden; }` (the existing `.n-card .img > img` cover rules
then take effect). Verify the `[data-mode="sakina"] .n-card .img` arch variant still clips. Consider
`aspect-ratio: 16/10` instead of a fixed 180px so it scales with card width.
**Target file:** `site/assets/css/styles.css` (the `.n-card .img` block ~line 417). **SHARED — 1 fix → all listings.**

### P0-2 🔴 Mobile nav drawer is trapped inside the nav bar — opens as a clipped ~112px box, not a full-height panel
**Page+element:** all pages, `.nav-drawer` (built by `enhance.js`, appended into `.site-nav`).
**Render-confirmed** at 375: opening the hamburger shows a 315×**112px** white box in the top corner with the 7
links overflowing/clipped — not the intended full-height slide-in panel.
**Problem (root cause, probed):** `.site-nav` has `backdrop-filter: saturate(1.2) blur(8px)`. Per CSS spec, an
element with a `backdrop-filter` other than `none` **establishes a containing block for `position:fixed`
descendants** (same as `transform`/`filter` do). `enhance.js` appends `.nav-drawer` *inside* `.site-nav`, so the
drawer's `position:fixed; inset-block:0` resolves against the **65px-tall nav**, not the viewport. Result: the
drawer can't reach full height and is clipped. `nav.contains(drawer) === true` + `nav backdrop-filter:
saturate(1.2) blur(8px)` confirmed live. **The mobile primary navigation is non-functional.**
**Fix (pick one, in order of preference):**
  (a) In `enhance.js`, append the `.nav-drawer` and backdrop to `document.body` instead of `nav` (keeps the frosted
      nav). This is the clean fix — the drawer escapes the containing block. **Recommended.**
  (b) OR in `styles.css`, drop `backdrop-filter` from `.site-nav` and use an opaque/`color-mix` background only
      (loses the frosted-glass nav, but trivial).
  (c) OR give `.nav-drawer` its own stacking via a `<body>`-level portal element.
**Target file:** `site/assets/js/enhance.js` (drawer construction ~line 47–63) **+ verify** `styles.css` drawer
rules still anchor to `inset-inline-end`. **SHARED — all pages.**

### P0-3 🟠→🔴 Lazy images pop in with no fade — the #1 perceived-smoothness defect, and it's the brief's priority
**Page+element:** every `loading="lazy"` `<img>` (all trip-card images, gallery placeholders).
**Problem:** there is **no image-load transition anywhere**. Combined with P0-1, cards currently snap from
empty→full-height-image with a hard pop as each lazy image decodes on scroll. Even after P0-1 is fixed, the
images will still hard-pop. The brief explicitly calls out the "pop-in problem" and asks for a lazy-image
fade-in. Right now the site has scroll-reveal on *text blocks* but the *photos themselves* — the heaviest, most
visible elements — appear with zero grace.
**Fix (vanilla, no lib):** add a tiny image fade. In `styles.css`:
`.n-card .img img { opacity:0; transition: opacity 400ms var(--ease-out); }`
`.n-card .img img.is-loaded, .n-card .img img[data-loaded] { opacity:1; }`
and in a few lines of `reveal.js` (or a new `img-fade` init), set `is-loaded` on `load` and immediately for
already-`complete` images (cache). Honor reduced-motion (the global kill-switch already neutralizes the
transition). **Do NOT apply this to the LCP hero `<img>`** (constraint #2 — hero must paint immediately).
**Target file:** `site/assets/css/styles.css` + `site/assets/js/reveal.js` (or `enhance.js`). **Motion item. SHARED.**

### P0-4 🟠 Hero has no load-in entrance — the most important screen arrives flat
**Page+element:** `.hero__inner` (chip → h1 → p → CTA row) on home + all trip details.
**Problem:** the LCP hero *image* must paint instantly (correct, keep it). But the hero **text/CTA overlay** has
no entrance at all — it's just there. Every reference travel/booking hero does a gentle staggered rise of the
copy block *after* the image is up. Its absence is the single biggest reason the site "feels static" on first
paint. This is fully compatible with constraint #2: animate only the overlay (`.hero__inner` children), never the
background image.
**Fix (vanilla):** add a one-shot CSS entrance on the overlay only, triggered by a class set on `DOMContentLoaded`
(not scroll): chip/h1/p/cta fade + 12–16px rise, ~480ms, `--ease-out`, staggered 60–80ms via
`transition-delay`/`nth-child`. Gate behind a `.hero-ready` body/section class so it fires once on load. Must be a
**no-op under reduced-motion and under Sakina** (omra hero should stay perfectly still — constraint #1).
**Target file:** `styles.css` (new `.hero__inner > * ` entrance rules) + ~5 lines in `enhance.js` to add
`.hero-ready`. **Motion item. SHARED (guard Sakina).**

### P0-5 🟠 Reveal motion is invisible/janky in practice — rootMargin fires too early and the easing is too quick to read
**Page+element:** all `[data-reveal]` blocks; `reveal.js` + the `[data-reveal]` CSS.
**Problem:** current spec is `fade + translateY(16px)`, `transition: 240ms`, observer
`threshold:0.12, rootMargin:'0px 0px -8% 0px'`. Three craft issues, render-observed: (1) **240ms is too fast** to
register as intentional motion — it reads as a flicker, not a reveal; AOS-class polish lives at 500–700ms for
body content. (2) **16px is too small a travel** to feel like anything at these durations. (3) the
`-8%` bottom rootMargin means elements often begin revealing while still 8% below the fold — by the time they're
centered they're already done, so the user *never sees the animation*, only its aftermath. (4) Stagger is
hand-coded per-element via `data-reveal-delay` with a hard 320ms cap — fine, but the cap is applied inconsistently
(home featured cards step 0/80/160/240/320/320 — the last two collide).
**Fix:** bump to `fade + 24px rise`, `transition: 600ms var(--ease-out)` for transform / `420ms` for opacity;
observer `threshold: 0.15, rootMargin: '0px 0px -12% 0px'` so the element is genuinely on-screen when it animates;
keep stagger but cap at 6 steps × ~90ms (≈540ms total, matches AOS guidance) and fix the 320/320 collision.
Confirm `--ease-out: cubic-bezier(.22,.8,.36,1)` is the easing on *both* opacity and transform (it is, keep it).
Add `will-change: opacity, transform` on un-revealed `[data-reveal]` and **remove it** after reveal (in JS, on the
same `unobserve`) to avoid leaving dozens of promoted layers alive.
**Target file:** `site/assets/css/styles.css` (`[data-reveal]` block ~877) + `site/assets/js/reveal.js`.
**Motion item. SHARED (Sakina already exempt — keep the `!important` stillness override).**

### P0-6 🟠 Égypte card shows «السعر عند الطلب» where every sibling shows a bold price — the price-anchor row breaks
**Page+element:** home + voyages Égypte `.n-card .n-price .amount` (text instead of numeral).
**Problem:** this is flagged in QA as honest-deferral (price genuinely unconfirmed), and that's correct *content*.
But *visually*, the Égypte card's price slot renders body-weight text in the price-color where neighbors render
big Changa numerals — it reads as a dead/error state in the grid, and it's the one card carrying a `−25%` promo
badge, so the eye lands on it and finds no number. The promo badge promises a deal the card can't show.
**Fix (no fabrication):** style the "price-on-request" state as a *deliberate* token, not a fallback — e.g. a
small teal chip «السعر عند الطلب — تواصل لمعرفته» sized like the other prices' baseline, OR move the WhatsApp CTA
up as the primary affordance for that one card. Add a `.n-price--on-request` modifier so it looks designed.
**Target file:** page-specific markup (`site/index.html`, `site/voyages/index.html`) + a small `styles.css`
modifier. **Page-specific (2 cards) + shared modifier.**

---

## P1 — HIGH-VALUE POLISH

### P1-1 🟡 Hero scrim is a flat full-cover darkening — text legibility is "okay", composition is muddy
**Element:** `.hero__media::after` — `linear-gradient(180deg, rgba(7,33,30,.35), rgba(7,33,30,.78))`.
**Problem:** it darkens the *entire* photo uniformly, which both (a) mutes the photography (the brand's "real
footage > stock" asset) and (b) still leaves mid-photo text sitting on a busy region. A senior treatment localizes
the scrim where the text is.
**Fix:** replace with a directional/bottom-weighted gradient anchored to the text side (inline-start in RTL) so the
photo stays vivid where there's no text: e.g. `linear-gradient(to bottom, rgba(7,33,30,.15) 0%, transparent 35%,
rgba(7,33,30,.55) 70%, rgba(7,33,30,.82) 100%)` plus a subtle inline-start `radial`/`linear` for the copy column.
Keep it token-independent (it's a documented legibility lock). **Target:** `styles.css` `.hero__media::after`. SHARED.

### P1-2 🟡 The Arch — the brand's signature device — is invisible on the only Sakina page
**Element:** omra hero + omra content. **Problem:** §05 says the arch is "Sakina's silent marker… tells the user
which world they're in before they read a word." On `/omra/` the hero is gradient-only (no image, no arch) and
there are no card images, so the user **never sees an arch**. The one ownable motif is absent exactly where it's
supposed to live. **Fix (no motion, within constraints):** apply the arch as an *outlined frame* (the §05 third
variant: `border-radius: var(--radius-arch)`, 2px gold border, sand fill) around the "ما يشمله السعر" block or a
guide-intro/du'a card — a still, reverent arch-framed element. One per viewport max (per §05). **Target:**
`site/omra/index.html` + a small `.arch-frame` util in `styles.css`. Page-specific.

### P1-3 🟡 No button press feedback — `:active` only cancels the hover lift
**Element:** `.n-btn:active { transform: none; }` (all buttons, all pages). **Problem:** on tap/click there is no
*positive* feedback — the design-system §06 promises "active = no lift" but a flat cancel reads as nothing
happening, especially on touch where there's no hover. **Fix:** give `:active` a real micro-response:
`transform: translateY(0) scale(.98); transition-duration: 90ms;` (scale-down is the one place a button *should*
scale — it signals press). Honor reduced-motion (global kill-switch covers it). **Motion item. Target:** `styles.css`
`.n-btn:active`. SHARED.

### P1-4 🟡 Nav-drawer slide easing/curtain is not perceivable; backdrop fade is fine but the panel "appears"
**Element:** `.nav-drawer` transition (after P0-2 is fixed). **Problem:** the transform transition is
`var(--dur-base)` = 240ms — once the panel is un-trapped it'll still snap. Drawers want a slightly longer, eased
slide. **Fix:** `transition: transform 320ms var(--ease-out)`; add a faint inline-start shadow that deepens as it
opens; stagger the drawer's link list in by 30ms each for a "settle". **Motion item. Target:** `styles.css` drawer
block + optional `enhance.js`. SHARED. (Do P0-2 first.)

### P1-5 🟡 FAB and sticky bar have no entrance — they're just present, and the FAB hover *scales* (layout-jitter risk)
**Element:** `.fab-whatsapp`, `.n-sticky-bar`. **Problem:** (a) no entrance — a sticky conversion bar that slides
up on first scroll, and a FAB that pops in after the hero, are standard delight beats that are missing. (b)
`.fab-whatsapp:hover { transform: translateY(-2px) scale(1.04); }` — the design-system §07 explicitly says "Never
scale buttons." The FAB scaling on hover contradicts the system's own motion law. **Fix:** add a one-shot
slide-up/scale-in entrance for the sticky bar (transform from `translateY(100%)`) and a fade+rise for the FAB,
fired on load or first scroll; change FAB hover to `translateY(-2px)` only (drop the scale) or a shadow bloom.
**Motion item. Target:** `styles.css` + `enhance.js`. SHARED.

### P1-6 🟡 Card hover lift is fine, but there's no image zoom — the most "premium" cheap win is unused
**Element:** `.n-card:hover`. **Problem:** card lifts (`translateY(-3px)` + shadow) but the photo inside stays
inert. A subtle image scale-on-hover (the *image*, contained by `overflow:hidden`) is the single most effective
"this feels crafted" micro-interaction for trip cards. **Fix (after P0-1):** `.n-card .img img { transition:
transform 600ms var(--ease-out); } .n-card:hover .img img { transform: scale(1.04); }`. Pointer-only (hover
media), reduced-motion-exempt. **Motion item. Target:** `styles.css`. SHARED.

### P1-7 🟡 Featured-trips stagger collides (delays 0/80/160/240/320/**320**) and ignores RTL reading order
**Element:** home `#featured-trips` `data-reveal-delay`. **Problem:** the last two cards share `320` so they pop
together; and in a 3-col RTL grid the stagger should cascade by *visual* row order, which left-to-right delay
values don't respect. **Fix:** recompute delays per row (reset to 0 at each row start) or cap at one row's worth;
fix the collision. **Target:** `site/index.html` (+ any listing reusing fixed delays). Page-specific.

### P1-8 🟡 `/voyages/` filter chips look interactive but only jump (no filter) — and the active chip has no state
**Element:** `.n-meta-row` chips `href="#tunisie"` etc. **Problem:** (QA flagged D1 as cosmetic; from a UX-craft
view it's a real expectation break) — they're styled identically to filter pills, sit under "تصفية حسب الوجهة"
(filter by destination), but only anchor-jump. Users will read them as filters and feel the page is broken when
all cards stay. No `:target`/active styling either. **Fix:** either implement a tiny CSS `:target` filter (hide
non-matching `.n-card`, show all on `#all`) — pure CSS, no JS, fits the no-lib budget — **or** relabel the section
"اذهب إلى" (jump to) and add an active/`:focus` chip state. **Target:** `site/voyages/index.html` + `styles.css`.
Page-specific.

### P1-9 🟡 Prices "pop" less in Sakina (gold-600) than they should for the brand's #1 signal
**Element:** `.n-grid td.p`, `.n-price .amount` in Sakina. **Problem (render-observed):** gold-600 `#95761F` on
white is a muted olive at price size — it passes contrast but lacks the *confidence* of the Rihla coral price.
The brand thesis is "price is a feature / typographic hero." In Sakina the hero-ness is undersold. **Fix:** keep
the gold (reverence constraint) but increase price *weight/size* in Sakina specifically, or pair the numeral with
a hairline gold underline/rule so it reads as deliberate emphasis rather than dull text. Do **not** switch Sakina
to coral. **Target:** `styles.css` (a `[data-mode="sakina"] .n-grid td.p` tweak). Page-specific to Sakina.

### P1-10 🟡 Hero `<p>` measure is fine but body copy elsewhere has no max-width guard → long lines on desktop
**Element:** `.service-card p`, inline `<p>` in why/trust blocks. **Problem:** `.hero p` and `.sec-head` cap
measure (52–64ch ✓), but service-card and several inline paragraphs have no `max-width`, so at 1440 in a wide card
the Arabic body can exceed the ≤65ch readability rule. **Fix:** add `max-inline-size: 60ch` (or `62ch`) to body
paragraph defaults / `.service-card p`. **Target:** `styles.css`. SHARED.

### P1-11 🟡 Focus ring uses `--color-accent` (coral/gold) which can vanish on coral/gold elements
**Element:** global `:focus-visible { outline: 3px solid var(--color-accent); }`. **Problem:** a coral focus ring
on a coral accent button (or gold on gold in Sakina) has near-zero contrast against its own background — the focus
indicator disappears on exactly the highest-priority CTAs. **Fix:** use a dual ring (`outline` + `box-shadow`
offset in a contrasting ink/white), or switch the ring to `--text-strong`/white-with-offset so it's visible on any
background. Accessibility-adjacent but a real keyboard-UX gap. **Target:** `styles.css`. SHARED.

---

## P2 — NICE-TO-HAVE DELIGHT

- **P2-1 🟢 Sticky-bar entrance tied to scroll direction** (slide up when scrolling down past the hero, tuck away
  scrolling up). Motion item. `enhance.js`. SHARED detail pages.
- **P2-2 🟢 Nav shadow transition is good; add a 1px hairline + slight bg-opacity step on `.is-scrolled`** so the
  frosted nav gains presence over content. `styles.css`. SHARED.
- **P2-3 🟢 Guide-photo touch near CTAs** (BUSINESS-AUDIT: founder Haddad Youssef Islam is "the brand's core trust
  asset"). No guide face appears anywhere on the rendered pages. Add a small circular guide portrait beside the
  trust strip / final CTA — the single highest "companion not vendor" delight move. Page-specific (about/home/omra).
- **P2-4 🟢 Departure-from-Constantine motif** — a tiny inline "✈ قسنطينة →" route glyph on cards/heroes would
  reinforce the one geographic differentiator. Decorative SVG only, no motion. `styles.css`/partials.
- **P2-5 🟢 FAQ accordion has no open/close transition** — `<details>` snaps. A `grid-template-rows` height
  transition on `.faq-body` (reduced-motion-exempt) would smooth it. Motion item. `site/faq/index.html` `<style>`.
- **P2-6 🟢 Trust-strip icons are all the same teal stroke weight** — fine, but a faint `--color-primary-soft`
  chip behind each icon (like `.service-card__icon`) would lift the strip from "list" to "component." `styles.css`.
- **P2-7 🟢 `n-badge-promo` "−25%" and the Égypte card** — the promo badge is good, but it's the *only* urgency on
  the page; consider a subtle one-time pulse on load (Rihla only, ≤1 per page, reduced-motion-off) for the promo
  badge. Motion item. Respect "one urgency element per Rihla page." `styles.css`.
- **P2-8 🟢 Section-background rhythm is mostly alternating sand/white**, but several sections are the same
  surface back-to-back (trust → why → testimonials), flattening the vertical rhythm. Audit the home section order
  for surface alternation. Page-specific.
- **P2-9 🟢 Mode/token transition (`[data-mode] { transition: background/color 240ms }`)** is set globally but
  modes never change at runtime (mode is per-page). This transition is dead weight on every element-less surface;
  harmless but consider scoping it. `styles.css`. (Cosmetic.)

---

## DO NOT TOUCH — immovables for the implementer

1. **`/omra/` (Sakina) stays STILL.** No scroll animation, no hero entrance, no card-image fade, no reveal — the
   page correctly has zero `[data-reveal]` nodes and the CSS `!important` stillness override. Every motion item
   above (P0-3, P0-4, P0-5, P1-3, P1-4, P1-5, P1-6, P2-x) MUST be a no-op under `[data-mode="sakina"]`. Keep Amiri,
   gold, gradient hero, reverence. Stillness is the design.
2. **LCP hero `<img>` paints immediately** — never apply opacity/transform/fade to the first above-the-fold hero
   *image*. P0-4's entrance animates the hero *text overlay only*, never the background image.
3. **No animation libraries.** All motion stays vanilla (IntersectionObserver + CSS). No AOS, no GSAP. Perf budget
   LCP < 2.5s on 3G; keep JS tiny. `will-change` must be added *and removed*, never left on dozens of nodes.
4. **Token system only** (no raw hex except the documented photo-overlay legibility locks), **logical CSS
   properties only** (RTL), **reduced-motion honored** (global kill-switch — every new transition inherits it),
   **48px touch targets**, **WhatsApp = checkout**, **honesty / `TODO-CLIENT` content stays** (do not invent the
   Égypte price in P0-6 — restyle the empty state, don't fill it).

---

## Render coverage note

| Viewport | Home | Omra (Sakina) | Voyages | Tunisie | Services | Contact | FAQ |
|---|---|---|---|---|---|---|---|
| 375 mobile | ✅ screenshot (AR + FR) + probes | ✅ screenshot (hero + price grid) + probes | ⬛ source + probe (same broken card pattern confirmed) | ⬛ source | ⬛ source | ⬛ source | ⬛ source |
| 768 tablet | ✅ probe (card 623px bug confirmed) | ⬛ source | ⬛ source | ⬛ source | ⬛ source | ⬛ source | ⬛ source |
| 1440 desktop | ✅ screenshot (broken grid confirmed) | ⬛ source | ⬛ source | ⬛ source | ⬛ source | ⬛ source | ⬛ source |

✅ = rendered/screenshotted live · ⬛ = source-read + (where noted) computed-style probe against the shared,
already-rendered component rules. **Could I render visually at each viewport?** Yes for the load-bearing cases
(home + omra at mobile, home at desktop, plus FR/LTR). Screenshot capture wedged on the Google-Fonts fetch after
~12 captures; remaining viewport/page judgments fall back to `getComputedStyle` probes (which is what *proved* the
two P0 cascade bugs) and source analysis against the shared component CSS. The two P0 render bugs are
breakpoint-independent and confirmed by direct geometry measurement, not just by eye.
