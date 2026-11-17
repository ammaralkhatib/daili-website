# 001 — The blog in several languages (the engine only)

Status: done
**Commit:** `4b5a62ab` feat(blog): posts in several languages — engine, fixed words, guards. Pushed to origin/main together with this report. `./deploy.sh` was NOT run.
**Step 0:** `4c4f192a` docs(plan): sync planning docs (this prompt), pushed. `static/assets/img/photos/` was not touched.
**No post is translated.** The commit holds no `blog/<slug>.<loc>.*` file. The dry-run files were deleted (Verify 3).

## What a translation needs now
1. `blog/<slug>.de.html` — the translated body (no `<h1>`, no FAQ, no CTA, like the English body).
2. `blog/<slug>.de.json` — `title`, `description`, `h1`, `imageAlt`, `faq` (same number of questions), `cta` `{h2, html}`, and `itemList` only if the English post has one. Nothing else.
3. That's all. The build makes `/de/blog/<slug>/`, the hreflang set, the sitemap entry, `/de/blog/`, the German Blog link and the German "From the blog". Languages: `BLOG_LOCALES = ['en','de','nb','uk','sv','nl']` in `site.config.mjs`.

## Where the fixed words live
`blog/ui/<loc>.json`, one file per blog language (en, de, nb, uk, sv, nl), all with the same keys. A missing file, a missing or empty string, an extra key, or `seeHowFeature` without `{feature}` stops the build. English comes out letter for letter as before (Verify 1). `BLOG_INDEX` in `site.config.mjs` is gone; its words are `blog/ui/en.json` → `index`. The feed still uses the English `index.h1` / `index.description`.

## The new strings (you can't read them all, so here is the full list)
| key | English (source) | de | nb | uk | sv | nl |
|---|---|---|---|---|---|---|
| faqHeading | Frequently asked questions | Häufige Fragen | Ofte stilte spørsmål | Поширені запитання | Vanliga frågor | Veelgestelde vragen |
| keepReading | Keep reading | Weiterlesen | Les videre | Читати далі | Läs vidare | Lees verder |
| fromTheBlog | From the blog | Aus dem Blog | Fra bloggen | З блогу | Från bloggen | Uit de blog |
| allArticles | All articles → | Alle Artikel → | Alle artikler → | Усі статті → | Alla artiklar → | Alle artikelen → |
| seeHowFeature | See how {feature} works in daili → | {feature} in daili ansehen → | Se {feature} i daili → | {feature} у daili: як це працює → | Se {feature} i daili → | Bekijk {feature} in daili → |
| moreInEnglish | More articles in English → | Weitere Artikel auf Englisch → | Flere artikler på engelsk → | Більше статей англійською → | Fler artiklar på engelska → | Meer artikelen in het Engels → |
| newsletter.heading | Get one short email a month | Eine kurze E-Mail im Monat | Én kort e-post i måneden | Один короткий лист на місяць | Ett kort mejl i månaden | Eén korte e-mail per maand |
| newsletter.text | What's new in daili and one tip for your family's week. No ads, no tracking. You'll get an email to confirm. | Was es Neues in daili gibt und ein Tipp für die Woche deiner Familie. Keine Werbung, kein Tracking. Du bekommst eine E-Mail zum Bestätigen. | Hva som er nytt i daili og et tips til familiens uke. Ingen reklame, ingen sporing. Du får en e-post for å bekrefte. | Що нового в daili і порада на тиждень для твоєї родини. Без реклами, без стеження. Ти отримаєш лист, щоб підтвердити підписку. | Vad som är nytt i daili och ett tips för familjens vecka. Ingen reklam, ingen spårning. Du får ett mejl för att bekräfta. | Wat er nieuw is in daili en een tip voor de week van je gezin. Geen reclame, geen tracking. Je krijgt een e-mail om te bevestigen. |
| newsletter.label | Your email | Deine E-Mail-Adresse | E-postadressen din | Твоя електронна пошта | Din e-postadress | Je e-mailadres |
| newsletter.placeholder | you@example.com | du@beispiel.de | deg@eksempel.no | imya@example.com | du@exempel.se | jij@voorbeeld.nl |
| newsletter.button | Subscribe | Anmelden | Meld meg på | Підписатися | Prenumerera | Aanmelden |
| newsletter.honeypot (hidden) | Leave this field empty | Dieses Feld leer lassen | La dette feltet stå tomt | Залиш це поле порожнім | Lämna det här fältet tomt | Laat dit veld leeg |
| newsletter.unsubscribe | Unsubscribe any time. | Jederzeit abbestellbar. | Meld deg av når du vil. | Можеш відписатися будь-коли. | Avsluta när du vill. | Je kunt je altijd afmelden. |
| newsletter.privacy | Privacy policy | Datenschutzerklärung | Personvernerklæring | Політика конфіденційності | Integritetspolicy | Privacybeleid |
| index.title | Blog — Daili | Blog — Daili | Blogg — Daili | Блог — Daili | Blogg — Daili | Blog — Daili |
| index.description | Practical writing on running a family: documents, calendars, lists, and getting everyone to actually use the system. | Praktische Texte rund um den Familienalltag: Dokumente, Kalender, Listen und wie wirklich alle das System nutzen. | Praktiske tekster om familiehverdagen: dokumenter, kalendere, lister og hvordan du får alle til å faktisk bruke systemet. | Практичні тексти про сімейне життя: документи, календарі, списки й те, як зробити, щоб усі справді користувалися системою. | Praktiska texter om familjens vardag: dokument, kalendrar, listor och hur du får alla att faktiskt använda systemet. | Praktische artikelen over het gezinsleven: documenten, agenda's, lijsten en hoe je zorgt dat iedereen het systeem echt gebruikt. |
| index.h1 | The Daili blog | Der Daili-Blog | Daili-bloggen | Блог Daili | Dailis blogg | De Daili-blog |
| index.intro | (same as description, with "—") | (same as description, with "—") | (same, with "—") | (same, with "—") | (same, with "—") | (same, with "—") |

The newsletter words follow the app's own newsletter texts in each language (`newsletterAskBody`, `newsletterSettingsHint` in the ARB files). German and Ukrainian say "du"/"ти" like their home pages. The feed title stays English ("The Daili blog").

## The guards (one line each)
Kept, now for every language of a post (check-build section 11): one `<h1>` · canonical = the page itself · its own description (not the landing page's) · og:type article + the post's hero as og:image · FAQ parity (words ↔ visible page ↔ FAQPage JSON-LD) · ItemList when declared · hero file exists · in the sitemap · no duplicate slugs.
Changed from "the blog is English-only" to the new rule:
- §1 manifest: expects every translated post page and every language index; nothing more.
- §11 hreflang: English-only post → zero hreflang in `<head>` and no xhtml:link in the sitemap (unchanged). Translated post → exactly its languages + x-default (English), on every page, every alternate built and pointing back; the sitemap the same.
- §11 new: og:locale and og:image:alt in the page's language; the Article JSON-LD's `mainEntityOfPage` is the page's own URL, `inLanguage` the page's language, `headline` its h1.
- §11b index: each language's index lists exactly that language's posts; a translated index links "More in English" to `/blog/`; indexes are one hreflang cluster when there is more than one (none while only English).
- §11b nav + footer: a language with its own index links to `/<loc>/blog/` without hreflang; every other language (and English) keeps `/blog/` with `hreflang="en" lang="en"`. (The footer is newly checked.)
- §11b feed: one item per English post, `<language>en`, only English post links; RSS autodiscovery only on English blog pages.
- §19: a feature page shows "From the blog" exactly when a post in ITS language is tagged, links only into its own language, "All articles" to its own index; every post links to its primary feature page in its language and never to itself.
New, §11c + `tools/blog-i18n.mjs`: (a) same shape — same number of h2/h3/p/li/table/tr/img/blockquote/a, same external links and #anchors, internal links to the same page in the page's language where it exists (read from that page's hreflang alternates in dist/), checked in the body and in `cta.html` · (b) not a copy — body, title, h1 differ from English · (c) no English fixed word left on a translated post or index page · (d) forbidden words in every translation file, every `blog/ui/*.json` and every English post.
Build-time (throws in build.mjs, requirement 1): only one of the two files · `en` or a language not in `BLOG_LOCALES` · unknown slug · missing/empty/unknown key · different number of FAQ questions · `itemList` missing or extra · `<h1>` or FAQ/CTA section in the body · a bad file name in `blog/`.
Test: `tools/test-blog-i18n.mjs` (48 cases, in `npm test` and in `npm run build` before `build.mjs`), made-up fixture in `tools/fixtures/blog-i18n/` (never reaches dist/).

## Verify 1 — nothing changed for today's site
Before my first edit: `npm run build` → `build OK · 3759 pages · 3728 in hreflang clusters`, copied `dist/` to `/tmp/blogi18n/dist-before`. After my last edit, with no translation files: `npm run build` again, then `diff -r`:
```
post pages: 27 | help json: 25 | other: none
  27 <        "Frequently asked questions" above — the blog is English-only.
  27 <        literally true. The strings are English inline, exactly like
  27 >        blog/ui/<loc>.json like the FAQ heading above; `lang` is the page's.
  27 >        literally true. Every word is the page's language's, from
25 help json files, 0 differ beyond the generated timestamp
```
Every difference, explained:
1. **27 post pages, 2 lines each:** the HTML comment above the newsletter form in `templates/blogpost.html` said "the strings are English inline … the blog is English-only". The prompt asks to make such comments true, so I reworded it. It is a comment: readers never see it. Every visible byte, link, meta tag and JSON-LD is the same.
2. **25 `help/<loc>.json` files:** only the `"generated"` timestamp, which changes on every build (also without my change).
Nothing else differs: same page count (3759), same sitemap, same feed, same asset hashes.

## Verify 2 — build and tests
`npm run build` (foreground, after deleting the dry-run files):
```
content OK · 28 locale(s) · 525 keys each
reviews OK · 7 review(s) · 189 translation(s) in 28 locale(s)
legal OK · 2 document(s) × 28 locale(s)
help OK · 115 article(s) · … · 87 app routes checked
test-check-help OK · 99 cases (1 clean fixture + every guard rule planted and caught)
test-blog-i18n OK · 48 cases (1 clean fixture + every translation rule planted and caught)
built 3759 pages · 28 locale(s) · 3756 sitemap entries
blog: 27 post(s) · /blog/ index · feed.xml (English) · 0 translation(s) · languages en, de, nb, uk, sv, nl
build OK · 3759 pages · 3728 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
help search OK · 26 cases · 2 built page(s)
```
`npm test`:
```
detector OK · 32 cases · 28 locale(s) built
test-check-help OK · 99 cases (1 clean fixture + every guard rule planted and caught)
help search OK · 26 cases · 2 built page(s)
test-blog-i18n OK · 48 cases (1 clean fixture + every translation rule planted and caught)
```
(After the build I only edited `README.md`, `BLOG-POST-TEMPLATE.md` and this report — none is read by the build.)

## Verify 3 — dry run with a real translation (not committed)
Post: `cozi-30-day-calendar-limit` (shortest, 721 words). Two Opus 5.5 helper agents translated it into German and Ukrainian (two files each). I waited for both and checked the files on disk. The build was green with them in (`build OK · 3763 pages · 3734 in hreflang clusters`, `2 translation(s) · indexes en, de, uk`).
- hreflang in `<head>` (4 on each page): en, de, uk, x-default →
  `/blog/cozi-30-day-calendar-limit/`, `/de/blog/…`, `/uk/blog/…`, x-default `/blog/…` — the same 4 on all three pages. (`/usr/bin/grep -c hreflang` on the whole file says 36 / 33 / 33 lines, because the language picker's 28 rows and the nav/footer links also carry hreflang; the `<head>` holds exactly 4.)
- `/de/blog/cozi-30-day-calendar-limit/`: `<html lang="de">`, og:locale `de`, title "Das 30-Tage-Limit im Cozi-Kalender, erklärt", byline "20. Oktober 2026", "Häufige Fragen", no "Keep reading" (no other German post), CTA line `<a href="/de/features/calendar/">Kalender in daili ansehen →</a>`, newsletter `lang="de"` + link to `/datenschutz.html`, Article JSON-LD `inLanguage: de` + `@id` = its own URL, no RSS link.
- `/uk/blog/…`: the same in Ukrainian; privacy link `/uk/privacy.html`.
- `/de/blog/` and `/uk/blog/`: one post each, then "Weitere Artikel auf Englisch →" / "Більше статей англійською →" to `/blog/` (hreflang="en" lang="en"). `/blog/` got hreflang en/de/uk/x-default.
- English post: unchanged words, plus its 4 hreflang lines; still has the RSS link.
- German feature page `/de/features/calendar/`: "Aus dem Blog" with the German post, "Alle Artikel →" to `/de/blog/`. `/sv/features/calendar/`: no block. `/features/calendar/` (English) unchanged.
- Sitemap: the three post URLs and `/blog/` have the alternates en, de, uk, x-default; English-only posts have none.
- Header + footer "Blog": `/de/` → `/de/blog/` (no hreflang), `/uk/` → `/uk/blog/`, `/sv/` and `/nb/` → `/blog/` with `hreflang="en" lang="en"`, `/` unchanged.
- Language picker on the German post: Deutsch → the German post, Українська → the Ukrainian post, English → the English post, Svenska → `/sv/` (as today). Same look, same markup.
- **Pictures** (headless Chrome, 360 px wide, full page): `claude-reports/2026-11-17/001-shots/de-post-light.webp`, `de-post-dark.webp`, `de-index-light.webp`, `de-index-dark.webp`. I looked at all four: nothing overflows (page width 360), light and dark both read well, the "More in English" link uses the existing CTA-link style.
- Then I **deleted the four files** and built again: the diff is the same as Verify 1 (only the comment + timestamps), and `git status --short` shows none of them (only my code changes, `claude-reports/2026-11-17/` and the untracked `static/assets/img/photos/`).

## Verify 4 — broken on purpose (each put back afterwards)
1. Deleted `cozi-30-day-calendar-limit.de.json` → `node build.mjs` stops:
   `blog/cozi-30-day-calendar-limit.de.json is missing — blog/cozi-30-day-calendar-limit.de.html needs its words (title, description, h1, imageAlt, faq, cta)`
2. Added "Familienplanung" to the German body → `check-build`:
   `blog/cozi-30-day-calendar-limit.de.html holds the forbidden word "Familienplanung" — it means contraception`
3. Removed one `<p>` from the German body → `check-build`:
   `blog/cozi-30-day-calendar-limit.de.html body has 18 <p>, the English has 19`

## What I could not do
Nothing left out. One thing to know: Verify 1's diff is not empty — it is 2 comment lines per post page (explained above). If you want a byte-for-byte empty diff, the only way is to keep the old (now untrue) comment.

## Decisions I had to make
- **Fixed words in `blog/ui/<loc>.json`, not `BLOG_UI` in site.config.mjs** — one plain file per language is what a translator (or agent) touches, and site.config.mjs stays structure.
- **`BLOG_INDEX` removed** — its words moved to `blog/ui/en.json` → `index`, so there is one place, not two.
- **The feature line is not a word-for-word "See how X works"** — German, Ukrainian etc. would need a grammatical case for the feature name; "Kalender in daili ansehen →" / "Календар у daili: як це працює →" keeps the name in its plain form.
- **"No English left" ignores a string that is the same in both languages** — "Blog — Daili" is the right German and Dutch title; it would otherwise always fail.
- **Ukrainian forbidden list also has "сімейний планувальник"** — the prompt says never a word that reads as "family planner"; this makes the guard catch it.
- **The English "family planning" stays in the list** — I checked: no English post holds it. The guard also scans the English posts and the English fixed words.
- **The forbidden check uses the file's language AND English** — an English "family planning" left in a German file is caught too.
- **Internal links are judged from the target page's own hreflang in dist/** — this handles every page (e.g. `/privacy.html` → `/datenschutz.html`) without a hand list. Side effect: when an older post gets its own translation later, translations that link to it must be updated, or the build is red. The recipe says so.
- **The shape and link rules also run on `cta.html`** — it has a link too (`/` → `/de/`).
- **"More articles in English →" reuses `class="post-cta-link"`** — an existing link style; no new CSS (rule 6).
- **No description length limit for translations** — English has none either.
- **The newsletter `lang`** is the page's language. The api accepts all six (`config/locales.php` `supported`), read only, not changed.

## Help impact
none

## For the next publish prompt
To add a NEW post in six languages:
1. English as today (`BLOG-POST-TEMPLATE.md`): `blog/<slug>.en.html` + the `BLOG_POSTS` entry + the hero in `static/assets/img/blog/`.
2. For each of de, nb, uk, sv, nl: `blog/<slug>.<loc>.html` (same tags as English, external links unchanged, internal links to that language's page where it exists: `/` → `/<loc>/`, `/features/x/` → `/<loc>/features/x/`, English-only posts stay `/blog/…`) and `blog/<slug>.<loc>.json` with `title, description, h1, imageAlt, faq, cta` (+ `itemList` if English has it). Translators: home-page tone (German "du"), feature names from `content/<loc>.json` / `content/glossary.md`, never the "family planning" words. Have them write the files with the file-write tool and check every file on disk afterwards.
3. `npm run build` (foreground). Section 11c names any file whose shape, links, words or language is off; fix the file, not the guard.
4. Check: hreflang in the `<head>` = the 6 languages + x-default on all 6 pages; the post on `/blog/` and on each `/<loc>/blog/`; the feed has only the English one; 360 px light/dark for English and one translation.
5. Report: the title and first sentence of each language next to an English copy, so Ammar can check them.
6. The first translated post creates `/de/blog/`, `/nb/blog/`, … and switches those languages' header/footer "Blog" link to them. That is expected.
