# 015 — Help center in Japanese, Korean, Chinese (Simplified)

Status: done · all 3 languages · `HELP_LOCALES = [..., 'bg', 'ja', 'ko', 'zh-Hans']` · `npm run build` green (1806 pages; ja/ko/zh-Hans.json each have 64 articles, 9 tips, 6 checklist rows) · pushed, not deployed

## Per language
| | ja | ko | zh-Hans |
|---|---|---|---|
| Done | yes | yes | yes |
| Build | green after 1 fix (a keyword list had 13 entries) | green on the first try | green on the first try |
| Register | です/ます, "〜をタップします" | 해요체, "〜을/를 누르세요" | 你, "点〜" |
| Plural forms in `_ui.json` | other | other | other |

Labels come from the ARB at the live tag `v1.6.0+11`. I mapped each English bold label to its ARB key first (ARB `zh` for zh-Hans). Then a script checked **every** bold label in the 192 files against that language's ARB. The only labels it didn't find are listed below, plus the bold sentence lead-ins in notifications-help and vault-where. Those are sentences, not labels.
- The example family names follow each locale's screenshot: 佐藤家, 김가네, 李家.
- Alt text still says Marco and Lena, because the pictures are still the English ones (prompt 017 covers the pictures).
- All bodies are well under the character caps. The longest ja file is about 2 KB.

**Spot check (all three):** account-password, calendar-reminders, habits-streaks, lists-due-reminders, start-join. I re-read each one against the label table and the ARB. None has a mismatch, apart from the placeholder labels below.

## Labels the ARB didn't have (and what I wrote)
- **Hold to leave** (wall board): left in English, as in the other languages.
- For labels with a placeholder, I used the ARB text without the variable part:
  - ja: **参加**, **当日に通知する**, **家族のエネルギー**, **6件を追加**, and "子どもの名前のあとに**の分をあなたがチェックします**"
  - ko: **들어가기**, **당일에 알려 주기**, **가족 에너지**, **6개 넣기**, and "아이 이름과 함께 **님 대신 체크해요**"
  - zh-Hans: **加入**, **当天提醒我**, **家庭能量**, **添加6项**
  - zh-Hans "You tick for": `你替 {name} 打勾` has the name in the middle, so I wrote it as a quote without bold: “你替某某打勾”，“某某”就是孩子的名字.
- For the phone's own menus I wrote these from memory, so they're **not verified** on a device:
  - iPhone: ja **編集 → ウィジェットを追加**, ko **편집 → 위젯 추가**, zh **编辑 → 添加小组件**.
  - Android: ja **ウィジェット**, ko **위젯**, zh **小部件** (the name differs between phone makers).
  - Focus / Do Not Disturb: 集中モード + おやすみモード, 집중 모드 + 방해금지 모드, 专注模式 + 勿扰模式.
  - Worth a native check.

## ARB notes (not English issues; worth a look in the app)
- **The Agenda view is "list"** in all three (ja リスト, ko 목록, zh 列表). The articles say that.
- **zh uses different words to edit and delete a series**: 只改这一次 vs 只删这一次. edit-delete and repeating name both.
- **zh 文件** means both Documents (the tile) and File (the add option).
- zh has two meanings for 相册: "From camera roll" = 从相册选择, and an album is also 相册. vault-photos reads a bit oddly because of this.
- ja `familyOwnershipSectionHeader` = オーナー, the same word as the Owner role.
- ja `newsletterSettingsGroup` = メール, but `fieldEmail` = メールアドレス.
- ko uses one word, 알림, for Reminder, Reminders and Notifications.
- ko: the Groceries preset and Shopping are both 장보기.
- ko `settingsSectionAbout` = "Daili 정보". "Rate Daili" has a capital D in every language, English included.

## English issues
None new. The two from 009 still apply:
- `lists-categories`: the note is about deleting a category, but no step says how.
- `anywhere-wall`: the board is in English only for these readers.

## SHAs
- `caca9b7` docs(plan): prompt
- `3352cb2` feat(help): Japanese (ja)
- `121defe` feat(help): Korean (ko)
- `fc36331` feat(help): Chinese (Simplified) (zh-Hans)

Help impact: none
