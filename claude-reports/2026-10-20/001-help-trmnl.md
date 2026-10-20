# Help: new article "Show daili on a TRMNL display"

**Prompt:** `claude-prompts/2026-10-20/001-help-trmnl.md`
**Completed:** 2026-10-20 · **Status:** done

## Summary

There is a new help article, `anywhere-trmnl`, in English and all 24 other help languages (25 files). Its address is `https://daili.app/help/anywhere/trmnl/`, ready for the TRMNL listing. It has one picture: your Today screen export, shown in English in every language. Commit **33967f6** is pushed. `./deploy.sh` was **not** run.

Step 0: I committed the prompt file alone as `docs(plan): sync planning docs` (e477bde) and pushed it. The untracked blog and photo images were left alone.

## What changed

- `help/en/anywhere/trmnl.md` + 24 translations. `since: 1.11.0`, `order: 5`, `media: anywhere-trmnl`, related `anywhere-wall, anywhere-widgets, calendar-private` (all three exist).
- `help/en/anywhere/wall.md`: `anywhere-trmnl` added to `related` only. `updated` is unchanged.
- `static/help/media/en/anywhere-trmnl.webp`: 720×540, WebP quality 84, the same settings as the app's `help_shots_finish.py`.
- `help/media.json`: one entry added. `help/media-gaps.json`: `anywhere-trmnl` listed for all 24 translated languages, with the reason "TRMNL screen export, English only".

## Labels taken from the plugin (`lang/<locale>/trmnl.php`)

`manage.view_label` (**Screen**; in German it is "Ansicht"), `manage.views.*` (Today · 3 days · Week · Month · List), `manage.weather.show` (**Show weather**), `manage.save_refresh` (**Save and update screen**), `manage.disconnect` (**Disconnect**), `manage.family_label` (family or group) and `install.code_label` (6-digit code). **Plugins**, **Daili** and TRMNL stay in English everywhere.

## Facts corrected against the code

1. **You do not pick the screen during install.** The install pages ask only for the email, then the code, then the family (only if you are in more than one). The Screen and the weather are set later, on the plugin's settings page. So the article has three steps: install → email + code (+ pick a family) → open the plugin settings, pick a Screen, press Save and update screen.
2. **The email must be confirmed** (`install.unverified_*`). Step 2 says this in a few words.
3. **Privacy:** private to-dos (private items) are also never shown, not just events and lists (plan §6). The note says "Private events, lists and to-dos".
4. **Language:** the code comment says the board is "en + de only". In fact `TrmnlLocale::resolve` checks for the file on disk, and all 25 `trmnl.php` files exist. So I added **no** "English and German only" sentence.
5. Turning the display: confirmed. Orientation is part of the cache key, and **Save and update screen** clears the cache and sends `force_refresh`.

## Left out / shortened

The English must stay under 150 words (the guard's limit; the prompt said 210, which is the limit for translations). To fit, I dropped the word "mashups". The article now says "Daili also fits half or a quarter of the screen". The stop sentence says "remove it in TRMNL".

## English issues raised by the translators (not changed)

- "Daili also fits half or a quarter of the screen" does not say this is a TRMNL layout ("mashup") setting.
- "Turned the display upright (or back)?" means portrait/landscape only by implication. sk, uk and bg reworded it as "now portrait (or landscape again)".
- The feature names in the note were taken from the ARB in most languages and from the help topic titles in ja/ko/zh/th/id. Both are app words. Some, such as sv "Hushållsbudget", are longer than the English.

## Verify

- `node tools/check-help.mjs` → `help OK · 93 article(s) · 25 locales · 73 app routes checked`
- `npm run build` → `build OK · 3198 pages` · `detector OK · 32 cases`. Each language prints `93 articles` and `1 picture(s) in English (listed gaps)`.
- Spot checks: `dist/help/anywhere/trmnl/index.html`, `dist/de/help/anywhere/trmnl/` and `dist/ja/help/anywhere/trmnl/` exist. `dist/help/en.json` lists `anywhere-trmnl`. The `<img>` points to `/help/media/en/anywhere-trmnl.webp` (720×540) with the translated alt text. The file is in `dist/`, mode 644.
- I re-read the German translation in full. It reads naturally and uses the plugin's labels.

## Open items for Ammar

- Run `./deploy.sh` after you have checked it. The link goes live only after that.
- **Plugins** is the label the prompt gave for TRMNL's own menu. I could not check it against TRMNL's site.

## Help impact

New article `anywhere-trmnl` (topic anywhere): how to install the TRMNL plugin, choose screens, what stays private, and how to disconnect.
