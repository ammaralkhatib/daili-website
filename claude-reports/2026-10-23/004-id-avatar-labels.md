# 004 — id avatar labels · done

- Pages: `help/id/account/avatar-ai.md` — 2 quotes now say "Avatar AI Anda" (picture alt text + body). The picture `static/help/media/id/account-avatar-ai.webp` was committed with it. Translated pages have no `updated:` field (their date is `translatedFrom`), and it was already 2026-10-23, so I left it alone.
- Recount: `grep -rn 'AI-mu\|selfie-mu' help/id` = 0. (The page never quoted "Ubah selfie-mu", so nothing there to change.)
- Build: `npm run build` OK — 3233 pages, detector OK, help search OK.
- SHA: `12587fc` (pushed). Planning docs: `373a660`. Not deployed. `static/assets/img/photos/` still untracked.

## Help impact
none
