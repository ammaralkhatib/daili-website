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
export const LOCALES = ['en', 'de', 'fr', 'es', 'it', 'nl', 'pt', 'sv', 'da', 'nb', 'pl', 'cs', 'fi', 'tr', 'id', 'ja', 'ko', 'zh-Hans', 'zh-Hant', 'th', 'ru', 'hi', 'ar', 'el', 'uk', 'bg', 'ro', 'sk'];

/** The full 28-locale target, kept here so the endonym map below stays honest. */
export const PLANNED_LOCALES = [
  'en', 'de', 'ja', 'fr', 'ko', 'es', 'zh-Hans', 'zh-Hant', 'it', 'nl', 'pt',
  'sv', 'da', 'nb', 'pl', 'tr', 'ar', 'cs', 'fi', 'th', 'ru', 'id', 'hi',
  'el', 'uk', 'bg', 'ro', 'sk',
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
  el: 'Ελληνικά',
  uk: 'Українська',
  bg: 'Български',
  ro: 'Română',
  sk: 'Slovenčina',
};

/** Right-to-left locales. Drives <html dir> and the mirrored CSS custom properties. */
export const RTL = new Set(['ar']);

/** Store links live in exactly one place, so fixing one fixes all 23 locales. */
export const stores = {
  ios: {
    url: 'https://apps.apple.com/app/id6800427546',
    // 2026-09-01: the listing went public — v1.2.0 approved and released.
    // Confirmed via itunes.apple.com/lookup?id=6800427546&country=de
    // (`resultCount: 1`). The `available: false` arm stays wired up as the
    // tested off-switch should the listing ever go away again.
    available: true,
    verified: true,
  },
  android: {
    url: 'https://play.google.com/store/apps/details?id=app.daili',
    available: true,
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
/**
 * The body map for a legal page that exists in all 23 locales.
 *
 * `build.mjs` resolves a page body as `pg.body[loc]`, so a 23-entry object is
 * all a translated legal page needs — no build change, and a missing file
 * throws at read time rather than rendering an empty page.
 *
 * German is the one exception the map has to spell out: `datenschutz.de.html`
 * and `nutzungsbedingungen.de.html` are AUTHORITATIVE versions with their own
 * filenames, not `privacy.de.html` translations, and renaming them would move
 * nothing on disk but would quietly lose that distinction.
 */
const LEGAL_BODIES = (id, deFile) => Object.fromEntries(
  LOCALES.map((loc) => [loc, loc === 'de' ? deFile : `${id}.${loc}.html`]),
);

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
  // Privacy and Terms are the only legal pages that exist in every locale. The
  // English text is the binding one and every other language says so in its
  // first paragraph (`p.translated`, written into the body files, checked by
  // tools/check-legal.mjs) — which is what makes shipping 23 translations of a
  // legal document defensible at all.
  //
  // The two English and the two German URLs are FLAT and must never move: they
  // are printed in the live store listings. Everything else lives under its
  // locale directory. Same cluster names as before, so the hreflang set grows
  // from 2 members to 23 with no other change.
  {
    id: 'privacy',
    template: 'legal.html',
    locales: 'all',
    cluster: 'privacy',
    body: LEGAL_BODIES('privacy', 'datenschutz.de.html'),
    out: (loc) => (loc === 'en' ? 'privacy.html' : loc === 'de' ? 'datenschutz.html' : `${loc.toLowerCase()}/privacy.html`),
    priority: () => '0.3',
  },
  {
    id: 'terms',
    template: 'legal.html',
    locales: 'all',
    cluster: 'terms',
    body: LEGAL_BODIES('terms', 'nutzungsbedingungen.de.html'),
    out: (loc) => (loc === 'en' ? 'terms.html' : loc === 'de' ? 'nutzungsbedingungen.html' : `${loc.toLowerCase()}/terms.html`),
    priority: () => '0.3',
  },
  {
    id: 'whats-new',
    template: 'whats-new.html',
    locales: ['en', 'de'],
    cluster: 'whats-new',
    // EN + DE only, deliberately: a release-notes page in 23 languages would
    // cost 23 translations every release, forever. The legal pages already
    // establish that the site can carry an en+de-only cluster.
    body: { en: 'changelog/whats-new.en.html', de: 'changelog/whats-new.de.html' },
    // Per-locale meta, so `meta` is a function here where the blog's is a plain
    // object. build.mjs resolves either.
    meta: (loc) => WHATS_NEW[loc],
    out: (loc) => (loc === 'en' ? 'whats-new.html' : 'neuigkeiten.html'),
    priority: () => '0.4',
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
 * The blog's author. One person, one place: the byline the template prints and
 * the `author` in every post's Article JSON-LD read from this object, so they
 * cannot disagree with each other.
 */
export const BLOG_AUTHOR = { name: 'Ammar Khatib', url: '/impressum.html' };

/**
 * The blog's topic clusters, from claude/blog-seo-plan-2026-09.md section 1.
 * Key = the id a post carries, value = how it would be displayed.
 *
 * Nothing renders this yet. It is recorded now because tagging a post costs one
 * word while the post is being written and is archaeology afterwards — and
 * because /blog/ will want to group by it once there are enough posts for
 * grouping to look deliberate rather than broken. build.mjs throws on a
 * `cluster` that is not a key here, so a typo cannot create a silent sixth
 * cluster of one.
 */
export const BLOG_CLUSTERS = {
  documents: 'Family documents',
  cozi: 'Leaving Cozi',
  adoption: 'Getting the family to use it',
  privacy: 'Privacy and children’s data',
  devices: 'Mixed-device households',
};

/**
 * The post manifest — one object per post, and the ONLY place a post is
 * defined. Same contract PAGES has for pages: structure and identity here,
 * prose in blog/<body>.
 *
 * `slug` is the URL. It NEVER changes once a post is published.
 *
 * `faq` lives here and nowhere else. templates/blogpost.html renders the
 * visible FAQ from this array and build.mjs's renderHead builds the FAQPage
 * JSON-LD from the same array, so the markup and the visible text are the same
 * strings by construction. Google requires FAQ markup to match visible text
 * exactly, and the only way to guarantee that is to never type a question
 * twice — the landing page's FAQ is wired the same way for the same reason.
 *
 * `title` and `h1` are deliberately allowed to differ: the title tag is
 * competing in a search result, the H1 is being read on the page.
 *
 * `imageWidth`/`imageHeight` are the intrinsic pixels, measured from the file,
 * exactly as IMAGE_SIZES above records them for the app screenshots. They are
 * what stops the hero shifting the layout while it loads.
 *
 * The pages derived from this array carry `cluster: null` (see build.mjs). The
 * blog is English-only; a blog page must never claim a landing page in another
 * locale as its hreflang alternate.
 */
export const BLOG_POSTS = [
  {
    slug: 'where-to-store-important-family-documents',
    cluster: 'documents',
    title: 'Where to Store Important Family Documents: Safe or Phone?',
    description: 'Fireproof safe, cloud drive or your phone? Compare the three ways families store passports, birth certificates and insurance papers — and when each one fails.',
    h1: 'Where to Store Important Family Documents (Safe, Cloud, or Phone?)',
    published: '2026-09-02',
    updated: '2026-09-02',
    body: 'where-to-store-important-family-documents.en.html',
    image: '/assets/img/blog/where-to-store-important-family-documents.webp',
    imageAlt: 'Several EU passports and travel documents fanned out on a grey fabric surface',
    imageWidth: 1200,
    imageHeight: 801,
    faq: [
      {
        q: 'Is a photo of a passport legally valid?',
        a: 'Usually not as proof of identity. A copy is for reference — giving a hospital your insurance number, giving an airline a document number, proving to yourself which passport expires when. For anything official, you still need the original. That is exactly why copies and originals live in different places.',
      },
      {
        q: 'Where should the originals live?',
        a: 'In one place, and everyone who might need them should know where. A rated safe at home is right for most families because it stays accessible. A bank box is better protection but worse access; use it for things you will not need at short notice.',
      },
      {
        q: 'Do I need a safe AND a cloud folder AND the phone copies?',
        a: 'No. Most families need two: something that protects the originals, and one place that gives instant access. The phone set is small enough that adding it takes an evening, and it is the half most households are missing.',
      },
    ],
    // The closing CTA. It is per-post prose, not boilerplate — it names what
    // this particular article was about — so it lives with the post rather than
    // being hard-coded into a template twenty posts have to share.
    cta: {
      h2: 'What daili does with this',
      html: `<p>Daili has a documents vault built for exactly the second half of this article. Files you put in it are stored <strong>on your device only</strong> — they are never uploaded to our servers and are not part of any backup we hold. That means they are there with no signal, and they are not sitting in a company's cloud waiting on an account password.</p>
<p>It also means the vault is not a backup. Your originals still need the safe, and anything irreplaceable still needs a copy somewhere else. The vault is the ten-second answer, not the fire answer.</p>
<p class="post-cta-link"><a href="/">See how the documents vault works →</a></p>`,
    },
  },
  {
    slug: 'digital-family-emergency-binder',
    cluster: 'documents',
    title: 'The Digital Family Emergency Binder: What Goes In It',
    description: 'The paper emergency binder has one flaw — it is at home. How to build a digital version you actually carry, what belongs in it, and what must stay on paper.',
    h1: 'The Digital Family Emergency Binder',
    published: '2026-09-03',
    updated: '2026-09-03',
    body: 'digital-family-emergency-binder.en.html',
    image: '/assets/img/blog/digital-family-emergency-binder.webp',
    imageAlt: 'A woman filing a page into a ring binder at a white desk, with a smartphone and a cup of coffee beside her',
    imageWidth: 1200,
    imageHeight: 800,
    faq: [
      {
        q: 'Should I keep a paper binder as well?',
        a: 'Yes, for the top two tiers. Certificates, deeds, wills and insurance policies need to survive as originals, and paper in a rated safe does that better than anything digital. The digital binder is not a replacement for the safe — it is the half the safe was never able to do.',
      },
      {
        q: 'Is a phone safe enough for these documents?',
        a: 'For tier-three copies, yes, provided the phone is locked with a passcode or biometrics and the files are not sitting loose in the camera roll where they end up in shared albums and automatic cloud backups. Keep them somewhere separate and named. And leave out anything that works on its own for a thief: card numbers, passwords, signed blank forms.',
      },
      {
        q: 'What if my phone is destroyed in the same emergency?',
        a: 'That is exactly why the other adult has a copy, and why the originals are in the safe. The binder is one of three places, not the only one. If all three go at once, you have a much larger problem than paperwork — and the certificates in the safe are the ones you will actually need to rebuild from.',
      },
    ],
    cta: {
      h2: 'What daili does with this',
      html: `<p>Daili's documents vault is built for the second half of this article. Files you put in it are stored <strong>on your device only</strong> — never uploaded to our servers, and not part of any backup we hold. So they open in airplane mode, in a hospital basement, abroad with the data switched off.</p>
<p>That also means the vault is not a backup. Your originals still belong in the safe, and the other adult still needs their own copy. The vault is the part that is in your pocket.</p>
<p class="post-cta-link"><a href="/">See how the documents vault works →</a></p>`,
    },
  },
  {
    slug: 'family-document-checklist',
    cluster: 'documents',
    title: 'The Family Document Checklist: 27 Papers to Have Ready',
    description: 'A room-by-room checklist of the 27 documents every household needs to find fast — identity, medical, money, property, school — and which need the original.',
    h1: 'The Family Document Checklist: 27 Papers Every Household Should Have Ready',
    published: '2026-09-04',
    updated: '2026-09-04',
    body: 'family-document-checklist.en.html',
    image: '/assets/img/blog/family-document-checklist.webp',
    imageAlt: 'A hand ticking off items on a handwritten checklist in a notebook',
    imageWidth: 1200,
    imageHeight: 675,
    // The one post on the blog that is literally a list of named things, so it
    // is the one post where ItemList is a description rather than decoration.
    // Declaring the list's NAME here is the whole opt-in: renderHead reads the
    // 27 items back out of the rendered body (see the ol.doc-checklist blocks
    // in blog/family-document-checklist.en.html) rather than taking a second
    // copy of them here, for the same reason `faq` is never typed twice.
    itemList: 'The family document checklist — 27 documents every household should have ready',
    faq: [
      {
        q: 'How often should I update this?',
        a: 'Once a year is enough for the list as a whole. Two things need updating the day they change: the medication page and anyone\'s insurance card. Everything else can wait for the annual pass.',
      },
      {
        q: 'What if I am renting?',
        a: 'Items 19 and 20 become the tenancy agreement and your deposit paperwork, and contents insurance matters more, not less — the building is insured by the landlord, everything inside it is not. The rest of the list is unchanged.',
      },
      {
        q: 'Do I need originals, or are copies enough?',
        a: 'It depends on the tier. Certificates need originals. Contracts, policies and wills need an original or a certified copy. For everything in the third tier a plain copy does the job, which is why that tier is the one worth having on your phone.',
      },
    ],
    cta: {
      h2: 'What daili does with this',
      html: `<p>Daili has a documents vault for the instant set — the six or seven files you need at a school office or a hospital desk. Files in it are stored <strong>on your device only</strong>: never uploaded to our servers, not part of any backup we hold. They open with no signal.</p>
<p>It is not a filing cabinet and it is not a backup. The originals still belong in the safe. The vault is the part you carry.</p>
<p class="post-cta-link"><a href="/">See how the documents vault works →</a></p>`,
    },
  },
  {
    slug: 'shared-family-calendar-rules',
    cluster: 'adoption',
    title: '7 Rules for a Shared Family Calendar That Everyone Follows',
    description: 'Most shared calendars fail on habits, not features. Seven house rules — who adds what, how far ahead, what a colour means — that keep a family calendar trusted.',
    h1: '7 Rules for a Shared Family Calendar Everyone Actually Follows',
    published: '2026-09-05',
    updated: '2026-09-05',
    body: 'shared-family-calendar-rules.en.html',
    image: '/assets/img/blog/shared-family-calendar-rules.webp',
    imageAlt: 'A large family gathered around a laid dinner table at home, one man talking to the group',
    imageWidth: 1200,
    imageHeight: 801,
    faq: [
      {
        q: 'What if one person refuses to use it?',
        a: 'Then you have a relationship conversation, not a calendar problem, and no app fixes it. What does help: stop reminding them verbally. Every time you relay what is on the calendar, you prove they do not need to open it. Let one small thing be missed. That is uncomfortable, and it is usually the only thing that works.',
      },
      {
        q: 'How much detail is too much?',
        a: 'If an event needs scrolling to read, it is too much. When, where, who, and anything a stand-in would need. Everything else — the address you already know, the kit list, the group chat context — belongs in a note or nowhere.',
      },
      {
        q: 'Should children be able to add events?',
        a: 'Yes, from about ten. A child who can add their own football match is a child who has some ownership of the family\'s time, and it is one fewer thing routed through an adult. Expect a few mistakes and some very optimistic entries. That is a small price.',
      },
    ],
    cta: {
      h2: 'What daili does with this',
      html: `<p>Daili gives every family member their own colour, so rule 4 works without anyone maintaining a legend. Events carry a place, an end time and the person responsible, and there is no limit on how far ahead you can look — which is what rule 6 needs.</p>
<p>The rules matter more than the app. If you follow all seven in a shared Google Calendar, that works too.</p>
<p class="post-cta-link"><a href="/">See how the family calendar works →</a></p>`,
    },
  },
  {
    slug: 'cozi-free-plan-what-you-get',
    cluster: 'cozi',
    title: 'What Cozi\'s Free Plan Actually Includes in 2026',
    description: 'Cozi now has three tiers, not two. What free really gives you, what the 30-day calendar limit is, and why so many 2026 blog posts get the timeline wrong.',
    h1: 'What Cozi\'s Free Plan Actually Includes in 2026',
    published: '2026-09-06',
    updated: '2026-09-06',
    body: 'cozi-free-plan-what-you-get.en.html',
    image: '/assets/img/blog/cozi-free-plan-what-you-get.webp',
    imageAlt: 'A father checking his phone in the kitchen while his children eat breakfast',
    imageWidth: 1200,
    imageHeight: 801,
    faq: [
      {
        q: 'Is Cozi still free in 2026?',
        a: 'Yes. There is a free plan with a shared calendar, shopping and to-do lists and a recipe box. What is limited on free is how far ahead you can add and view events, month view on mobile, calendar search, reminders beyond one per event, and an ad-free experience.',
      },
      {
        q: 'When did Cozi change its free plan?',
        a: 'The user reports cluster in May 2024, not 2026. We found no announcement from Cozi at any point, which is why the change surprised people. Posts dated 2026 claiming a fresh paywall are re-dating a two-year-old change.',
      },
      {
        q: 'Is Cozi Gold worth $39?',
        a: 'If your family plans further than a month ahead, probably yes — it is one subscription for everyone and it removes the limit that causes most of the complaints. If you only ever use this week, free is genuinely fine.',
      },
    ],
    cta: {
      h2: 'What daili does with this',
      html: `<p>We make a family planner, so treat this as interested rather than neutral. Two things we can state plainly: daili does not limit how far ahead you can look, and there are no ads on any plan.</p>
<p>Cozi is a good app with a large, happy user base. If it fits your family, use it.</p>
<p class="post-cta-link"><a href="/">See what daili includes →</a></p>`,
    },
  },
  {
    slug: 'what-to-leave-with-a-babysitter',
    cluster: 'documents',
    title: 'What to Leave with a Babysitter or Grandparent',
    description: 'The one-page handover every sitter needs: contacts, medical details, routines, house rules and the permissions they need — plus what to deliberately leave out.',
    h1: 'What to Leave with a Babysitter or Grandparent for a Weekend Away',
    published: '2026-09-07',
    updated: '2026-09-07',
    body: 'what-to-leave-with-a-babysitter.en.html',
    image: '/assets/img/blog/what-to-leave-with-a-babysitter.webp',
    imageAlt: 'A grandmother sitting with two grandchildren as they draw at a table',
    imageWidth: 1200,
    imageHeight: 800,
    faq: [
      {
        q: 'What does a grandparent need that a paid sitter does not?',
        a: 'Less instruction and more updates. Grandparents know how to look after children; what they need is what has changed since they last did it — current allergies, current bedtime, current rules — plus a clear line about medication.',
      },
      {
        q: 'How much medical detail is appropriate?',
        a: 'Enough to act on, no more. Allergies and what to do, current medication with doses, what has been given today, what is allowed for ordinary aches, and the GP\'s number. Not a full history, and nothing about a diagnosis a carer does not need in order to keep your child safe.',
      },
      {
        q: 'Do I need all this for one evening out?',
        a: 'No. For a few hours: your numbers, one nearby adult, allergies and medication, bedtime, and the wifi. The full page is for overnight and longer, when the sitter has to make decisions without you.',
      },
    ],
    cta: {
      h2: 'What daili does with this',
      html: `<p>The handover page is the sort of thing you write once and then cannot find. Keep the filled-in version in daili's documents vault with the insurance card and the vaccination record, and it is <a href="/blog/digital-family-emergency-binder/">on your phone next time</a> — including the version you can send to a sitter in seconds.</p>
<p>Vault files are stored <strong>on your device only</strong>: never uploaded to our servers, and not part of any backup we hold.</p>
<p class="post-cta-link"><a href="/">See how the documents vault works →</a></p>`,
    },
  },
  {
    slug: 'nobody-uses-the-family-calendar-app',
    cluster: 'adoption',
    title: 'Nobody in My Family Uses the Calendar App — 5 Reasons Why',
    description: 'You installed it, added everything, and you are still the only one who opens it. The five reasons family apps get abandoned, and the fix for each one.',
    h1: 'Nobody in My Family Uses the Calendar App',
    published: '2026-09-08',
    updated: '2026-09-08',
    body: 'nobody-uses-the-family-calendar-app.en.html',
    image: '/assets/img/blog/nobody-uses-the-family-calendar-app.webp',
    imageAlt: 'A tired mother working at a laptop while her children play around her',
    imageWidth: 1200,
    imageHeight: 800,
    faq: [
      {
        q: 'Should I just go back to a paper calendar on the fridge?',
        a: 'For some households, genuinely yes. A fridge calendar has one enormous advantage: it is visible without anyone deciding to look. Its limits are that only people standing in the kitchen can see it and only one person tends to write on it. Many families end up with both — the wall calendar as the ambient display, the app as the thing that reaches the parent who is not at home.',
      },
      {
        q: 'How long before a new habit sticks?',
        a: 'Two weeks of daily use is the realistic marker, and the signal is not enthusiasm — it is somebody else entering something without being asked. If that has not happened by week two, adding features will not fix it.',
      },
      {
        q: 'What if only one child refuses?',
        a: 'Usually a teenager, and usually about privacy rather than the app. It is worth asking directly whether they mind everyone seeing everything they do. Many family apps allow private events; agreeing that some of their life stays theirs tends to end the resistance quickly.',
      },
    ],
    cta: {
      h2: 'What daili does with this',
      html: `<p>Nothing here is specific to daili — the restart works in any app, including the one you already have.</p>
<p>Two things we did build for reason 3: notifications are off by default and set per person, so nobody gets pinged for events that are not theirs. And there is no limit on how far ahead you can look, which is what makes the fortnightly review worth doing.</p>
<p class="post-cta-link"><a href="/">See how the family calendar works →</a></p>`,
    },
  },
  {
    slug: 'documents-to-keep-on-your-phone',
    cluster: 'documents',
    title: 'The 6 Documents to Keep on Your Phone for Your Kids',
    description: 'Six documents worth having on your phone before you need them — insurance card, vaccination record, consent letter and three more. Plus three to never keep there.',
    h1: 'When the School Calls: The 6 Documents to Keep on Your Phone',
    published: '2026-09-09',
    updated: '2026-09-09',
    body: 'documents-to-keep-on-your-phone.en.html',
    image: '/assets/img/blog/documents-to-keep-on-your-phone.webp',
    imageAlt: 'A woman standing in a kitchen taking a phone call, one hand to her chest, looking concerned',
    imageWidth: 1200,
    imageHeight: 800,
    faq: [
      {
        q: 'Is a photo accepted at a hospital?',
        a: 'For information, almost always — a number to read, an allergy to check, a vaccination date to confirm. For proof of identity, usually not; that still needs the original. The copies on your phone are for answering questions quickly, not for proving who you are.',
      },
      {
        q: 'What if my phone is locked and I am not there?',
        a: 'Then these files do not help, and that is the point of the consent letter and the emergency contact. Most phones also have a medical ID or emergency information screen reachable from the lock screen — put the allergy line and one phone number there. It is the one thing that works without you.',
      },
      {
        q: 'Should my teenager have these too?',
        a: 'From secondary school age, yes — their own insurance card, their own allergy page, and your number. A teenager at a sports fixture forty minutes away is exactly the case this list is for, and they are the one holding a phone.',
      },
    ],
    cta: {
      h2: 'What daili does with this',
      html: `<p>Daili's documents vault holds this set. Files in it are stored <strong>on your device only</strong> — never uploaded to our servers, and not part of any backup we hold. So they open in airplane mode, in a hospital basement, or abroad with data off.</p>
<p>That also means it is not a backup. The originals still belong somewhere safe.</p>
<p class="post-cta-link"><a href="/">See how the documents vault works →</a></p>`,
    },
  },
  {
    slug: 'family-app-children-data',
    cluster: 'privacy',
    title: 'Where Does Your Family App Store Your Children\'s Data?',
    description: 'Family apps hold your children\'s schedules, schools and photos. Six questions to ask before you invite your kids in — and how to find the real answers.',
    h1: 'Where Does Your Family App Store Your Children\'s Data?',
    published: '2026-09-10',
    updated: '2026-09-10',
    body: 'family-app-children-data.en.html',
    image: '/assets/img/blog/family-app-children-data.webp',
    imageAlt: 'A woman sitting beside her young son while he uses a tablet',
    imageWidth: 1200,
    imageHeight: 800,
    faq: [
      {
        q: 'Are family calendar apps safe for children?',
        a: 'Most are, in the ordinary sense that they are not doing anything sinister. The question worth asking is narrower: how much do they collect, where does it live, and can you get it back or delete it. An app that answers all three clearly is usually a safe bet regardless of size.',
      },
      {
        q: 'What is the difference between encrypted and on-device?',
        a: 'Encrypted usually means the company holds your file in a scrambled form and can unscramble it. On-device means the file never left your phone. Both are reasonable; only one removes the company from the picture entirely.',
      },
      {
        q: 'Should I use my child\'s real name in a family app?',
        a: 'For a shared calendar, a first name is usually enough, and there is no benefit to a full legal name. Save the full details for the places that genuinely need them — school forms, medical records — rather than every app the family uses.',
      },
    ],
    // Every line below is checkable against /privacy.html — that is the whole
    // point of this box, and of the post it closes. Do not add a claim here
    // that is not written there; in particular the Firebase sentence must stay
    // beside "Germany", because "EU-hosted" on its own is a half-truth.
    cta: {
      h2: 'What daili does with this',
      html: `<p>Since this article is a list of questions, here are our own answers, so you can hold us to the same standard.</p>
<p><strong>Server:</strong> Germany, with Host Europe GmbH. <strong>Firebase</strong> (Google) handles Google and Apple sign-in and push notifications, and processes limited technical data such as device tokens outside the EU under standard contractual clauses. Both halves are true and we would rather say both.</p>
<p><strong>Funding:</strong> free today, with no ads, no advertising networks, no data sold, and no analytics on this website — no cookies either. By our own question 2 that should make you suspicious, so: daili is free because it is new and small, and if we ever add paid extras, everything free today stays free for the people already here.</p>
<p><strong>Export:</strong> there is a data export endpoint.</p>
<p><strong>Deletion:</strong> account deletion with a 30-day grace period, then a hard delete.</p>
<p><strong>Photos and documents:</strong> the vault is stored <strong>on your device only</strong>. Vault files are never uploaded to our servers and are not in any backup we hold.</p>
<p class="post-cta-link"><a href="/privacy.html">Read our privacy policy →</a></p>`,
    },
  },
  {
    slug: 'get-partner-to-use-family-calendar',
    cluster: 'adoption',
    title: 'How to Get Your Partner to Use the Family Calendar',
    description: 'Nagging does not work and neither does a better app. Six things that do — starting with giving up the habit that keeps you as the family\'s only scheduler.',
    h1: 'How to Get Your Partner to Actually Use the Family Calendar',
    published: '2026-09-11',
    updated: '2026-09-11',
    body: 'get-partner-to-use-family-calendar.en.html',
    image: '/assets/img/blog/get-partner-to-use-family-calendar.webp',
    imageAlt: 'A couple standing indoors looking at one phone together, one of them pointing at the screen',
    imageWidth: 1200,
    imageHeight: 800,
    faq: [
      {
        q: 'What if they genuinely will not engage at all?',
        a: 'Then stop investing effort in adoption and use the calendar for yourself. It still reduces your own load. Keep one shared list — usually shopping — because that one has an immediate payoff for everyone, and leave the rest. A calendar one person actually uses beats a shared one nobody does.',
      },
      {
        q: 'Is it fair to let something be missed?',
        a: 'Only if it is small and no child bears the cost. A missed swimming lesson is a lesson. A missed hospital appointment is not a teaching tool, it is a consequence for someone who did not choose any of this. Keep the stakes on the adults.',
      },
      {
        q: 'Does a wall calendar work better for some people?',
        a: 'Often, yes. A paper calendar in the kitchen is visible without anyone deciding to look, which is its enormous advantage. Plenty of households run both — paper for ambient awareness, the app for the parent who is not in the kitchen. That is not a failure, it is a sensible split.',
      },
    ],
    cta: {
      h2: 'What daili does with this',
      html: `<p>Two things here are product decisions rather than advice. Notifications are off by default and set per person, so nobody gets pinged for events that are not theirs — that is point 4 handled before it becomes a problem. And adding an event is deliberately short, because point 5 is where most shared calendars are lost.</p>
<p>The rest of this article works in any app, including the one you already have.</p>
<p class="post-cta-link"><a href="/">See how the family calendar works →</a></p>`,
    },
  },
  {
    slug: 'medical-consent-grandparents-babysitting',
    cluster: 'documents',
    title: 'Medical Consent for Grandparents Babysitting: What You Need',
    description: 'What a carer can and cannot authorise, what a consent letter should say, and where to keep it so it is there at the hospital desk. With a template.',
    h1: 'Medical Consent for Grandparents Babysitting: What You Actually Need',
    published: '2026-09-12',
    updated: '2026-09-12',
    body: 'medical-consent-grandparents-babysitting.en.html',
    image: '/assets/img/blog/medical-consent-grandparents-babysitting.webp',
    imageAlt: 'A hand signing printed documents with a pen on a dark wooden table',
    imageWidth: 1200,
    imageHeight: 800,
    // No `itemList` here, and deliberately no HowTo anywhere: a legal-adjacent
    // document is not a set of steps, and marking one up as a procedure claims
    // more for it than the post is willing to say. Article + FAQPage only.
    faq: [
      {
        q: 'Is a consent letter legally binding?',
        a: 'That depends on the country, and often it is better described as evidence of your wishes than as a binding instrument. Its practical value — making a clinic\'s own policy easy to apply and removing a delay at the desk — does not depend on that distinction.',
      },
      {
        q: 'Do grandparents need one for a single evening?',
        a: 'No. For a few hours nearby, contact numbers, allergies and medication are enough. The letter is for overnight stays and weekends, where a decision might have to be made without you on the phone.',
      },
      {
        q: 'Does a hospital have to honour it?',
        a: 'Not automatically. Hospitals apply their own policies and their own clinical judgement, and in an emergency they treat regardless. The letter makes the non-urgent situations easier, which is most of them.',
      },
    ],
    cta: {
      h2: 'What daili does with this',
      html: `<p>Write it once, then keep the signed copy in daili's documents vault with the insurance card and the vaccination record. It is on your phone when a clinic asks, and you can send it in seconds.</p>
<p>Vault files are stored <strong>on your device only</strong> — never uploaded to our servers and not part of any backup we hold.</p>
<p class="post-cta-link"><a href="/">See how the documents vault works →</a></p>`,
    },
  },
  {
    slug: 'mixed-iphone-android-family-calendar',
    cluster: 'devices',
    title: 'The Mixed iPhone and Android Household: What Works',
    description: 'Apple Family Sharing stops at Android. Google\'s family group is built for Google accounts. What actually works when half the house is on the other platform.',
    h1: 'The Mixed iPhone and Android Household',
    published: '2026-09-13',
    updated: '2026-09-13',
    body: 'mixed-iphone-android-family-calendar.en.html',
    image: '/assets/img/blog/mixed-iphone-android-family-calendar.webp',
    imageAlt: 'A couple sitting together on a sofa at home, each using their own phone',
    imageWidth: 1200,
    imageHeight: 800,
    faq: [
      {
        q: 'Can an Android user join Apple Family Sharing?',
        a: 'No. Apple requires a personal Apple Account signed in to iCloud, and there is no Android client. This is not a setting you have missed.',
      },
      {
        q: 'Why does a shared calendar take so long to update?',
        a: 'If it is a subscribed calendar (an ICS feed), the receiving app only refreshes periodically, and Google does not publish how often. If it is a genuinely shared calendar where you have edit rights, updates should be quick — so a long delay usually means you are subscribed to a feed rather than sharing a calendar, which are different things.',
      },
      {
        q: 'Do we all need the same app?',
        a: 'For a calendar everyone can add to, effectively yes — everyone needs to be in the same system, whether that is a Google calendar or a family app. What you do not need is the same phone.',
      },
    ],
    cta: {
      h2: 'What daili does with this',
      html: `<p>Daili runs on iOS and Android, and both are the same app: everyone in the family can add, edit and see the same events, shopping lists and to-dos, whichever phone they have. There is no read-only tier for the person on the wrong platform.</p>
<p>It can also subscribe to external calendars, so school terms and fixtures land in the same place as everything else.</p>
<p class="post-cta-link"><a href="/">See how it works on both platforms →</a></p>`,
    },
  },
  {
    slug: 'switch-family-app-without-losing-lists',
    cluster: 'cozi',
    title: 'Switch Family Apps Without Losing Your Lists',
    description: 'Calendars move with a feed. Shopping lists, to-dos and recipes do not. A step-by-step switch plan that keeps both apps running until the new one is trusted.',
    h1: 'Switch Family Apps Without Losing Your Lists',
    published: '2026-09-14',
    updated: '2026-09-14',
    body: 'switch-family-app-without-losing-lists.en.html',
    image: '/assets/img/blog/switch-family-app-without-losing-lists.webp',
    imageAlt: 'A mother and daughter shopping together in a supermarket aisle',
    imageWidth: 1200,
    imageHeight: 800,
    faq: [
      {
        q: 'How long should I run both apps?',
        a: 'Two weeks is enough for most families. Longer than three and you have two live systems rather than a transition, which is worse than either app on its own.',
      },
      {
        q: 'What if my partner keeps using the old one?',
        a: 'Expect it for the first week — it is habit, not resistance. Move their entries across and tell them you did, without making it a thing. If it is still happening in week three, the problem is adoption rather than migration, and that is a different conversation.',
      },
      {
        q: 'Can I import a CSV of my lists?',
        a: 'Rarely. Most family apps have no list import. Copy-and-paste from a printed or web view is the realistic route, which is why moving only active items matters — you are doing this by hand.',
      },
    ],
    cta: {
      h2: 'What daili does with this',
      html: `<p>Daili can subscribe to an external calendar feed, so the calendar half of the overlap plan works without re-typing. Lists are the part you move by hand, in daili as anywhere else — which is why the advice above is to move only what is still alive.</p>
<p class="post-cta-link"><a href="/">See how shared lists work →</a></p>`,
    },
  },
  {
    slug: 'teenagers-private-events-family-calendar',
    cluster: 'adoption',
    title: 'Should Teenagers Have Private Events on the Family Calendar?',
    description: 'Where the line sits between coordinating and monitoring — what to insist on, what to let go, and how to set it up so the argument happens only once.',
    h1: 'Should Teenagers Have Private Events on the Family Calendar?',
    published: '2026-09-15',
    updated: '2026-09-15',
    body: 'teenagers-private-events-family-calendar.en.html',
    image: '/assets/img/blog/teenagers-private-events-family-calendar.webp',
    // Describes the photo, not the post, and not the relationship: a woman
    // watching from across a room is what is in the frame. The draft's front
    // matter said "living room" and "her mother standing behind her"; neither
    // survives looking at the file.
    imageAlt: 'A teenage girl sitting on a bed looking at her phone, with a woman standing across the room watching her',
    imageWidth: 1200,
    imageHeight: 800,
    faq: [
      {
        q: 'Should a 13-year-old have a private calendar?',
        a: 'Usually partial rather than full: private events allowed, time blocks still visible, and anything needing a lift or money stays open. Thirteen is a good age to start practising the arrangement while most plans still involve you anyway.',
      },
      {
        q: 'What if they hide something important?',
        a: 'Then the arrangement gets revisited, calmly and once. But be careful about reading a private block as concealment — a teenager wanting privacy about an ordinary evening is developmentally normal, not evidence of a problem.',
      },
      {
        q: 'Can I see the location without seeing the event?',
        a: 'That is exactly what a time block with a rough area does, and it is the honest middle ground. Live location tracking is a different thing with a different weight, and it deserves its own conversation rather than being folded silently into the calendar.',
      },
    ],
    // States a feature and stops. An article about a family's trust boundaries
    // that ends with a hard sell reads badly and deservedly; do not expand this.
    cta: {
      h2: 'What daili does with this',
      html: `<p>Daili has private events and per-person roles, so a teenager can hold their own account and mark an event private while it still occupies a visible block in the family week. That is the arrangement this article describes, without anyone having to police it.</p>
<p class="post-cta-link"><a href="/">See how member roles work →</a></p>`,
    },
  },
  {
    slug: 'family-organiser-apps-gdpr',
    cluster: 'privacy',
    title: 'Family Organiser Apps and GDPR: What Parents Should Ask',
    description: 'GDPR gives you six concrete rights over your family\'s data, and children get extra protection. How to test whether a family app actually honours any of them.',
    h1: 'Family Organiser Apps and GDPR: What Parents in Europe Should Ask',
    published: '2026-09-16',
    updated: '2026-09-16',
    body: 'family-organiser-apps-gdpr.en.html',
    image: '/assets/img/blog/family-organiser-apps-gdpr.webp',
    imageAlt: 'A woman reading printed papers beside an open laptop at a kitchen table',
    imageWidth: 1200,
    imageHeight: 895,
    faq: [
      {
        q: 'Does GDPR apply to a US family app?',
        a: 'Generally yes, if it offers its service to people in the EU. Where the company is based does not remove the obligation. What differs is how easy it is to enforce in practice, which is a real consideration.',
      },
      {
        q: 'Can I demand my child\'s data be deleted?',
        a: 'You can make the request as the holder of parental responsibility. Erasure is not absolute — a company may keep data where it has a legal reason to — but for a family calendar there is rarely such a reason, so a refusal deserves a follow-up question.',
      },
      {
        q: 'Is a parent\'s consent enough for a child\'s account?',
        a: 'Under Article 8, where consent is the legal basis, yes — consent given or authorised by the holder of parental responsibility is what the law asks for below the applicable age. The company is also expected to make reasonable efforts to verify that.',
      },
    ],
    // Every line here is checkable against /privacy.html, and the Firebase
    // sentence stays next to "Germany" for the same reason it does on post 9:
    // "EU-hosted" on its own is a half-truth, and this post spends a whole
    // section saying so. Do not trim this box to make it read cleaner — the
    // article's argument is that a company should state its exceptions.
    cta: {
      h2: 'What daili does with this',
      html: `<p>The point of this article is to be tested rather than trusted, so:</p>
<p><strong>Where the data lives:</strong> Germany, with Host Europe GmbH. <strong>Firebase</strong> (Google) handles sign-in and push notifications and processes limited technical data, such as device tokens, outside the EU under standard contractual clauses.</p>
<p><strong>Portability:</strong> there is a data export endpoint.</p>
<p><strong>Erasure:</strong> account deletion with a 30-day grace period, then a hard delete.</p>
<p><strong>Children's data in the vault:</strong> photos and documents are stored <strong>on your device only</strong> — never uploaded to our servers, not in any backup we hold.</p>
<p>Run the test in this article on us.</p>
<p class="post-cta-link"><a href="/privacy.html">Read our privacy policy →</a></p>`,
    },
  },
  {
    slug: 'share-calendar-with-android-family-member',
    cluster: 'devices',
    title: 'How to Share a Calendar With Someone on Android',
    description: 'You are on iPhone, they are on Android. Three ways to share a calendar that survive both phones — the public link, a shared Google Calendar, and a family app.',
    h1: 'How to Share a Calendar with a Family Member Who Has an Android',
    published: '2026-09-17',
    updated: '2026-09-17',
    body: 'share-calendar-with-android-family-member.en.html',
    image: '/assets/img/blog/share-calendar-with-android-family-member.webp',
    // Describes the photo: the screen is the Android version screen, not a
    // setup screen as the draft's front matter had it. See the report — the
    // legible "11" is why this hero wants swapping.
    imageAlt: 'A hand holding an Android phone showing the Android version screen, over a patterned tiled floor',
    imageWidth: 1200,
    imageHeight: 800,
    faq: [
      {
        q: 'Can an Android phone edit a shared Apple calendar?',
        a: 'Not through a public link — Apple states that subscribers can view but not change. Apple\'s editing option requires the other person to have an Apple account, so for an Android user the practical answer is no. Use a shared Google Calendar instead.',
      },
      {
        q: 'Why does the shared calendar take hours to update?',
        a: 'Because it is almost certainly a subscription rather than a share. Subscribed calendars are refreshed periodically by the receiving app, and Google does not publish the interval. A properly shared calendar with edit rights does not have this problem.',
      },
      {
        q: 'Is there a way to do this without a Google account?',
        a: 'Yes — a cross-platform family app, which is method 3. Every other route ends up depending on either an Apple account or a Google account, and your Android family member is unlikely to get the first.',
      },
    ],
    cta: {
      h2: 'What daili does with this',
      html: `<p>Daili is method 3. iOS and Android are the same app: everyone in the family can add and edit the same events, and shared shopping lists and to-dos come with it, which is where the calendar-only methods stop.</p>
<p>It can also subscribe to external calendar feeds, so school terms and fixtures sit alongside everything else.</p>
<p class="post-cta-link"><a href="/">See how it works on both platforms →</a></p>`,
    },
  },
  {
    slug: 'family-app-month-three-cleanup',
    cluster: 'adoption',
    title: 'Month Three: When the Family App Is Full of Dead To-Dos',
    description: 'Every family app works in week one. By month three the list has 200 items nobody trusts. A 30-minute reset, and four habits that stop it happening again.',
    h1: 'Month Three: When the Family App Is Full of Dead To-Dos',
    published: '2026-09-18',
    updated: '2026-09-18',
    body: 'family-app-month-three-cleanup.en.html',
    image: '/assets/img/blog/family-app-month-three-cleanup.webp',
    imageAlt: 'A desk covered in colourful sticky notes, checklists and notebooks around a laptop',
    imageWidth: 1200,
    imageHeight: 725,
    faq: [
      {
        q: 'How often should we clear the list?',
        a: 'Ten minutes monthly. Families who do it quarterly end up doing the full thirty-minute reset every time, because three months is long enough for the list to become unpleasant to look at, and unpleasant tasks get postponed.',
      },
      {
        q: 'What if my partner adds things and never finishes them?',
        a: 'Then the item has an owner, which is progress. The problem is capacity or priority, not the app. It is worth looking at the list together and asking which things are genuinely going to happen — deleting the ones that are not is kinder than leaving them as a standing reproach.',
      },
      {
        q: 'Is it better to start a fresh account?',
        a: 'Almost never. A new account means everyone re-installs, re-invites and re-learns, and you lose the calendar history along with the mess. Deleting one bad list is cheap; restarting the whole system costs you the adoption you already have.',
      },
    ],
    // The last line stays. A cleanup article that ends by implying the right
    // app makes cleanup unnecessary is selling something untrue, and this box
    // is the only place the post speaks as us.
    cta: {
      h2: 'What daili does with this',
      html: `<p>Daili keeps completed items out of the way rather than deleting them, so a monthly sweep does not mean losing the record of what was actually done. To-dos carry an owner and a date, which is the rule above built into the form rather than left to discipline.</p>
<p>None of that removes the need for the ten minutes a month. No app does.</p>
<p class="post-cta-link"><a href="/">See how shared to-dos work →</a></p>`,
    },
  },
];

/**
 * The /blog/ index's own copy.
 *
 * These are literals here, not keys in content/<locale>.json, and that is
 * deliberate: check-content.mjs enforces key-set equality across all 23 locale
 * files, so one English-only key would have to be added — untranslated — to 22
 * files that will never render it. The blog is English-only, so its page copy
 * lives with the rest of the blog's structure, exactly as each post's title
 * does in BLOG_POSTS.
 *
 * `h1` doubles as the RSS channel title and `description` as the channel
 * description, so the feed and the page introduce the blog with the same words.
 *
 * nav.blog is the one exception and DOES live in all 23 content files: it
 * renders in the header and footer of every locale, so it is real translated
 * copy rather than English-only page text.
 */
export const BLOG_INDEX = {
  title: 'Blog — Daili',
  description: 'Practical writing on running a family: documents, calendars, lists, and getting everyone to actually use the system.',
  h1: 'The Daili blog',
  intro: 'Practical writing on running a family — documents, calendars, lists, and getting everyone to actually use the system.',
};

/**
 * The "what's new" page's own copy, EN + DE.
 *
 * Literals here rather than keys in content/<locale>.json for the same reason
 * BLOG_INDEX is: check-content.mjs enforces key-set equality across all 23
 * locale files, so four keys for a two-language page would mean 84 untranslated
 * entries in files that will never render them.
 *
 * The release notes themselves are NOT here — they live in changelog/, one
 * <section class="release"> per version, because a release prompt prepends a
 * block to a file and must never have to edit config.
 */
export const WHATS_NEW = {
  en: {
    title: "What's new in Daili — release notes",
    description: 'Every Daili update in plain words: what was added, what was fixed, and when. One entry per released version.',
    h1: "What's new in Daili",
    intro: 'Every update, in plain words.',
  },
  de: {
    title: 'Neu in Daili — Was sich geändert hat',
    description: 'Jedes Daili-Update in einfachen Worten: was neu ist, was repariert wurde und wann. Ein Eintrag pro veröffentlichter Version.',
    h1: 'Neu in Daili',
    intro: 'Jedes Update, in einfachen Worten.',
  },
};

/**
 * The help center (daili.app/help/ plus help/en.json for the app).
 *
 * The articles themselves live in help/en/<topic>/<slug>.md and are parsed by
 * tools/help-lib.mjs; what is here is the structure around them.
 *
 * HELP_PUBLIC is the switch. While it is false every help page is noindex, none
 * is in the sitemap and the footer has no Help link — the pages build and can
 * be previewed, but nothing points at them. en.json is built either way,
 * because the app reads it. Public since 2026-09-24.
 *
 * LIVE_APP_VERSION is the version people can download today. The pages hide an
 * article whose `since` is newer, so a help page never explains a button the
 * reader's app does not have yet. en.json keeps every article: the app filters
 * by its own version. The release help sync bumps this on release day.
 */
export const HELP_PUBLIC = true;
export const LIVE_APP_VERSION = '1.6.0';

/**
 * The topic icons, a fixed vocabulary: the app maps each name to its own icon
 * and the site to its own glyph, so a name outside this list is something one
 * of them cannot draw. tools/check-help.mjs fails on it.
 */
export const HELP_ICONS = ['start', 'people', 'calendar', 'list', 'meal', 'cake', 'paw', 'folder', 'widget', 'bell', 'user', 'note'];

/** The help topics, in the order the help home and the app list them. The key
 *  is the folder name under help/<locale>/ and the `topic` every article
 *  declares. Their titles and summaries are words, so they live with the other
 *  page words in help/<locale>/_ui.json under `topics`. */
export const HELP_TOPICS = {
  start:         { icon: 'start' },
  family:        { icon: 'people' },
  calendar:      { icon: 'calendar' },
  lists:         { icon: 'list' },
  meals:         { icon: 'meal' },
  notes:         { icon: 'note' },
  birthdays:     { icon: 'cake' },
  habits:        { icon: 'paw' },
  vault:         { icon: 'folder' },
  anywhere:      { icon: 'widget' },
  notifications: { icon: 'bell' },
  account:       { icon: 'user' },
};

/**
 * The help locales that are complete and get built: pages under
 * dirFor(code) + 'help/' and a dist/help/<code>.json for the app. English
 * first, always. A code joins once help/<code>/ has every article and a full
 * _ui.json and the build is green (tools/check-help.mjs refuses a listed locale
 * with anything missing). A help/<code>/ folder not listed here is still
 * checked, just not built. Only the app's languages get a help center — ru, hi
 * and ar are website-only and keep linking to the English one.
 */
export const HELP_LOCALES = ['en', 'de', 'nl', 'sv', 'da', 'nb', 'fi', 'fr', 'it', 'es', 'pt', 'pl', 'cs', 'sk', 'ro', 'tr', 'el', 'uk', 'bg', 'ja', 'ko', 'zh-Hans', 'zh-Hant', 'th', 'id'];

/** The web app the header, the hero, the final section and the footer point at. */
export const WEB_APP_URL = 'https://app.daili.app';

/**
 * The home page's member count, in the members headline (home.members.h2a,
 * {count}), formatted per locale with Intl.NumberFormat.
 * Real, current user count — Ammar updates it by hand. Never round up.
 */
export const MEMBERS_COUNT = 1000;

/**
 * Real app-store reviews for the home page. The reviews section renders only
 * when there are at least three; with fewer there is no section and no markup
 * at all. Never put placeholder or invented text here.
 *
 * Shape, one object per review, shown in its original language:
 *   { title: 'Finally one app for all of us',
 *     text: 'We used three apps and a paper calendar…',
 *     name: 'Anna K.',
 *     source: 'App Store' | 'Google Play',
 *     stars: 5,          // 1..5
 *     lang: 'en' }       // the review's own language, written as lang= on the card
 */
export const REVIEWS = [];

/**
 * The home page (claude-prompts/2026-09-28/bevel-mock/index.html): the drawing
 * around the words. Every string is in content/<loc>.json under home.*; this is
 * only what is not translated — glyphs, colours, positions, file names.
 *
 * HOME_ICONS: 24×24 line glyphs (stroke = currentColor), keyed by name.
 */
export const HOME_ICONS = {
  cal: '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  cart: '<path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>',
  note: '<path d="M5 4h10l4 4v12H5z"/><path d="M9 11h6M9 15h4"/>',
  flame: '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z"/>',
  todo: '<rect x="3.5" y="4" width="17" height="16" rx="3"/><path d="M8 12l2.5 2.5L16 9"/>',
  meal: '<path d="M7 3v8a2 2 0 0 0 2 2v8M11 3v8M7 7h4M17 21V3c-2 1.5-3 4-3 7v3h3"/>',
  cake: '<path d="M4 20h16v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z"/><path d="M4 15c2 1.5 4 1.5 5.3 0 1.4 1.5 4 1.5 5.4 0 1.3 1.5 3.3 1.5 5.3 0"/><path d="M12 11V7"/><path d="M12 3.5c.8.8 1 1.6 0 2.3-1-.7-.8-1.5 0-2.3z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  watch: '<rect x="6" y="6" width="12" height="12" rx="3.5"/><path d="M9 6l.6-3h4.8l.6 3M9 18l.6 3h4.8l.6-3"/>',
  widgets: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="17" height="7" rx="2"/>',
  eink: '<rect x="3" y="5" width="18" height="13" rx="2"/><path d="M7 9h6M7 12h10M7 15h4"/>',
  outlook: '<rect x="3" y="6" width="12" height="12" rx="2"/><path d="M15 9h5.5v9H15"/><circle cx="9" cy="12" r="2.6"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z"/>',
  lang: '<path d="M4 5h9M8.5 3v2M6 5c.5 3 2.5 5.5 5 7M11 5c-.8 4-3.5 7-7 8.5"/><path d="M12.5 20l4-9 4 9M14 17h5"/>',
  mountain: '<path d="M3 19l6-10 4 6 2-3 6 7z"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  people: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3 2.8-5 5.5-5s4.9 2 5.5 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2c2.3.2 4 1.9 4.5 4.8"/>',
  photo: '<rect x="3.5" y="5" width="17" height="14" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M20.5 16l-5-5-8 8"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
  paw: '<circle cx="7" cy="10" r="1.8"/><circle cx="11" cy="6.5" r="1.8"/><circle cx="15.5" cy="7.5" r="1.8"/><circle cx="18" cy="11.5" r="1.8"/><path d="M8.5 17.5c0-2.5 2-4.5 4-4.5s4 2 4 4.5c0 1.5-1.2 2.5-2.5 2.2-1-.2-2-.2-3 0-1.3.3-2.5-.7-2.5-2.2z"/>',
  noads: '<rect x="3.5" y="5" width="17" height="14" rx="3"/><path d="M7.5 15l2-6 2 6M8.2 13h2.6M14 9v6h1.2a2.5 2.5 0 0 0 0-6z"/><path d="M4 4l16 16"/>',
  notrack: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/><path d="M4 4l16 16"/>',
  nosell: '<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5a4 4 0 1 0 0 7M7.5 11h6M7.5 13.5h6"/>',
  folder: '<path d="M3.5 7a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.8z" fill="currentColor" stroke="none"/>',
};

/**
 * The seven cards floating around the hero phone, in home.hero.cards order.
 * `pos` is the desktop place as inline CSS (inset-inline-start, so /ar/ mirrors);
 * `top` in px is also the order they get ticked in as you scroll. `dir` is
 * which way the card flies off (-1 = towards the inline start). `hideM`
 * hides the card below 860px (the mock's cards 3, 6 and 7).
 */
export const HERO_CARDS = [
  { icon: 'cal', tone: 'lake', start: '3%', top: 40, dir: -1 },
  { icon: 'cart', tone: 'leaf', start: '11%', top: 205, dir: -1 },
  { icon: 'note', tone: 'berry', start: '1%', top: 380, dir: -1, hideM: true },
  { icon: 'flame', tone: 'honey', start: '72%', top: 20, dir: 1 },
  { icon: 'todo', tone: 'leaf', start: '78%', top: 190, dir: 1 },
  { icon: 'meal', tone: 'clay', start: '70%', top: 460, dir: 1, hideM: true },
  { icon: 'cake', tone: 'honey', start: '12%', top: 520, dir: -1, hideM: true },
];

/** The "Works with" row, in home.works.items order. */
export const WORKS_ICONS = ['phone', 'phone', 'watch', 'widgets', 'eink', 'cal', 'outlook', 'globe'];

/** The two badges above the members headline, in home.members.badges order. */
export const MEMBER_BADGES = [{ icon: 'lang', tone: 'lake' }, { icon: 'mountain', tone: 'leaf' }];

/**
 * The members carousel: eight photo cards, in home.members.cards order, with
 * the two tiles (home.members.tiles) at positions 3 and 7. `done` draws the
 * widget ticked. Photos are static/assets/img/home/<photo>.webp.
 */
export const MEMBER_CARDS = [
  { photo: 'p_kitchen', icon: 'note', tone: 'berry', done: false },
  { photo: 'p_market', icon: 'cart', tone: 'leaf', done: true },
  { photo: 'p_teen', icon: 'flame', tone: 'honey', done: true },
  { photo: 'p_cake', icon: 'cake', tone: 'honey', done: false },
  { photo: 'p_football', icon: 'cal', tone: 'lake', done: false },
  { photo: 'p_super', icon: 'cart', tone: 'leaf', done: true },
  { photo: 'p_desk', icon: 'todo', tone: 'leaf', done: true },
  { photo: 'p_balcony', icon: 'flame', tone: 'honey', done: true },
];
/** After which photo card (0-based) each tile sits: 3rd and 7th in the row. */
export const MEMBER_TILES_AFTER = [1, 4];

/**
 * The demo family in the Daili Plus avatar strip. Names are data, not content:
 * they are the demo family's names in every language. `av` is the app's avatar
 * file (static/assets/img/home/av-<av>.webp).
 */
export const HOME_FAMILY = [
  { name: 'Lena', av: 'adult_1' },
  { name: 'Marco', av: 'adult_7' },
  { name: 'Emma', av: 'child_5' },
  { name: 'Noah', av: 'child_1' },
  { name: 'Mia', av: 'child_9' },
  { name: 'Oma Rosi', av: 'adult_31' },
  { name: 'Opa Karl', av: 'adult_20' },
  { name: 'Lukas', av: 'child_14' },
  { name: 'Sofia', av: 'adult_12' },
];

/** The twelve app tiles around the calendar orbit: glyph, colour, place. */
export const ORBIT_TILES = [
  { icon: 'cal', color: '#4F86B0', x: 50, y: 0, r: -8 },
  { icon: 'watch', color: '#15271F', x: 50, y: 100, r: -6 },
  { icon: 'globe', color: '#18A06A', x: 15, y: 85, r: 12 },
  { icon: 'eink', color: '#15271F', x: 0, y: 50, r: -10 },
  { icon: 'phone', color: '#A9628F', x: 15, y: 15, r: 6 },
  { icon: 'outlook', color: '#2E6DB4', x: 28, y: 24, r: 9 },
  { icon: 'flag', color: '#D9714A', x: 72, y: 24, r: -7 },
  { icon: 'cake', color: '#E0A032', x: 24, y: 72, r: -9 },
  { icon: 'widgets', color: '#4F86B0', x: 76, y: 76, r: 8 },
  { icon: 'people', color: '#18A06A', x: 37, y: 37, r: 6 },
  { icon: 'todo', color: '#18A06A', x: 63, y: 63, r: -8 },
  { icon: 'photo', color: '#A9628F', x: 37, y: 63, r: 10 },
];

/**
 * "See it in action": per step, the button's glyph and tone, the screenshot
 * the phone shows, the ground tint behind it and the toast's glyph and tone.
 * Words are home.flow.items[i] and home.flow.toasts[i].
 */
export const FLOW_STEPS = [
  { icon: 'cal', tone: 'lake', shot: 'shot-calendar', tint: '#E4EEF6', toast: 'cal', toastTone: 'lake' },
  { icon: 'cart', tone: 'leaf', shot: 'shot-shopping', tint: '#E8F6E2', toast: 'cart', toastTone: 'leaf' },
  { icon: 'todo', tone: 'leaf', shot: 'shot-todos', tint: '#EEF3E6', toast: 'todo', toastTone: 'leaf' },
  { icon: 'paw', tone: 'honey', shot: 'shot-habits', tint: '#FAEFD6', toast: 'flame', toastTone: 'honey' },
];

/** The six privacy chips' glyphs, in home.privacy.chips order. */
export const PRIVACY_ICONS = ['noads', 'notrack', 'nosell', 'flag', 'folder', 'spark'];

/**
 * The photo mosaic above "Made with care": seven columns, each with its drift
 * speed, its top offset (px) and its photos with their heights (px).
 */
export const MOSAIC = [
  { speed: 2, top: 40, photos: [['p_hall', 230], ['p_grandpa', 200]] },
  { speed: 1, top: 120, photos: [['p_kitchen', 300]] },
  { speed: 1, top: 0, photos: [['p_bike', 230], ['p_picnic', 200]] },
  { speed: 1, top: 90, photos: [['p_table', 300]] },
  { speed: 3, top: 20, photos: [['p_stretch', 230], ['p_market', 200]] },
  { speed: 3, top: 140, photos: [['p_cake', 300]] },
  { speed: 3, top: 50, photos: [['p_groc', 230], ['p_balcony', 200]] },
];

/**
 * The flat-lay around the last phone: twelve objects, each with its place
 * (inset-inline-start %, top px), width, tilt and where it slides in from
 * (fx/fy px; fx flips in RTL).
 */
export const FLAT_OBJECTS = [
  { obj: 'o_tote', start: 4, top: 40, w: 250, rot: -10, fx: -300, fy: -80 },
  { obj: 'o_notebook', start: 22, top: 330, w: 200, rot: 12, fx: -260, fy: 120 },
  { obj: 'o_cake', start: 2, top: 420, w: 190, rot: 0, fx: -300, fy: 160 },
  { obj: 'o_calendar', start: 20, top: 20, w: 170, rot: -6, fx: -200, fy: -200 },
  { obj: 'o_mug', start: 32, top: 520, w: 120, rot: 0, fx: -120, fy: 220 },
  { obj: 'o_keys', start: 62, top: 520, w: 150, rot: 18, fx: 160, fy: 220 },
  { obj: 'o_lunch', start: 64, top: 30, w: 200, rot: 8, fx: 220, fy: -200 },
  { obj: 'o_photos', start: 80, top: 60, w: 210, rot: -12, fx: 300, fy: -80 },
  { obj: 'o_shoes', start: 76, top: 330, w: 220, rot: 10, fx: 280, fy: 120 },
  { obj: 'o_folder', start: 88, top: 420, w: 170, rot: -4, fx: 300, fy: 160 },
  { obj: 'o_cat', start: 50, top: 590, w: 150, rot: -8, fx: 0, fy: 260 },
  { obj: 'o_crayons', start: 62, top: 290, w: 150, rot: 20, fx: 200, fy: 60 },
];

/**
 * Which store-screenshot set each site locale shows.
 *
 * The screenshots come from the store pipeline in ../store-shots/raw/, whose
 * folders are store locales (`en-US`, `pt-PT`) rather than the site's short
 * codes, so the two have to be mapped. A site locale that is absent here has no
 * capture of its own: build.mjs resolves it to `en`, per file.
 *
 * That fallback is deliberate, and it is only for screenshots. A missing
 * *string* is still a hard error (check-content.mjs), because a silently
 * English sentence rots unnoticed — a silently English screenshot is just a
 * screenshot of an app the reader is about to see in English anyway.
 *
 * tools/make-site-shots.py reads this map out of this file, so adding a
 * language is one line here plus a re-run of the converter.
 */
export const SHOT_LOCALE = {
  en: 'en-US', de: 'de', fr: 'fr-FR', es: 'es-ES', it: 'it', nl: 'nl',
  pt: 'pt-PT', sv: 'sv', da: 'da', nb: 'nb', pl: 'pl', cs: 'cs', fi: 'fi',
  tr: 'tr',
  el: 'el', uk: 'uk', bg: 'bg', ro: 'ro', sk: 'sk',
  id: 'id', th: 'th', ja: 'ja', ko: 'ko',
  'zh-Hans': 'zh-Hans', 'zh-Hant': 'zh-Hant',
  // ru, hi, ar — no capture yet, so they resolve to en. Add the line when
  // ../store-shots/raw/<store-locale>/ exists.
};

/**
 * The raw store-screenshot file names and the site names they become. Also read
 * by tools/make-site-shots.py, which is the only thing that writes shots/.
 *
 * shot-recipes, shot-photos and shot-documents are missing from this map on
 * purpose: the demo family has no capture of those three screens yet, so their
 * files live in shots/en/ only and every locale falls back to them.
 */
export const SHOT_SOURCES = {
  '01-dashboard': 'shot-home',
  '02-calendar': 'shot-calendar',
  '03-shopping': 'shot-shopping',
  '04-todos': 'shot-todos',
  '05-mealplan': 'shot-mealplan',
  '06-birthdays': 'shot-birthdays',
  '07-family': 'shot-family',
  '08-habits': 'shot-habits',
  '09-notes': 'shot-notes',
};

/** Intrinsic pixel sizes, measured from the files. Used for width/height so the
 *  page stops shifting layout on every load. */
export const IMAGE_SIZES = {
  'shot-': { width: 640, height: 1391 },
  'ill-': { width: 840, height: 688 },
  // The web app in a browser window: static/assets/img/web-calendar.webp.
  // 16:10, the aspect the browser frame in the hero and in the "also on your
  // computer" block are both drawn to.
  'web-': { width: 1600, height: 1000 },
  'logo': { width: 512, height: 512 },
  // The home page's generated photos (3:4) and flat-lay objects (square),
  // static/assets/img/home/p_*.webp and o_*.webp.
  'p_': { width: 720, height: 956 },
  'o_': { width: 520, height: 520 },
};

export const imageSize = (name) => {
  if (name.startsWith('shot-')) return IMAGE_SIZES['shot-'];
  if (name.startsWith('ill-')) return IMAGE_SIZES['ill-'];
  if (name.startsWith('web-')) return IMAGE_SIZES['web-'];
  if (name.startsWith('p_')) return IMAGE_SIZES['p_'];
  if (name.startsWith('o_')) return IMAGE_SIZES['o_'];
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
