# 001 — Help: "Use daili from Claude and other AI apps"

**Prompt:** `claude-prompts/2026-10-22/001-help-ai-apps.md` · **Status:** done · **Not deployed** (`./deploy.sh` is yours).

## What changed
- New article `anywhere-ai-apps` (`help/en/anywhere/ai-apps.md`, order 6, since 1.11.0, route `/settings/ai-apps`, which `check-help` accepted) plus 24 translations. That is 25 files: en + de nl sv da nb fi fr it es pt pl cs sk ro tr el uk bg ja ko zh-Hans zh-Hant th id.
- `help/en/anywhere/web.md`: `anywhere-ai-apps` added to `related` only (`updated` not bumped).
- No media, no `media*.json` or media-gaps change.

## Labels, where they come from
- App ARB `app_<arb>.arb`: `settingsTitle`, `aiAppsTitle` (the Settings row and the screen title), `aiAppsDisconnect`, plus `dashboardTileBudget`, `cycleTitle`, `documentsTitle`, `photosTitle` for the "never reach it" list. Wording for events/to-dos/shopping is from `aiAppsIntro`.
- API `lang/<locale>/mcp.php`: `authorize.approve` (**Allow** / Erlauben / 許可する …).
- Web `../daili-web/src/i18n/<tag>.ts`: `profile.title` / `shell.profileTitle`.
- Claude's **Customize / Connectors / Add custom connector / Add / Connect** stay in English everywhere. MCP, Claude and the URL are unchanged.

## Deviations and facts corrected against the code
1. **The body is at most 150 words, not up to 230.** `tools/help-lib.mjs` caps article bodies at 150 words (`LIMITS.words`). The prompt's whole outline is still there, but shorter. Dropped: the third example ("Add dentist…"), "(Google, Apple or email)" in step 3, and "Not in your app yet? Update daili or use app.daili.app".
2. **`mediaPending` was added.** `check-help` needs `media` or `mediaPending` on every article. I wrote `mediaPending: none on purpose: Claude's screens are English-only and change often`. It is front matter only, and nothing went into `media*.json`. It now shows in the "waiting for a picture" list.
3. **Web label = "Profile & settings", not "Profile".** That is the page title in `daili-web` i18n (`profile.title`). The web card itself is not built yet (daili-web prompt `2026-10-22/001` is open).
4. **The URL is plain text**, because `check-help` forbids backticks in articles.
5. **"Ticks items off":** `CheckItemTool` can also untick. "Can't edit or delete" matches the CLAUDE.md §3 v1 rules. `set_meal` only adds and never replaces.
6. **Disconnect also happens** when you are removed from the family, or the family or account is deleted (api report 006). The article only says "leave the family or group", as the prompt asked.

## Verify
```
node tools/check-help.mjs → help OK · 94 article(s) · 25 locale(s) · 74 app routes checked
npm run build → build OK · 3233 pages · 3203 in hreflang clusters; each locale 94 articles, 16 tips, 6 checklist
```
I spot-checked `dist/help/anywhere/ai-apps/index.html`, `dist/de/…` and `dist/ja/…`: the Note renders as `help-note`, and the bold labels are correct (ja: 許可する, 設定 → 接続中のAIアプリ, 接続を解除, プロフィールと設定). `dist/help/en.json` lists `anywhere-ai-apps`.

## Commit & push
`1c07ed3` docs(help): AI apps (MCP connector) article (27 files, including this prompt). **Pushed** to `main`. Untracked files that aren't mine were left alone.

## Help impact
New article `anywhere-ai-apps` (https://daili.app/help/anywhere/ai-apps/ after deploy).
