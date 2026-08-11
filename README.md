# How to put this website live (Plesk)

1. In Plesk, open the **daili.app** subscription → create the website/hosting
   for `daili.app` (document root, e.g. `httpdocs`). Add Let's Encrypt SSL
   (same as you did for api.daili.app) and turn on "Redirect HTTP to HTTPS".
2. Upload this whole folder's CONTENTS (not the folder itself) into the document
   root — Plesk File Manager can upload the zip and "Extract Files" there.
3. Delete this README from the server.

## Before going live

- Name, address and dates are already filled in (privacy, Datenschutz, Impressum).
- Only remaining placeholder: when the app is in the stores, replace the two grey
  "Coming soon" badges in `index.html` and `de.html` with real store links.
- When the privacy policy changes, bump the date at the top of both versions.

## Notes

- The site is 100% static: no cookies, no external fonts/scripts — that keeps it
  GDPR-simple (no cookie banner needed) and fast.
- Privacy Policy URL for the stores:  https://daili.app/privacy.html
  (German: https://daili.app/datenschutz.html)
- Support URL for the stores:         https://daili.app/support.html
- The legal texts are a careful draft, not legal advice — please skim the
  wko.at Impressum requirements once (2 minutes) if Daili is run as a business.
