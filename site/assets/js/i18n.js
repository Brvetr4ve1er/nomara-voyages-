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

      'lang.ar':         'العربية',
      'lang.fr':         'الفرنسية'
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

      'lang.ar':         'Arabe',
      'lang.fr':         'Français'
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
