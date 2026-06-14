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
      'turquie.hero.sub':  'أسبوع في إسطنبول بين المعالم التاريخية والأسواق والمضائق، مع فندق 4 نجوم وجولات منظمة. تذكرة وفندق ومرافقة في سعر واحد واضح.',
      'turquie.hero.chip': 'رحلة مميّزة · انطلاق من قسنطينة',
      'sec.turquie.price.title':'باقة إسطنبول',
      'turquie.book.title':'جاهز للسفر إلى تركيا؟',

      /* ── AZERBAIDJAN ── */
      'azerbaidjan.hero.title':'باكو — أذربيجان',
      'azerbaidjan.hero.sub':  'اكتشف باكو، لؤلؤة بحر قزوين، بين المدينة القديمة والأبراج الحديثة، مع فندق 4 نجوم وجولات منظمة. تذكرة وفندق ومرافقة في سعر واحد واضح.',
      'azerbaidjan.hero.chip': 'عرض خاص · انطلاق من قسنطينة',
      'sec.azerbaidjan.price.title':'باقة باكو',
      'azerbaidjan.book.title':'جاهز للسفر إلى أذربيجان؟',

      /* ── MALAISIE ── */
      'malaisie.hero.title':'ماليزيا',
      'malaisie.hero.sub':  'رحلة إلى ماليزيا بين ناطحات السحاب في كوالالمبور والجزر الاستوائية الساحرة، مع فندق 4 نجوم وجولات منظمة. تذكرة وفندق ومرافقة في سعر واحد واضح.',
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

  var STATIC_TEXT_FR = {
    'دج': 'DZD',
    '/ للشخص — السعر شامل': '/ personne — prix inclus',
    'واتساب': 'WhatsApp',
    'اعرف المزيد': 'En savoir plus',
    'عرض على خرائط جوجل': 'Voir sur Google Maps',
    'عرض الموقع على الخريطة': 'Voir l’emplacement sur la carte',
    'تخطّي إلى المحتوى': 'Passer au contenu',
    'نومارا للسياحة و خدمات الحج و العمرة — رفيقك في كل رحلة.': 'Nomara voyages, Hajj et Omra — votre compagnon à chaque voyage.',
    'البريد الإلكتروني: قيد التأكيد': 'E-mail : à confirmer',
    'العنوان': 'Adresse',
    'وكالة سياحية مرخّصة — رقم الرخصة: TODO-CLIENT ·': 'Agence de voyages agréée — licence : à confirmer ·',
    '— نموذج مراجعة · TODO-CLIENT': '— exemple d’avis · à remplacer',
    'السعر عند الطلب — تواصل لمعرفته': 'Prix sur demande — contactez-nous',
    'تذكرة الطيران ذهابًا وإيابًا من مطار قسنطينة': 'Billet d’avion aller-retour depuis l’aéroport de Constantine',
    'مرافقة فريق نومارا طوال الرحلة': 'Accompagnement de l’équipe Nomara pendant tout le voyage',
    'تواصل معنا الآن، نرد عليك بسرعة ونؤكد حجزك خطوة بخطوة.': 'Contactez-nous maintenant : nous répondons vite et confirmons votre réservation étape par étape.',
    'الانطلاق': 'Départ',
    'العودة': 'Retour',
    'الجولات': 'Excursions',
    'الجولات السياحية المنظمة': 'Excursions touristiques organisées',
    'الإقامة في فندق 4 نجوم مع الفطور': 'Hébergement en hôtel 4 étoiles avec petit-déjeuner',
    '· مع الفطور': '· avec petit-déjeuner',
    'السعر والمواعيد قيد التأكيد — تواصل معنا لمعرفة المقاعد المتاحة.': 'Prix et dates à confirmer — contactez-nous pour connaître les places disponibles.',
    'نقل إلى المطار والعودة إلى قسنطينة برفقة فريق نومارا.': 'Transfert vers l’aéroport et retour à Constantine avec l’équipe Nomara.',
    'السعر للشخص': 'Prix par personne',
    'الخطوات': 'Étapes',
    'العمرة والحج': 'Omra et Hajj',
    'الرحلات المنظمة': 'Voyages organisés',
    'تونس': 'Tunisie',
    'تركيا': 'Turquie',
    'مصر': 'Égypte',
    'أذربيجان': 'Azerbaïdjan',
    'ماليزيا': 'Malaisie',
    'كل الخدمات': 'Tous les services',
    'رحلة مميّزة': 'Voyage premium',
    'انطلاق مباشر من قسنطينة': 'Départ direct de Constantine',
    'انطلاق من قسنطينة': 'Départ de Constantine',
    'إقامة كاملة · 7 ليالٍ · انطلاق من قسنطينة': 'Pension complète · 7 nuits · départ de Constantine',
    '3 خيارات فنادق': '3 choix d’hôtels',
    'فندق 4 نجوم · جولات · انطلاق من قسنطينة': 'Hôtel 4 étoiles · excursions · départ de Constantine',
    'فندق 4 نجوم · عرض خاص · انطلاق من قسنطينة': 'Hôtel 4 étoiles · offre spéciale · départ de Constantine',
    'فندق 4 نجوم · جزر وجولات · انطلاق من قسنطينة': 'Hôtel 4 étoiles · îles et excursions · départ de Constantine',
    'الغردقة −25%': 'Hurghada −25 %',
    'عرضان': 'Deux offres',
    'القاهرة التاريخية + منتجع البحر الأحمر': 'Le Caire historique + resort de la mer Rouge',
    'كل الوجهات في مكان واحد': 'Toutes les destinations au même endroit',
    'تصفّح كل الرحلات المنظمة واختر وجهتك.': 'Parcourez tous les voyages organisés et choisissez votre destination.',
    'استعرض كل ما تقدّمه نومارا في صفحة واحدة.': 'Découvrez tout ce que Nomara propose sur une seule page.',
    'نرافقك في رحلة العمر': 'Nous vous accompagnons dans le voyage d’une vie',
    'عمرة شوال وعمرة جوان، بطيران مباشر من قسنطينة وفنادق قريبة من الحرم. مرافقة كاملة تطمئن قلبك من لحظة الانطلاق إلى العودة — السعر شامل الطيران والفندق والمرافقة والتأشيرة.': 'Omra de Chawwal et de juin avec vol direct depuis Constantine, hôtels proches du Haram et accompagnement complet du départ au retour — le prix comprend vol, hôtel, accompagnement et visa.',
    'تعرّف على باقات العمرة': 'Découvrir les forfaits Omra',
    'استفسر عبر واتساب': 'Demander sur WhatsApp',
    'ح ي': 'HY',
    'حدّاد يوسف إسلام': 'Haddad Youcef Islam',
    'مرشدكم — يرافقكم بنفسه على الأرض': 'Votre guide — présent avec vous sur le terrain',
    'السعر الذي تراه هو ما تدفعه — يشمل الطيران والفندق والمرافقة. لا تكاليف خفية ولا أسعار «ابتداءً من» تتغيّر لاحقًا.': 'Le prix affiché est le prix payé : vol, hôtel et accompagnement inclus. Pas de frais cachés ni de prix “à partir de” qui changent ensuite.',
    'فريق نومارا يرافقك على الأرض، يجيب عن أسئلتك ويحل ما يطرأ — لست وحدك في أي خطوة.': 'L’équipe Nomara vous accompagne sur place, répond à vos questions et gère les imprévus — vous n’êtes jamais seul.',
    'تواصل معنا مباشرة، نرد عليك بسرعة، ونؤكد حجزك بكل بساطة — دون تعقيد ولا أوراق طويلة.': 'Contactez-nous directement : nous répondons vite et confirmons votre réservation simplement, sans démarches compliquées.',
    '«رافقونا في العمرة من البداية للنهاية، والفندق كان قريبًا من الحرم فعلًا. شعرنا بالاطمئنان.»': '« Ils nous ont accompagnés pour l’Omra du début à la fin, et l’hôtel était vraiment proche du Haram. Nous étions rassurés. »',
    '«رحلة جربة كانت منظمة وبسعر واضح، وكل شيء كان كما اتفقنا عليه تمامًا.»': '« Le voyage à Djerba était bien organisé, avec un prix clair. Tout était exactement comme convenu. »',
    'نموذج — في انتظار مراجعات العملاء': 'Exemple — en attente d’avis clients',
    'اقرأ المزيد': 'Lire la suite',
    'تعرّف على وكالتنا ومرشدنا، واطّلع على آراء عملائنا.': 'Découvrez notre agence, notre guide et les avis de nos clients.',
    'من نحن': 'À propos',
    'تواصل معنا الآن عبر واتساب أو اتصل بنا مباشرة — نرد عليك بسرعة ونرتّب لك كل شيء.': 'Contactez-nous maintenant sur WhatsApp ou appelez-nous directement — nous répondons vite et organisons tout pour vous.',
    'نومارا للسياحة و خدمات الحج و العمرة — وكالة من عين مليلة، نرافق المسافرين من شرق الجزائر في رحلاتهم ومناسكهم، انطلاقًا من مطار قسنطينة.': 'Nomara voyages, Hajj et Omra est une agence basée à Aïn M’Lila. Nous accompagnons les voyageurs de l’Est algérien dans leurs voyages et rites, au départ de l’aéroport de Constantine.',
    'بدأنا برؤية بسيطة: أن يجد المسافر الجزائري رفيقًا يثق به — لا مجرد وكالة تبيع تذاكر. لذلك نهتم بكل تفصيل، من اختيار الفندق إلى المرافقة على الأرض، ونحرص على وضوح السعر منذ اللحظة الأولى.': 'Nous sommes partis d’une idée simple : offrir au voyageur algérien un compagnon de confiance, pas seulement une agence qui vend des billets. Nous soignons chaque détail, du choix de l’hôtel à l’accompagnement sur place, avec un prix clair dès le départ.',
    'مرشدكم ومرافقكم على الأرض': 'Votre guide et accompagnateur sur place',
    '«أنا حدّاد يوسف إسلام، أرافقكم بنفسي في رحلاتكم. أؤمن أن السفر — خاصة العمرة — أمانة، وأن المسافر يستحق أن يشعر بالاطمئنان من لحظة الانطلاق إلى العودة. لذلك تجدونني معكم على الأرض، أجيب عن أسئلتكم وأحل ما يطرأ، حتى تتفرّغوا لرحلتكم وعبادتكم.»': '« Je suis Haddad Youcef Islam, et je vous accompagne personnellement pendant vos voyages. Je crois que le voyage, surtout l’Omra, est une responsabilité : le voyageur mérite d’être rassuré du départ au retour. Je suis donc présent sur place pour répondre à vos questions et gérer les imprévus, afin que vous puissiez vivre votre voyage et votre adoration sereinement. »',
    'على مدى السنوات، رافقت مجموعات من المعتمرين والمسافرين، ونقلت لحظات الرحلات مباشرة لعائلاتهم. هذه العلاقة الإنسانية هي ما يميّز نومارا.': 'Au fil des années, j’ai accompagné des groupes de pèlerins et de voyageurs, en partageant les moments du voyage avec leurs familles. Cette relation humaine est ce qui distingue Nomara.',
    'وكالة سياحية مرخّصة — رقم الرخصة:': 'Agence de voyages agréée — licence :',
    'مرشد معروف يرافقك بنفسه': 'Un guide reconnu vous accompagne personnellement',
    'أسعار واضحة شاملة دون تكاليف خفية': 'Des prix clairs et inclusifs, sans frais cachés',
    '«رافقونا في العمرة من البداية للنهاية، والفندق كان قريبًا من الحرم فعلًا. شعرنا بالاطمئنان طوال الرحلة.»': '« Ils nous ont accompagnés pour l’Omra du début à la fin, et l’hôtel était vraiment proche du Haram. Nous étions rassurés tout au long du voyage. »',
    '«رحلة جربة كانت منظمة وبسعر واضح، وكل شيء جاء كما اتفقنا عليه تمامًا. سنكرّرها معهم.»': '« Le voyage à Djerba était bien organisé, avec un prix clair. Tout s’est passé comme convenu. Nous repartirons avec eux. »',
    '«تعامل صادق ورد سريع على واتساب. أنصح بهم لمن يبحث عن راحة البال.»': '« Service honnête et réponse rapide sur WhatsApp. Je les recommande à ceux qui cherchent la tranquillité. »',
    'هذه نماذج توضيحية لشكل المراجعات — لا نعرض مراجعات حقيقية إلا بعد موافقة أصحابها. (TODO-CLIENT: استبدالها بمراجعات حقيقية)': 'Ces avis sont des exemples de mise en page. Les vrais avis ne seront publiés qu’avec l’accord de leurs auteurs. À remplacer par des avis réels.',
    'تواصل معنا عبر واتساب أو اتصل بنا — نرد عليك بسرعة.': 'Contactez-nous sur WhatsApp ou appelez-nous — nous répondons vite.',
    'فندق 4 نجوم في إسطنبول': 'Hôtel 4 étoiles à Istanbul',
    'فندق 4 نجوم في باكو': 'Hôtel 4 étoiles à Bakou',
    'فندق 4 نجوم في كوالالمبور': 'Hôtel 4 étoiles à Kuala Lumpur',
    'إقلاع مباشر من مطار قسنطينة واستقبال ونقل إلى الفندق في إسطنبول.': 'Vol direct depuis l’aéroport de Constantine, accueil et transfert vers l’hôtel à Istanbul.',
    'إقلاع مباشر من مطار قسنطينة واستقبال ونقل إلى الفندق في باكو.': 'Vol direct depuis l’aéroport de Constantine, accueil et transfert vers l’hôtel à Bakou.',
    'إقلاع مباشر من مطار قسنطينة واستقبال ونقل إلى الفندق في كوالالمبور.': 'Vol direct depuis l’aéroport de Constantine, accueil et transfert vers l’hôtel à Kuala Lumpur.',
    'جولات في معالم إسطنبول: آيا صوفيا، المسجد الأزرق، البازار الكبير والمضيق.': 'Excursions à Istanbul : Sainte-Sophie, Mosquée bleue, Grand Bazar et Bosphore.',
    'جولات في باكو وضواحيها: المدينة القديمة، الكورنيش والمعالم الحديثة.': 'Excursions à Bakou et autour : vieille ville, corniche et monuments modernes.',
    'جولات بين كوالالمبور (أبراج بتروناس) والجزر والمناطق السياحية.': 'Excursions entre Kuala Lumpur, les tours Petronas, les îles et sites touristiques.',
    'لمحة من تونس': 'Aperçu de la Tunisie',
    'لمحة من تركيا': 'Aperçu de la Turquie',
    'لمحة من أذربيجان': 'Aperçu de l’Azerbaïdjan',
    'لمحة من ماليزيا': 'Aperçu de la Malaisie',
    'لمحة من مصر': 'Aperçu de l’Égypte',
    'اتصل بنا مباشرة في أي وقت خلال ساعات العمل.': 'Appelez-nous directement pendant les horaires d’ouverture.',
    'راسلنا على واتساب، نرد عليك بسرعة.': 'Écrivez-nous sur WhatsApp, nous répondons vite.',
    'للاستفسارات الكتابية.': 'Pour les demandes écrites.',
    'البريد الإلكتروني قيد التأكيد': 'E-mail à confirmer',
    'حي الغزالي، عين مليلة، أم البواقي، الجزائر —': 'Cité Ghazali, Aïn M’Lila, Oum El Bouaghi, Algérie —',
    'من السبت إلى الخميس —': 'Du samedi au jeudi —',
    '(TODO-CLIENT: تأكيد المواعيد)': '(horaires à confirmer)',
    'واتساب متاح للرد على مدار اليوم تقريبًا.': 'WhatsApp est disponible presque toute la journée.',
    'السعر شامل: الطيران من قسنطينة + الإقامة + المرافقة.': 'Prix inclus : vol depuis Constantine + hébergement + accompagnement.',
    'السعر شامل: الطيران من قسنطينة + الإقامة + المرافقة. 7 ليالٍ.': 'Prix inclus : vol depuis Constantine + hébergement + accompagnement. 7 nuits.',
    'السعر شامل: الطيران من قسنطينة + الإقامة + المرافقة. 8 ليالٍ.': 'Prix inclus : vol depuis Constantine + hébergement + accompagnement. 8 nuits.',
    'القاهرة': 'Le Caire',
    'الأهرامات وأبو الهول والقاهرة التاريخية · جولات منظمة': 'Pyramides, Sphinx et Le Caire historique · excursions organisées',
    'السعر والمواعيد قيد التأكيد.': 'Prix et dates à confirmer.',
    '−25%': '−25 %',
    'الغردقة — Collection Mirage': 'Hurghada — Collection Mirage',
    'منتجع البحر الأحمر · شواطئ صافية وإطلالات ساحرة': 'Resort de la mer Rouge · plages claires et vues charmantes',
    'عرض خاص −25%': 'Offre spéciale −25 %',
    'السعر بعد الخصم والمواعيد قيد التأكيد — تواصل معنا ونوضّح لك كل التفاصيل.': 'Prix remisé et dates à confirmer — contactez-nous pour tous les détails.',
    'الإقامة في الفندق أو المنتجع المختار': 'Hébergement dans l’hôtel ou le resort choisi',
    'النقل والجولات المنظمة': 'Transferts et excursions organisées',
    'الفندق': 'Hôtel',
    'التصنيف والإقامة': 'Catégorie et pension',
    'جربة —': 'Djerba —',
    'سوسة —': 'Sousse —',
    'إقامة كاملة (Full Board)': 'Pension complète (Full Board)',
    'نصف إقامة': 'Demi-pension',
    'نصف إقامة — الباقة الاقتصادية': 'Demi-pension — forfait économique',
    'الأسعار قيد التأكيد — تواصل معنا لمعرفة المواعيد والمقاعد المتاحة.': 'Prix à confirmer — contactez-nous pour les dates et places disponibles.',
    'إقلاع مباشر من مطار قسنطينة، واستقبال ونقل إلى الفندق فور الوصول إلى تونس.': 'Vol direct depuis Constantine, accueil et transfert vers l’hôtel dès l’arrivée en Tunisie.',
    'أيام الإقامة': 'Séjour',
    'استمتاع بالشاطئ والفندق، مع إمكانية جولات اختيارية إلى المدينة العتيقة والأسواق.': 'Profitez de la plage et de l’hôtel, avec des excursions optionnelles vers la médina et les marchés.',
    'نقل إلى المطار والعودة إلى قسنطينة، مع مرافقة فريق نومارا حتى نهاية الرحلة.': 'Transfert vers l’aéroport et retour à Constantine, avec l’équipe Nomara jusqu’à la fin du voyage.',
    'الإقامة في الفندق المختار': 'Hébergement dans l’hôtel choisi',
    'النقل من وإلى المطار': 'Transfert depuis et vers l’aéroport',
    'الفندق والمسافة من الحرم': 'Hôtel et distance du Haram',
    'المسافة': 'Distance',
    'فندق قريب من الحرم': 'Hôtel proche du Haram',
    '350 م': '350 m',
    'فندق على مسافة متوسطة': 'Hôtel à distance moyenne',
    '500 م': '500 m',
    'فندق اقتصادي': 'Hôtel économique',
    '700 م': '700 m',
    'طيران مباشر من قسنطينة، وفنادق على مسافات مختلفة من الحرم — تختار ما يناسبك بسعر واضح.': 'Vol direct depuis Constantine et hôtels à différentes distances du Haram — choisissez ce qui vous convient avec un prix clair.',
    'الأسعار والمسافات إرشادية وقيد التأكيد — تواصل معنا لتفاصيل المواعيد والمقاعد المتاحة.': 'Prix et distances indicatifs, à confirmer — contactez-nous pour les dates et places disponibles.',
    'احجز عمرة شوّال': 'Réserver l’Omra de Chawwal',
    'مواعيد انطلاق متعددة في شهر جوان، مع نفس مستوى المرافقة والقرب من الحرم.': 'Plusieurs dates de départ en juin, avec le même niveau d’accompagnement et de proximité du Haram.',
    'الأسعار إرشادية وقيد التأكيد — تواصل معنا لمعرفة مواعيد الانطلاق المتاحة في جوان.': 'Prix indicatifs, à confirmer — contactez-nous pour connaître les dates disponibles en juin.',
    'احجز عمرة جوان': 'Réserver l’Omra de juin',
    'الطيران المباشر ذهابًا وإيابًا من مطار قسنطينة': 'Vol direct aller-retour depuis l’aéroport de Constantine',
    'الإقامة في فندق قريب من الحرم': 'Hébergement dans un hôtel proche du Haram',
    'المرافقة الكاملة على الأرض طوال الرحلة': 'Accompagnement complet sur place pendant tout le voyage',
    'إجراءات التأشيرة': 'Procédures de visa',
    '«اللّهُمّ اجعلها عمرةً مبرورةً وسعيًا مشكورًا»': '« Ô Allah, fais-en une Omra acceptée et un effort récompensé »',
    'نرافقك من لحظة الانطلاق إلى العودة — بسكينة واطمئنان.': 'Nous vous accompagnons du départ au retour — avec sérénité et tranquillité.',
    'نرشدك في مناسك الحج خطوة بخطوة، ونرافقك على الأرض من الانطلاق إلى العودة بسكينة واطمئنان.': 'Nous vous guidons dans les rites du Hajj pas à pas et vous accompagnons sur place du départ au retour.',
    'إرشاد في المناسك': 'Guidance dans les rites',
    'مرافقة ميدانية تشرح لك المناسك وتقف معك في كل خطوة، حتى تؤدي حجك بطمأنينة.': 'Un accompagnement sur place qui explique les rites et reste avec vous à chaque étape.',
    'تنظيم ولوجستيك': 'Organisation et logistique',
    'نتكفّل بالإقامة والتنقّل والترتيبات، لتتفرّغ أنت للعبادة وحدها.': 'Nous gérons l’hébergement, les déplacements et les arrangements pour que vous puissiez vous consacrer à l’adoration.',
    'مرافقة موثوقة': 'Accompagnement fiable',
    'خبرة سنوات في مرافقة الحجاج والمعتمرين، وحضور ميداني نقل لحظات الرحلة مباشرة.': 'Des années d’expérience dans l’accompagnement des pèlerins, avec une présence réelle sur le terrain.',
    'استفسر عن الحج': 'Demander pour le Hajj',
    'جمعنا لك أهم ما تحتاج معرفته قبل السفر — من الوثائق إلى ما تحضّره في حقيبتك.': 'Nous avons rassemblé l’essentiel à savoir avant le départ, des documents à préparer à votre valise.',
    'دليل التحضير والأسئلة الشائعة': 'Guide de préparation et FAQ',
    'قيد التأكيد': 'À confirmer',
    'قيد التأكيد — TODO-CLIENT': 'À confirmer',
    'تواصل معنا مباشرة عبر واتساب، نرد عليك بسرعة ونرتّب لك كل شيء.': 'Contactez-nous directement sur WhatsApp, nous répondons vite et organisons tout.',
    'تختلف الوثائق حسب الوجهة، لكنها عادةً تشمل: جواز سفر ساري المفعول، صور شمسية، وملف التأشيرة إن كانت الوجهة تتطلبها. نوضّح لك القائمة الكاملة لوجهتك عند الحجز، ونساعدك في ترتيب الملف.': 'Les documents varient selon la destination, mais comprennent généralement un passeport valide, des photos d’identité et un dossier de visa si nécessaire. Nous vous donnons la liste complète à la réservation et nous vous aidons à constituer le dossier.',
    'نعم، نساعدك في تحضير ملف التأشيرة وترتيب الوثائق المطلوبة. مع ذلك، قرار منح التأشيرة يبقى بيد القنصلية، ونحن لا نضمن الحصول عليها — نساعدك فقط في تقديم ملف سليم ومرتّب.': 'Oui, nous vous aidons à préparer le dossier de visa et les documents requis. La décision reste toutefois entre les mains du consulat : nous aidons à présenter un dossier clair et complet, sans garantir l’obtention.',
    'تفاصيل خدمة التأشيرة': 'Détails de l’assistance visa',
    '(TODO-CLIENT: تأكيد نطاق الخدمة)': '(périmètre du service à confirmer)',
    'نعتمد عادةً نظام العربون لتثبيت الحجز، ثم تسديد الباقي قبل السفر. تفاصيل المبالغ والمواعيد نتفق عليها عند الحجز عبر واتساب.': 'Nous utilisons généralement un acompte pour confirmer la réservation, puis le solde avant le départ. Les montants et délais sont convenus sur WhatsApp.',
    '(TODO-CLIENT: تأكيد نسبة العربون وآجال الدفع)': '(acompte et délais de paiement à confirmer)',
    'نعم، نعرض الأسعار شاملةً: الطيران من قسنطينة + الإقامة + المرافقة (وللعمرة: التأشيرة أيضًا). لا نعتمد أسلوب «ابتداءً من» ولا نخفي تكاليف. أي خدمة إضافية اختيارية نوضّحها لك مسبقًا.': 'Oui, nos prix incluent le vol depuis Constantine, l’hébergement et l’accompagnement (et le visa pour l’Omra). Pas de prix “à partir de” ni de frais cachés ; toute option est expliquée à l’avance.',
    'ننصح بتحضير: ملابس الإحرام، ملابس مريحة ومحتشمة، حذاء مريح للمشي، أدوات النظافة الشخصية، الأدوية الخاصة بك، نسخة من الوثائق، ومبلغ نقدي بسيط للمصاريف. نرسل لك قائمة تحضير مفصّلة قبل السفر، ونرافقك في كل خطوة.': 'Nous conseillons de préparer : habits d’ihram, vêtements confortables et modestes, chaussures de marche, trousse d’hygiène, médicaments personnels, copies des documents et un petit budget en espèces. Nous envoyons une liste détaillée avant le départ et nous vous accompagnons à chaque étape.',
    'تنطلق رحلاتنا مباشرةً من مطار قسنطينة (محمد بوضياف)، وهو الأقرب لمسافري شرق الجزائر. هذا يوفّر عليك عناء التنقّل إلى مطارات بعيدة.': 'Nos voyages partent directement de l’aéroport de Constantine (Mohamed Boudiaf), le plus proche pour les voyageurs de l’Est algérien — vous évitant le trajet vers des aéroports lointains.',
    'نتفهّم أن الظروف قد تتغيّر. سياسة التعديل والإلغاء تعتمد على نوع الرحلة وقربها من موعد الانطلاق وشروط شركات الطيران والفنادق. تواصل معنا في أقرب وقت ونوضّح لك الخيارات المتاحة بصدق.': 'Nous comprenons que les circonstances changent. Les modifications et annulations dépendent du type de voyage, de la proximité du départ et des conditions des compagnies et hôtels. Contactez-nous au plus tôt pour connaître les options.',
    '(TODO-CLIENT: تأكيد سياسة الإلغاء والاسترجاع)': '(politique d’annulation et remboursement à confirmer)',
    'ببساطة: تواصل معنا عبر واتساب على': 'Simplement : contactez-nous sur WhatsApp au',
    'أو اتصل على': 'ou appelez le',
    '، أخبرنا بالوجهة والتاريخ وعدد المسافرين، ونتكفّل بالباقي. الحجز يثبت بالعربون.': ', indiquez la destination, la date et le nombre de voyageurs, et nous nous occupons du reste. La réservation est confirmée par acompte.',
    'كل الوجهات': 'Toutes les destinations',
    '3 خيارات فنادق · 7 ليالٍ · إقامة كاملة': '3 choix d’hôtels · 7 nuits · pension complète',
    'فندق 4 نجوم · جولات سياحية': 'Hôtel 4 étoiles · excursions touristiques',
    'فندق 4 نجوم · عرض خاص': 'Hôtel 4 étoiles · offre spéciale',
    'فندق 4 نجوم · جزر وجولات': 'Hôtel 4 étoiles · îles et excursions',
    'تبحث عن العمرة؟': 'Vous cherchez l’Omra ?',
    'تعرّف على باقات عمرة شوال وجوان من قسنطينة.': 'Découvrez les forfaits Omra de Chawwal et de juin depuis Constantine.',
    'باقات العمرة': 'Forfaits Omra',
    'فنادق متعددة الوجهات': 'Hôtels multi-destinations',
    'تونس، تركيا، أذربيجان، ماليزيا، مصر، السعودية وغيرها.': 'Tunisie, Turquie, Azerbaïdjan, Malaisie, Égypte, Arabie saoudite et plus.',
    'قرب من الحرم': 'Proximité du Haram',
    'فنادق على مسافات مختلفة من الحرم للعمرة والحج، حسب ميزانيتك.': 'Hôtels à différentes distances du Haram pour l’Omra et le Hajj, selon votre budget.',
    'غرف عائلية وفردية': 'Chambres familiales et individuelles',
    'نختار لك الغرفة التي تناسب عدد المسافرين ونوع الإقامة.': 'Nous choisissons la chambre adaptée au nombre de voyageurs et au type de séjour.',
    'أنواع إقامة': 'Types de pension',
    'إقامة كاملة أو نصف إقامة أو مع الفطور — كما يناسبك.': 'Pension complète, demi-pension ou petit-déjeuner — selon vos besoins.',
    'أخبرنا بالوجهة والتواريخ وعدد المسافرين عبر واتساب.': 'Envoyez-nous la destination, les dates et le nombre de voyageurs sur WhatsApp.',
    'نقترح عليك خيارات فنادق بأسعار واضحة.': 'Nous vous proposons des hôtels avec des prix clairs.',
    'تختار، ونؤكد الحجز ونرسل لك التفاصيل.': 'Vous choisissez, nous confirmons la réservation et envoyons les détails.',
    'نساعدك في تحضير ملف التأشيرة وترتيب الوثائق المطلوبة لوجهتك. نرافقك في الخطوات بصدق ووضوح، دون أن نَعِدك بما لا نملكه — قرار منح التأشيرة يبقى بيد القنصلية.': 'Nous vous aidons à préparer votre dossier de visa et à organiser les documents requis. Nous vous accompagnons honnêtement, sans promettre ce qui ne dépend pas de nous : la décision revient au consulat.',
    'ملاحظة بصدق: هذه الخدمة قيد التطوير، ولا نضمن الحصول على التأشيرة — نساعدك فقط في تحضير ملف سليم ومرتّب. (TODO-CLIENT: تأكيد نطاق الخدمة والوجهات المدعومة)': 'Note honnête : ce service est en développement. Nous ne garantissons pas l’obtention du visa ; nous aidons à préparer un dossier clair et complet. Périmètre et destinations à confirmer.',
    'تأشيرة شنغن': 'Visa Schengen',
    'ترتيب وثائق ملف شنغن للسفر إلى أوروبا، ومراجعتها قبل التقديم.': 'Organisation et vérification du dossier Schengen avant dépôt.',
    'تأشيرة السعودية': 'Visa Arabie saoudite',
    'مرافقة في إجراءات تأشيرة العمرة والزيارة إلى السعودية.': 'Accompagnement pour les démarches de visa Omra et visite en Arabie saoudite.',
    'تأشيرة تركيا': 'Visa Turquie',
    'المساعدة في طلب التأشيرة الإلكترونية أو الورقية لتركيا.': 'Aide à la demande de visa électronique ou papier pour la Turquie.',
    'وجهات أخرى': 'Autres destinations',
    'أذربيجان، ماليزيا وغيرها — تواصل معنا لنرى ما نستطيع ترتيبه لك.': 'Azerbaïdjan, Malaisie et autres — contactez-nous pour voir ce que nous pouvons organiser.',
    'تواصل معنا عبر واتساب وأخبرنا بوجهتك وتاريخ سفرك المتوقع.': 'Contactez-nous sur WhatsApp avec votre destination et date prévue.',
    'نوضّح لك قائمة الوثائق المطلوبة ونساعدك في تجهيزها وترتيبها.': 'Nous vous expliquons la liste des documents et aidons à les préparer.',
    'نرافقك حتى تقديم الملف، ونبقى معك للإجابة عن أسئلتك.': 'Nous vous accompagnons jusqu’au dépôt et restons disponibles pour vos questions.',
    'مقارنة بين الشركات': 'Comparaison des compagnies',
    'نبحث في عدة شركات طيران لنجد أنسب سعر وأفضل توقيت.': 'Nous comparons plusieurs compagnies pour trouver le meilleur prix et horaire.',
    'أولوية للرحلات المباشرة من مطار قسنطينة قُربًا منك.': 'Priorité aux vols directs depuis l’aéroport de Constantine.',
    'ذهاب وإياب أو ذهاب فقط': 'Aller-retour ou aller simple',
    'نرتّب لك التذكرة حسب حاجتك ومرونة تواريخك.': 'Nous réservons le billet selon vos besoins et la flexibilité de vos dates.',
    'تأكيد سريع': 'Confirmation rapide',
    'نؤكد الحجز ونرسل لك التذكرة فور إتمام الدفع.': 'Nous confirmons la réservation et envoyons le billet après paiement.',
    'أرسل لنا الوجهة والتواريخ وعدد المسافرين عبر واتساب.': 'Envoyez-nous la destination, les dates et le nombre de voyageurs sur WhatsApp.',
    'نعرض عليك أفضل الأسعار المتاحة من عدة شركات.': 'Nous vous présentons les meilleurs prix disponibles chez plusieurs compagnies.',
    'تختار، وندفع ونؤكد ونرسل لك التذكرة.': 'Vous choisissez, nous validons et vous envoyons le billet.',
    'بصدق': 'En toute honnêteté',
    'ما لا يشمله السعر': 'Ce que le prix ne comprend pas',
    'لنكون صادقين معك من البداية.': 'Pour être honnêtes avec vous dès le départ.',
    'النفقات الشخصية والتسوّق': 'Les dépenses personnelles et le shopping',
    'الجولات والأنشطة الاختيارية غير المذكورة في البرنامج': 'Les excursions et activités optionnelles non mentionnées au programme',
    'الوجبات غير المذكورة ضمن نوع الإقامة': 'Les repas non inclus dans le type de pension',
    'تأمين السفر الاختياري': 'L’assurance voyage optionnelle',
    'رسوم التأشيرة إن كانت مطلوبة لوجهتك': 'Les frais de visa, si requis pour votre destination',
    'قد يعجبك أيضًا': 'Cela pourrait aussi vous plaire',
    'تركيا — إسطنبول': 'Turquie — Istanbul',
    'أذربيجان — باكو': 'Azerbaïdjan — Bakou',
    'ماليزيا — كوالالمبور': 'Malaisie — Kuala Lumpur',
    '7 ليالٍ · فندق 4 نجوم': '7 nuits · hôtel 4 étoiles',
    '3 خيارات فنادق · 7 ليالٍ': '3 choix d’hôtels · 7 nuits',
    'أهرامات · بحر أحمر': 'Pyramides · mer Rouge',
    'فنادق قرب الحرم · شوال وجوان': 'Hôtels près du Haram · Chawwal & juin',
    'تونس — جربة وسوسة': 'Tunisie — Djerba & Sousse',
    'مصر — القاهرة والغردقة': 'Égypte — Le Caire & Hurghada',
    'العمرة والحج من قسنطينة': 'Omra & Hajj depuis Constantine',
    'النفقات الشخصية والهدايا': 'Les dépenses personnelles et les cadeaux',
    'الهدي أو الأضحية إن رغبت': 'Le hady ou le sacrifice, si vous le souhaitez',
    'الجولات والزيارات الاختيارية غير المذكورة': 'Les visites et excursions optionnelles non mentionnées',
    'الوجبات غير المذكورة في الباقة': 'Les repas non inclus dans le forfait',
    'أي رسوم رسمية تستجد تفرضها الجهات المختصة': 'Tout frais officiel nouvellement imposé par les autorités compétentes',
    'بعد العمرة': 'Après l’Omra',
    'اكتشف وجهاتنا': 'Découvrez nos destinations',
    'كل الرحلات المنظمة': 'Tous les voyages organisés',
    'تونس · تركيا · أذربيجان · ماليزيا · مصر': 'Tunisie · Turquie · Azerbaïdjan · Malaisie · Égypte',
};

  var textNodeSources = new WeakMap();
  var LATIN_DIGITS = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
  };

  function normalizeTextKey(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function replaceTextPreservingEdges(sourceValue, translatedValue) {
    var source = String(sourceValue || '');
    var leading = (source.match(/^\s*/) || [''])[0];
    var trailing = (source.match(/\s*$/) || [''])[0];
    return leading + translatedValue + trailing;
  }

  function shouldSkipTextNode(node) {
    if (!node || !node.nodeValue || !normalizeTextKey(node.nodeValue)) return true;
    var parent = node.parentElement;
    if (!parent) return true;
    if (parent.closest('[data-i18n]')) return true;
    return /^(SCRIPT|STYLE|SVG|NOSCRIPT|TEMPLATE)$/i.test(parent.tagName);
  }

  function walkTextNodes(root, callback) {
    if (!root || !document.createTreeWalker) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        return shouldSkipTextNode(node)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      }
    });
    var node = walker.nextNode();
    while (node) {
      callback(node);
      node = walker.nextNode();
    }
  }

  function applyStaticText(lang) {
    var root = document.body || document.documentElement;
    walkTextNodes(root, function (node) {
      if (!textNodeSources.has(node)) {
        textNodeSources.set(node, node.nodeValue);
      }

      var source = textNodeSources.get(node);
      var key = normalizeTextKey(source);
      if (lang === 'fr' && STATIC_TEXT_FR[key] != null) {
        node.nodeValue = replaceTextPreservingEdges(source, STATIC_TEXT_FR[key]);
      } else {
        node.nodeValue = source;
      }
    });
  }

  function toLatinDigits(value) {
    return String(value || '').replace(/\u066A/g, '%').replace(/[٠-٩۰-۹]/g, function (ch) {
      return LATIN_DIGITS[ch] || ch;
    });
  }

  function normalizeNumbers(root) {
    var target = root || document.body || document.documentElement;
    walkTextNodes(target, function (node) {
      var normalized = toLatinDigits(node.nodeValue);
      if (normalized !== node.nodeValue) node.nodeValue = normalized;
    });

    target.querySelectorAll('[aria-label], [placeholder], [alt], [title]').forEach(function (el) {
      ['aria-label', 'placeholder', 'alt', 'title'].forEach(function (attr) {
        var value = el.getAttribute(attr);
        if (value == null) return;
        var normalized = toLatinDigits(value);
        if (normalized !== value) el.setAttribute(attr, normalized);
      });
    });
  }

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

    // #7: localize the pre-filled WhatsApp message (?text=). i18n only swaps
    // text/attrs, never href query params, so an FR user would otherwise open
    // WhatsApp pre-typed in Arabic. Capture the original AR href once, then for
    // FR replace the text param with a neutral French greeting (restore on AR).
    document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
      if (!a.dataset.waHref) a.dataset.waHref = a.getAttribute('href');
      var orig = a.dataset.waHref;
      if (!orig || orig.indexOf('text=') === -1) return;
      a.setAttribute('href', lang === 'fr'
        ? orig.replace(/text=[^&]*/, 'text=' + encodeURIComponent('Bonjour, je souhaite réserver un voyage avec Nomara.'))
        : orig);
    });

    applyStaticText(lang);
    normalizeNumbers(document.body || document.documentElement);

    // Keep the switcher's active state in sync. #33: also expose the selected
    // state to assistive tech via aria-pressed (visual .is-active alone is mute).
    document.querySelectorAll('.lang-switcher [data-i18n-lang]').forEach(function (btn) {
      var active = btn.getAttribute('data-i18n-lang') === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
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
