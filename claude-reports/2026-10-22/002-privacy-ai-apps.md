# 2026-10-22 002 — Privacy: AI apps you connect

**Status: done** (re-run; replaces the earlier blocked report).

## Preconditions
- daili-web `1b5e1b6 feat(profile): Connected AI apps card` is present.
- API `21f38f8 fix(mcp): never pass Google- or Outlook-synced events to AI apps` is present.

## Files × locales
- 28 bodies: `legal/privacy.en.html`, `legal/datenschutz.de.html` (there is no `privacy.de.html`), and 26 translations (ar bg cs da el es fi fr hi id it ja ko nb nl pl pt ro ru sk sv th tr uk zh-Hans zh-Hant). Each body gets:
  - 1a `<p id="ai-apps">` after the Wall display paragraph (§4)
  - 1b `<p id="google-ai-apps">` after the Google sharing list (§5)
  - 1c a closing sentence on the §7 paragraph
  - the date set to 22 Oct 2026, localised
- EN and DE are word for word from the prompt. The translations come from the English, in each file's register, and each file keeps its translation note.
- Small choices:
  - ja, zh-Hans, zh-Hant: no leading space before 1c, because CJK sentences there run on without spaces.
  - ar: uses ← for the UI path, as the Arabic file already does for every menu path.
  - Every locale translates "providing the service you asked for" literally, not as the file's usual "performance of the contract".

## Labels checked
- App ARB: `aiAppsTitle` = Connected AI apps / Verbundene KI-Apps, and `settingsTitle` = Settings / Einstellungen. These match the prompt text.
- Web: `profile.title` = Profile & settings / Profil & Einstellungen. This also matches.
- The other locales use the label from their own ARB and web file. ar, hi and ru have none, so those labels are natural translations.

## Untrue sentences
None found. The facts were re-checked:
- 15 MCP tools, none of which edit or delete.
- Firebase is loaded from gstatic.
- `ai_connections` is in the export.
- Connections are revoked by the revocation hooks and deleted by `AccountPurger`.
- There is no scheduled Passport token purge, so "we keep it until you delete your account" stays.

## Guard
`tools/check-legal.mjs` now requires `id="ai-apps"` and `id="google-ai-apps"` in every privacy body. To prove it can fail, I renamed the id in `privacy.ja.html`:
`1 legal error(s): legal/privacy.ja.html does not contain id="google-ai-apps" — AI apps you connect (MCP) are in every locale …` (exit 1). After restoring the id: `legal OK · 2 document(s) × 28 locale(s)`.

## Build
- `build OK · 3233 pages · 3203 in hreflang clusters`
- `detector OK · 32 cases · 28 locale(s) built`
- Spot-checked `dist/privacy.html`, `dist/datenschutz.html` and `dist/ja/privacy.html`: both ids are present and the date is 22 October 2026.

## Commit
Committed by pathspec; the untracked files that are not mine were left alone. Pushed; not deployed. The SHA is in `git log`, under `docs(legal): privacy — AI apps you connect`.

## Help impact
None.
