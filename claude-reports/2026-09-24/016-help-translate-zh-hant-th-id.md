# 016 — Help center in Chinese (Traditional), Thai, Indonesian

Status: done · all 3 languages · `HELP_LOCALES = [..., 'zh-Hans', 'zh-Hant', 'th', 'id']` · `npm run build` green (2034 pages; zh-Hant/th/id.json each have 64 articles, 9 tips, 6 checklist rows) · pushed, not deployed

## Per language
| | zh-Hant | th | id |
|---|---|---|---|
| Done | yes | yes | yes |
| Build | green on the first try | green on the first try | green on the first try |
| Register | 你, 「點〜」, Taiwan words (行事曆, 行程, 帳號, 首頁) | คุณ, "แตะ …" | **Anda**, "ketuk …" (see below) |
| Plural forms in `_ui.json` | other | other | other |
| Example family | 陳家 | ครอบครัวศรีสุข | Keluarga Wijaya |

Labels come from the ARB at the live tag `v1.6.0+11` (`app_zh_Hant`, `app_th`, `app_id`). I mapped each English bold label to its ARB key first. Then a script checked **every** bold label in the 192 files (about 500 per language) against that language's ARB. The only labels it didn't find are listed below, plus the bold sentence lead-ins in notifications-help and vault-where, which are sentences, not labels. zh-Hant was written from `app_zh_Hant.arb`, not converted from zh-Hans (for example 行事曆/行程/帳號/首頁/相片/資料夾, 掃描 QR Code).

**Indonesian register:** the rules say "Indonesian kamu", but they also say to match how the app addresses the user. `app_id.arb` says "Anda" 132 times and "kamu" about 12 times (for example `habitsYouTickFor` = "Kamu mencentang untuk"). I followed the app and used **Anda**. If you want kamu, only the running text changes. The labels stay the same.

Alt text still says Marco and Lena, because the pictures are still the English ones (prompt 017). The "Stretch" habit in the habits-tick alt text is a server template, not in the ARB. I wrote 伸展 / ยืดเหยียด / Peregangan.

**Spot check (all three):** calendar-repeating, lists-due-reminders, habits-create, account-preferences, family-groups. I re-read each one against the label table. Apart from the placeholder labels below, there are no mismatches.

## Labels the ARB didn't have (and what I wrote)
- **Hold to leave** (wall board): left in English, as in the other languages.
- For labels with a placeholder, I used the ARB text without the variable part:
  - zh-Hant: **加入**, **當天提醒我**, **家庭能量**, **新增6項**. "You tick for" is `你替 {name} 打勾`, with the name in the middle, so I wrote it the way zh-Hans did: 「你替某某打勾」 without bold.
  - th: **เข้าร่วม**, **เตือนฉันในวันนั้น**, **พลังงานของครอบครัว**, **เพิ่ม 6 รายการ**, **คุณติ๊กให้**
  - id: **Gabung**, **Ingatkan saya pada hari itu**, **Energi keluarga**, **Tambah 6 barang**, **Kamu mencentang untuk**
- I wrote the phone's own menu names from memory, so they are **not verified** on a device:
  - iPhone widgets: zh-Hant **編輯 → 加入小工具**, th **แก้ไข → เพิ่มวิดเจ็ต**, id **Edit → Tambah Widget**.
  - Android: **小工具**, **วิดเจ็ต**, **Widget**.
  - Focus / Do Not Disturb: 專注模式 + 勿擾模式, โฟกัส + ห้ามรบกวน, Fokus + Jangan Ganggu.
  - Worth a native check.

## ARB notes (not English issues; worth a look in the app)
- zh-Hant: **Agenda is 列表** (same as zh-Hans). Edit and delete of a series use different words: 只改這一次 / 只刪這一次. The articles say both.
- zh-Hant: **紀念日** is Anniversary, but it is also the Celebration heading and "Edit celebration" (編輯紀念日). Only the type chip says 慶祝.
- zh-Hant: Assignee and the Person group-by are both 負責人. System and System default are both 跟隨系統. Children and Kids are both 孩子.
- th: **Note = Save = บันทึก**, so lists-shopping step 3 reads "เพิ่ม **บันทึก** แล้วแตะ **บันทึก**".
- th: **Servings = "จำนวนที่"**, which looks cut off (probably meant จำนวนที่เสิร์ฟ).
- th: The habit Reminder is การแจ้งเตือน, but everywhere else a reminder is การเตือน. Appearance = ธีม. Send reset link = only ส่งลิงก์.
- th: Groceries = ของใช้ในครัว ("kitchen supplies").
- id: Done, Completed and End are all **Selesai**. The Assignee label is "Ditugaskan ke" ("assigned to"). **Add item = "Tambah barang"** (goods) on to-do lists too.
- id: mixed Anda/kamu, see above.

## English issues
None new. The two from 009 still apply:
- `lists-categories`: the note is about deleting a category, but no step says how.
- `anywhere-wall`: the board is in English only for these readers.

Small one: in `calendar-repeating`'s note, "Repeats" isn't bold, but **All day** and **Private event** are. I kept the same.

## SHAs
- `b756ba0` docs(plan): prompt
- `d6b0c8b` feat(help): Chinese (Traditional) (zh-Hant)
- `400583e` feat(help): Thai (th)
- `ba2ff24` feat(help): Indonesian (id)

Help impact: none
