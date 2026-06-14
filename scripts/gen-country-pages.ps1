# =========================================================
# gen-country-pages.ps1 — one-off generator for the 3 premium
# single-hotel country detail pages (turquie, azerbaidjan, malaisie).
# Produces vanilla static HTML; chrome pasted inline. Run once.
# Tunisie + Egypte are hand-authored separately (multi-offer).
# =========================================================
param([switch]$IUnderstandThisOverwritesLivePages)
# SAFETY GUARD (#15/#16): this is a ONE-OFF generator. Since it last ran, the
# deployed pages were hand-edited with full per-page SEO (canonical/OG/JSON-LD),
# the verified live Google Maps link (maps.app.goo.gl/...), and a batch of
# a11y/perf fixes. Re-running would OVERWRITE all of that with older template
# output. Refuse unless the operator explicitly opts in.
if (-not $IUnderstandThisOverwritesLivePages) {
  Write-Error "STALE GENERATOR — refusing to run. Deployed pages have diverged (live SEO, maps.app.goo.gl link, a11y/perf fixes). Re-running reverts them. If you truly want to regenerate from scratch, pass -IUnderstandThisOverwritesLivePages, then re-apply the post-generation fixes (see docs/FLEET-AUDIT.md)."
  exit 1
}
$root = Split-Path -Parent $PSScriptRoot

# Pre-encoded WhatsApp prefilled messages (URL-encoded Arabic)
$pages = @(
  @{
    slug='turquie'; hero='hero__turquie'; country='تركيا'; city='إسطنبول';
    title='رحلة إسطنبول المنظمة'; cardTitle='إسطنبول — تركيا';
    price='119 000'; nights='7';
    heroTag='رحلة مميّزة · انطلاق من قسنطينة';
    intro='أسبوع في إسطنبول بين المعالم التاريخية والأسواق والمضائق، مع فندق 4 نجوم وجولات منظمة. تذكرة وفندق ومرافقة في سعر واحد واضح.';
    hotelName='فندق 4 نجوم في إسطنبول'; hotelNameFr='Hôtel 4★ Istanbul'; board='مع الفطور';
    it1='إقلاع مباشر من مطار قسنطينة واستقبال ونقل إلى الفندق في إسطنبول.';
    it2='جولات في معالم إسطنبول: آيا صوفيا، المسجد الأزرق، البازار الكبير والمضيق.';
    it3='نقل إلى المطار والعودة إلى قسنطينة برفقة فريق نومارا.';
    gallery=@(
      @{src='/assets/images/gallery/turquie-hagia-sophia.jpg'; alt='آيا صوفيا في إسطنبول'},
      @{src='/assets/images/gallery/turquie-bosphorus.jpg'; alt='مضيق البوسفور ومساجد إسطنبول'},
      @{src='/assets/images/gallery/turquie-grand-bazaar.jpg'; alt='حلويات ومتاجر البازار الكبير في إسطنبول'}
    );
    waEnc='%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%AD%D8%AC%D8%B2%20%D9%81%D9%8A%20%D8%B1%D8%AD%D9%84%D8%A9%20%D8%A5%D8%B3%D8%B7%D9%86%D8%A8%D9%88%D9%84';
  },
  @{
    slug='azerbaidjan'; hero='hero__azerbaidjan'; country='أذربيجان'; city='باكو';
    title='رحلة باكو المنظمة'; cardTitle='باكو — أذربيجان';
    price='119 000'; nights='7';
    heroTag='عرض خاص · انطلاق من قسنطينة';
    intro='اكتشف باكو، لؤلؤة بحر قزوين، بين المدينة القديمة والأبراج الحديثة، مع فندق 4 نجوم وجولات منظمة. تذكرة وفندق ومرافقة في سعر واحد واضح.';
    hotelName='فندق 4 نجوم في باكو'; hotelNameFr='Hôtel 4★ Bakou'; board='مع الفطور';
    it1='إقلاع مباشر من مطار قسنطينة واستقبال ونقل إلى الفندق في باكو.';
    it2='جولات في باكو وضواحيها: المدينة القديمة، الكورنيش والمعالم الحديثة.';
    it3='نقل إلى المطار والعودة إلى قسنطينة برفقة فريق نومارا.';
    gallery=@(
      @{src='/assets/images/gallery/azerbaidjan-flame-towers.jpg'; alt='أبراج اللهب في باكو'},
      @{src='/assets/images/gallery/azerbaidjan-heydar-aliyev.jpg'; alt='مركز حيدر علييف في باكو'},
      @{src='/assets/images/gallery/azerbaidjan-old-city.jpg'; alt='فناء تاريخي في المدينة القديمة بباكو'}
    );
    waEnc='%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%AD%D8%AC%D8%B2%20%D9%81%D9%8A%20%D8%B1%D8%AD%D9%84%D8%A9%20%D8%A8%D8%A7%D9%83%D9%88';
  },
  @{
    slug='malaisie'; hero='hero__malaisie'; country='ماليزيا'; city='كوالالمبور';
    title='رحلة ماليزيا المنظمة'; cardTitle='ماليزيا';
    price='199 000'; nights='8';
    heroTag='رحلة مميّزة · انطلاق من قسنطينة';
    intro='رحلة إلى ماليزيا بين ناطحات السحاب في كوالالمبور والجزر الاستوائية الساحرة، مع فندق 4 نجوم وجولات منظمة. تذكرة وفندق ومرافقة في سعر واحد واضح.';
    hotelName='فندق 4 نجوم في كوالالمبور'; hotelNameFr='Hôtel 4★ Kuala Lumpur'; board='مع الفطور';
    it1='إقلاع مباشر من مطار قسنطينة واستقبال ونقل إلى الفندق في كوالالمبور.';
    it2='جولات بين كوالالمبور (أبراج بتروناس) والجزر والمناطق السياحية.';
    it3='نقل إلى المطار والعودة إلى قسنطينة برفقة فريق نومارا.';
    gallery=@(
      @{src='/assets/images/gallery/malaisie-petronas.jpg'; alt='برجا بتروناس في كوالالمبور'},
      @{src='/assets/images/gallery/malaisie-batu-caves.jpg'; alt='كهوف باتو في كوالالمبور'},
      @{src='/assets/images/gallery/malaisie-kuala-lumpur-night.jpg'; alt='أضواء كوالالمبور ليلًا'}
    );
    waEnc='%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%AD%D8%AC%D8%B2%20%D9%81%D9%8A%20%D8%B1%D8%AD%D9%84%D8%A9%20%D9%85%D8%A7%D9%84%D9%8A%D8%B2%D9%8A%D8%A7';
  }
)

# WhatsApp SVG path (nav/sticky small icon)
$waPath = 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.2c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1a13 13 0 0 1-5.7-5C7.6 11.5 7 10.4 7 9.3c0-1 .5-1.5.7-1.7.2-.2.5-.3.6-.3h.5c.2 0 .4 0 .5.4l.8 1.9c.1.2.1.4 0 .6l-.4.6c-.1.2-.2.3-.1.5.5.9 1.3 1.7 2.2 2.3.2.1.4.1.5 0l.7-.6c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.3.4.5 0 .1 0 .6-.2 1.1Z'
$fabPath = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z'

function NavLink($href,$key,$label,$slug,$cur){
  if($slug -eq $cur){ "      <a href=`"$href`" data-i18n=`"$key`" aria-current=`"page`">$label</a>" }
  else { "      <a href=`"$href`" data-i18n=`"$key`">$label</a>" }
}

foreach($p in $pages){
  $galleryCards = @()
  for($i = 0; $i -lt $p.gallery.Count; $i++){
    $delay = $i * 80
    $g = $p.gallery[$i]
    $galleryCards += "          <div class=`"n-card`" data-reveal data-reveal-delay=`"$delay`"><div class=`"img`"><img src=`"$($g.src)`" alt=`"$($g.alt)`" loading=`"lazy`" decoding=`"async`" width=`"900`" height=`"506`"></div></div>"
  }
  $galleryCards = $galleryCards -join "`n"
  $tmpl = @"
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#1F8A7A">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Changa:wght@400;500;600;700;800&family=Readex+Pro:wght@300;400;500;600;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=Space+Mono&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <link rel="icon" href="/assets/images/favicon/favicon.ico" sizes="any">
  <link rel="icon" href="/assets/images/favicon/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="icon" href="/assets/images/favicon/favicon-16.png" sizes="16x16" type="image/png">
  <link rel="apple-touch-icon" href="/assets/images/favicon/apple-touch-icon.png" sizes="180x180">
  <link rel="manifest" href="/assets/images/favicon/site.webmanifest">
  <!-- SEO: title/meta/canonical/og/jsonld go here (Agent 4) -->
  <title>$($p.title) — من قسنطينة | نومارا</title>
</head>
<body data-mode="rihla">

  <a class="skip-link" href="#main">تخطّي إلى المحتوى</a>

  <nav class="site-nav" aria-label="التنقّل الرئيسي">
    <a class="nav-logo" href="/" aria-label="نومارا للسياحة والأسفار — الرئيسية"><img src="/assets/images/logo.svg" alt="Nomara Voyages" width="180" height="44"></a>
    <div class="nav-links">
      <a href="/" data-i18n="nav.home">الرئيسية</a>
      <a href="/omra/" data-i18n="nav.omra">العمرة والحج</a>
      <a href="/voyages/" data-i18n="nav.voyages" aria-current="page">الرحلات المنظمة</a>
      <a href="/services/" data-i18n="nav.services">الخدمات</a>
      <a href="/a-propos/" data-i18n="nav.apropos">من نحن</a>
      <a href="/faq/" data-i18n="nav.faq">الأسئلة الشائعة</a>
      <a href="/contact/" data-i18n="nav.contact">اتصل بنا</a>
    </div>
    <div class="lang-switcher" role="group" aria-label="تبديل اللغة">
      <button type="button" data-i18n-lang="ar" class="is-active">AR</button>
      <button type="button" data-i18n-lang="fr">FR</button>
    </div>
    <div class="nav-cta">
      <a class="n-btn n-btn-wa" href="https://wa.me/213661457025" target="_blank" rel="noopener" data-i18n="cta.whatsapp">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="$waPath"/></svg>
        تواصل واتساب
      </a>
    </div>
    <button class="nav-toggle" type="button" aria-label="القائمة" aria-expanded="false" aria-controls="nav-drawer">
      <svg class="icon-menu" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      <svg class="icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </nav>

  <main id="main">

    <!-- ================= HERO ================= -->
    <header class="hero">
      <div class="hero__media">
        <picture>
          <source type="image/avif" media="(max-width:768px)" srcset="/assets/images/heroes/$($p.hero)--mobile.avif">
          <source type="image/webp" media="(max-width:768px)" srcset="/assets/images/heroes/$($p.hero)--mobile.webp">
          <source type="image/avif" srcset="/assets/images/heroes/$($p.hero).avif">
          <source type="image/webp" srcset="/assets/images/heroes/$($p.hero).webp">
          <img src="/assets/images/heroes/$($p.hero).jpg" alt="" loading="eager" fetchpriority="high" width="1600" height="900">
        </picture>
      </div>
      <div class="hero__inner">
        <span class="n-chip" style="margin-block-end:var(--space-4)">$($p.heroTag)</span>
        <h1>$($p.cardTitle)</h1>
        <p>$($p.intro)</p>
        <div class="cta-row">
          <a class="n-btn n-btn-accent" href="https://wa.me/213661457025?text=$($p.waEnc)" target="_blank" rel="noopener" data-i18n="cta.book">احجز مقعدك</a>
          <a class="n-btn n-btn-wa" href="https://wa.me/213661457025" target="_blank" rel="noopener" data-i18n="cta.whatsapp">تواصل واتساب</a>
        </div>
      </div>
    </header>

    <!-- ================= PRICE + HOTEL ================= -->
    <section class="section" id="hotels">
      <div class="wrap">
        <div class="sec-head">
          <span class="eyebrow">السعر والإقامة</span>
          <h2>باقة $($p.city)</h2>
          <p>السعر شامل: الطيران من قسنطينة + الإقامة + المرافقة. $($p.nights) ليالٍ.</p>
        </div>

        <div class="n-card" style="padding:var(--space-6)">
          <h4 style="font-size:var(--text-xl)">$($p.hotelName) <span class="n-stars" aria-label="أربع نجوم">★★★★</span></h4>
          <p class="hotel"><bdi>$($p.hotelNameFr)</bdi> · $($p.board)</p>
          <div class="n-price">
            <span class="amount" dir="ltr">$($p.price)</span><span class="cur">دج</span><span class="per">/ للشخص — السعر شامل</span>
          </div>
          <!-- TODO-CLIENT: confirm hotel name, board and exact price/dates -->
          <div class="cta-row">
            <a class="n-btn n-btn-accent" href="https://wa.me/213661457025?text=$($p.waEnc)" target="_blank" rel="noopener" data-i18n="cta.book">احجز مقعدك</a>
            <a class="n-btn n-btn-wa" href="https://wa.me/213661457025?text=$($p.waEnc)" target="_blank" rel="noopener">واتساب</a>
          </div>
        </div>
        <p class="hotel" style="margin-block-start:var(--space-3);color:var(--text-muted)">السعر والمواعيد قيد التأكيد — تواصل معنا لمعرفة المقاعد المتاحة.</p>
      </div>
    </section>

    <!-- ================= ITINERARY ================= -->
    <section class="section" id="itinerary" style="background:var(--surface-raised)">
      <div class="wrap">
        <div class="sec-head">
          <span class="eyebrow">البرنامج</span>
          <h2>كيف تمرّ رحلتك</h2>
        </div>
        <div class="card-grid">
          <article class="service-card"><h3>الانطلاق</h3><p>$($p.it1)</p></article>
          <article class="service-card"><h3>الجولات</h3><p>$($p.it2)</p></article>
          <article class="service-card"><h3>العودة</h3><p>$($p.it3)</p></article>
        </div>
        <!-- TODO-CLIENT: confirm detailed day-by-day itinerary -->
      </div>
    </section>

    <!-- ================= INCLUDES ================= -->
    <section class="section" id="includes">
      <div class="wrap">
        <div class="sec-head">
          <span class="eyebrow">ما يشمله السعر</span>
          <h2>كل شيء في باقة واحدة</h2>
        </div>
        <ul style="display:grid;gap:var(--space-3);max-width:52ch">
          <li style="display:flex;gap:.6rem;align-items:start"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> تذكرة الطيران ذهابًا وإيابًا من مطار قسنطينة</li>
          <li style="display:flex;gap:.6rem;align-items:start"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> الإقامة في فندق 4 نجوم $($p.board)</li>
          <li style="display:flex;gap:.6rem;align-items:start"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> الجولات السياحية المنظمة</li>
          <li style="display:flex;gap:.6rem;align-items:start"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> مرافقة فريق نومارا طوال الرحلة</li>
        </ul>
      </div>
    </section>

    <!-- ================= GALLERY ================= -->
    <section class="section" id="gallery" style="background:var(--surface-raised)">
      <div class="wrap">
        <div class="sec-head">
          <span class="eyebrow">صور الرحلة</span>
          <h2>لمحة من $($p.country)</h2>
        </div>
        <div class="trip-grid">
$galleryCards
        </div>
      </div>
    </section>

    <!-- ================= CTA + TRUST ================= -->
    <section class="section" id="book">
      <div class="wrap" style="text-align:center">
        <h2>جاهز للسفر إلى $($p.country)؟</h2>
        <p style="color:var(--text-muted);max-width:46ch;margin:var(--space-3) auto var(--space-5)">تواصل معنا الآن، نرد عليك بسرعة ونؤكد حجزك خطوة بخطوة.</p>
        <div class="cta-row" style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap">
          <a class="n-btn n-btn-accent" href="https://wa.me/213661457025?text=$($p.waEnc)" target="_blank" rel="noopener" data-i18n="cta.book">احجز مقعدك</a>
          <a class="n-btn n-btn-primary" href="tel:+213661457025"><span dir="ltr">0661 45 70 25</span></a>
        </div>
        <div class="n-trust" style="justify-content:center">
          <div class="t"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg> وكالة مرخّصة</div>
          <div class="t"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg> مرافقة كاملة</div>
          <div class="t"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/></svg> انطلاق من قسنطينة</div>
        </div>
      </div>
    </section>

  </main>

  <footer class="site-footer">
    <div class="wrap">
      <div class="site-footer__grid">
        <div class="site-footer__brand">
          <div style="color:#fff"><img src="/assets/images/logo-mono.svg" alt="Nomara Voyages" width="200" height="48"></div>
          <p class="site-footer__contact">نومارا للسياحة و خدمات الحج و العمرة — رفيقك في كل رحلة.</p>
          <div class="site-footer__contact" style="margin-block-start:1rem">
            <a class="tel" href="tel:+213661457025" dir="ltr">0661 45 70 25</a><br>
            <!-- TODO-CLIENT: real Gmail address (unconfirmed) --><span style="opacity:.85">البريد الإلكتروني: قيد التأكيد</span>
          </div>
          <div class="site-footer__socials" aria-label="شبكات التواصل">
            <a href="https://instagram.com/nomara.voyages" target="_blank" rel="noopener" aria-label="Instagram"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
            <a href="https://www.facebook.com/search/top?q=Nomara%20voyages%20%D9%86%D9%88%D9%85%D8%A7%D8%B1%D8%A7" target="_blank" rel="noopener" aria-label="Facebook"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9h3V6h-3a4 4 0 0 0-4 4v2H8v3h2v6h3v-6h2.5l.5-3H13v-2a1 1 0 0 1 1-1Z"/></svg></a>
          </div>
        </div>
        <div>
          <h4 data-i18n="footer.explore">استكشف</h4>
          <ul class="site-footer__list">
            <li><a href="/" data-i18n="nav.home">الرئيسية</a></li>
            <li><a href="/omra/" data-i18n="nav.omra">العمرة والحج</a></li>
            <li><a href="/voyages/" data-i18n="nav.voyages">الرحلات المنظمة</a></li>
            <li><a href="/tunisie/" data-i18n="nav.tunisie">تونس</a></li>
            <li><a href="/turquie/" data-i18n="nav.turquie">تركيا</a></li>
            <li><a href="/azerbaidjan/" data-i18n="nav.azerbaidjan">أذربيجان</a></li>
            <li><a href="/malaisie/" data-i18n="nav.malaisie">ماليزيا</a></li>
            <li><a href="/egypte/" data-i18n="nav.egypte">مصر</a></li>
          </ul>
        </div>
        <div>
          <h4 data-i18n="footer.services">خدماتنا</h4>
          <ul class="site-footer__list">
            <li><a href="/services/" data-i18n="nav.services">كل الخدمات</a></li>
            <li><a href="/services/visa/" data-i18n="nav.visa">خدمات التأشيرة</a></li>
            <li><a href="/services/hotellerie/" data-i18n="nav.hotellerie">حجز الفنادق</a></li>
            <li><a href="/services/vols/" data-i18n="nav.vols">حجز التذاكر</a></li>
            <li><a href="/a-propos/" data-i18n="nav.apropos">من نحن</a></li>
            <li><a href="/faq/" data-i18n="nav.faq">الأسئلة الشائعة</a></li>
            <li><a href="/contact/" data-i18n="nav.contact">اتصل بنا</a></li>
          </ul>
          <h4 style="margin-block-start:1.5rem">العنوان</h4>
          <p class="site-footer__contact" data-i18n="footer.address">حي الغزالي، عين مليلة، أم البواقي</p>
          <p style="margin-block-start:.5rem"><a href="https://maps.google.com/?q=Nomara+Voyages+Ain+M'lila" target="_blank" rel="noopener">عرض على خرائط جوجل</a></p>
        </div>
      </div>
      <div class="site-footer__legal">
        وكالة سياحية مرخّصة — رقم الرخصة: TODO-CLIENT ·
        <span data-i18n="footer.rights">كل الحقوق محفوظة</span> © <span dir="ltr">2026</span> Nomara Voyages.
      </div>
    </div>
  </footer>

  <div class="n-sticky-bar" role="complementary" aria-label="الحجز السريع">
    <div class="n-sticky">
      <a class="n-btn n-btn-wa" href="https://wa.me/213661457025?text=$($p.waEnc)" target="_blank" rel="noopener" data-i18n="cta.whatsapp">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="$waPath"/></svg>
        واتساب
      </a>
      <a class="n-btn n-btn-primary" href="tel:+213661457025">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
        <span dir="ltr">0661 45 70 25</span>
      </a>
    </div>
  </div>

  <a class="fab-whatsapp" href="https://wa.me/213661457025" target="_blank" rel="noopener" aria-label="تواصل معنا عبر واتساب">
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="$fabPath"/></svg>
  </a>

  <script src="/assets/js/i18n.js" defer></script>
  <script src="/assets/js/enhance.js" defer></script>
  <script src="/assets/js/reveal.js" defer></script>
</body>
</html>
"@

  $dir = Join-Path $root "site/$($p.slug)"
  if(-not (Test-Path $dir)){ New-Item -ItemType Directory -Path $dir | Out-Null }
  $out = Join-Path $dir 'index.html'
  [System.IO.File]::WriteAllText($out, $tmpl, (New-Object System.Text.UTF8Encoding($false)))
  Write-Host "wrote $out"
}
