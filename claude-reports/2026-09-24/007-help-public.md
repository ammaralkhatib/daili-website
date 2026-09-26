# 007 — Help center public

Status: done · commit `141c87e` (prompt: `ff50332`) · pushed to main.

- `site.config.mjs`: `HELP_PUBLIC = true`; the comment gets "Public since 2026-09-24." Nothing else changed, because no guard failed.
- `npm run build` passes on the first try. The help line reads `help: 64 of 64 article(s) on pages (live 1.6.0) · 11 topic(s) · en.json 64 articles, 9 tips, 6 checklist · PUBLIC`.
- noindex: 0 in `dist/help/index.html`. It is also 0 in every other HTML file under `dist/help/`, including every topic and article page.
- Sitemap: 76 `/help/` URLs = 1 + 11 topics + 64 articles.
- Footer: `<a href="/help/" hreflang="en" lang="en">` is on `dist/index.html:488` and `dist/de/index.html:467`.
- Note: 3 articles still wait for a hand-made picture (anywhere-widgets, anywhere-web, anywhere-wall). This is a warning only, as before.

## Open item for Ammar
Run `./deploy.sh`. This also ships 006 (the allowlist, the "?" fixes and the privacy paragraph). Then check:
- `curl -sI https://daili.app/help/en.json` → `200` with `cache-control: public, max-age=300`;
- https://daili.app/help/ opens.
