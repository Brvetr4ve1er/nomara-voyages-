# NOMARA VOYAGES — DEPLOY (live in ~30 minutes)

> Target: **Cloudflare Pages** (free tier). Static site, **no build step**, output dir = `site/`.
> Edit → push → live, same loop as the Alliance project. This doc is the whole runbook.

---

## 0 · Pre-flight (do these BEFORE deploy)

These are the only hard gates. Everything else in `QA-REPORT.md §6` is post-launch.

1. **Pick the production domain** (e.g. `nomaravoyages.com`). You will find-replace the placeholder
   `https://nomaravoyages.com` — it already happens to be the placeholder, so if that IS the final
   domain, **no replacement needed**. If it's different (e.g. `.dz`), run the find-replace in §3.
2. **License number** — drop the real `رقم الرخصة` into the footers (15 pages + 404) and a-propos.
   Optional for a *private* soft launch; required before public promotion of Hajj/Umrah.
3. **Prices** — confirm the `TODO-CLIENT` prices/dates or accept the honest «قيد التأكيد» framing.

You do **not** need email, Facebook URL, hours, or OG images to go live — they're stubbed honestly.

---

## 1 · Repository layout (already deploy-ready)

```
site/                     ← PUBLISH THIS DIRECTORY (set "output dir = site")
  index.html  404.html  robots.txt  sitemap.xml
  _headers                ← security + cache headers (Cloudflare reads this automatically)
  _redirects              ← 301 aliases (Cloudflare reads this automatically)
  assets/                 ← css, js, images, favicon, manifest
  <route>/index.html      ← pretty URLs (/omra/, /contact/, …)
```

`_headers` and `_redirects` live **inside `site/`** (the publish root) — Cloudflare picks them up
with zero config. ✅ Already in place.

---

## 2 · Deploy — choose ONE path

### Path A — Git connect (recommended, gives auto-deploy on push)

1. Push this repo to GitHub/GitLab (private is fine).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
3. Build settings:
   - **Framework preset:** `None`
   - **Build command:** *(leave empty)*
   - **Build output directory:** `site`
   - **Root directory:** *(leave as repo root)*
4. **Save and Deploy.** First build is ~20s (it just copies `site/`). You get a
   `*.pages.dev` URL immediately.
5. Every future `git push` to the production branch auto-deploys. Edit → push → live.

### Path B — Wrangler (direct upload, no Git)

```powershell
npm i -g wrangler           # one-time
wrangler login              # opens browser, authorise
wrangler pages deploy site --project-name nomara-voyages
```

Re-run the last line to ship updates. (Path A is preferred so the team isn't tied to one machine.)

---

## 3 · Wire the real domain + find-replace the placeholder

**3a. Find-replace the placeholder domain** (only if the final domain ≠ `nomaravoyages.com`).
351 occurrences across `site/` (canonical, OG, JSON-LD `@id`s, sitemap, robots). From repo root:

```powershell
# DRY RUN — see what would change
Get-ChildItem site -Recurse -Include *.html,*.xml,*.txt |
  Select-String -Pattern 'nomaravoyages\.com' | Measure-Object | Select-Object Count

# APPLY — replace with your real domain (edit $new)
$old = 'nomaravoyages.com'
$new = 'YOURDOMAIN.com'
Get-ChildItem site -Recurse -Include *.html,*.xml,*.txt | ForEach-Object {
  $c = Get-Content -LiteralPath $_.FullName -Raw -Encoding UTF8
  if ($c -match [regex]::Escape($old)) {
    Set-Content -LiteralPath $_.FullName -Value ($c.Replace($old,$new)) -Encoding UTF8 -NoNewline
  }
}
```

Then commit + push (Path A) or re-run `wrangler pages deploy site` (Path B).

**3b. Custom domain in Cloudflare.** Pages project → **Custom domains → Set up a domain** → enter the
apex (and `www` if wanted). If the domain's DNS is already on Cloudflare, it's one click. Otherwise
add the shown CNAME/`A` records at your registrar. HTTPS cert provisions automatically (a few min).

**3c. Turn on HSTS** once HTTPS serves cleanly: uncomment/add in `site/_headers` under `/*`:
```
  Strict-Transport-Security: max-age=31536000; includeSubDomains
```
(Add `; preload` only deliberately — it's hard to undo.)

---

## 4 · Post-deploy smoke test (5 min, do every deploy)

On the **live** URL (not localhost):

- [ ] `GET /` → 200, hero paints, fonts swap in. No console errors (DevTools).
- [ ] `GET /omra/` → Sakina look (Amiri/gold/arch), sticky bar visible on mobile.
- [ ] **Tap a WhatsApp CTA on a phone** → WhatsApp opens with readable **Arabic** prefill
      (e.g. tunisie → «أريد الحجز في رحلة تونس»). Test at least: home hero, one trip card, omra sticky.
- [ ] **Tap a `tel:` link** → dialer shows `+213 661 45 70 25`.
- [ ] `GET /sitemap.xml` → 200, lists 15 URLs on the **real domain** (no placeholder leaked).
- [ ] `GET /robots.txt` → 200, `Sitemap:` line points to the real domain.
- [ ] Hit a bad URL (`/nope`) → Cloudflare serves `/404.html` (styled, with WhatsApp CTA).
- [ ] Test a 301: `/turkey` → `/turquie/`, `/umrah` → `/omra/`, `/visa` → `/services/visa/`.
- [ ] **FR toggle** on home → flips to LTR/French and back; no Arabic leaks.
- [ ] Paste the home URL into WhatsApp → OG card shows AR title + hero image.

---

## 5 · Lighthouse pass (do once, target the live mobile URL)

```
DevTools → Lighthouse → Mobile → Analyze   (or: npx lighthouse https://YOURDOMAIN/ --preset=mobile)
```
Expected, given the build: **Perf 90+, A11y 95+, Best-Practices 95+, SEO 100.** If Perf dips, the
usual culprit is the Google-Fonts round-trip on 3G — fixed by self-hosting (§6). Re-run on `/omra/`
and one trip page.

Validate structured data once live:
`https://search.google.com/test/rich-results` → paste `/`, `/omra/`, `/faq/`, `/tunisie/`.

---

## 6 · Recommended hardening (post-launch, not blockers)

- **Self-host fonts** (Alliance recommendation — privacy + one fewer 3G round-trip):
  download Changa / Readex Pro / Amiri / Space Mono `woff2`, drop in `site/assets/fonts/`, add
  `@font-face` (with `font-display:swap`) at the top of `styles.css`, and remove the Google
  `<link>` from each `<head>`. `_headers` already caches `/assets/fonts/*` immutable for a year.
- **Dedicated OG images** — 1200×630 per page type in `site/assets/images/og/`; swap the Turkey-hero
  stand-in and the omra logo-SVG OG references in each `<head>`.
- **Enforce CSP** — `_headers` ships a **Report-Only** CSP today (pages use inline `<script>`/`<style>`
  /inline SVG). To enforce, move inline JS/CSS to nonce'd responses via a Pages Function, then switch
  `Content-Security-Policy-Report-Only` → `Content-Security-Policy`. See `SEO-PLAYBOOK.md §5`.
- **Analytics** — Cloudflare Web Analytics (free, cookieless) is one toggle in the Pages project; no
  code change, respects the privacy posture.

---

## 7 · Rollback

Cloudflare Pages keeps every deployment. Project → **Deployments** → pick a known-good build →
**Rollback to this deployment**. Instant. (Or `git revert` + push for Path A.)

---

### One-paragraph TL;DR
Connect the repo to Cloudflare Pages with **output dir `site/`** and **no build command**; it deploys
as-is (`_headers`/`_redirects` are already inside `site/`). Find-replace `nomaravoyages.com` with the
real domain if different (§3a), attach the custom domain, run the §4 smoke test (especially the
WhatsApp Arabic prefill on a real phone) and a §5 Lighthouse pass. Live in ~30 minutes.
