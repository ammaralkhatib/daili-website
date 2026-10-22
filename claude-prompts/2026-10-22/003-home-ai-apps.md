# Home page: tell people Daili works with AI apps (strip, card, FAQ)

Load the **frontend-design:frontend-design** skill first and use it inside
this site's existing tokens, fonts, colours and the bento card style.

## Goal
Since 2026-10-22 Daili works as a connector for AI apps: a user adds
`https://api.daili.app/mcp` in Claude, signs in once, then asks "what's on
this weekend?" or "put milk on the list". The help article is live
(`help/en/anywhere/ai-apps.md`, id `anywhere-ai-apps`). The home page does
not mention it. Add it in three small places — no new page.

## Requirements
1. **Works-with strip** (`home.works.items`): add `Claude` right after
   `Outlook`. Product name, Latin letters in every locale (update the
   `@works` description if it lists the names). **Do not add ChatGPT** —
   Ammar adds it when Daili is live in ChatGPT's app directory.
2. **"On every screen" bento** (`home.screens`, `build.mjs` `bento`): a
   sixth card `ai`:
   - `h3`: "Ask your AI app"
   - `p`: "Connect Daili to Claude or another AI app, then ask what's on this
     weekend or add milk to the list, right in the chat."
   - a small **drawn chat** (HTML/CSS, `aria-hidden`, like the drawn
     widgets): one user bubble `q` = "What's on this weekend?" and one answer
     bubble with two short lines `a1` = "Sat 10:00 · Emma's swimming",
     `a2` = "Sun 15:00 · Grandma's birthday" (reuse names/events the page
     already uses if they fit better — say which), plus a tiny caption
     `foot` = "From your Daili calendar".
     Neutral chat look in this site's palette. **No Claude/OpenAI logo,
     colours or fonts** — only the word "Claude" in the text.
   - a link `more` = "How to connect" to the help article in the page's
     language (the help exists for `HELP_LOCALES`; other site locales link
     the English article — use the same rule the site already uses for help
     links, or add a small helper next to the existing help helpers).
   - Pick the gradient class and span so six cards sit well at desktop,
     tablet and phone width; you may change spans of the existing cards to
     balance the grid, but not their content. Update `@screens` ("five
     cards" → "six").
3. **FAQ** (`faq.items`): a new item right after "Can I bring my existing
   calendar?":
   - q: "Does Daili work with AI apps like Claude?"
   - a: "Yes. Connect Daili to Claude or another AI app that supports MCP,
     then ask what's on today or tell it what to add. It only sees the
     family or group you choose — never Budget, Cycle or other people's
     private items. <a href="…">How to connect</a>"
   If the FAQ also feeds structured data (FAQPage JSON-LD), the new item
   must appear there too.
4. **Every sentence must be true.** Check against the help article and the
   API repo's CLAUDE.md §3 "MCP connector". Never write "free", a price or
   "Plus".
5. **Translations:** add the new keys to `content/en.json` and translate
   them into every other `content/<locale>.json` (all 28 site locales,
   including ar/hi/ru), following `content/glossary.md` and the file's
   register; "Claude", "MCP", "Daili" untouched. The help link text uses the
   same words as the app's `aiAppsHowToTitle` where the app has the language
   (`../familyplanner-app/lib/l10n/app_<loc>.arb`).

## Scope
- In: `content/*.json`, `build.mjs` (bento + FAQ + strip if needed), the
  home CSS, `templates/landing.html` only if needed, this prompt file.
- Out: help, legal, blog, feature pages, `LIVE_APP_VERSION`, `deploy.sh`.
  🔴 Untracked files that are NOT yours (`claude-prompts/2026-10-21/`,
  `claude-prompts/MARKETING-WEEKLY.md`, `static/assets/img/photos/`): do not
  touch, stage or commit them.

## Verify
`npm run build` green, `node tools/check-content.mjs` green (and any other
check the build runs). Look at `dist/index.html`, `dist/de/` and `dist/ja/`
at 1440, 768 and 390 px wide (Playwright/Chromium if you have it): the
bento has no gaps or overflow, the chat bubbles do not overflow in long
languages (de, fi), the FAQ item opens.

## Commit & push
`feat(home): works with AI apps — strip, bento card, FAQ`; body
`Prompt: claude-prompts/2026-10-22/003-home-ai-apps.md`. Commit this prompt
file with it. **Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-22/003-home-ai-apps.md`, half a page: what was
added, the grid/spans you chose and why, locales × keys, any sentence you
changed for truth, build lines, screenshots you looked at, SHA + push.
`## Help impact`: none.
