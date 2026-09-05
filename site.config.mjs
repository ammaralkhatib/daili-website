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
export const LOCALES = ['en', 'de', 'fr', 'es', 'it', 'nl', 'pt', 'sv', 'da', 'nb', 'pl', 'cs', 'fi', 'tr', 'id', 'ja', 'ko', 'zh-Hans', 'zh-Hant', 'th', 'ru', 'hi', 'ar'];

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
