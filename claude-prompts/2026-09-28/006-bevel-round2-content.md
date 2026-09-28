# Bevel home — round 2, 1/2: the strings for Ammar's change list

## Goal

The Bevel home page is live. Ammar reviewed it (2026-09-28) and asked for a
list of changes; 007 builds them. This prompt adds / changes / removes the
**strings** those changes need, in **all 28 locales**. Same rules as
`claude-prompts/2026-09-28/004-bevel-content-keys.md` (read it and its
report): native, short, never English left in place, placeholder parity,
glossary terms, person and product names unchanged, "Daili" survives.

Visual references for what each string is for:
`claude-prompts/2026-09-28/round2-refs/` (Ammar's screenshots) and the widget
designs in the app repo `ios/FamCanvasWidgets/*.swift` (strings the real
widgets show — reuse their wording where it exists in that locale's
`ios/FamCanvasWidgets/<lang>.lproj`, so the site says what the widget says).

## Scope

- **In:** `content/*.json` (28) incl. `@`-descriptions.
- **Out:** everything else. Never run `./deploy.sh`.

## Changes (English source)

### Add
1. `nav.downloadApp` — `Download app` (the dark header pill; replaces "Get the app").
   `nav.openWebApp` — `Open web app` (new button inside the download menu).
2. `home.hero.rating` — `{rating} on Google Play` — `{rating}` = the build's
   locale-formatted rating number (e.g. `4.7` / `4,7`). One placeholder.
   `home.hero.ratingAlt` — `Rated {rating} out of 5 on Google Play` (screen-reader label).
3. `home.hero.scenes` — **replaces** `home.hero.cards`. Exactly 7 scenes in
   this order, each exactly 3 cards `{ t, s }` (t ≤ 22 chars, s ≤ 28):
   ```jsonc
   "scenes": [
     { "id": "calendar", "cards": [ {"t":"Swimming class","s":"Today · 16:30 · Noah"}, {"t":"Dentist","s":"Tue · 08:15 · Mia"}, {"t":"Parents' evening","s":"Thu · 18:30"} ] },
     { "id": "todos",    "cards": [ {"t":"Take out the bins","s":"Noah · tonight"}, {"t":"Do the laundry","s":"Lena · today"}, {"t":"Check homework","s":"Mia · 17:00"} ] },
     { "id": "shopping", "cards": [ {"t":"Milk · 2 l","s":"Marco is at the store"}, {"t":"Bread","s":"Added by Lena"}, {"t":"Apples · 1 kg","s":"Groceries · 3 of 7"} ] },
     { "id": "habits",   "cards": [ {"t":"Stretch · 5 min","s":"4-day streak"}, {"t":"Read 20 minutes","s":"Mia · every day"}, {"t":"Water the plants","s":"Family energy +1"} ] },
     { "id": "notes",    "cards": [ {"t":"Lunch money","s":"Pinned for Friday"}, {"t":"Wi-Fi password","s":"Shared with the family"}, {"t":"Grandma arrives Sat","s":"Who picks her up?"} ] },
     { "id": "birthdays","cards": [ {"t":"Emma turns 12","s":"In 3 days"}, {"t":"Gift for Emma","s":"To-do · Marco"}, {"t":"Noah turns 8","s":"In 11 days"} ] },
     { "id": "meals",    "cards": [ {"t":"Porridge","s":"Breakfast · Monday"}, {"t":"Chicken salad","s":"Lunch · Monday"}, {"t":"Vegetable curry","s":"Dinner tonight"} ] }
   ]
   ```
   `id` is data (not translated; keep it English in every locale and add it
   to the identical-string exemptions if the check needs it). The meal and
   birthday texts match the store screenshots (Porridge / Chicken salad /
   Vegetable curry; Emma 12, Noah 8) — in each locale use the dish and
   person names **that locale's screenshots show** (read
   `familyplanner-app/test_driver/store_shots/fixtures/<lang>.dart` and
   `shared/habits_notes_demo.dart`) so the card and the screen agree.
4. `home.day.cards` — **replace** the 3-card array with exactly **6** cards
   in this order (same shape `{ h3, p, t, s }`):
   1. Lists — p `Add milk in the kitchen, tick it off in the shop. Everyone sees it straight away.` — t `Bread` — s `Ticked by Marco · just now`
   2. Habits — p `Small routines, done together. Every tick gives Minzi, your family cat, more energy.` — t `Family energy · 34 / 40` — s `6 more and Minzi goes on a trip`
   3. Notes — p `Quick thoughts, the Wi-Fi password, who picks up Grandma. Keep a note private or share it with the family.` — t `Grandma arrives Saturday at 3 pm` — s `Shared with Family`
   4. Recipes — p `Keep the family favourites, or import one from a video or a photo. Send the ingredients to your list in one tap.` — t `Sweet & sour sticky tofu` — s `13 ingredients · Add to Groceries`
   5. Meal plan — p `Plan breakfast, lunch and dinner for the week, so nobody asks what's for dinner at six.` — t `Vegetable curry` — s `Dinner · Monday`
   6. Birthdays — p `Countdowns for every birthday in the family, and a reminder in time to get the gift.` — t `Emma turns 12` — s `In 3 days, 12 hours`
   The Habits card must match the habits screenshot's own energy widget
   wording in that locale (007 lays it exactly over that widget).
5. `home.calendars.apple` — `{ "t": "Apple Calendar", "s": "Connected via your iPhone" }`
   (the second floating card next to the Google one).
6. `home.screens.tablet` — `{ "h3": "On the wall with any tablet", "p": "Turn an old tablet into a family board for the kitchen or the hallway. It shows the week and updates by itself.", "alt": "The Daili family board on a tablet" }`.
7. `home.screens.widgets` — **replace** with the texts the real widgets show
   (source: `ios/FamCanvasWidgets/en.lproj` + the Swift files):
   `{ "h3": "Widgets", "p": "Next up, shopping, habits, birthdays and quick add, right on your home screen.", "upcoming": "Upcoming", "toBuy": "{count} to buy", "energy": "Energy {n}/{max}", "habits": "Habits", "startsIn": "starts in", "days": "days", "birthday": "Birthday", "event": "Event", "task": "Task", "item": "Item", "meal": "Meal" }`
   — where the real widget has a string, copy its translation from that
   locale's `.lproj` instead of translating fresh. Placeholders must match.
8. `home.flow` — unchanged. `home.final.web` — `Open in your browser` with
   `@description` "Third button next to the store badges, globe icon".

### Change
9. `home.members.cards[3].s` (Emma's birthday photo) → `Today · party at 3 pm`.
   The old text claimed a wish list; Daili has no wish-list feature.

### Remove — NOT here
Nothing is deleted in this prompt: the live page still reads the old keys.
007 deletes `home.hero.cards`, `home.dinner`, `home.screens.trmnl`,
`home.nav.privacy`, `home.nav.cta` and any other key it stops using. Where
this prompt says "replace" (`home.day.cards`, `home.screens.widgets`), add the
new content under a temporary key name instead — `home.day.cards6`,
`home.screens.widgets2` — so the current page keeps building; 007 renames
them back and removes the old ones.

## Constraints

- `npm run build` must pass with the current templates unchanged.
- Arrays: identical length and `id` order in all locales.

## Verify

- `npm run build` green (paste the tail).
- Leaf-count per locale identical (one line).
- Paste `de` `home.hero.scenes` (all 21 cards) and `home.day.cards` in the report.

## Commit & push

`content: Bevel home round 2 strings (28 locales)` — body
`Prompt: claude-prompts/2026-09-28/006-bevel-round2-content.md`. **Push now.**

## Report

`claude-reports/2026-09-28/006-bevel-round2-content.md` (≤ one page).
