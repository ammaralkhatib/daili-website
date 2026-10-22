# 2026-10-22 002 — Privacy: AI apps you connect

**Status: blocked** — one sentence of the prescribed text is not true for the code. No legal file and no `tools/check-legal.mjs` change made.

## Untrue sentence (stopped on)
1a / 2a: "…or in the web app under Profile" / „oder in der Web-App unter Profil“.
The web app has no Connected AI apps card: `../daili-web/src` has no AI-apps/MCP/connections strings or UI, and `daili-web` prompt `2026-10-22/001-connected-ai-apps-card.md` is still untracked and not run (no report, no commit in `git log --all`). Today you can't disconnect an AI app in the web app. The 001 help report found the same thing ("The web card itself is not built yet").

Options: (a) run daili-web 001 first, then re-run this prompt unchanged; or (b) Planning Claude removes the web clause from 1a/2a (and the help article's "(web: **Profile & settings**)").

## Label check (for the re-run)
- App: `aiAppsTitle` = "Connected AI apps" / „Verbundene KI-Apps“, `settingsTitle` = "Settings" / „Einstellungen“ — match the text. The screen (`2f75b116 feat(settings): Connected AI apps`) is on app `main` but **not** in tag `v1.11.0+17` yet. That's fine for a policy, but worth knowing.
- Web: the page title is "Profile & settings" / „Profil & Einstellungen“ (`profile.title`), not "Profile" / „Profil“. Use those words once the card ships.

## Facts verified (all true)
- Precondition: API `21f38f8 fix(mcp): never pass Google- or Outlook-synced events to AI apps` is present.
- Tools `app/Mcp/Tools/*`: 15 tools (read + add + check). None edit or delete.
- Sign-in page loads Firebase from `www.gstatic.com/firebasejs/10.12.2/`.
- Export: `ExportUserDataJob::aiConnections` → client name, family, created/last used/expires, revoked.
- Revocation: `McpConnections::revokeForMember/Family/User`. Hard delete: `AccountPurger` → `mcpConnections->deleteForUser`.
- No scheduled Passport token purge in `routes/console.php`, so "we keep it until you delete your account" stays.

## Guard proof / build
Not run (stopped before editing).

## Commit
Only this report and the prompt file, by pathspec. The untracked `claude-prompts/2026-10-21/`, `claude-prompts/MARKETING-WEEKLY.md` and `static/assets/img/photos/` are left alone.

## Help impact
None from this prompt. The shipped help article `anywhere-ai-apps` has the same web claim ("web: Profile & settings"). Fix it when the web card ships or if option (b) is chosen.
