# Website: the header bar takes the page width (same edges as the footer)

## Goal
The floating header pill (`.nav` in `static/assets/style.css`) is only as wide as its content (`width:max-content`)
and sits in the middle. Ammar wants it as wide as the page content, so its left and right edges line up with the
footer's content and the page's `.wrap` on every page.

## Requirements
1. **Desktop only (≥ 861px).** Below that the header already spans the screen (burger layout) — do not change it.
2. **Width = the page's own content width.** The header's outer edges must line up with the left and right
   edges of the `.wrap` content on the SAME page, at every window width:
   - home and feature pages (`home.css`): `.wrap{width:min(1240px,calc(100% - 48px))}`;
   - every other page (`style.css`): `.wrap{max-width:1120px;padding-inline:22px}` → 1076px of content.
   Do it with one shared rule or custom property so the two cannot drift apart again (for example a
   `--page-w` each stylesheet sets once and both `.wrap` and `.nav` read). Do not change any page's content width.
3. **Layout inside the bar:** logo at the left edge; the links, the language picker and the "Download app" button
   together at the right edge. Keep the pill look (radius, blur, border, shadow, height) and the current order of
   the items. Keep the 861–1080px rule working (check what it hides or shrinks; nothing may wrap or overlap).
4. Open menus (language list, download menu) must still open inside the window and line up with their button.
5. The footer and the phone header stay exactly as they are.

## Verify
- `npm run build` passes.
- Headless check on `/` (home), `/features/habits/`, `/help/`, `/wall-display/`, `/blog/`, `/privacy.html` at
  1440, 1280, 1100, 900 and 390px wide: read `getBoundingClientRect()` of `.nav` and of the footer's inner wrap and
  give the left/right numbers in the report (they must match within 1px at ≥ 861px). No sideways scroll anywhere.
  One light and one dark screenshot looked at.
- An RTL page (`/ar/`): logo on the right, the rest on the left, edges still lined up.

## Commit & push
Commit pending docs first. Then `style(site): header bar spans the page width`; body
`Prompt: claude-prompts/2026-11-12/004-header-page-width.md`.
🔴 Do NOT stage `static/assets/img/photos/`. **Push now. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-11-12/004-header-page-width.md` (file-write tool; `wc -c` > 0), short, plain English: the rule
you used, the measured edges per page and width, anything that had to change in the 861–1080px range, build
result, SHA + push. `## Help impact`: none.
