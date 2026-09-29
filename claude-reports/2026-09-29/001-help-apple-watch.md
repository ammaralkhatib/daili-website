# Help: "daili on your Apple Watch"

**Prompt:** `claude-prompts/2026-09-29/001-help-apple-watch.md` · **Status:** done · **Commit:** `0154523` (pushed; prompt `786091c`)

New article `anywhere-watch` in English + all 24 help locales. It covers the four pages, the 3-step set-up, voice add, the complications / Smart Stack and the Note. There is no Siri and no tip, because `skip-keys.json` has no watch key. `since: 1.8.0` (CHANGELOG's latest cut is 1.7.0 and PLAN.md says "Help sync for 1.8.0"). `order: 2`. `media: watch-up-next`, and the body also shows `watch-shopping`. The localized pictures cover all 25 locales, so there are no media gaps. `anywhere-widgets` now links to it in `related:`. The labels come from the app: page titles from the ARB, and the complication names **Next up** / **Quick note** from `DailiWatchWidgets/Localizable.xcstrings`.

**Deviations:**
- The file is `anywhere/watch.md`, not `apple-watch.md`. check-help requires id = `<topic>-<slug>`, and I kept the id `anywhere-watch` from the prompt.
- Undo applies to shopping and to-dos only. Habits have no untick window in `WatchHabitsController`.
- The to-dos page title is **To-dos**, not "My to-dos".
- `watch-todos`, `watch-habits` and `watch-quick-note` are removed from all `help/media*.json`, because an unused media id is an orphan error. Their 75 WebPs stay on disk, uncommitted.
- Apple's own labels (Available Apps, Install, Edit, Complications) are my best guess of iOS wording per language. They are least certain in th and tr.

**Verification:** `npm run build` → help OK · 72 articles · 25 locales; build OK · 2234 pages; detector OK. The article is in every `help/<code>.json`. The web page stays hidden until `LIVE_APP_VERSION` is 1.8.0.

**Owner step:** `./deploy.sh` (website), after bumping `LIVE_APP_VERSION` to 1.8.0 on store day if the page should be visible.
