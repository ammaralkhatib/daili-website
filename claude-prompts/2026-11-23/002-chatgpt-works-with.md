# Website + help: Daili is live in ChatGPT, so name ChatGPT next to Claude

## Why
This is list item #33. OpenAI approved the Daili app for ChatGPT on 2026-11-04. Ammar published it on
2026-11-23 and checked it: ChatGPT → **Apps** → search "Daili" finds it. Prompt `2026-10-22/003-home-ai-apps`
left ChatGPT out on purpose ("Ammar adds it when Daili is live in ChatGPT's app directory"). It is live now.
It is the same connector as for Claude (`https://api.daili.app/mcp`, same tools, same sign-in and family pick),
only listed in ChatGPT's app directory, so users find it there by name and do not paste the address.

## Requirements
1. **Works-with strip** (`home.works.items`, all 28 `content/<locale>.json`): add `ChatGPT` right **before**
   `Claude`. Latin letters in every locale. Update the `@works` description (the list of product names).
2. **Bento card `ai`** (`home.screens`, from `2026-10-22/003`): change only the `p` text to name ChatGPT
   first, e.g. en: "Connect Daili to ChatGPT, Claude or another AI app, then ask what's on this weekend or add
   milk to the list, right in the chat." The drawn chat stays as it is. **No OpenAI or Claude logo, colours or
   fonts** — only the words.
3. **FAQ** (`faq.items`, the item "Does Daili work with AI apps like Claude?"):
   - q: "Does Daili work with AI apps like ChatGPT and Claude?"
   - a: "Yes. Find Daili in ChatGPT's apps, or connect it in Claude or another AI app that supports MCP, then
     ask what's on today or tell it what to add. It only sees the family or group you choose — never Budget,
     Cycle or other people's private items. <a {help:anywhere-ai-apps}>How to connect</a>"
   The FAQPage JSON-LD is built from the same items — check the built page holds the new q and a.
4. **Help article `anywhere-ai-apps`** (`help/en/anywhere/ai-apps.md` and the same file in every help
   language). Keep the `id`, `routes`, `since`, `order`, `related` and the `mediaPending` line as they are.
   - `title`: "Use daili from ChatGPT, Claude and other AI apps"; `summary` names ChatGPT too;
     `keywords`: add `openai`, `apps`, `app directory` (keep the old ones).
   - First line: "Ask ChatGPT, Claude or another AI app "What's on this weekend?" or "Put milk on the
     shopping list"."
   - A short part **In ChatGPT** before the Claude steps:
     1. "In ChatGPT, open **Apps** and search for **Daili**."
     2. "Connect it, sign in to Daili, pick the family or group, then press **Allow**."
     Do NOT name other ChatGPT buttons or menus (we did not check them, and ChatGPT changes them often).
     **Allow** is Daili's own sign-in page, so that word is safe.
   - The three Claude steps stay, under a short part **In Claude**. "Other AI apps that support MCP use the
     same address." stays after them.
   - Everything else (what it reads/adds, the Note, Disconnect, the Plus line) stays word for word.
   - Start each part with a bold lead-in line ("**In ChatGPT**", "**In Claude**"), the style
     `help/en/account/safety.md` and `help/en/notes/files.md` already use; `npm run check:help` must pass
     (numbered steps under each lead-in).
   - English: `updated: 2026-11-23`. Every translation: translate the new lines in the file's register,
     `translatedFrom: 2026-11-23`. "ChatGPT", "Claude", "MCP", "Daili"/"daili" untouched. The word for
     **Apps** stays in English (ChatGPT's menu name), like the site already keeps **Customize** /
     **Connectors** in the Claude steps — check what the translations do there and do the same.
5. **Other places that name Claude as the AI app** — `grep -rn -i "claude"` over `content/`, `help/`,
   `build.mjs`, `templates/`, `static/` (e.g. `llms.txt`, meta descriptions): where the site lists Claude as
   *the* AI app Daili works with, add ChatGPT the same way (ChatGPT first). Do NOT change:
   - blog posts, changelog / What's-new pages (they tell what was true on their date);
   - `legal/` — if a legal text names Claude or the AI app companies, do NOT change it: name file + line in
     the report, Ammar decides;
   - the help keyword "claude code", "cursor".
   List every place you changed and every place you kept, with the reason.
6. **Every sentence must be true.** Same facts as before (api `CLAUDE.md` §3 "MCP connector"): it reads and
   adds, can't edit or delete, ticks items off, only the chosen family or group. Never write "free", a price,
   "Plus" (other than the help line that is already there), "official", "partner" or anything that says
   OpenAI or Anthropic endorse Daili.
7. **Translations:** follow `content/glossary.md` and each file's register. All 28 site locales for
   `content/`, every help language for the article.
8. Another prompt of today (`2026-11-23/001-plus-ai-actions-50`) also edits `content/*.json` and `help/`
   (the Plus number 30 → 50). If it already ran, its lines are in `main`: keep them. Do not touch any AI-action
   number.

## Scope
- In: `content/*.json`, `help/*/anywhere/ai-apps.md`, the places Requirement 5 finds, `build.mjs` /
  `templates/` only if needed, this prompt file, the report.
- Out: `legal/`, blog, changelog, images, the app, the web app, the api.

## Verify
- `npm run check:help`, then `npm run build` (runs all checks) — green, in the FOREGROUND.
- Open the built `en` and one other home page (e.g. `de`) and the built en help article: ChatGPT is in the
  strip, the card, the FAQ (and its JSON-LD), and the article shows both parts.
- `grep -rn "ChatGPT" content/ | wc -l` per file: every locale has the strip + card + FAQ lines.

## Commit & push
- Conventional Commit `docs(site,help): Daili works in ChatGPT — strip, card, FAQ, help`; body names
  `Prompt: claude-prompts/2026-11-23/002-chatgpt-works-with.md`.
- **Push now.** Do NOT run `./deploy.sh` — Planning Claude checks first, then Ammar deploys.

## Report
- `claude-reports/2026-11-23/002-chatgpt-works-with.md`: what changed per place (strip, card, FAQ, JSON-LD,
  help per language, Requirement 5 places), what you kept and why (legal, blog …), checks, SHA, pushed.
- Do not write the word "blocked" next to a status anywhere in the report unless you really stopped.
