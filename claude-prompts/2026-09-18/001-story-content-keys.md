# Scroll story 1/2 — content keys for the floating cards (28 locales)

## Goal

The home page is being rebuilt as a "scroll story" (one feature per screen, a
sticky phone, small floating cards next to it — see
`claude-prompts/2026-09-08/scroll-story-mock.html`, Ammar approved v7 on
2026-09-18). This run adds every **new string** the story needs to
`content/<loc>.json` for all 28 locales, and removes the keys the new page no
longer renders. **No template, CSS, JS or build.mjs change in this run** — 002
does the page, and it can only build once these keys exist everywhere.

Done = `node tools/check-content.mjs` (the first link of `npm run build`)
passes for all 28 files; every new string is translated (never left in
English) in the 27 non-English files.

## Scope

- **In:** `content/*.json` (all 28), `content/glossary.md` only if a new
  card word needs a glossary line (unlikely).
- **Out:** everything else. Do not touch templates, CSS, JS, build.mjs,
  site.config.mjs, tools/.

## Requirements

1. **New object `story`** in every content file, shaped exactly like this
   (English source below — write it into `en.json` with `@` descriptions the
   way the file does today, then translate for the other 27 files):

   ```json
   "story": {
     "cards": {
       "hero":      [ {"t":"Swimming class",        "s":"Today · 16:30"},
                      {"t":"Milk · 2 l",             "s":"Marco is in the store"},
                      {"t":"Take out the bins",      "s":"Noah · done"} ],
       "calendar":  [ {"t":"Swimming class",        "s":"Today · 16:30 · Emma"},
                      {"t":"Piano lesson",           "s":"every other Wednesday"},
                      {"t":"Reminder on 4 phones",   "s":"15 minutes before"} ],
       "shopping":  [ {"t":"Milk · 2 l",             "s":"Lena added it — at home"},
                      {"t":"Bread",                  "s":"Marco · in the store"},
                      {"t":"Synced in about a second","s":"on every phone in the family"} ],
       "todos":     [ {"t":"Water the plants",       "s":"Emma · Friday"},
                      {"t":"Take out the bins",      "s":"Noah · done 🎉"},
                      {"t":"Reminder",               "s":"Thursday · 18:00"} ],
       "meals":     [ {"t":"Tuesday · Dinner",       "s":"Pasta — from the recipe box"},
                      {"t":"6 ingredients → Groceries","s":"added in one tap"},
                      {"t":"The week, planned by Sunday","s":"breakfast to dinner"} ],
       "birthdays": [ {"t":"Emma turns 12",          "s":"in 22 days · August 29"},
                      {"t":"Reminder for everyone",  "s":"one week before"},
                      {"t":"Marco turns 41",         "s":"in 3 weeks — every year"} ],
       "vault":     [ {"t":"Insurance card.pdf",     "s":"on this phone only"},
                      {"t":"Holiday 2026 · 48 photos","s":"never uploaded"},
                      {"t":"No server ever sees these","s":"not even ours"} ],
       "family":    [ {"t":"The Bergers",            "s":"5 members"},
                      {"t":"Invite code 482913",     "s":"or share the link"},
                      {"t":"Noah · managed profile", "s":"no email needed — upgrade later"} ]
     }
   }
   ```

   - The keys `hero`, `calendar`, `shopping`, `todos`, `meals`, `birthdays`,
     `vault`, `family` are **structure** (they match `FEATURES[].key` plus
     `hero`) — never translated, never reordered. Exactly 3 cards each, each
     card exactly `t` + `s`. check-content enforces the shape.
   - **`@` description** for `story.cards` (one, on the object, en.json only):
     "Tiny UI cards floating next to the phone in the home-page story. They
     imitate app content: an event pill, a shopping row, a to-do, a reminder.
     `t` is the bold line, `s` the small grey line under it. Keep each line
     short (t ≤ 28 characters, s ≤ 36) — they must not wrap. Names (Lena,
     Marco, Emma, Noah, Mia, the Bergers) and the code 482913 are the demo
     family from the screenshots and stay as they are. Times follow the
     locale's own convention (16:30 / 4:30 PM), dates too (August 29 / 29.
     August)."
   - Translate every `t` and `s` in the 27 other files. Names and the number
     stay. Localize times, dates and the ` · ` separators as the locale would
     write them in an app (de: "Heute · 16:30", "Emma · Freitag"; en-style
     "→" and "—" may become the locale's usual dash). The 🎉 stays.
   - Keep the character limits — if a translation runs long, shorten the
     meaning, don't wrap ("Reminder on 4 phones" → de "Erinnerung auf 4 Handys").
   - Mirror the nearest existing sentence in each file for tone (lesson 80
     in CLAUDE.md: a server-side string is an all-locales change; this is the
     website twin of that rule).

2. **`nav.menu`** — new key in `nav`, en: `"Open menu"` (the burger button's
   `aria-label`; it is English in every locale today, planned in the never-run
   016 fixups). Translate ×27.

3. **`features.family.alt`** — today says "Illustration of a family" (en) —
   the family tile used an illustration. The story shows the real Family
   screen. Change to en `"Family screen with members and the invite code"`
   and translate ×27.

4. **Removals** (all 28 files, same keys, and their `@` twins in en.json):
   `hero.kicker` (the platform pill above the headline is gone), 
   `pricing.lead` (never rendered since 014). Grep `build.mjs` and
   `templates/` first to prove nothing renders them; if something does, keep
   the key and say so in the report. Leave `trust.*` and `featuresSection.*`
   in place even though 002 will stop rendering them — Ammar has not decided
   whether the trust strip returns, and re-translating 28 × 7 lines is worse
   than 7 idle keys.

5. `node tools/check-content.mjs` must pass. If it flags a translated card as
   "byte-identical to English" for a legitimately identical string (e.g. a
   name-only line), reword the translation slightly rather than touching the
   checker.

## Constraints

- Zero npm dependencies. Do not touch `tools/`.
- Write files with the file-write tool, never a shell heredoc (cat is bat).
- Self-correct up to 2 attempts, then `blocked`.

## Verify

- `node tools/check-content.mjs` → clean.
- `node -e` one-liner: every file has `story.cards.<8 keys>` with 3 cards,
  each with non-empty `t` and `s`; the longest `t` and `s` per locale
  (paste the two longest strings overall with their locale — 002 sizes the
  cards from them).

## Commit & push

- `feat(content): scroll-story card strings, nav.menu, family alt — 28 locales`
  — body `Prompt: claude-prompts/2026-09-18/001-story-content-keys.md`.
  **Push now** (the website repo has no auto-deploy; `./deploy.sh` is manual).

## Report

- `claude-reports/2026-09-18/001-story-content-keys.md`: the two longest
  strings, any translation you were unsure about (list locale + string),
  anything you kept that requirement 4 wanted removed, and the commit SHA.
