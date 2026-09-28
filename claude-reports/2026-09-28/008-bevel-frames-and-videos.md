# Report: 008 Bevel home round 2b — Apple device frames + real app clips

Prompt: `claude-prompts/2026-09-28/008-bevel-frames-and-videos.md` · Status: **blocked** (both steps; nothing built, no site files changed)
Commits: `50f3670` docs(prompts): 008 (step 0) and this report. There is **no feature commit** and nothing to deploy.

## Step 2: blocked by the privacy check
I looked at every frame at 1 fps. The four clips cover exactly the four flow steps:

| Clip | Length | Shows |
|---|---|---|
| `18-39-47` | 24.3 s | calendar: new event "Swimming", category, location, event sheet |
| `18-41-59` | 19.7 s | shopping: Groceries list, ticking Milk/Eggs, adding "Mil" |
| `18-42-58` | 15.2 s | to-dos: Household list, ticking laundry, editing "Water the plants" |
| `18-43-49` | 17.5 s | habits: Minzi, "Start a habit", New habit "Read", ticking instrument |

**Stop condition hit:** in `ScreenRecording_09-28-2026 18-43-49_1.mov`, from **~0:06 to ~0:10** (the "New habit → Who is in?" list), a sixth member called **"Sandra"** appears, with an avatar, between Lena and Marco. Sandra is on neither the prompt's demo list nor anywhere in `content/`, the app's `lib/`/`tool/` or `store-shots/`. The prompt says to stop on anything outside the demo family, so I encoded and published no clip.

The other clips have no real names, addresses or notification banners. They do contain **junk test data** that is also not from the demo family. It isn't private, but it would look bad on the home page:
- `18-39-47`: calendar entries "test" and "fddfsf" on Sep 19 (visible ~0:02–0:04 and ~0:20–0:22), and the typed location "City pooö" (~0:15–0:24).
- `18-41-59`: a second shopping list "rerew" (~0:00–0:01, ~0:17), and a "dfsdf" item in the Groceries preview (~0:17–0:19).
- The status bar shows only time/signal/wifi/battery plus the red recording pill. It has no carrier and no notifications.

**Your step:** re-record habits without Sandra (or remove her from the demo family first). Ideally delete the junk entries and re-record calendar and shopping too. Then re-run Step 2. Planned mapping: calendar → `flow-calendar`, shopping → `flow-shopping`, to-dos → `flow-todos`, habits → `flow-habits`. All four are longer than 12 s and would be trimmed. The clips are English UI, which would be fine on every locale for now.

## Step 1: blocked by Apple's licence (same as 007 D1)
The bezel folder still holds only the three DMGs; no PNGs have been exported. `hdiutil imageinfo` reports `Software License Agreement: true`, so even `hdiutil attach -readonly -nobrowse` stops at Apple's Design Resources licence. Accepting it is your decision, not an agent's. Neither prompt 008 nor the folder says that you have accepted it. Also, as noted in 007, that licence text excludes use for "website content". I did not mount anything. There are no bezel files or FRAMES numbers to report, and the D2 CSS frames stay live.

**Your step if you want D1:** accept the licence yourself and confirm that website use is permitted. Then either export the PNGs into the folder or state in the next prompt that the licence is cleared. After that, Step 1 can run as written.

## Checks
No build was run: no template, CSS, JS, config or asset changed (`git status` shows only the untouched pre-existing files). The temporary frames in `/tmp/rec/` have been deleted.

## Owner step
None to deploy. To unblock: clean recordings (Step 2) and a licence decision (Step 1).
