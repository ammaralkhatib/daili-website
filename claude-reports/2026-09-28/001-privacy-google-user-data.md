# Privacy policy — Google user data + data protection sections

**Prompt:** `claude-prompts/2026-09-28/001-privacy-google-user-data.md`
**Completed:** 2026-09-28 · **Status:** done (build blocked by an unrelated help-route check, see Open items)

## Summary

Added section 5 "Google user data" (access / use / storage / sharing / protection / retention / Limited Use) and section 6 "How we protect your data" to all 28 privacy bodies. Also added the section-5 cross-reference sentence and the TRMNL "Wall display" paragraph to section 4, renumbered old 5–10 → 7–12, and dated every body 2026-09-28. English is word for word from the prompt. I found no sentence in it that contradicts the facts list, so I changed nothing.

## Files touched

- `legal/privacy.en.html`: the prompt's text, verbatim.
- `legal/datenschutz.de.html`: German, written (not translated), with the prompt's sub-headings and Limited Use sentence.
- `legal/privacy.<26 locales>.html`: translations by five parallel subagents. Each file has the same markup as English: 12 `<h2>`, 7 `<h3>`, 27 `<li>`, 4 `<code>`, and the same ids.
- `tools/check-legal.mjs`: the four guard changes below.
- CSS: none needed. `.legal h3` and `.legal ul` already exist (style.css:769–771).

## Decisions

- **German uses "du", not "Sie".** The prompt said the file uses "Sie", but the whole `datenschutz.de.html` is written in "du"/"eure". Mixing registers would read badly, so the two prompt headings became `6. Wie wir deine Daten schützen` and `Wie lange wir sie speichern und wie du sie löschst`. All other German headings are exactly as given.
- **App labels come from the app's ARB files.** Quoted UI labels ("Connect Google Calendar", "Share with family", "Disconnect") use each locale's string, e.g. de „Google Kalender verbinden“, „Mit Familie teilen“, „Trennen“. ru, ar and hi have no ARB file, so those labels are translated. uk's app label for "Share with family" is "Показувати родині" ("show to family"); it was kept because it is the app's own string.
- **Menu path wording is not checked.** The steps "Calendar → settings" in the disconnect path are plain translations and were not checked against the app's screen titles. Only "Disconnect" comes from the app.
- **"Limited Use" stays in English everywhere.** Each locale's heading reads "Limited Use (<local term>)", so the phrase Google looks for appears in all languages. The policy link text stays in English.

## Verification

Guard (`tools/check-legal.mjs`):
- a) `<h2>` counter is now `/<h2[\s>]/g`.
- b) Every `<h2 id>` in the English body must exist in every locale.
- c) Privacy en + de must contain `id="google-user-data"`, `id="data-protection"`, `api-services-user-data-policy` and `Limited Use`, with the prompt's failure message.
- d) Each check was proven to fail, then the file was restored:
  - Removed the id from `privacy.ja.html` → `has no <h2 id="google-user-data"> — …`
  - Removed the Limited Use link from English → `does not contain api-services-user-data-policy — the Google OAuth verification depends on this section — see claude-prompts/2026-09-28/001`
  - Demoted the fr `data-protection` `<h2>` to `<h3>` → `has 11 <h2> sections, English has 12` plus the missing-id error. The old `/<h2>/` counter could not have seen this.
- After restoring: `legal OK · 2 document(s) × 28 locale(s)`.

Build:
- `npm run build` **fails at check-help**: `app route "/onboarding/you" has no article`. This comes from app commit `625ec725` (new onboarding "You" step), not from this change.
- `HELP_SKIP_ROUTE_CHECK=1 npm run build` passes the whole chain: content OK, legal OK, `build OK · 2034 pages`, check-build, `detector OK`.

Rendered output:
- `dist/privacy.html`, `dist/datenschutz.html`, `dist/fr/privacy.html` and `dist/ja/privacy.html` all show `<h2>` 1–12 with no gaps, and both ids exist.
- Headless Chrome (CDP) at 360 px and 1280 px (en, de, ja):
  - h3 is 17.28px with a 22px top margin; ul has a 22px inline margin. These match the `.legal` rules.
  - Horizontal overflow is 0 at 360 px, including the long `calendar.calendarlist.readonly`.
  - Anchor jumps clear the sticky header via the existing `scroll-padding-top: var(--header-h)`.

Self-correction: none needed.

## Commit & push

- **Commits:** `33b9dc1` — docs(plan): sync planning docs (the prompt only). `9d73e09` — feat(legal): privacy policy — Google user data + data protection sections.
- **Push:** `origin/main`

## Help impact

none

## Open items for the owner

- **`./deploy.sh` will fail at check-help until `/onboarding/you` gets an article or is added to `"pending"` in `help/routes-allowlist.json`.** This is a one-line fix I left alone because it's out of this prompt's scope. Say the word and I'll add it.
- **`./deploy.sh` builds from the working tree, so it will also ship files that are not mine and are not committed:**
  - `changelog/whats-new.de.html`
  - `changelog/whats-new.en.html`
  - `claude/blog-seo-plan-2026-09.md`
  - untracked: `claude/blog-drafts/018–027*.md`, `claude/blog-drafts/TODO.md`, `claude/website-scroll-story-2026-09-18.md`, `static/assets/img/blog/what-to-look-for-family-app.webp`, `static/assets/img/photos/`
- After deploying, resubmit OAuth verification and point the reviewer to `https://daili.app/privacy.html#google-user-data`.
- Optional: have a native speaker read the 26 translations. Subagents flagged these as least certain: the "share, transfer or disclose" heading in nl/sv/fi; the e-paper display wording; pt using the app's "Desligar" in a pt-BR file.

## Deviations from prompt

- German register: "du" instead of "Sie" (see Decisions).
- The build was verified with `HELP_SKIP_ROUTE_CHECK=1` because of the unrelated route failure.
