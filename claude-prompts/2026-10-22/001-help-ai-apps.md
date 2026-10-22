# Help: new article "Use daili from Claude and other AI apps" (all help languages)

## Goal
Daili now works as a **connector** for AI apps (MCP = a standard that lets an
AI app use another app's tools). A user adds `https://api.daili.app/mcp` in
Claude, signs in to Daili once, and can then ask "what's on this weekend?" or
say "add dentist Tuesday 3 pm". It is live on the server today and works with
any app version. Users need one page that explains connecting, what the AI
can and cannot see, and how to disconnect. Add one article to the
**anywhere** topic, in English and every `HELP_LOCALES` language. Its address
will be `https://daili.app/help/anywhere/ai-apps/` (the web app will link it),
so the file is `ai-apps.md`.

**Do not deploy.** Ammar runs `./deploy.sh` himself after checking.

## Sources (facts — do not guess)
- API repo `~/Herd/familyplanner-api`: `lang/en/mcp.php` (the sign-in and
  consent page labels: **Allow**, "Which family or group?"),
  `app/Mcp/Tools/*` (what each tool really does), CLAUDE.md §3 "MCP
  connector" (rules), report `claude-reports/2026-10-21/006-…` (disconnect).
- App repo `~/development/flutter_projects/familyplanner/familyplanner-app`:
  `lib/l10n/app_<locale>.arb` keys `aiApps*` (screen title **Connected AI
  apps**, **Disconnect**) and the Settings label.
- Web repo `../daili-web`: `src/i18n/<tag>.ts` — the Profile page title in
  each language (the web shows the same card under **Profile**).
- Claude's own docs (checked 2026-10-22): **Customize → Connectors → Add
  custom connector**, enter the URL, **Add**, then **Connect** and sign in.
  Free Claude accounts can add one custom connector.

## Article (English, `help/en/anywhere/ai-apps.md`)
Front matter like the other `anywhere` articles:
`id: anywhere-ai-apps`, `topic: anywhere`, `routes: /settings/ai-apps`
(if `check-help` rejects it, use `/settings` and say so), `since: 1.11.0`,
`updated: 2026-10-22`, `order: 6`, no `media` (see below),
`related: anywhere-web, account-plus, calendar-private`,
keywords incl. `ai, artificial intelligence, claude, chatgpt, mcp, connector,
assistant, chatbot, ask, cursor, claude code`.

Title: "Use daili from Claude and other AI apps".
Summary: Ask an AI app about your family's day and let it add events, to-dos
and shopping items.

Body — short sentences, the voice of the existing articles, ≤ 230 words:
1. Opening: connect daili to an AI app such as Claude, then ask it about
   your day or tell it what to add — without opening daili. Two or three
   example questions in quotes ("What's on this weekend?", "Add dentist on
   Tuesday at 3 pm", "Put milk on the shopping list").
2. Numbered list (Claude):
   1. In Claude, open **Customize** → **Connectors** → **Add custom connector**.
   2. Name it Daili and paste `https://api.daili.app/mcp`. Press **Add**.
   3. Press **Connect**, sign in with your daili account (Google, Apple or
      email) and choose the family or group. Press **Allow**.
3. One sentence: other AI apps that support MCP connectors use the same
   address.
4. One short paragraph on what it can do: read your calendar, lists, meals,
   notes, birthdays and family members; add events, to-dos, shopping items,
   meals and notes; tick items off. It cannot change or delete anything.
5. `> Note:` The AI app sees only what you see in the family or group you
   chose. Others' private items, Budget, Cycle, Documents & Photos and events
   synced from Google or Outlook never reach it. What it reads goes to the
   company behind the AI app.
6. A paragraph on stopping: in daili, open **Settings → Connected AI apps**
   and press **Disconnect** (on app.daili.app: **Profile → Connected AI
   apps**). Not in your app yet? Update daili or use app.daili.app. Leaving
   the family or group disconnects it too.
7. One sentence: if your family needs Daili Plus for this, the sign-in window
   says so. (Do NOT mention founders, early families, cohorts or prices.)

Brand rule: lowercase "daili" standing alone like the other articles, "Daili"
as the connector's name in step 2. Check every fact against the sources;
where the code says otherwise, follow the code and list it in the report.

## No picture (on purpose)
Claude's screens are English-only and change often, and the Daili screen is
not in the live app yet. Do not add media or a media-gap entry; add nothing
to `media*.json`.

## Also
- `help/en/anywhere/web.md`: add `anywhere-ai-apps` to its `related` only (do
  not bump `updated`).

## Translations
Translate the article into every `HELP_LOCALES` language following
`claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`. Daili labels from the
ARB files / `lang/<locale>/mcp.php` / the web's i18n table. **Claude's three
menu labels (Customize, Connectors, Add custom connector) and the buttons
Add / Connect stay in English in every language** (we cannot check Claude's
own translations; the app does the same). Keep "MCP", "Claude", "ChatGPT",
the URL as they are.

## Scope
- In: `help/en/anywhere/ai-apps.md` + its translations, `help/en/anywhere/web.md`
  (`related` only), this prompt file, `npm run build`.
- Out: legal (prompt 002), other articles, `LIVE_APP_VERSION`, home page,
  blog, feature pages. 🔴 Untracked files that are not yours
  (`claude-prompts/2026-10-21/`, `claude-prompts/MARKETING-WEEKLY.md`,
  `static/assets/img/photos/`): leave them untracked.

## Verify
`npm run build` green and `node tools/check-help.mjs` green (route check NOT
skipped). Spot-check `dist/help/anywhere/ai-apps/index.html`, the `de` and
`ja` pages. `dist/help/en.json` lists the article.

## Commit & push
`docs(help): AI apps (MCP connector) article`; body
`Prompt: claude-prompts/2026-10-22/001-help-ai-apps.md`. Commit this prompt
file with it. **Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-22/001-help-ai-apps.md`, half a page: articles ×
locales, labels taken from where, facts corrected against the code, build
lines, SHA + push. `## Help impact`: new article anywhere-ai-apps.
