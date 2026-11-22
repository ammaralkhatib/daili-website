# 001 — Privacy policy: Focus and Move videos and music load from our Hetzner storage

**Result:** done · **Commit:** `b64c2744` docs(legal): Focus and Move videos and music load from our Hetzner storage — pushed to origin/main (29 files: 28 `legal/privacy.*` / `datenschutz.de` + `tools/check-legal.mjs`). `./deploy.sh` was NOT run: Ammar deploys after Planning Claude's review.
**Step 0:** `85fcf4df` docs(plan): sync planning docs (this prompt file), pushed. No commits were held. `static/assets/img/photos/` stayed unstaged.

## Facts and the code that proves them
Read in `../familyplanner-app` at HEAD `db15d0e4` (no uncommitted changes in `lib/features/focus` or `lib/features/workout`).

**1. Where the files come from — confirmed.**
`lib/features/focus/data/focus_clips_client.dart:15-19`: base `https://daili-buddy-clips.fsn1.your-objectstorage.com/`, list `manifest.json`. `lib/features/workout/data/move_clips_client.dart:15-19`: the same bucket, list `workout.json`. Both only ask https on this one host and never follow a redirect (`isBucketUrl`, `followRedirects: false`, Focus :77-84 / Move :77-84).

**2. What the request holds — confirmed.**
- Each client builds its OWN `Dio` (Focus `:77`, Move `:77`), not the API client, with no interceptors. So there is no sign-in token, cookie, account id or family id. Commit `02db0e72` (Move) says the same, and the doc comment at Move `:68-73` too.
- The URL is the base + a file name that must match the list name or a clip/music pattern; no query (`urlFor` / `isBucketUrl`, Focus :93-115, Move :93-117). No user text can be in it.
- Headers the app sets: only `Accept` — `application/json` for the list (Focus `:137`, Move `:139`), `video/mp4` for a clip (Focus `:187`), `video/mp4` or `audio/*` (Move `:191`). Dio 5.11.1 adds no `content-type` on a GET without data (`options.dart` `_defaultContentType` is null). dart:io's HttpClient also sends its own defaults: `Host`, `Accept-Encoding: gzip` and `User-Agent: Dart/<version> (dart:io)` — these are dart:io standard behaviour, I did not read them in source. None of them names the person or the phone model.
- The phone's IP address reaches Hetzner, like any download.

**3. What stays on the phone — confirmed (with one detail).**
- Videos and music: kept in `focus_clips/` and `move_clips/` under the server cache root — iOS `Library/Caches` (not in the iCloud backup), Android support folder (backup rules carry `app_flutter/vault/` only); kept on sign-out (`focus_clip_store.dart:24-33`, `move_clip_store.dart:25-34`). Old files are removed: Focus keeps the current buddy + the one before (`focus_clip_store.dart:20-21`), Move removes files not in the list and clips of routines not opened for 60 days (`move_clips_controller.dart:211-256`).
- The list files: the last good list is kept in SharedPreferences (`focus_store.dart:135`, `move_clip_store.dart:215-233`). SharedPreferences can be in the iOS backup, so the text says only "it also keeps the latest list of files" — NOT "outside the backup" for the lists.
- Move progress: `move_store.dart:12-22` — one file `vault/u<userId>/move.json`, "It never touches the network", in the phone's own backup. Fields: finished routines (sessions), week goal + older goals, sounds (`move_data.dart:25, 60, 233, 308-313`); app CLAUDE.md §3 "Move" lists level and statistics too. No file outside `lib/features/workout` imports the Move store. The CHANGELOG line is true.

**4. Web / wall screen — the app only.**
`grep -rn "daili-buddy-clips\|your-objectstorage" ../daili-web/src` → no hits. In the app, only the two clients name the bucket. The text speaks of the app only.

**5. When — confirmed, nothing loads earlier.**
- Focus: `focus_screen.dart:272-277` calls `open` / `select` on the timer screen; the controller reads the list and loads the 2 clips of the shown buddy (`focus_clips_controller.dart:173-183`, `_run` from `:211`, list at `:348`). No buddy or Reduce motion → nothing is asked (`:225`). Back online → it loads what is missing, but only after the screen was opened (`:161-166`). A started download goes on after the screen closes.
- Move: `move_screen.dart:67` → `openMoveScreen` reads the list only, "Never downloads" (`move_clips_controller.dart:211-227`). A routine's start screen (`move_routine_screen.dart:85`) → `openRoutine` loads its clips, music and "Show me how" demos: on Wi-Fi by itself, on mobile data it asks first (once per routine) (`:269-306`, `:314-331`).
- No call at app start: the controllers' `build()` do no network (Focus `:160-169`, Move `:176-187`); the only other users only watch the state (`move_audio.dart:266`).

## New text — English (`legal/privacy.en.html`)

`#focus-move-media`, new, right after `#notes-files`:
> **Focus and Move videos and music.** The buddy videos in Focus and the videos and music in Move are not part of the app: the app downloads them from our public storage space at Hetzner Online GmbH in Germany, and only when you use these features. Focus loads the list of its videos and the two videos of the buddy it shows when you open Focus or pick another buddy; Move loads its list when you open Move, and the videos and music of a routine when you open that routine (on mobile data, the app asks you first). These downloads carry no account data — no sign-in, no name, no family and nothing you wrote. Like any download, they show Hetzner your phone's IP address. The app keeps the downloaded videos and music on your phone, outside your phone's backup, so they don't need to load again, and removes the ones it no longer needs; it also keeps the latest list of files. What you do in Move — your finished routines, statistics, week goal, level and sound settings — is saved only on your phone, in a file that is part of your phone's own backup (iCloud or Google) if you use one, and never goes to our server. Legal basis: performance of the contract with you (Art. 6(1)(b) GDPR).

Service providers: "…Hetzner Online GmbH (Germany), which stores note files in Daili cloud, server backups and the videos and music of Focus and Move; …"
Where data is processed: "Note files in Daili cloud, server backups and the videos and music of Focus and Move are stored by Hetzner Online GmbH in Germany."
Backup paragraph: unchanged.

## New text — German (`legal/datenschutz.de.html`, binding)

> **Videos und Musik in Fokus und Bewegung.** Die Kumpel-Videos in Fokus sowie die Videos und die Musik in Bewegung sind nicht Teil der App: Die App lädt sie aus unserem öffentlichen Speicher bei der Hetzner Online GmbH in Deutschland, und zwar nur, wenn du diese Funktionen nutzt. Fokus lädt die Liste seiner Videos und die zwei Videos des Kumpels, der gerade zu sehen ist, wenn du Fokus öffnest oder einen anderen Kumpel wählst; Bewegung lädt seine Liste, wenn du Bewegung öffnest, und die Videos und die Musik einer Übungsrunde, wenn du diese Übungsrunde öffnest (über mobile Daten fragt die App dich vorher). Diese Downloads enthalten keine Kontodaten — keine Anmeldung, keinen Namen, keine Familie und nichts, was du geschrieben hast. Wie bei jedem Download sieht Hetzner dabei die IP-Adresse deines Handys. Die App behält die geladenen Videos und die Musik auf deinem Handy, außerhalb des Backups deines Handys, damit sie nicht erneut geladen werden müssen, und entfernt die, die sie nicht mehr braucht; außerdem behält sie die jeweils neueste Liste der Dateien. Was du in Bewegung machst — deine abgeschlossenen Übungsrunden, Statistiken, dein Wochenziel, deine Stufe und deine Ton-Einstellungen —, wird nur auf deinem Handy gespeichert, in einer Datei, die zum eigenen Backup deines Handys gehört (iCloud oder Google), wenn du eines nutzt, und geht nie an unseren Server. Rechtsgrundlage: Erfüllung des Vertrags mit dir (Art. 6 Abs. 1 lit. b DSGVO).

Dienstleister: "…die Hetzner Online GmbH (Deutschland), die Notiz-Dateien in der Daili Cloud, die Sicherungen des Servers sowie die Videos und die Musik von Fokus und Bewegung speichert; …"
Verarbeitungsort: "Notiz-Dateien in der Daili Cloud, die Sicherungen des Servers sowie die Videos und die Musik von Fokus und Bewegung speichert die Hetzner Online GmbH in Deutschland."
Feature names, "Kumpel", "Übungsrunde" and "Stufe" are the app's own words (`app_de.arb` `focusTitle`, `moveTitle`, `focusBuddy*`, `moveRoutines`, `moveLevel`).

## Facts I could not confirm
None of the written facts. Left out on purpose:
- "outside the backup" for the kept list files (SharedPreferences can be in the iOS backup).
- The exact dart:io default headers are standard behaviour, not read in source (only in this report, not in the policy).
- Not in this prompt, so left alone: the opt-in usage counts `focus.*` / `workout.*` (key names only) are covered by the general `#help-improve` paragraph, which does not name Focus or Move.

## Locales
All 26 others translated from the English by 4 sub-agents (model Opus 5.5); I waited for all 4 before the commit. A first agent got an incomplete brief by mistake; I stopped it at once, and `git status` showed it had touched no file. Checked on disk for all 28 pages: `id="focus-move-media"` once, `datetime="2026-11-22"` once, the new `<p id="focus-move-media"><strong>…</p>` complete and right after `#notes-files`, diff 4 added / 3 removed lines in 4 hunks (the same as English). App names used: the app's `focusTitle` / `moveTitle` per language. ar, hi and ru have no app translation:
- ar: التركيز / الحركة (translated, like the page's "Cycle" = الدورة).
- ru: Фокус / Движение (translated, like "Цикл").
- hi: फ़ोकस / मूव (written as they sound, like "Daili क्लाउड"; the agent says "व्यायाम" would be the translated choice for Move).
A native check of ar and hi is worth it.

## Guard and build
- `tools/check-legal.mjs`: new `FOCUS_MOVE_MUST_CONTAIN` (privacy: `id="focus-move-media"`, terms: none) + `FOCUS_MOVE_WHY` + its loop, the same shape as the two-way block.
- The guard fails without the id: I ran `node tools/check-legal.mjs` while the locales were still being translated → exit 1, e.g. `legal/privacy.sk.html does not contain id="focus-move-media" — Focus and Move videos and music from our Hetzner storage are in every locale …`.
- `npm run build`: passes — `legal OK · 2 document(s) × 28 locale(s)`, `build OK · 3759 pages`. `npm test`: passes (exit 0).

## Changelog
No line: the prompt allows changes only to `legal/**` and `tools/check-legal.mjs`.

## Open items for Ammar
- Planning Claude reviews EN + DE, then Ammar runs `./deploy.sh`.

## Help impact
none
