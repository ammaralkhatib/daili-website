# Report — 001 newsletter: privacy policy (28 locales) + blog sign-up form

Prompt: `claude-prompts/2026-09-19/001-newsletter-privacy-and-blog-form.md`
Commit: `081c2aa` (pushed to `origin/main`)

## Done

- All 28 policy bodies: the "we send no newsletters" sentence is gone, a
  **Newsletter (optional)** paragraph sits directly after the E-mails paragraph
  inside section 4, section 2 gained one sentence about the blog form, and the
  `.updated` line is `datetime="2026-09-19"` in every file, in each file's own
  date format.
- `templates/blogpost.html`: a `<section class="post-newsletter">` after the
  `post-cta` aside — a plain form POST to `https://api.daili.app/newsletter/subscribe`,
  no JavaScript.
- `static/assets/style.css`: the card, the row/stack behaviour, the honeypot's
  visually-hidden wrapper; and the form joins the list of things the print sheet
  drops.
- `static/.htaccess`: `form-action 'none'` → `form-action https://api.daili.app`.

`npm run build` is green through all four links, first try. The 17 `check-content`
length-ratio warnings are the ones that were already there before this change.

```
content OK · 28 locale(s) · 232 keys each
legal OK · 2 document(s) × 28 locale(s)
built 134 pages · 28 locale(s) · 132 sitemap entries
build OK · 134 pages · 114 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```

## No changelog entry

`changelog/whats-new.en.html` states its own contract at the top: one
`<section class="release">` per **version**, each an `<h2>Daili X.Y.Z</h2>` and a
list of user-visible **app** changes. It has never carried a policy change — the
word "privacy" appears nowhere in it. The site's own rule for a policy change is
section 9 of the policy itself ("we will update this page and note the date at
the top"), and the date bump is that. So nothing was added to the changelog.

## The English paragraph (binding)

> **Newsletter (optional).** Only if you switch it on — in the app, in the web
> app, when you sign up, or with the form on our blog — do we send you a
> newsletter: about one e-mail a month with new features and tips. We store your
> e-mail address, your language, where you signed up and the date you agreed, as
> proof of your consent. The newsletter is sent through Brevo (Sendinblue SAS,
> France, EU), which processes this data on our behalf. If you sign up with the
> blog form, or have not confirmed your e-mail address yet, Brevo first sends a
> confirmation e-mail; nothing else is sent until you click it. Newsletter
> e-mails contain **no tracking pixels and no tracked links**. You can
> unsubscribe at any time — with the link in every newsletter, the switch in the
> app or web app, or by writing to us; you are then removed from the list.
> Deleting your account also deletes you from the newsletter. Legal basis: your
> consent (Art. 6(1)(a) GDPR), which you can withdraw at any time without
> affecting e-mails already sent.

Section 2, new second paragraph:

> The one form on this site is the newsletter sign-up under our blog posts: it
> sends the e-mail address you type to our own server (api.daili.app) and nothing
> else — see "Newsletter (optional)" in section 4.

And the E-mails paragraph now ends at the provider:

> **E-mails.** We send account e-mails (verification, password reset,
> invitations) through Brevo, an EU e-mail provider.

## The German paragraph (also authoritative)

> **Newsletter (optional).** Nur wenn du ihn einschaltest — in der App, in der
> Web-App, bei der Registrierung oder über das Formular in unserem Blog — senden
> wir dir einen Newsletter: etwa eine E-Mail pro Monat mit neuen Funktionen und
> Tipps. Wir speichern deine E-Mail-Adresse, deine Sprache, wo du dich angemeldet
> hast und das Datum deiner Einwilligung — als Nachweis dieser Einwilligung.
> Versendet wird der Newsletter über Brevo (Sendinblue SAS, Frankreich, EU), das
> diese Daten in unserem Auftrag verarbeitet. Wenn du dich über das
> Blog-Formular anmeldest oder deine E-Mail-Adresse noch nicht bestätigt hast,
> schickt Brevo zuerst eine Bestätigungs-E-Mail; vorher wird nichts anderes
> versendet. Newsletter-E-Mails enthalten **keine Zählpixel und keine getrackten
> Links**. Du kannst dich jederzeit abmelden — über den Link in jedem Newsletter,
> den Schalter in der App oder Web-App, oder indem du uns schreibst; du wirst
> dann aus der Liste entfernt. Löschst du dein Konto, wirst du auch aus dem
> Newsletter gelöscht. Rechtsgrundlage: deine Einwilligung (Art. 6 Abs. 1 lit. a
> DSGVO), die du jederzeit widerrufen kannst, ohne dass der bisherige Versand
> davon berührt wird.

Section 2, new second paragraph:

> Das einzige Formular auf dieser Website ist die Newsletter-Anmeldung unter
> unseren Blogbeiträgen: Sie sendet die E-Mail-Adresse, die du einträgst, an
> unseren eigenen Server (api.daili.app) und sonst nichts — siehe „Newsletter
> (optional)" in Abschnitt 4.

The `„…"` quote pair is the one this file already uses (`„Geburtstage
importieren"`), not the typographically correct `„…“` — matched deliberately so
the page stays internally consistent.

## Translations I am not sure about

A native reader should look at these. Everything else follows each file's own
existing terminology (the word each file already used for "newsletter" in the
sentence that was removed).

| Locale | Phrase | Why I am unsure |
|---|---|---|
| zh-Hans | 通讯（可选） | The removed sentence said 通讯稿, which is closer to "press release" than "newsletter". I used 通讯 for the heading and the body. 电子报 (as in zh-Hant) or 邮件通讯 may read better. |
| ru | Рассылка (по желанию) | "Рассылка" is right but generic — it is also the word for any bulk mailing. A reader may not connect it to the switch labelled in the app. |
| uk | Розсилка (за бажанням) | Same concern as ru. |
| th | จดหมายข่าว (ไม่บังคับ) | "ไม่บังคับ" is literally "not compulsory"; "ตัวเลือก" or "ถ้าต้องการ" may be the better register for an opt-in. |
| ar | «النشرة الإخبارية (اختيارية)» | "نشرة إخبارية" reads as a news bulletin. It is the term the file already used, so I kept it, but a product newsletter may want a softer word. |
| hi | ट्रैकिंग पिक्सेल / ट्रैक किया गया लिंक | Transliterated English. There is no settled Hindi term and the file transliterates elsewhere too, but it is worth a check. |
| fr | « Lettre d'information (facultative) » | The file avoided "newsletter" (it said "ni lettre d'information ni e-mail publicitaire"), so I kept "lettre d'information" throughout — but the app's own switch may well say "Newsletter". If it does, this should follow the app. |
| el | συνδέσμους με ιχνηλάτηση | A mouthful for "tracked links". "συνδέσμους με παρακολούθηση" is an alternative. |

The GDPR citation in each file was changed from that file's own `(f)` form to
its `(a)` form (e.g. `čl. 6 odst. 1 písm. f GDPR` → `písm. a`,
`art. 6, lid 1, onder f, AVG` → `onder a`), so the reference style never
diverges from the rest of the page.

## The CSP line

Before:

```
form-action 'none';
```

After:

```
form-action https://api.daili.app;
```

Nothing else in the header changed. The comment block above it gained five
lines: "zero external requests by design" is no longer the whole truth and the
next reader should find out why from the file rather than from git.

## The form

```html
<section class="post-newsletter">
  <h2>Get one short email a month</h2>
  <p>What's new in daili and one tip for your family's week. No ads, no tracking. You'll get an email to confirm.</p>
  <form class="nl-form" method="post" action="https://api.daili.app/newsletter/subscribe">
    <input type="hidden" name="lang" value="en">
    <label class="nl-label" for="nl-email">Your email</label>
    <div class="nl-row">
      <input class="nl-input" id="nl-email" type="email" name="email" required autocomplete="email" placeholder="you@example.com">
      <button class="nl-btn" type="submit">Subscribe</button>
    </div>
    <div class="nl-hp" aria-hidden="true">
      <label for="nl-website">Leave this field empty</label>
      <input id="nl-website" name="website" type="text" tabindex="-1" autocomplete="off">
    </div>
    <p class="nl-small">Unsubscribe any time. <a href="/privacy.html">Privacy policy</a></p>
  </form>
</section>
```

English and inline, like the `Frequently asked questions` heading above it — the
blog is English-only, so nothing went into `content/*.json`.

### Measured, not eyeballed

Headless Chrome, the built page inside a same-origin iframe sized to the exact
viewport, reading real boxes off the live DOM:

```
w=1100  input 476×43 @ y4764   button 121×43 @ y4764   sameRow true
w=700   input 476×43 @ y4753   button 121×43 @ y4753   sameRow true
w=390   input 316×43 @ y6205   button 316×43 @ y6258   sameRow false   (stacked)

honeypot wrapper box 1×1 at every width   input tabIndex -1   aria-hidden true   type "text"
tab order inside the form: INPUT:nl-email → BUTTON:submit → A:Privacy policy
action https://api.daili.app/newsletter/subscribe   method post
scrollWidth == clientWidth at 1100 / 700 / 390 — no horizontal overflow
scripts in the page: 3 — the two JSON-LD blocks and assets/script.js, unchanged
```

**One bug found and fixed before committing.** The first version styled the
field `flex:1 1 220px`. That is a *width* in a row and a 220-px-tall text box in
a column, so the phone layout rendered a 316×220 input. The phone query now
resets it (`flex:0 0 auto;width:100%`); the 390 px numbers above are from after
the fix.

### Stills

`shots/form-900-light.png`, `shots/form-900-dark.png`,
`shots/form-390-light.png`, `shots/cta-and-form-900.png`.

The card reuses `.post-cta`'s geometry — same border, radius and padding — but
sits on `--mint-soft` rather than `--mint`. Two identical mint panels stacked
read as one long panel and the CTA would stop being the louder of the two; the
last still is there to show the pair. Dark mode needed no new rule: every value
is a token that the `prefers-color-scheme` block already flips.

## Open item for Ammar

**`./deploy.sh` — and it has to go first.** Before the web app deploy and before
the app release that carries the newsletter switch. Until this is live, the
policy on daili.app still says we send no newsletters.

The form itself 404s until api prompt `2026-09-19/002-newsletter-opt-in.md` is
deployed — `https://api.daili.app/newsletter/subscribe` does not exist yet.
Deploying this first is still correct: an honest policy with a form that is not
wired up is the safe order, the reverse is not.
