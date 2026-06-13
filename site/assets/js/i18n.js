/**
 * Nomara Voyages — i18n.js
 * AR-canonical runtime switcher (Alliance S10 strategy c, inverted).
 *
 * Document default is <html lang="ar" dir="rtl">. Arabic is the indexed,
 * canonical language. French is a runtime guest:
 *   - elements opt in with data-i18n="key"
 *   - switching to FR sets <html lang="fr" dir="ltr"> and swaps text from
 *     the `fr` dictionary, FALLING BACK to `ar` when a key is missing
 *   - choice persists in localStorage
 *   - the .lang-switcher active state stays in sync
 *
 * This skeleton ships only the SHARED CHROME keys Agent 1 owns (nav,
 * CTAs, footer, lang names). Agent 3 expands the dictionary.
 *
 * Dependency-free. Self-inits on DOMContentLoaded.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'nomara-lang';

  /* Safe localStorage (private mode / disabled storage throws). */
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ── Shared-chrome dictionary (Agent 1 scope). AR is the source. ──
     Agent 3 will MERGE additional page keys into window.NOMARA_I18N. */
  var DICT = {
    ar: {
      'nav.home':        'الرئيسية',
      'nav.omra':        'العمرة والحج',
      'nav.voyages':     'الرحلات المنظمة',
      'nav.tunisie':     'تونس',
      'nav.turquie':     'تركيا',
      'nav.azerbaidjan': 'أذربيجان',
      'nav.malaisie':    'ماليزيا',
      'nav.egypte':      'مصر',
      'nav.services':    'الخدمات',
      'nav.visa':        'خدمات التأشيرة',
      'nav.hotellerie':  'حجز الفنادق',
      'nav.vols':        'حجز التذاكر',
      'nav.apropos':     'من نحن',
      'nav.faq':         'الأسئلة الشائعة',
      'nav.contact':     'اتصل بنا',

      'cta.book':        'احجز مقعدك',
      'cta.whatsapp':    'تواصل واتساب',
      'cta.call':        'اتصل بنا',
      'cta.details':     'التفاصيل',
      'cta.allTrips':    'كل الرحلات',

      'footer.contact':  'تواصل معنا',
      'footer.address':  'حي الغزالي، عين مليلة، أم البواقي',
      'footer.followUs': 'تابعنا',
      'footer.explore':  'استكشف',
      'footer.services': 'خدماتنا',
      'footer.rights':   'كل الحقوق محفوظة',
      'footer.allServices': 'كل الخدمات',
      'footer.addressTitle': 'العنوان',

      'lang.ar':         'العربية',
      'lang.fr':         'الفرنسية',

      /* ── Extended CTAs ── */
      'cta.waLong':      'تواصل واتساب',
      'cta.wa':          'واتساب',
      'cta.callUs':      'تواصل معنا',
      'cta.learnMore':   'اعرف المزيد',
      'cta.startWa':     'ابدأ عبر واتساب',
      'cta.omraPackages':'باقات العمرة',
      'cta.allDest':     'كل الوجهات',
      'cta.backHome':    'العودة إلى الرئيسية',

      /* ── Sticky bar ── */
      'sticky.wa':       'واتساب',

      /* ── Trust strip (shared) ── */
      'trust.licensed':       'وكالة سياحية مرخّصة — عين مليلة',
      'trust.licensedShort':  'وكالة مرخّصة',
      'trust.licensedOmra':   'وكالة مرخّصة للحج والعمرة',
      'trust.guide':          'مرشد معروف يرافقك في الرحلة',
      'trust.guideOmra':      'مرافقة ميدانية موثوقة',
      'trust.companion':      'مرافقة كاملة',
      'trust.travelers':      'آلاف المسافرين معنا عبر السنوات',
      'trust.directConst':    'انطلاق مباشر من مطار قسنطينة',
      'trust.directConstShort':'انطلاق من قسنطينة',

      /* ── HOME ── */
      'home.hero.title':   'اكتشف العالم مع نومارا',
      'home.hero.sub':     'رحلات منظمة وعمرة من مطار قسنطينة، برفقة فريق يلازمك في كل خطوة. سعر واحد واضح يشمل الطيران والفندق والمرافقة — دون مفاجآت.',
      'home.hero.chip':    'وكالة سياحة وعمرة — عين مليلة',
      'sec.home.featured.eyebrow': 'Voyages Organisés',
      'sec.home.featured.title':   'وجهات مختارة من نومارا',
      'sec.home.featured.sub':     'رحلات جاهزة من قسنطينة، بأسعار شفافة شاملة لكل ما تحتاجه.',
      'sec.home.services.title':   'خدماتنا',
      'sec.home.services.sub':     'كل ما تحتاجه لرحلتك تحت سقف واحد — من العمرة إلى التذاكر والتأشيرة.',
      'sec.home.why.eyebrow':      'Pourquoi Nomara',
      'sec.home.why.title':        'رفيقك في كل رحلة',
      'sec.home.why.sub':          'نحن لا نبيع تذاكر فقط — نرافقك من أول استفسار إلى العودة بأمان.',
      'sec.home.trust.title':      'لماذا تثق بنومارا',
      'sec.home.testimonials.eyebrow':'آراء المسافرين',
      'sec.home.testimonials.title':  'ماذا يقول من سافر معنا',
      'home.finalcta.title':       'جاهز لرحلتك القادمة؟',

      /* Service cards (shared home + services) */
      'svc.omra.title':    'العمرة والحج',
      'svc.omra.blurb':    'نرافقك في رحلة العمر خطوة بخطوة — طيران مباشر من قسنطينة، فنادق قريبة من الحرم، ومرافقة لا تتركك وحدك في أي لحظة.',
      'svc.voyages.title': 'الرحلات المنظمة',
      'svc.voyages.blurb': 'رحلات منظمة بالكامل إلى تونس وتركيا وأذربيجان وماليزيا ومصر — تذكرة وفندق ومرافقة في سعر واحد واضح، تنطلق من قسنطينة.',
      'svc.hotel.title':   'حجز الفنادق',
      'svc.hotel.blurb':   'نحجز لك الغرفة المناسبة في أي وجهة، بأسعار تفاوضنا عليها لك — تصلك التفاصيل والتأكيد عبر واتساب دون عناء البحث.',
      'svc.vols.title':    'حجز التذاكر',
      'svc.vols.blurb':    'نقارن لك بين شركات الطيران ونجد أفضل سعر لرحلتك انطلاقًا من قسنطينة — تذاكر مؤكدة وأسعار شفافة دون مفاجآت.',
      'svc.visa.title':    'خدمات التأشيرة',
      'svc.visa.blurb':    'نساعدك في تحضير ملف التأشيرة وترتيب الوثائق المطلوبة لوجهتك — نرافقك في الخطوات بصدق ووضوح، دون وعود لا نملكها.',

      /* Why-Nomara value cards */
      'why.price.title':     'سعر واحد واضح',
      'why.companion.title': 'مرافقة بشرية',
      'why.wa.title':        'حجز سهل عبر واتساب',

      /* ── OMRA (Sakina) ── */
      'omra.hero.title':   'نرافقك في رحلة العمر',
      'omra.hero.sub':     'عمرة شوال وعمرة جوان بطيران مباشر من قسنطينة، وفنادق قريبة من الحرم، ومرافقة تطمئن قلبك خطوة بخطوة. السعر شامل الطيران والفندق والمرافقة والتأشيرة.',
      'omra.hero.chip':    'العمرة والحج من قسنطينة',
      'omra.cta.book':     'احجز عمرتك',
      'sec.omra.shawwal.eyebrow':'عمرة شوّال',
      'sec.omra.shawwal.title':  'باقات عمرة شوّال',
      'sec.omra.juin.eyebrow':   'عمرة جوان',
      'sec.omra.juin.title':     'باقات عمرة جوان',
      'sec.omra.includes.title': 'ما يشمله السعر',
      'omra.slogan':       'نومارا، رفيقك في طاعتك',
      'sec.omra.hajj.eyebrow':   'خدمات الحج',
      'sec.omra.hajj.title':     'الحج برفقة من تثق به',
      'sec.omra.prep.eyebrow':   'قبل السفر',
      'sec.omra.prep.title':     'تحضير العمرة والحج',

      /* ── VOYAGES hub ── */
      'voyages.hero.eyebrow':'Voyages Organisés',
      'voyages.hero.title':  'الرحلات المنظمة',
      'voyages.hero.sub':    'كل وجهاتنا في مكان واحد — تذكرة وفندق ومرافقة في سعر واضح، انطلاقًا من مطار قسنطينة.',

      /* ── Trip pages (shared section labels) ── */
      'sec.trip.includes.eyebrow':'ما يشمله السعر',
      'sec.trip.includes.title':  'كل شيء في باقة واحدة',
      'sec.trip.itinerary.eyebrow':'البرنامج',
      'sec.trip.itinerary.title':  'كيف تمرّ رحلتك',
      'sec.trip.gallery.eyebrow':  'صور الرحلة',
      'sec.trip.price.eyebrow':    'السعر والإقامة',
      'sec.trip.hotels.eyebrow':   'الفنادق والأسعار',

      /* ── TUNISIE ── */
      'tunisie.hero.title':'تونس — جربة وسوسة',
      'tunisie.hero.sub':  'أسبوع على شواطئ تونس مع إقامة كاملة وثلاثة خيارات فنادق تناسب ميزانيتك. تذكرة وفندق ومرافقة في سعر واحد واضح.',
      'tunisie.hero.chip': 'رحلة منظمة · انطلاق من قسنطينة',
      'sec.tunisie.hotels.title':'اختر فندقك',
      'tunisie.book.title':'جاهز للسفر إلى تونس؟',

      /* ── TURQUIE ── */
      'turquie.hero.title':'إسطنبول — تركيا',
      'turquie.hero.sub':  'أسبوع في إسطنبول بين المعالم التاريخية والأسواق والمضائق، مع فندق ٤ نجوم وجولات منظمة. تذكرة وفندق ومرافقة في سعر واحد واضح.',
      'turquie.hero.chip': 'رحلة مميّزة · انطلاق من قسنطينة',
      'sec.turquie.price.title':'باقة إسطنبول',
      'turquie.book.title':'جاهز للسفر إلى تركيا؟',

      /* ── AZERBAIDJAN ── */
      'azerbaidjan.hero.title':'باكو — أذربيجان',
      'azerbaidjan.hero.sub':  'اكتشف باكو، لؤلؤة بحر قزوين، بين المدينة القديمة والأبراج الحديثة، مع فندق ٤ نجوم وجولات منظمة. تذكرة وفندق ومرافقة في سعر واحد واضح.',
      'azerbaidjan.hero.chip': 'عرض خاص · انطلاق من قسنطينة',
      'sec.azerbaidjan.price.title':'باقة باكو',
      'azerbaidjan.book.title':'جاهز للسفر إلى أذربيجان؟',

      /* ── MALAISIE ── */
      'malaisie.hero.title':'ماليزيا',
      'malaisie.hero.sub':  'رحلة إلى ماليزيا بين ناطحات السحاب في كوالالمبور والجزر الاستوائية الساحرة، مع فندق ٤ نجوم وجولات منظمة. تذكرة وفندق ومرافقة في سعر واحد واضح.',
      'malaisie.hero.chip': 'رحلة مميّزة · انطلاق من قسنطينة',
      'sec.malaisie.price.title':'باقة كوالالمبور',
      'malaisie.book.title':'جاهز للسفر إلى ماليزيا؟',

      /* ── EGYPTE ── */
      'egypte.hero.title': 'مصر — القاهرة والغردقة',
      'egypte.hero.sub':   'عرضان في وجهة واحدة: القاهرة التاريخية بأهراماتها، ومنتجع الغردقة على البحر الأحمر بعرض خاص. اختر ما يناسبك مع مرافقة كاملة من نومارا.',
      'egypte.hero.chip':  'رحلة منظمة · انطلاق من قسنطينة',
      'egypte.cta.seeOffers':'شاهد العرضين',
      'sec.egypte.offers.eyebrow':'عرضان',
      'sec.egypte.offers.title':  'اختر وجهتك في مصر',
      'egypte.book.title': 'جاهز للسفر إلى مصر؟',

      /* ── SERVICES hub ── */
      'services.hero.eyebrow':'Nos Services',
      'services.hero.title':  'خدماتنا',
      'services.hero.sub':    'كل ما تحتاجه لرحلتك تحت سقف واحد — من العمرة والرحلات المنظمة إلى الفنادق والتذاكر والتأشيرة.',
      'services.help.title':  'هل لديك سؤال؟',

      /* ── SERVICE: hotellerie ── */
      'hotel.hero.eyebrow':'Hôtellerie',
      'hotel.hero.title':  'حجز الفنادق',
      'hotel.hero.sub':    'نحجز لك الغرفة المناسبة في أي وجهة — داخل الجزائر أو خارجها — بأسعار تفاوضنا عليها لك. تصلك التفاصيل والتأكيد عبر واتساب دون عناء البحث والمقارنة.',
      'sec.hotel.what.title':'ماذا نحجز لك',
      'sec.hotel.steps.title':'كيف تحجز معنا',

      /* ── SERVICE: vols ── */
      'vols.hero.eyebrow': 'Billetterie / Vols',
      'vols.hero.title':   'حجز التذاكر',
      'vols.hero.sub':     'نقارن لك بين شركات الطيران ونجد أفضل سعر لرحلتك، انطلاقًا من مطار قسنطينة أو غيره. تذاكر مؤكدة وأسعار شفافة دون مفاجآت ولا رسوم خفية.',
      'sec.vols.what.title':'ماذا نوفّر لك',
      'sec.vols.steps.title':'كيف نحجز تذكرتك',

      /* ── SERVICE: visa ── */
      'visa.hero.eyebrow': 'Assistance Visa',
      'visa.hero.title':   'خدمات التأشيرة',
      'sec.visa.help.title':'بِمَ نساعدك',
      'sec.visa.steps.title':'كيف نعمل معك',

      /* ── ABOUT ── */
      'about.hero.eyebrow':'À propos',
      'about.hero.title':  'من نحن',
      'sec.about.guide.eyebrow':'مرشدك',
      'sec.about.trust.eyebrow':'لماذا تثق بنا',
      'sec.about.trust.title':  'وكالة مرخّصة ومسؤولة',
      'sec.about.reviews.eyebrow':'آراء العملاء',
      'sec.about.reviews.title':  'ماذا قالوا عنا',
      'about.cta.title':   'تعرّفت علينا؟ لنبدأ رحلتك',

      /* ── CONTACT ── */
      'contact.hero.eyebrow':'Contact',
      'contact.hero.title':  'اتصل بنا',
      'contact.hero.sub':    'أسرع طريقة للوصول إلينا هي واتساب أو الهاتف — نرد عليك بسرعة ونرتّب لك كل شيء. لا حاجة لملء أي نموذج.',
      'contact.phone.title': 'الهاتف',
      'contact.wa.title':    'واتساب',
      'contact.email.title': 'البريد الإلكتروني',
      'contact.address.title':'العنوان',
      'contact.hours.title': 'ساعات العمل',
      'contact.follow.title':'تابعنا',

      /* ── FAQ ── */
      'faq.hero.eyebrow':  'FAQ',
      'faq.hero.title':    'الأسئلة الشائعة',
      'faq.hero.sub':      'جمعنا لك أكثر ما يسأل عنه المسافرون. لم تجد جوابك؟ تواصل معنا عبر واتساب ونرد عليك بسرعة.',
      'faq.q.docs':        'ما الوثائق المطلوبة للسفر معكم؟',
      'faq.q.visa':        'هل تساعدوننا في إجراءات التأشيرة؟',
      'faq.q.payment':     'كيف يتم الدفع؟ وهل يوجد دفع بالتقسيط أو عربون؟',
      'faq.q.allInclusive':'هل السعر شامل كل شيء؟',
      'faq.q.packing':     'ماذا أحضّر لرحلة العمرة؟',
      'faq.q.departure':   'من أين تنطلق رحلاتكم؟',
      'faq.q.cancel':      'ماذا لو احتجت تغيير الموعد أو الإلغاء؟',
      'faq.q.howbook':     'كيف أحجز؟',
      'faq.cta.more':      'لديك سؤال آخر؟ تواصل واتساب',

      /* ── 404 ── */
      '404.eyebrow':       'خطأ 404',
      '404.title':         'ضللنا الطريق قليلًا'
    },
    fr: {
      'nav.home':        'Accueil',
      'nav.omra':        'Omra & Hajj',
      'nav.voyages':     'Voyages organisés',
      'nav.tunisie':     'Tunisie',
      'nav.turquie':     'Turquie',
      'nav.azerbaidjan': 'Azerbaïdjan',
      'nav.malaisie':    'Malaisie',
      'nav.egypte':      'Égypte',
      'nav.services':    'Services',
      'nav.visa':        'Assistance visa',
      'nav.hotellerie':  'Hôtellerie',
      'nav.vols':        'Billetterie',
      'nav.apropos':     'À propos',
      'nav.faq':         'FAQ',
      'nav.contact':     'Contact',

      'cta.book':        'Réservez votre place',
      'cta.whatsapp':    'Contact WhatsApp',
      'cta.call':        'Appelez-nous',
      'cta.details':     'Détails',
      'cta.allTrips':    'Tous les voyages',

      'footer.contact':  'Contactez-nous',
      'footer.address':  "Cité Ghazali, Aïn M'Lila, Oum El Bouaghi",
      'footer.followUs': 'Suivez-nous',
      'footer.explore':  'Explorer',
      'footer.services': 'Nos services',
      'footer.rights':   'Tous droits réservés',
      'footer.allServices': 'Tous les services',
      'footer.addressTitle': 'Adresse',

      'lang.ar':         'Arabe',
      'lang.fr':         'Français',

      /* ── Extended CTAs ── */
      'cta.waLong':      'Contact WhatsApp',
      'cta.wa':          'WhatsApp',
      'cta.callUs':      'Contactez-nous',
      'cta.learnMore':   'En savoir plus',
      'cta.startWa':     'Commencer sur WhatsApp',
      'cta.omraPackages':'Forfaits Omra',
      'cta.allDest':     'Toutes les destinations',
      'cta.backHome':    "Retour à l'accueil",

      /* ── Sticky bar ── */
      'sticky.wa':       'WhatsApp',

      /* ── Trust strip (shared) ── */
      'trust.licensed':       'Agence de voyages agréée — Aïn M\'Lila',
      'trust.licensedShort':  'Agence agréée',
      'trust.licensedOmra':   'Agence agréée Hajj et Omra',
      'trust.guide':          'Un guide reconnu vous accompagne',
      'trust.guideOmra':      'Accompagnement sur place de confiance',
      'trust.companion':      'Accompagnement complet',
      'trust.travelers':      'Des milliers de voyageurs au fil des années',
      'trust.directConst':    'Vols directs depuis l\'aéroport de Constantine',
      'trust.directConstShort':'Départ de Constantine',

      /* ── HOME ── */
      'home.hero.title':   'Découvrez le monde avec Nomara',
      'home.hero.sub':     'Voyages organisés et Omra au départ de Constantine, avec une équipe qui vous accompagne à chaque étape. Un seul prix clair : vol + hôtel + accompagnement — sans surprises.',
      'home.hero.chip':    'Agence de voyages et Omra — Aïn M\'Lila',
      'sec.home.featured.eyebrow': 'Voyages organisés',
      'sec.home.featured.title':   'Destinations choisies par Nomara',
      'sec.home.featured.sub':     'Des voyages prêts au départ de Constantine, à des prix transparents qui comprennent tout.',
      'sec.home.services.title':   'Nos services',
      'sec.home.services.sub':     'Tout ce qu\'il vous faut pour votre voyage sous un même toit — de l\'Omra aux billets et au visa.',
      'sec.home.why.eyebrow':      'Pourquoi Nomara',
      'sec.home.why.title':        'Votre compagnon à chaque voyage',
      'sec.home.why.sub':          'Nous ne vendons pas que des billets — nous vous accompagnons de la première question au retour en toute sécurité.',
      'sec.home.trust.title':      'Pourquoi faire confiance à Nomara',
      'sec.home.testimonials.eyebrow':'Avis des voyageurs',
      'sec.home.testimonials.title':  'Ce que disent ceux qui ont voyagé avec nous',
      'home.finalcta.title':       'Prêt pour votre prochain voyage ?',

      /* Service cards (shared home + services) */
      'svc.omra.title':    'Omra & Hajj',
      'svc.omra.blurb':    'Nous vous accompagnons dans le voyage d\'une vie, pas à pas — vol direct depuis Constantine, hôtels proches du Haram, et un accompagnement qui ne vous laisse jamais seul.',
      'svc.voyages.title': 'Voyages organisés',
      'svc.voyages.blurb': 'Des voyages entièrement organisés vers la Tunisie, la Turquie, l\'Azerbaïdjan, la Malaisie et l\'Égypte — billet, hôtel et accompagnement dans un seul prix clair, au départ de Constantine.',
      'svc.hotel.title':   'Réservation d\'hôtels',
      'svc.hotel.blurb':   'Nous vous réservons la chambre qu\'il vous faut dans toute destination, à des tarifs négociés pour vous — détails et confirmation par WhatsApp, sans la corvée de la recherche.',
      'svc.vols.title':    'Billetterie',
      'svc.vols.blurb':    'Nous comparons les compagnies aériennes pour trouver le meilleur prix au départ de Constantine — billets confirmés et prix transparents, sans surprises.',
      'svc.visa.title':    'Assistance visa',
      'svc.visa.blurb':    'Nous vous aidons à préparer votre dossier de visa et à réunir les documents requis pour votre destination — un accompagnement honnête et clair, sans promesses que nous ne pouvons tenir.',

      /* Why-Nomara value cards */
      'why.price.title':     'Un seul prix clair',
      'why.companion.title': 'Un accompagnement humain',
      'why.wa.title':        'Réservation facile par WhatsApp',

      /* ── OMRA (Sakina) ── */
      'omra.hero.title':   'Nous vous accompagnons dans le voyage d\'une vie',
      'omra.hero.sub':     'Omra de Chawwal et de juin avec vol direct depuis Constantine, hôtels proches du Haram, et un accompagnement qui apaise votre cœur pas à pas. Le prix comprend : vol + hôtel + accompagnement + visa.',
      'omra.hero.chip':    'Omra et Hajj depuis Constantine',
      'omra.cta.book':     'Réservez votre Omra',
      'sec.omra.shawwal.eyebrow':'Omra de Chawwal',
      'sec.omra.shawwal.title':  'Forfaits Omra de Chawwal',
      'sec.omra.juin.eyebrow':   'Omra de juin',
      'sec.omra.juin.title':     'Forfaits Omra de juin',
      'sec.omra.includes.title': 'Ce que le prix comprend',
      'omra.slogan':       'Nomara, votre compagnon dans votre dévotion',
      'sec.omra.hajj.eyebrow':   'Services Hajj',
      'sec.omra.hajj.title':     'Le Hajj accompagné par ceux en qui vous avez confiance',
      'sec.omra.prep.eyebrow':   'Avant le départ',
      'sec.omra.prep.title':     'Préparer l\'Omra et le Hajj',

      /* ── VOYAGES hub ── */
      'voyages.hero.eyebrow':'Voyages organisés',
      'voyages.hero.title':  'Voyages organisés',
      'voyages.hero.sub':    'Toutes nos destinations au même endroit — billet, hôtel et accompagnement à un prix clair, au départ de l\'aéroport de Constantine.',

      /* ── Trip pages (shared section labels) ── */
      'sec.trip.includes.eyebrow':'Ce que le prix comprend',
      'sec.trip.includes.title':  'Tout dans un seul forfait',
      'sec.trip.itinerary.eyebrow':'Programme',
      'sec.trip.itinerary.title':  'Comment se déroule votre voyage',
      'sec.trip.gallery.eyebrow':  'Photos du voyage',
      'sec.trip.price.eyebrow':    'Prix et hébergement',
      'sec.trip.hotels.eyebrow':   'Hôtels et prix',

      /* ── TUNISIE ── */
      'tunisie.hero.title':'Tunisie — Djerba et Sousse',
      'tunisie.hero.sub':  'Une semaine sur les plages de Tunisie en pension complète, avec trois choix d\'hôtels selon votre budget. Billet, hôtel et accompagnement dans un seul prix clair.',
      'tunisie.hero.chip': 'Voyage organisé · départ de Constantine',
      'sec.tunisie.hotels.title':'Choisissez votre hôtel',
      'tunisie.book.title':'Prêt à partir en Tunisie ?',

      /* ── TURQUIE ── */
      'turquie.hero.title':'Istanbul — Turquie',
      'turquie.hero.sub':  'Une semaine à Istanbul entre les sites historiques, les bazars et le Bosphore, avec un hôtel 4 étoiles et des excursions organisées. Billet, hôtel et accompagnement dans un seul prix clair.',
      'turquie.hero.chip': 'Voyage premium · départ de Constantine',
      'sec.turquie.price.title':'Forfait Istanbul',
      'turquie.book.title':'Prêt à partir en Turquie ?',

      /* ── AZERBAIDJAN ── */
      'azerbaidjan.hero.title':'Bakou — Azerbaïdjan',
      'azerbaidjan.hero.sub':  'Découvrez Bakou, la perle de la Caspienne, entre la vieille ville et les tours modernes, avec un hôtel 4 étoiles et des excursions organisées. Billet, hôtel et accompagnement dans un seul prix clair.',
      'azerbaidjan.hero.chip': 'Offre spéciale · départ de Constantine',
      'sec.azerbaidjan.price.title':'Forfait Bakou',
      'azerbaidjan.book.title':'Prêt à partir en Azerbaïdjan ?',

      /* ── MALAISIE ── */
      'malaisie.hero.title':'Malaisie',
      'malaisie.hero.sub':  'Un voyage en Malaisie entre les gratte-ciel de Kuala Lumpur et les îles tropicales enchanteresses, avec un hôtel 4 étoiles et des excursions organisées. Billet, hôtel et accompagnement dans un seul prix clair.',
      'malaisie.hero.chip': 'Voyage premium · départ de Constantine',
      'sec.malaisie.price.title':'Forfait Kuala Lumpur',
      'malaisie.book.title':'Prêt à partir en Malaisie ?',

      /* ── EGYPTE ── */
      'egypte.hero.title': 'Égypte — Le Caire et Hurghada',
      'egypte.hero.sub':   'Deux offres dans une seule destination : Le Caire historique et ses pyramides, et le resort de Hurghada sur la mer Rouge en offre spéciale. Choisissez ce qui vous convient, avec un accompagnement complet de Nomara.',
      'egypte.hero.chip':  'Voyage organisé · départ de Constantine',
      'egypte.cta.seeOffers':'Voir les deux offres',
      'sec.egypte.offers.eyebrow':'Deux offres',
      'sec.egypte.offers.title':  'Choisissez votre destination en Égypte',
      'egypte.book.title': 'Prêt à partir en Égypte ?',

      /* ── SERVICES hub ── */
      'services.hero.eyebrow':'Nos services',
      'services.hero.title':  'Nos services',
      'services.hero.sub':    'Tout ce qu\'il vous faut pour votre voyage sous un même toit — de l\'Omra et des voyages organisés aux hôtels, billets et visa.',
      'services.help.title':  'Vous avez une question ?',

      /* ── SERVICE: hotellerie ── */
      'hotel.hero.eyebrow':'Hôtellerie',
      'hotel.hero.title':  'Réservation d\'hôtels',
      'hotel.hero.sub':    'Nous vous réservons la chambre qu\'il vous faut dans toute destination — en Algérie ou à l\'étranger — à des tarifs négociés pour vous. Détails et confirmation par WhatsApp, sans la corvée de la recherche et de la comparaison.',
      'sec.hotel.what.title':'Ce que nous réservons pour vous',
      'sec.hotel.steps.title':'Comment réserver avec nous',

      /* ── SERVICE: vols ── */
      'vols.hero.eyebrow': 'Billetterie / Vols',
      'vols.hero.title':   'Billetterie',
      'vols.hero.sub':     'Nous comparons les compagnies aériennes pour trouver le meilleur prix, au départ de l\'aéroport de Constantine ou d\'ailleurs. Billets confirmés et prix transparents, sans surprises ni frais cachés.',
      'sec.vols.what.title':'Ce que nous vous offrons',
      'sec.vols.steps.title':'Comment nous réservons votre billet',

      /* ── SERVICE: visa ── */
      'visa.hero.eyebrow': 'Assistance visa',
      'visa.hero.title':   'Assistance visa',
      'sec.visa.help.title':'En quoi nous vous aidons',
      'sec.visa.steps.title':'Comment nous travaillons avec vous',

      /* ── ABOUT ── */
      'about.hero.eyebrow':'À propos',
      'about.hero.title':  'À propos de nous',
      'sec.about.guide.eyebrow':'Votre guide',
      'sec.about.trust.eyebrow':'Pourquoi nous faire confiance',
      'sec.about.trust.title':  'Une agence agréée et responsable',
      'sec.about.reviews.eyebrow':'Avis des clients',
      'sec.about.reviews.title':  'Ce qu\'ils ont dit de nous',
      'about.cta.title':   'Vous nous connaissez ? Commençons votre voyage',

      /* ── CONTACT ── */
      'contact.hero.eyebrow':'Contact',
      'contact.hero.title':  'Contactez-nous',
      'contact.hero.sub':    'Le moyen le plus rapide de nous joindre : WhatsApp ou téléphone — nous vous répondons vite et organisons tout pour vous. Aucun formulaire à remplir.',
      'contact.phone.title': 'Téléphone',
      'contact.wa.title':    'WhatsApp',
      'contact.email.title': 'E-mail',
      'contact.address.title':'Adresse',
      'contact.hours.title': 'Horaires d\'ouverture',
      'contact.follow.title':'Suivez-nous',

      /* ── FAQ ── */
      'faq.hero.eyebrow':  'FAQ',
      'faq.hero.title':    'Questions fréquentes',
      'faq.hero.sub':      'Nous avons réuni les questions les plus posées par les voyageurs. Vous ne trouvez pas votre réponse ? Contactez-nous sur WhatsApp, nous vous répondons vite.',
      'faq.q.docs':        'Quels documents faut-il pour voyager avec vous ?',
      'faq.q.visa':        'Nous aidez-vous dans les démarches de visa ?',
      'faq.q.payment':     'Comment se fait le paiement ? Y a-t-il un paiement échelonné ou un acompte ?',
      'faq.q.allInclusive':'Le prix comprend-il tout ?',
      'faq.q.packing':     'Que dois-je préparer pour le voyage de l\'Omra ?',
      'faq.q.departure':   'D\'où partent vos voyages ?',
      'faq.q.cancel':      'Et si je dois changer la date ou annuler ?',
      'faq.q.howbook':     'Comment réserver ?',
      'faq.cta.more':      'Une autre question ? Contactez-nous sur WhatsApp',

      /* ── 404 ── */
      '404.eyebrow':       'Erreur 404',
      '404.title':         'Nous nous sommes un peu égarés'
    }
  };

  /* Expose so Agent 3 can extend without re-declaring. */
  window.NOMARA_I18N = window.NOMARA_I18N || DICT;

  function t(key, lang) {
    var d = window.NOMARA_I18N;
    if (d[lang] && d[lang][key] != null) return d[lang][key];
    if (d.ar && d.ar[key] != null) return d.ar[key];   // fall back to AR
    return null;
  }

  function applyLang(lang) {
    var html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'fr' ? 'ltr' : 'rtl');

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = t(el.getAttribute('data-i18n'), lang);
      if (val != null) el.textContent = val;
    });

    // Attribute translations: data-i18n-aria, data-i18n-placeholder
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var val = t(el.getAttribute('data-i18n-aria'), lang);
      if (val != null) el.setAttribute('aria-label', val);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var val = t(el.getAttribute('data-i18n-placeholder'), lang);
      if (val != null) el.setAttribute('placeholder', val);
    });

    // Keep the switcher's active state in sync.
    document.querySelectorAll('.lang-switcher [data-i18n-lang]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-i18n-lang') === lang);
    });

    store.set(STORAGE_KEY, lang);
  }

  function init() {
    var saved = store.get(STORAGE_KEY);
    var initial = (saved === 'fr' || saved === 'ar')
      ? saved
      : (document.documentElement.getAttribute('lang') || 'ar');

    // Wire the switcher buttons (they carry data-i18n-lang="ar|fr").
    document.querySelectorAll('.lang-switcher [data-i18n-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.getAttribute('data-i18n-lang'));
      });
    });

    // Apply the resolved language (only flips chrome if it differs from AR).
    applyLang(initial);

    // Public API so other scripts (and Agent 3) can drive it.
    window.NOMARA_setLang = applyLang;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
