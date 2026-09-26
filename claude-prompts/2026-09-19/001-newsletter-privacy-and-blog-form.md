# Newsletter — privacy policy update (28 locales) + sign-up form under blog posts

> **Order matters.** This must be DEPLOYED (`./deploy.sh`) before the web
> app deploy and before the app build with the newsletter switch ships —
> nobody may sign up while the policy still says "we send no newsletters".
> The form itself only works once api prompt `2026-09-19/002-newsletter-opt-in.md`
> is live (it posts to `https://api.daili.app/newsletter/subscribe`).

## Goal

daili gets a monthly newsletter, **opt-in only** (Ammar, 2026-09-19). Two
website changes:

1. The privacy policy today says, in every language: *"We send no
   newsletters and no marketing e-mails."* That becomes untrue. Replace it
   with an honest, short **Newsletter (optional)** paragraph, in all 28
   policy files, and bump the "Last updated" date.
2. Every blog post gets a small newsletter form at the end, so readers
   without the app can subscribe (double opt-in: Brevo sends a confirm
   email; the api handles everything).

Done = `npm run build` passes (all four guards), the policy is updated in
every locale, and a blog post shows a working form that posts to the api.

## Scope

- **In:** `legal/privacy.*.html` (27 files) + `legal/datenschutz.de.html`;
  `templates/blogpost.html`; `static/assets/style.css` (form styles);
  `static/.htaccess` (CSP `form-action`); `changelog`/What's-new only if the
  site's own rules require it for a policy change (say what you did).
- **Out:** `content/*.json` (the blog is English-only and its template
  already carries English inline text like "Frequently asked questions" —
  keep the form English and inline the same way), terms/impressum, the home
  page, `build.mjs`, `tools/`.

## Requirements

### 1. Privacy policy (all 28 files)

a. In section 4, replace the **E-mails** paragraph's last sentence ("We send
   no newsletters and no marketing e-mails.") — keep the account-mail
   sentence as it is.
b. Add, right after that paragraph, a new paragraph with this meaning
   (English is the binding version; German is authoritative too — write
   both carefully; the other 26 are faithful translations in each file's
   existing style and terminology):

   **Newsletter (optional).** Only if you switch it on (in the app, the web
   app, when you sign up, or with the form on our blog) do we send you a
   newsletter — about one e-mail a month with new features and tips. We
   store your e-mail address, your language, where you signed up and the
   date you agreed, as proof of your consent. The newsletter is sent through
   Brevo (Sendinblue SAS, France, EU), which processes this data on our
   behalf. If you sign up with the blog form or haven't confirmed your
   e-mail address yet, Brevo first sends a confirmation e-mail; nothing else
   is sent until you click it. Newsletter e-mails contain **no tracking
   pixels and no tracked links**. You can unsubscribe at any time — with the
   link in every newsletter, the switch in the app or web app, or by writing
   to us; you are then removed from the list. Deleting your account also
   deletes you from the newsletter. Legal basis: your consent (Art. 6(1)(a)
   GDPR), which you can withdraw at any time without affecting earlier
   sending.

c. In section 2 (**This website**) add one sentence: the blog's newsletter
   form sends the e-mail address you type directly to our own server
   (api.daili.app) and nothing else; see "Newsletter" below. The "no
   cookies / no analytics / no third-party scripts" claims stay true — do
   not add any.
d. "Last updated" → 19 September 2026 (`datetime="2026-09-19"`), in every
   file, in each file's own date format.
e. Headings and numbering stay as they are (the newsletter is a paragraph
   inside section 4, not a new section) so nothing else shifts.

### 2. Blog form

a. In `templates/blogpost.html`, after the `post-cta` aside, add a
   `<section class="post-newsletter">`:
   - h2: "Get one short email a month"
   - p: "What's new in daili and one tip for your family's week. No ads, no
     tracking. You'll get an email to confirm."
   - `<form method="post" action="https://api.daili.app/newsletter/subscribe">`
     with: a labelled `<input type="email" name="email" required
     autocomplete="email">` (visible label "Your email"), hidden
     `<input type="hidden" name="lang" value="en">`, a honeypot
     `<input name="website">` that is hidden from people and screen readers
     (visually hidden container, `tabindex="-1"`, `autocomplete="off"`,
     `aria-hidden="true"` on its wrapper) — **not** `type="hidden"`, bots
     skip those — and a submit button "Subscribe".
   - small print: "Unsubscribe any time. " + link "Privacy policy" to the
     English privacy page (use the same URL helper/path the site already uses
     for legal links).
   - **No JavaScript.** It is a plain form POST; the api answers with its
     own confirmation page. (The CSP hash machinery stays untouched.)
b. Styles in `style.css`: match the existing `post-cta` card look, input +
   button on one row on wide screens, stacked on phones, visible focus ring,
   works in dark mode if the site has one. The honeypot class must hide the
   field without `display:none` on the input itself being the only guard
   (a visually-hidden pattern on the wrapper is fine).
c. CSP in `static/.htaccess`: change `form-action 'none'` to
   `form-action https://api.daili.app`. Change nothing else in the header.

## Constraints

- `npm run build` green: check-content → build → check-build →
  test-detector. Self-correct up to 2 tries.
- No new JS, no third-party requests, no cookies — the policy's promises
  must stay literally true.
- Keep "daili" lowercase in display text except where the file already
  follows a different rule for legal pages (these pages currently say
  "Daili" in sentences — keep each file's existing usage).

## Verify

- `npm run build`
- `grep -L "2026-09-19" legal/privacy.*.html legal/datenschutz.de.html` →
  prints nothing (every file updated).
- `grep -l "no newsletters\|keine Newsletter\|Newsletter oder Werbe" legal/*`
  → only files where the NEW text legitimately uses the word; the old
  "we send no newsletters" meaning is gone in every locale (check by eye in
  en/de + 2 others and say which).
- `npm run serve`, open a blog post: form visible, honeypot invisible, tab
  order email → Subscribe → Privacy link, phone width stacks.

## Commit & push

- `feat(newsletter): privacy policy newsletter section (28 locales) + blog sign-up form`
  — body `Prompt: claude-prompts/2026-09-19/001-newsletter-privacy-and-blog-form.md`.
- **Push now** (the website repo has no auto-deploy; `./deploy.sh` is manual).

## Report

`claude-reports/2026-09-19/001-newsletter-privacy-and-blog-form.md`: the
final English + German paragraph text, any translation you were unsure
about (locale + phrase), the CSP line before/after, SHA. Open item for
Ammar: `./deploy.sh` — **before** the web deploy and the app release.
