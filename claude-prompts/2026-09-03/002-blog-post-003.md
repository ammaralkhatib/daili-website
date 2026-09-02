# Publish blog post 3 — The Family Document Checklist

Follow **`claude-prompts/BLOG-POST-TEMPLATE.md`**. Draft:
`claude/blog-drafts/003-family-document-checklist.md`.
Slug `family-document-checklist` · cluster `documents` · published 2026-09-04.

## Specific to this post
1. **It has to print.** This is a linkable asset — people print and share
   checklists. Add `@media print` rules to `style.css`: hide nav, footer, hero
   image, language picker and CTA; keep the 27 numbered items; put a `☐` glyph
   before each. Test with the browser's print preview, not by eye.
2. **Items 1–27 are a real `<ol>`** with the document name in `<strong>`. Not a
   table — this page must read on a phone and print on paper.
3. **Two internal links are live**: post 1 (in "How to use this list") and post 2
   (the three-tier section). The babysitter link is ⏳ — leave it out.
4. One external link, `rel="noopener"`: the BBK "Dokumente sichern" page.
5. **Consider `ItemList` JSON-LD** as a third schema block alongside Article and
   FAQPage. This is literally a list of 27 named things, so the markup is honest
   here — it would be decorative on any other post. Your call; say which you did
   and why in the report.
