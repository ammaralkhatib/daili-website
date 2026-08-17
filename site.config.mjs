// Single source of truth for the whole site. Everything downstream — the locale
// directories, the language picker, the hreflang clusters, the sitemap, the
// detection script's SUPPORTED array — is derived from what is written here.
//
// Adding a language is three edits in this file plus one content/<code>.json.

export const BASE_URL = 'https://daili.app';

/**
 * Locales that are BUILT, in the order they were added.
 *
 * A locale listed here with no content/<code>.json fails tools/check-content.mjs
 * before a single byte is written, so this list can never get ahead of reality.
 *
 * The target is 23. They arrive in batches (see the plan's Phase 5); this array
 * is the switch that ships them.
 */
export const LOCALES = ['en', 'de'];

/** The full 23-locale target, kept here so the endonym map below stays honest. */
export const PLANNED_LOCALES = [
  'en', 'de', 'ja', 'fr', 'ko', 'es', 'zh-Hans', 'zh-Hant', 'it', 'nl', 'pt',
  'sv', 'da', 'nb', 'pl', 'tr', 'ar', 'cs', 'fi', 'th', 'ru', 'id', 'hi',
];

/**
 * English is served from the root, not from /en/. That keeps the SEO the root
 * has already earned, and makes / the canonical + x-default.
 */
export const DEFAULT_LOCALE = 'en';

/**
 * URL path prefix per locale.
 *
 * Directory names are LOWERCASE on disk ('/zh-hans/'), while the hreflang
 * attribute keeps proper BCP-47 casing ('zh-Hans'). Google is case-insensitive
 * on the attribute; a Linux filesystem is not case-insensitive on the path.
 * Splitting the two removes a whole class of 404.
 */
export const dirFor = (locale) =>
  locale === DEFAULT_LOCALE ? '/' : `/${locale.toLowerCase()}/`;

/**
 * Endonyms — each language's name in that language. NEVER translated.
 *
 * A picker labelled in the current page's language is unreadable to the person
 * trying to escape it. Copied from, and kept in step with, the app's
 * familyplanner-app/lib/core/localization/language_names.dart, which carries the
 * same rule for the same reason.
 */
export const endonyms = {
  en: 'English',
  de: 'Deutsch',
  ja: '日本語',
  fr: 'Français',
  ko: '한국어',
  es: 'Español',
  'zh-Hans': '简体中文',
  'zh-Hant': '繁體中文',
  it: 'Italiano',
  nl: 'Nederlands',
  pt: 'Português',
  sv: 'Svenska',
  da: 'Dansk',
  nb: 'Norsk',
  pl: 'Polski',
  tr: 'Türkçe',
  ar: 'العربية',
  cs: 'Čeština',
  fi: 'Suomi',
  th: 'ไทย',
  ru: 'Русский',
  id: 'Bahasa Indonesia',
  hi: 'हिन्दी',
};

/** Right-to-left locales. Drives <html dir> and the mirrored CSS custom properties. */
export const RTL = new Set(['ar']);

/** Store links live in exactly one place, so fixing one fixes all 23 locales. */
export const stores = {
  ios: {
    url: 'https://apps.apple.com/app/id6800427546',
    // NOTE 2026-08-17: this URL 404s in every storefront and
    // itunes.apple.com/lookup?id=6800427546 returns resultCount:0 — the app is
    // not public on the App Store yet. Shown anyway by an explicit decision.
    // When the real listing exists, change this line and rebuild.
    verified: false,
  },
  android: {
    url: 'https://play.google.com/store/apps/details?id=app.daili',
    verified: true,
  },
};

export const contact = {
  email: 'support@daili.app',
  name: 'Ammar Khatib',
  street: 'Kajetan-Sweth-Straße 8',
  city: '6020 Innsbruck',
  country: 'Austria',
};

/**
 * The page manifest. `locales` is either 'all' (every entry in LOCALES) or an
 * explicit list — the legal pages are authoritative in English and German only.
 *
 * `out` is a function of locale so the flat legal paths survive exactly as they
 * are: https://daili.app/privacy.html, /datenschutz.html and /support.html are
 * printed in the live App Store and Play listings and must not move, not even
 * behind a redirect.
 *
 * `cluster` groups pages that are translations of each other for hreflang.
 * Pages in different clusters must never reference each other as alternates.
 */
export const PAGES = [
  {
    id: 'landing',
    template: 'landing.html',
    locales: 'all',
    cluster: 'landing',
    out: (loc) => (loc === DEFAULT_LOCALE ? 'index.html' : `${loc.toLowerCase()}/index.html`),
    priority: (loc) => (loc === DEFAULT_LOCALE ? '1.0' : '0.9'),
  },
  {
    id: 'support',
    template: 'support.html',
    locales: 'all',
    cluster: 'support',
    out: (loc) => (loc === DEFAULT_LOCALE ? 'support.html' : `${loc.toLowerCase()}/support.html`),
    priority: () => '0.5',
  },
  {
    id: 'privacy',
    template: 'legal.html',
    locales: ['en', 'de'],
    cluster: 'privacy',
    body: { en: 'privacy.en.html', de: 'datenschutz.de.html' },
    out: (loc) => (loc === 'en' ? 'privacy.html' : 'datenschutz.html'),
    priority: () => '0.3',
  },
  {
    id: 'terms',
    template: 'legal.html',
    locales: ['en', 'de'],
    cluster: 'terms',
    body: { en: 'terms.en.html', de: 'nutzungsbedingungen.de.html' },
    out: (loc) => (loc === 'en' ? 'terms.html' : 'nutzungsbedingungen.html'),
    priority: () => '0.3',
  },
  {
    id: 'impressum',
    template: 'legal.html',
    locales: ['de'],
    cluster: null, // single-language legal notice: no hreflang set, noindex, not in sitemap
    noindex: true,
    body: { de: 'impressum.de.html' },
    out: () => 'impressum.html',
  },
  {
    id: 'notfound',
    template: '404.html',
    locales: ['en'],
    cluster: null,
    noindex: true,
    out: () => '404.html',
  },
];

/**
 * The landing page's feature sections, in order.
 *
 * Structure lives here, words live in content/<locale>.json under
 * features.<key>. Keeping them apart means a translator only ever sees prose —
 * never an image filename or a layout class — and adding a feature is a code
 * change rather than 23 translation changes.
 *
 * `art`: 'phone' = a phone mockup, 'duo' = a phone mockup in the wider slot,
 * 'ill' = a flat illustration. The alternating .alt class is derived from the
 * index, exactly as the hand-written page had it.
 */
export const FEATURES = [
  { key: 'calendar',  img: 'shot-calendar',  art: 'phone' },
  { key: 'shopping',  img: 'shot-shopping',  art: 'phone' },
  { key: 'todos',     img: 'shot-todos',     art: 'phone' },
  { key: 'meals',     img: 'shot-mealplan',  art: 'duo'   },
  { key: 'birthdays', img: 'shot-birthdays', art: 'phone' },
  { key: 'vault',     img: 'shot-documents', art: 'phone' },
  { key: 'family',    img: 'ill-family',     art: 'ill'   },
];

/**
 * The screenshot strip. These six files shipped with the site but were
 * referenced by nothing — free content that was already paid for.
 * Captions live in content under gallery.captions[], same order.
 */
// Phone screenshots only, deliberately: the illustrations are 840x688 and the
// screenshots 640x1391, and a strip mixing both leaves the captions at wildly
// different heights. The illustrations keep their home inside the feature
// sections instead.
export const GALLERY = [
  'shot-home', 'shot-recipes', 'shot-photos',
  'shot-shopping', 'shot-mealplan', 'shot-birthdays',
];

/**
 * The comparison table's marks. Words live in content under compare.rows[]
 * (row labels) and compare.cols (column headers); only the ✓/~/— marks are
 * here, because they are the same in every language.
 *
 * 'y' = yes, 'p' = partly, 'n' = no. Kept honest on purpose: a comparison
 * where the competitor loses every row reads as marketing, not as confidence.
 */
export const COMPARE_ROWS = [
  { daili: 'y', gcal: 'y', paper: 'p' }, // everyone's events in one place
  { daili: 'y', gcal: 'y', paper: 'n' }, // reminders on every phone
  { daili: 'y', gcal: 'n', paper: 'p' }, // shared shopping list
  { daili: 'y', gcal: 'n', paper: 'n' }, // to-dos with a name on them
  { daili: 'y', gcal: 'n', paper: 'n' }, // meal plan and recipes
  { daili: 'y', gcal: 'p', paper: 'n' }, // kids get their own login
  { daili: 'y', gcal: 'n', paper: 'n' }, // birthdays remembered every year
  { daili: 'y', gcal: 'n', paper: 'y' }, // no ads, nothing sold
];

export const COMPARE_MARKS = { y: '✓', p: '~', n: '—' };

/** The three trust pills' icons. Words live in content under trust.pills[]. */
export const TRUST_ICONS = [
  '<circle cx="12" cy="12" r="9"/><line x1="5.5" y1="5.5" x2="18.5" y2="18.5"/>',
  '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><line x1="4" y1="4" x2="20" y2="20"/>',
  '<path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
];

/** Intrinsic pixel sizes, measured from the files. Used for width/height so the
 *  page stops shifting layout on every load. */
export const IMAGE_SIZES = {
  'shot-': { width: 640, height: 1391 },
  'ill-': { width: 840, height: 688 },
  'logo': { width: 512, height: 512 },
};

export const imageSize = (name) => {
  if (name.startsWith('shot-')) return IMAGE_SIZES['shot-'];
  if (name.startsWith('ill-')) return IMAGE_SIZES['ill-'];
  return IMAGE_SIZES['logo'];
};

/**
 * Brand transliterations that must never appear. A model translating into
 * Arabic, Japanese or Chinese will transliterate a brand name by default, and
 * that is the failure the positive "contains Daili" check cannot catch.
 */
export const BRAND_TRANSLITERATIONS = [
  'دايلي', 'ديلي', 'デイリー', 'ダイリ', '데일리', '戴利', 'дейли', 'дэйли', 'ไดลี', 'डेली',
];

/** The old product name. Must appear nowhere. */
export const FORBIDDEN_STRINGS = ['FamCanvas'];
