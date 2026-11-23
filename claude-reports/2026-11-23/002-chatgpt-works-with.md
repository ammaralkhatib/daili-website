# 002 — Website + help: Daili is live in ChatGPT, so name ChatGPT next to Claude

**Result:** done · **Commit:** `61b61fc2` docs(site,help): Daili works in ChatGPT — strip, card, FAQ, help — pushed to origin/main together with this report's commit (54 files, 491 lines added, 341 removed). `./deploy.sh` was NOT run: Planning Claude checks first, then Ammar deploys.
**Step 0:** nothing to commit. This prompt was already in `dc45a4ef`, `main` was equal to `origin/main`, and no commits were held. `static/assets/img/photos/` (9 untracked pictures) stayed out of every commit.
**Sub-agents:** 7 translators, all `claude-opus-5-5`, all in the foreground, all finished before the commit: bg cs da de · el es fi fr · id it ja ko · nb nl pl pt · ro sk sv th · tr uk zh-Hans zh-Hant · ar hi ru (site only). Each one edited its own files and ran my check script (`/tmp/chatgpt002/check-loc.mjs`) plus `npm run check:help`. I re-ran the check on all 27 locales myself: all ✓.

## What changed

**1. Works-with strip** (`home.works.items`, all 28 `content/<lang>.json`): `ChatGPT` now sits right before `Claude`, in Latin letters (done by a script, the same in every file). The en `@works` description names ChatGPT in its list of product names.
- **Code change that was needed:** `build.mjs` wants exactly one icon per strip item, and the icons live in `WORKS_ICONS` in `site.config.mjs` (9 entries before, 9 items). Without a 10th icon the build failed ("home.works.items … must have exactly 9 entries, has 10"). I added a second `'chat'`: ChatGPT gets the same plain speech bubble Claude already had. No OpenAI or Anthropic logo, colour or font.

**2. Bento card `ai`** (`home.screens.ai.p`, 28 locales): it now names ChatGPT first. en: "Connect Daili to ChatGPT, Claude or another AI app, then ask what's on this weekend or add milk to the list, right in the chat." The drawn chat (q, a1, a2, foot, more) is unchanged; my check script stops if any other key of the card changes. The en `@ai` description says "ChatGPT" and "Claude" stay as written.

**3. FAQ** (28 locales): q is "Does Daili work with AI apps like ChatGPT and Claude?". In a, only the first sentence changed: "Yes. Find Daili in ChatGPT's apps, or connect it in Claude or another AI app that supports MCP, then ask …". The rest and the `<a {help:anywhere-ai-apps}>…</a>` link are unchanged in every language.
- **JSON-LD:** the built `dist/index.html` and `dist/de/index.html` both have the new q and a in the FAQPage `Question` / `acceptedAnswer` (checked in the built files).

**4. Help article `anywhere-ai-apps`** (en + 24 translations = all 25 help languages). `id`, `routes`, `since`, `order`, `related` and `mediaPending` are unchanged. en has `updated: 2026-11-23`, and every translation has `translatedFrom: 2026-11-23`.
- `title`: "Use daili from ChatGPT, Claude and other AI apps". `summary`: "Ask ChatGPT, Claude or another AI app about your family's day …".
- New part **In ChatGPT:** "open **Apps**, search for **Daili** and connect it."
- New lead-in **In Claude:**, then the three Claude steps.
- The new sentence "Then sign in, pick the family or group and press **Allow**." comes after "Other AI apps that support MCP use the same address.", so it covers ChatGPT, Claude and any other app.
- ChatGPT's menu name **Apps** stays in English in every translation, the same way they already keep **Customize** / **Connectors**. **Allow** keeps each language's existing word (Daili's own page, e.g. de **Erlauben**). No other ChatGPT button or menu is named.

### Where I had to go against the prompt's wording (the help guard wins; I did not widen it)
- **Only one numbered list per article** (`tools/help-lib.mjs`: "only one numbered list per article"). The prompt asked for numbered steps under both lead-ins. So ChatGPT gets one sentence and Claude keeps the one list.
- **150-word cap.** The old article was at exactly 150 words, and the prompt's text took it to 177. Every fact stayed except one clause. To get back to 150 (en is now exactly 150):
  - First line: "Ask your AI app "What's on this weekend?" …" instead of "Ask ChatGPT, Claude or another AI app …". The title, the summary and both lead-ins name the two apps.
  - Step 1 lost "In Claude," because the lead-in says it.
  - Step 3 is now only "Press **Connect**." Its sign-in part became the shared "Then sign in …" line above, so ChatGPT users get it too.
  - The Note's first two sentences became one sentence with the same facts. "only what you see in that family or group" and the full list (others' private items, Budget, Cycle, Documents, Photos, Google and Outlook events) are kept. "What it reads goes to the AI app's company." is unchanged.
  - **Left out:** ", or leave the family or group" at the end of the "To stop …" line. **Disconnect** is still there. If Ammar wants the clause back, another line has to get shorter.
- **12 keywords at most.** en added `openai` and `app directory`. I did not add `apps`, because it is in the title and the search reads titles. I dropped `ask`, because "Ask" is in the body. The translators added `openai` plus their word for "app directory", and dropped their word for "ask". Where a file had no such word, they dropped a different one: el, tr and uk dropped "assistant"; nb dropped "ki" as well as "spør" ("ai" and the title's "KI-apper" are still there). `chatgpt`, `claude`, `mcp`, `cursor` and `claude code` are in every language.

### Translation notes worth a look
- **cs, sk:** the title, summary and lead-in now write "Claude" without a case ending. Before, they had "Clauda" / "V Claudovi". My check script asked for the exact word "Claude", so this came from my check, not from the translators. Czech and Slovak often leave brand names undeclined, but a native reader may prefer the old forms.
- ar and hi wrote "ChatGPT's apps" with their own word for apps (to avoid mixing scripts). ro and sv wrote it as "… (Apps)". All other languages kept **Apps** in Latin letters.
- Every file kept its own register: the site is formal and the help informal where they already differed (cs, fr, id, ko, tr).

## Requirement 5: other places that name Claude
**Changed:** only the four above (strip, card, FAQ, help). Nothing else on the site lists Claude as *the* AI app. `build.mjs`, `templates/` and `static/` (there is no `llms.txt`) say "claude" only in code comments with prompt paths (`claude-prompts/…`). No meta description names Claude, and no other help article does.

**Kept, with the reason:**
- `legal/privacy.*.html` line 62 (en and de line 60) in all 28 legal files already says "an AI app, such as Claude or ChatGPT". Not changed, as the prompt asks. It is already true, so Ammar has nothing to decide unless he wants ChatGPT named first there too.
- `changelog/whats-new.en.html:76` and `whats-new.de.html:76` say "connect Daili to Claude and other AI apps". This is history (true on its date), so it is kept.
- `blog/`: no post names Claude.
- The help keywords `claude code` and `cursor` are kept in every language.
- `tools/check-legal.mjs`, `tools/check-build.mjs`, CSS and JS: only prompt-path comments.

## Checks (all in the foreground)
- `npm run check:help`: `help OK · 118 article(s) · 25 locale(s) · 94 app routes checked`.
- `npm run build`: exit 0. It printed `content OK · 28 locale(s) · 528 keys each` (527 → 528 because of the 10th strip item), `legal OK`, `test-check-help OK · 99 cases`, `build OK · 3759 pages`, `detector OK · 32 cases`, `help search OK · 38 cases`.
  - The first build failed at `test-check-help` "build of a German fixture" because of the missing 10th icon. That was fixed in `site.config.mjs` (above).
- `npm test`: exit 0 (detector, test-check-help, help search, blog i18n).
- Built pages:
  - `dist/index.html` and `dist/de/index.html`: the strip reads … Outlook · ChatGPT · Claude …, and the card, the FAQ and the JSON-LD name ChatGPT.
  - `dist/help/anywhere/ai-apps/index.html`: it has the "In ChatGPT:" part, then "In Claude:" with the 3 steps, then the shared sign-in line.
  - de and ja articles: 8 "ChatGPT" each.
- `grep -o ChatGPT content/<lang>.json`: 4 in every locale (strip, card, FAQ q, FAQ a); en has 6 (plus 2 descriptions).
- I searched the added lines for "free / gratis / kostenlos / official / offiziell / partner" and the CJK words for free: none found. No AI-action number was touched; the 50 from prompt 001 is unchanged.
- No fact-check sub-agent was run. There are no new app facts: the ChatGPT path is what Ammar checked ("Apps" → search "Daili"), and every other sentence keeps the existing facts.

## Open items for Ammar / Planning Claude
- Deploy the website (`./deploy.sh`) after Planning Claude's check.
- Decide whether the "or leave the family or group" clause is worth a cut elsewhere (see above).
- Optional: a native look at the undeclined "Claude" in cs and sk.

## Help impact
anywhere-ai-apps: you can now find Daili in ChatGPT under **Apps** (search "Daili"). There is a new "In ChatGPT" part before the Claude steps, and the sign-in / pick family / **Allow** step is shared by all apps. The title, summary and keywords name ChatGPT (and OpenAI), in all 25 help languages.
