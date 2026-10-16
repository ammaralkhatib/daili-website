# Feature row + feature pages — English source copy (2026-10-16)

Shared source for prompts `005` (row), `006` and `007` (pages). Planning
Claude wrote it from the approved prototype
(https://claude.ai/artifact/MG2cAfcQxsRJHk5i6gau3t, Ammar approved 2026-10-16).

🔴 **Every sentence must be true in the app as it ships with 1.11.0.**
Before you use a line, check it against the help articles (`help/en/**`),
`../familyplanner-app/CHANGELOG.md` and, if unclear, the app code. If a claim
is not true, rewrite it to what is true or drop it, and list it in your
report. Never invent a feature. Never write "free", a price, or "Plus"
(the free-forever promise is in-app only, CLAUDE.md §3 Monetization).
English is British, as on the rest of the site (colour, favourites).
Feature names = the app's own words (`dashboardTile*` in the ARB files).

Order of the row (13): calendar, lists, todos, budget (new), cycle (new),
habits, notes, recipes, meal-plan, birthdays, weather, documents, family.
Slug = the URL part: `/features/<slug>/` (English slug in every language).

## Cards (h3 · p · floating card t / s)

The six existing cards keep their current words (`home.day.cards`).
New cards:

| slug | h3 | p | t | s |
|---|---|---|---|---|
| calendar | Calendar | One shared calendar for the whole family, every person in their own colour. | Piano lesson | Today, 16:30 · Emma |
| todos | To-dos | Chores and errands with a name on them, so nothing falls between two people. | Take out the bins | Noah · Tomorrow, 08:00 |
| budget | Budget | See what is left this month, where the money went, and who owes whom. | {amount} left per day (24, in the currency the locale's screenshot shows) | Groceries · 9 days to go |
| cycle | Cycle | A private period tracker that stays on your phone. | the app's own "next period" wording for a range of days | Only you can see this |
| weather | Weather | Today's weather on your Home screen, so you know if the kids need a jacket. | Rain from 3 pm | Take an umbrella |
| documents | Documents & photos | A private vault for passports and important papers, only on your phone. | Passport Lena.pdf | Stays on this phone |
| family | Family | Invite everyone with a code, a link or a QR code, and add the kids who don't have a phone yet. | Noah joined The Bergers | Just now |

## Pages (lead · benefits [title — text] · FAQ)

**calendar** — lead: Everyone sees what is coming up, and everyone can add to it. Repeating events, reminders, and your Google or phone calendar right next to the family plan.
- Repeats the way life does — Weekly piano, every second Friday, the last day of the month.
- Reminders for the right people — Assign an event and only those people get the reminder.
- Your other calendars too — Show your Google or phone calendar inside Daili.

**lists** — lead: Shopping lists the whole family fills in, sorted into categories, with the things you buy often one tap away.
- Sorted like the shop — Items fall into categories, so you walk the shop once.
- Private lists too — Keep a list just for yourself, in the same app.
- Straight from a recipe — Send a recipe's ingredients to the list in one tap.

**todos** — lead: Give a task to one person or to several, add a reminder, and see what is done.
- Give it to anyone — One person, a few, or a child without their own phone.
- A nudge at the right time — A reminder on the day, or before it.
- Private to-dos — Some tasks are only yours to see.

**budget** — lead: A family budget that stays simple. Set a limit, add an expense in a few taps, and always know what is left.
- What is left, at a glance — Per day and per category, and how this month compares with the last.
- Every repeating bill on one screen — Rent, subscriptions, salary. Stop one in a single tap.
- Split shared costs — Daili works out who owes whom, and you settle up in the app.
- You choose who sees it — The whole family, a few people, or only you.
- FAQ: Do I connect my bank? — No. You add expenses yourself, so your bank details never leave your bank.
- FAQ: Can I use it without internet? — Yes. You see your budget offline, and an expense you add is sent when you are back online.

**cycle** — lead: Track your cycle without sharing it with anyone. Nobody in the family can see it, or see that you use it.
- Stays on your phone — Your cycle data is never sent to Daili's servers.
- Honest predictions — Daili shows a range of days, not one exact date.
- Discreet reminders — The lock screen just says you have a reminder, unless you choose otherwise.
- FAQ: Is this a medical app? — No. It helps you keep track. It does not give medical or contraception advice.
(Respect CLAUDE.md §3 Cycle tracker: no fertile window, no "safe days", no medical terms.)

**habits** — lead: Build habits as a family. Every tick fills Minzi's energy, and when it is full, Minzi goes on a trip.
- Together or alone — Habits for everyone, for a few, or just for you.
- Streaks that count — See how many days in a row you kept it up.
- A gentle reminder — At the time of day that fits the habit.
(Minzi rule: she only does what a real cat does.)

**notes** — lead: Write it down in two seconds, then keep it to yourself or share it with the family.
- Fast to write — A title and a note, nothing in the way.
- Private or shared — You decide for every single note.
- Find it again — Pin the important ones and sort them with tags.

**recipes** — lead: All your family recipes in one place, ready for the meal plan and the shopping list.
- Import a recipe — From a video link or a photo of a cookbook page.
- Ingredients to the list — One tap and they are on the shopping list.
- (third benefit only if true in 1.11.0: your own recipe tags)

**meal-plan** — lead: Breakfast, lunch and dinner for the week, filled from your recipes or just typed in.
- The whole week — See every meal at a glance.
- From your recipes — Pick a saved recipe for any day.
- Shopping done — Send what you need to the list.

**birthdays** — lead: Never miss a birthday again. Daili counts down and reminds you early enough to plan.
- Every birthday in one place — Family, friends, grandparents.
- A reminder in time — Early enough to get the gift.
- Import from contacts — Add the birthdays you already have.

**weather** — lead: The day's weather right where you plan the day, in °C or °F.
- Right on Home — No second app to open.
- (second benefit only if true: what else the weather card shows)

**documents** — lead: Keep important papers and photos close, without uploading them anywhere.
- On your phone only — Files never go to Daili's servers.
- Sorted in folders — Find the insurance card in seconds.
- In your phone's backup — Your files come back with your phone's own backup.

**family** — lead: Bring the whole family in, give everyone a colour, and add the kids who do not have a phone yet.
- Invite in seconds — A six-digit code, a link or a QR code.
- A colour for everyone — See at a glance whose event it is.
- More than one group — Your family, the grandparents, the football team.
