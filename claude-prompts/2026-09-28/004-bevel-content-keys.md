# Bevel home 1/2 — the content keys for the new home page

## Goal

Ammar picked a new home page modelled on bevel.health (Planning Claude's
prototype, 2026-09-28). This prompt adds **every string that page needs** to
**all 28 locales** in `content/<locale>.json`. 005 builds the page. Nothing
else changes here.

Design reference — what each string is for and where it sits:
`claude-prompts/2026-09-28/bevel-mock/index.html`. Open it in a browser
(file://, it runs offline except the photos) and scroll it end to end first.
Every visible English text in the mock maps to a key below.

Same job, same rules, same traps as `claude-prompts/2026-09-27/001-design-b-content-keys.md`
and `claude-prompts/2026-09-18/001-story-content-keys.md` — read both and their
reports first: natural, short, native-sounding translations; never English
left in place; never a literal calque; placeholder + inline-tag parity; "Daili"
survives every translation; no transliterated brand; the ≥25-char
identical-string rule; `tools/glossary.mjs` terms where they exist (Habits,
Minzi, Notes, Daili Plus …). Person names (Lena, Marco, Emma, Noah, Mia,
Oma Rosi, Opa Karl) and product names (iPhone, Android, Apple Watch, TRMNL,
Google Calendar, Outlook, YouTube, Google Gemini) stay exactly as written in
every locale. "Oma"/"Opa" may be localised to the locale's word for
grandma/grandpa **only** inside the `members.cards` captions, never in names
shown on avatars.

## Scope

- **In:** `content/*.json` (all 28) incl. the `@`-description objects.
- **Out:** everything else. Do not remove any key (005 removes the ones the
  new page no longer uses). Never run `./deploy.sh`.

## The keys (English is the source)

Add a new top-level object **`home`** (the old sections keep their keys until
005). Shapes below are exact: arrays keep their length in every locale.
Write an `@`-description for every object/array (one line: where it sits,
max length).

```jsonc
"home": {
  "nav": {
    "features": "Features",
    "plus": "Daili Plus",
    "screens": "Watch & widgets",
    "privacy": "Privacy",
    "login": "Log in",
    "cta": "Get the app"
  },
  "qr": { "t": "Get daili free", "s": "Scan with your phone camera. iPhone & Android.", "alt": "QR code that opens daili.app" },
  "hero": {
    "lead": "One calm place for your family's week: calendar, lists, to-dos, habits and notes that everyone can see. On every phone, on your wrist, and in the browser.",
    "cta": "Download free",
    "alt": "The Daili home screen on a phone, with an Apple Watch showing the next event",
    // 7 floating cards around the phone, top-left first. t ≤ 20 chars, s ≤ 26 chars.
    "cards": [
      { "t": "Swimming class", "s": "Today · 16:30 · Noah" },
      { "t": "Milk · 2 l", "s": "Marco is at the store" },
      { "t": "Lunch money", "s": "Pinned for Friday" },
      { "t": "Stretch · 5 min", "s": "4-day streak" },
      { "t": "Take out the bins", "s": "Noah · tonight" },
      { "t": "Vegetable curry", "s": "Dinner tonight" },
      { "t": "Gift for Emma", "s": "Birthday in 2 days" }
    ]
  },
  "watch": { "upNext": "Up next", "ev": "Swimming class", "evs": "16:30 · Noah", "list": "Groceries · 5 left" },
  "works": {
    "label": "Works with",
    // product names stay Latin; only "Home-screen widgets" and "Web browser" are translated
    "items": ["iPhone", "Android", "Apple Watch", "Home-screen widgets", "TRMNL", "Google Calendar", "Outlook", "Web browser"]
  },
  "members": {
    "badges": [
      { "t": "25 languages", "s": "From Deutsch to Türkçe" },
      { "t": "Made in Tirol", "s": "Innsbruck, Austria" }
    ],
    // {count} is a placeholder the build fills with the locale-formatted member number (e.g. "1,000" / "1.000")
    "h2a": "Joined by {count}+ members",
    "h2b": "planning life together",
    // 8 photo cards: cap = handwritten-style caption on the photo (≤ 28 chars), t/s = the Daili widget on it
    "cards": [
      { "cap": "Friday lunch, sorted.", "t": "Lunch money for Friday", "s": "Pinned · Family" },
      { "cap": "Saturday market run", "t": "Flowers for Oma", "s": "Groceries · 5 of 7" },
      { "cap": "Day 12. Minzi is proud.", "t": "Read 20 minutes", "s": "12-day streak" },
      { "cap": "She turns 12 today!", "t": "Emma turns 12", "s": "Today · 3 wishes on her list" },
      { "cap": "Never miss practice", "t": "Football practice", "s": "17:00 · Noah · every Tue" },
      { "cap": "Shopping with backup", "t": "Blueberries", "s": "Added by Lena · just now" },
      { "cap": "Homework first", "t": "Check homework", "s": "Mia · today" },
      { "cap": "Our little jungle", "t": "Water the plants", "s": "Every day · with Papa" }
    ],
    "tiles": [
      { "big": "€0", "t": "No ads, no trial, no catch." },
      { "t": "Minzi, the family cat, cheers you on" }
    ]
  },
  "day": {
    "h2": "Start the day together",
    "sub": "Everything your family needs to know, in the places you already look.",
    "cards": [
      { "h3": "Calendar", "p": "Everyone's week at a glance. School, swimming and the dentist, each person in their own colour.", "t": "Swimming class", "s": "Tue · 16:30 · Noah" },
      { "h3": "Lists", "p": "Add milk in the kitchen, tick it off in the shop. Everyone sees it straight away.", "t": "Bread", "s": "Ticked by Marco · just now" },
      { "h3": "Habits", "p": "Small routines, done together. Every tick gives Minzi, your family cat, more energy.", "t": "Family energy · 34 / 40", "s": "6 more and Minzi goes on a trip" }
    ]
  },
  "dinner": {
    "h3": "Dinner, decided",
    "p": "Plan the week's meals, keep the family recipes, and send the ingredients to your shopping list in one tap.",
    "chips": ["Meal plan", "Recipe box", "To the shopping list"],
    "t": "Sweet & sour sticky tofu",
    "s": "2 servings · 13 ingredients",
    "add": "Add to Groceries"
  },
  "calendars": {
    "h3": "Connect your calendars",
    "p": "Bring in Google, Outlook and your phone's calendar. Add public holidays for your country. See it all next to the family plan.",
    "t": "Google Calendar",
    "s": "Connected · 24 events synced"
  },
  "plus": {
    "eyebrow": "Daili Plus",
    "h2a": "Go deeper with",
    "h2b": "Daili Intelligence",
    "sub": "Smart helpers that turn videos, photos and ideas into plans, so you can get back to your family.",
    "video": { "h3": "Recipes from any video", "p": "Paste a YouTube link. Daili writes down the ingredients and the steps for you.", "hd": "Imported from video", "title": "Crispy chickpea curry", "t": "12 ingredients · 6 steps", "s": "Saved to your recipe box" },
    "letter": { "h3": "Snap a letter, get the dates", "p": "Take a photo of the school letter. Daili finds the dates and adds them to your calendar.", "hd": "3 events found",
      "rows": [ { "t": "School trip", "s": "Fri 10 Oct · 08:00" }, { "t": "Parents' evening", "s": "Tue 14 Oct · 18:30" }, { "t": "Photo day", "s": "Thu 16 Oct" } ],
      "add": "Add all 3" },
    "ideas": { "h3": "Dinner ideas for your week", "p": "Out of ideas? Get dinner suggestions for the whole week, then add the ones you like to your meal plan.", "hd": "Suggested for Thursday", "title": "Veggie lasagne", "t": "45 min · family favourite", "s": "Tap to add it to Thursday", "add": "Add to meal plan" },
    "fine": "Daili Plus features use Google Gemini, and only when you use them."
  },
  "flow": {
    "h2": "See it in action",
    "sub": "Four everyday moments, start to finish.",
    "items": [
      { "t": "Plan the week", "d": "Add swimming for Noah on Tuesday. It shows up on every phone in the family, in his colour." },
      { "t": "Share the shopping", "d": "Marco is at the store and ticks off the milk. At home you see it right away, no double buying." },
      { "t": "Tick off the to-dos", "d": "Noah finishes the laundry and ticks it. The whole family sees what is still open." },
      { "t": "Keep a habit", "d": "Stretch for five minutes, tick it, and watch Minzi get more energy for her next trip." }
    ],
    "toasts": [
      { "t": "Swimming class added", "s": "Noah · Tuesday 16:30" },
      { "t": "Marco got the milk", "s": "Groceries · 2 of 7" },
      { "t": "Noah did the laundry", "s": "Household · 1 left today" },
      { "t": "Stretch done", "s": "Family energy +1" }
    ],
    "pill": "Swim 16:30"
  },
  "screens": {
    "h2": "On every screen in your home",
    "sub": "Glance at your wrist, your home screen or the kitchen wall. The same family plan, everywhere.",
    "watch": { "h3": "Apple Watch", "p": "What's next, and the shopping list, right on your wrist." },
    "widgets": { "h3": "Widgets", "p": "Next up, shopping, to-dos, habits, notes and birthdays on your home screen.",
      "next": "Next up", "swim": "Swim", "habits": "Habits", "done": "done today", "groceries": "Groceries", "items": ["Milk", "Eggs", "Apples"] },
    "trmnl": { "h3": "On the wall with TRMNL", "p": "Show the family week on a TRMNL e-paper screen in the hallway. No glow, no noise.",
      "days": [ { "d": "Mon", "ev": ["Piano 15:00", "Dentist"] }, { "d": "Tue", "ev": ["Swim 16:30", "Parents 18:30"] }, { "d": "Wed", "ev": ["Football 17:00"] }, { "d": "Thu", "ev": ["Movie night"] } ] },
    "web": { "h3": "In your browser", "p": "Plan the week on a big screen at app.daili.app. The same family, the same plans.", "alt": "The Daili web app showing a family calendar" },
    "phones": { "h3": "And on every phone", "p": "iPhone and Android, in 25 languages. Grandma speaks Türkçe, the kids speak English? No problem." }
  },
  "privacy": {
    "h2": "Private by design",
    "sub": "Your family's plans belong to your family. That is not a setting, it is how Daili is built.",
    "chips": ["No ads", "No tracking", "We never sell your data", "Servers in the EU", "Documents & photos stay on your phone", "AI only when you use it"]
  },
  "care": {
    "h2a": "Made with care,",
    "h2b": "for real family life",
    "sub": "Designed and built in Tirol, Austria, for the everyday chaos of busy families."
  },
  "final": {
    "h2": "Ready when you are",
    "sub": "Start with one list. Add the calendar when you're ready. Daili grows with your family."
  }
}
```

Translator notes (put them in the matching `@`-descriptions):
- `members.cards[].cap` is a short, casual, social-media style caption — write
  it the way a parent would caption their own photo in that language, not a
  translation of the English joke. `"Day 12. Minzi is proud."` keeps "Minzi".
- `screens.phones.p` — the two example languages may change to fit the locale
  (for `tr`, say: grandma speaks German, the kids speak Turkish). Keep the
  idea: two generations, two languages, one app.
- `works.items`, `privacy.chips`, `dinner.chips`, `widgets.items`: short
  labels, no full stop.
- `flow.pill`, `watch.*`, `widgets.*`, `trmnl.days` are tiny UI texts inside
  drawn screens — keep them as short as the English (they sit in ~60–120 px).
- Weekday / date formats (`Fri 10 Oct · 08:00`, `Tue`) follow the locale's
  normal short style and 24-hour time.
- `{count}` must appear exactly once in `members.h2a` in every locale.

Existing keys stay untouched, `hero.lead` included — the new page reads
`home.hero.lead`. It still reuses these existing keys as they are:
`hero.h1a`, `hero.h1b`, `hero.webLink`, `hero.notes[]`, the store-badge
strings, `faq.*` and the footer/legal strings. 005 deletes the old keys the
new page no longer needs. The `// …` comments in the block above are notes for
you — real JSON files have no comments; put that guidance in the
`@`-descriptions.

## Constraints

- `npm run build` must pass (all four links: check-content → build →
  check-build → test-detector). The new keys are unused by templates in this
  prompt — if a check fails on unused keys, stop and report `blocked` with the
  exact message rather than weakening the check.
- Arrays: identical length in all 28 locales (check-content enforces).
- No other file changes.

## Verify

- `npm run build` green; paste the last 5 lines.
- `node -e` one-liner: every locale has `home` with the same key tree as `en`
  (print the count of leaf strings per locale; they must all match).
- Spot-read `de`, `ar`, `ja`, `tr` `home.members.cards` and `home.hero.cards`
  and paste them in the report (so Ammar can read the German).

## Commit & push

- `content: Bevel home page strings (28 locales)` — body
  `Prompt: claude-prompts/2026-09-28/004-bevel-content-keys.md`. **Push now.**

## Report

`claude-reports/2026-09-28/004-bevel-content-keys.md` (≤ one page): leaf count
per locale (one line), the `de` hero + member cards, any string you had to
shorten and why, build tail, SHA, push result.
