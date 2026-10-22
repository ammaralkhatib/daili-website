# 003 — Home: works with AI apps (strip, card, FAQ)

**Status: DONE** · commit `f070c72` on main, pushed. `./deploy.sh` not run.

## What was added
- **Works-with strip:** `Claude` right after `Outlook` in all 28 locales, with a new plain speech-bubble glyph (`HOME_ICONS.chat`, no vendor logo) as the 9th `WORKS_ICONS` entry. `@works` now lists Claude among the Latin-letter names. No ChatGPT.
- **Bento card `home.screens.ai`:** h3, p, a drawn chat (`aria-hidden`): the question in a forest-green bubble, the answer as a white card like the widgets, with lake and berry bars and a calendar-icon caption, plus a `more` link to the help article. Only the site's palette and fonts are used; "Claude" appears only as a word. Names come from what the page already shows: **Noah's swimming** (hero "Swimming class · Noah") and **Emma's birthday** (hero "Emma turns 12"), not the prompt's "Emma's swimming / Grandma's birthday". Each locale uses its own Noah and Emma (ja 蒼/陽菜, ko 지훈/서연, zh-Hans 浩然/子涵, zh-Hant 承翰/子晴, th ต้น/น้ำ, id Bayu/Putri) and its own time format (16.30 / 10h00).
- **Help link helper** `helpLinkAttrs(id, loc)` next to the help helpers in `build.mjs`. It links the page's own language for `HELP_LOCALES`; ar, hi and ru get the English article with `hreflang="en"`. I left out the footer's `lang="en"` because this link's words are in the page's language. The build fails if the article is missing or not live yet.
- **FAQ item 8** ("Does Daili work with AI apps like Claude?") right after the calendar question. The answer carries `<a {aiHelp}>`, which `faqAnswer()` fills in both the visible FAQ and the FAQPage JSON-LD. Checked: ar JSON-LD has 9 questions and the link.

## Grid
Desktop (4 columns): rows 1 and 2 are unchanged (1+1+2, then 2+2). The AI card is a **full-width third row** (`grid-column:1/-1`, auto height, 256 px) with the text at the start and the chat at the end. I chose this over re-spanning because the two-phone card and the tablet need their two columns, and a full-width row avoids holes at every breakpoint. 861–1100 px: the two-column grid with the AI card full width. ≤860 (this includes 768): one column, chat under the text, capped at 480 px. No existing card's span or content changed. Gradient: `g-leaf`, Daili green, which sits away from the lake and clay cards above it.

## Locales × keys
27 locales × 9 strings (h3, p, q, a1, a2, foot, more, faq q, faq a), plus "Claude" in the strip. Applied by a script that inserts text, keeps each file's hand formatting and deep-compares against the intended object. `more` and the FAQ link text use the app's `aiAppsHowToTitle` for its 24 languages. ar, hi and ru have no ARB, so I chose: طريقة الربط / कैसे जोड़ें / Как подключить. Budget, Cycle, family/group and AI-app terms are taken from each locale's live help article.

## Truth
Checked against `help/en/anywhere/ai-apps.md` and the API CLAUDE.md "MCP connector" section (one family per connection; never Budget, Vault or Cycle; never others' private items). No sentence was changed. No "free", price or "Plus" anywhere. In fi and tr, "Claude" is written as "Claude-sovellukseen" and "Claude'a" so the grammar works without inflecting the name.

## Outside the listed scope (needed)
- `site.config.mjs`: `WORKS_ICONS` and `HOME_ICONS.chat`, because the strip's icons live there.
- `tools/check-build.mjs`: the guard expected 5 bento boxes. It now expects 6 and checks that the AI box links to `help/anywhere/ai-apps/`.
- Help fixture builds (`HELP_TEST`) have no such article, so the link falls back to the help home there only.

## Build
```
content OK · 28 locale(s) · 511 keys each
legal OK · 2 document(s) × 28 locale(s)
help OK · 94 article(s) · 25 locales · 74 app routes checked
test-check-help OK · 99 cases
build OK · 3233 pages · 3203 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```
The content-check warnings (50 length-ratio warnings) are all old. None are on the new keys.

## Screenshots looked at
Headless Chrome over CDP with transitions off: en, de, ja, fi and ar at 1440, 768 and 390. Measured on every page: no element in the AI card overflows its box, no horizontal page scroll, and the bento rows have no gaps (box rectangles listed in the run). Looked at: the whole bento for en at 1440; the AI card for de at 1440 and 768, fi at 390, ja at 768 and ar at 1440 (mirrors correctly); the FAQ for de at 390. The new FAQ item opens (`details.open`, answer 68–192 px tall) on every page tested.

## Help impact
None.
