---
post: 27 of 27
cluster: E — mixed-device / calendar mechanics
status: draft, ready for review
word_count: ~1,410

slug: shared-calendar-wrong-time
cluster_id: devices
title: "Why Your Shared Calendar Shows the Wrong Time"
description: "An event lands an hour out, or on the wrong day entirely. The four causes — time zones, all-day events, daylight saving and subscribed feeds — and how to tell them apart."
h1: "Why Your Shared Calendar Shows the Wrong Time"
published: "2026-09-28"
updated: "2026-09-28"
body: shared-calendar-wrong-time.en.html
image: /assets/img/blog/shared-calendar-wrong-time.webp
imageAlt: "A row of round wall clocks along a dark wall, each showing a different time"
hero_source: https://www.pexels.com/photo/row-of-clocks-5158027/
---

# Why Your Shared Calendar Shows the Wrong Time

Somebody adds an event at three o'clock. It appears on your phone at two. Or it
appears on the right day for you and the day before for them. Or it was fine for
six months and then one Sunday in October everything moved.

These look like the same bug and they are four different problems. Once you can
tell them apart, each one is easy to fix.

## The four causes

**Time zones.** Somebody entered the event while their device was in a different
zone, or one person's device is set to the wrong zone.

**All-day events.** These behave differently from timed events, and the
difference is what makes things land on the wrong *day*.

**Daylight saving.** Clocks change, and events created before the change can
move relative to events created after it.

**Subscribed feeds.** The calendar is not shared at all — it is a copy that
updates on its own schedule.

The symptom tells you which one. A consistent offset of whole hours is a time
zone problem. Something landing a day early or late, usually for someone
abroad, is an all-day event problem. Everything shifting on one specific Sunday
is daylight saving. Something that is simply *missing* rather than wrong is a
feed problem.

## Time zones: the one everybody guesses first

A timed event is stored with a moment in time, not just a clock face. Three
o'clock in Vienna is two o'clock in London, and a calendar showing it correctly
in both places is doing exactly what it should — that is the feature, not the
bug.

It becomes a real problem in two situations.

**Somebody's device is on the wrong zone.** Common after travel, and common on
tablets and laptops that never leave the house but were set up in a hurry.
Check every device before blaming the app.

**An event was created while travelling.** A parent adds "dentist, 9am" from an
airport in another country, and their calendar honestly records nine o'clock
*there*.

**The fix:** check the time zone setting on every device in the household first —
it is the cause far more often than anything in the app. When adding something
while abroad, set the event's time zone explicitly if the app allows it, or
double-check it once you are home.

## All-day events: why things land on the wrong day

This is the one that confuses people most, and it is worth understanding because
it explains a whole category of weirdness.

An all-day event is not "an event from 00:00 to 23:59". It is a different kind
of thing: a date with no time attached. A birthday on 14 May is on 14 May
everywhere on earth, which is correct and useful.

Problems appear when something that should be a date gets stored as a timed
event, or the reverse. A holiday entered as "00:00 on Monday" can display as
late Sunday evening for anyone in a zone behind yours.

**The fix:** anything that is about a *day* rather than a *moment* should be an
all-day event. Birthdays, holidays, school closures, "bins out", anniversaries.
If one of those is behaving oddly across devices, check whether it was created
as a timed event and recreate it as an all-day one.

## Daylight saving: the Sunday everything moved

Twice a year, clocks change — and not on the same date everywhere. Europe and
North America do not switch on the same weekend, so for about two weeks each
spring and autumn the usual offset between them is an hour different from normal.

For events inside one country this rarely matters. For a repeating event
involving two countries — a weekly video call with grandparents abroad — it
matters twice a year, reliably.

**The fix:** there is no setting that removes this; it is how the world works
rather than an app failure. What helps is knowing to expect it. If you have a
recurring cross-border commitment, check it in late March and late October, and
accept that for a fortnight it moves.

## Subscribed feeds: not wrong, just old

The fourth cause is the one most often misdiagnosed, because the symptom is
different: nothing is at the wrong time, something is simply *not there*.

If you added a calendar by pasting a link, you are subscribed to a copy. Your
app refreshes that copy when it decides to, and Google does not publish how
often it refreshes subscribed calendars — people report delays of many hours.
There is no setting to make it instant.

**How to tell:** add an event yourself in the shared calendar. If you cannot —
it is read-only — you are subscribed, not sharing.

**The fix:** if you need changes to appear promptly, you need a genuinely shared
calendar that both people can edit, not a subscription. Feeds are right for
things somebody else publishes, like school terms or fixtures. They are wrong
for your family's own plans.

## The five-minute diagnostic

In order, because the cheap checks come first.

1. **Check the time zone on every device.** Phones, tablets, the laptop, the old
   iPad in the kitchen. One wrong device explains most cases.
2. **Is the offset a whole number of hours, and consistent?** Time zone.
3. **Is it landing a day out rather than hours out?** All-day event.
4. **Did it start on a specific Sunday?** Daylight saving.
5. **Is the event missing rather than wrong, and can you edit it?** If you cannot
   edit it, it is a subscription and it is stale.

## Frequently asked questions

**Should I turn off time zone support in my calendar?**
Usually not. It is doing the right thing, and switching it off tends to trade a
rare problem for a permanent one. The exception is a household that never
travels and repeatedly gets confused — then a fixed setting can be simpler. Most
people are better off fixing the device that is set wrong.

**Why does a birthday sometimes show a day early?**
Almost always because it was created as a timed event rather than an all-day
one. Recreate it as all-day and it will be correct everywhere.

**Why did my weekly call with family abroad move?**
Daylight saving, in the fortnight where two countries have changed clocks on
different weekends. It will correct itself. If the call matters, check it twice a
year rather than assuming.

---

## What daili does with this

Daili stores the kinds of event that are about a day — birthdays, celebrations,
holidays — as dates rather than moments, which is why they do not drift across
devices. Timed events carry their zone.

None of that helps if a device in the house is set to the wrong time zone, which
remains the most common cause by a distance.

[See how the family calendar works →](/)

---

## PUBLISHING NOTES (delete before publishing)

🔴 **No refresh-interval number.** The post says Google does not publish one and
people report many hours — which is all that is supportable. The widely repeated
"12 hours" traces only to a user forum thread title. Do not let it in.

🔴 **No claims about specific apps' internal behaviour** beyond what is
universally true of the iCalendar model (timed events carry a moment; all-day
events are dates). We have not tested each app's handling, and this post is
about concepts and diagnosis rather than any vendor's implementation.

**Internal links, all live:**
- ✅ The subscribed-feeds section →
  `/blog/mixed-iphone-android-family-calendar/`
- ✅ "read-only, you are subscribed" →
  `/blog/share-calendar-with-android-family-member/`
- ✅ "things somebody else publishes, like school terms" →
  `/blog/school-term-dates-family-calendar/` (post 26 — publishes the day
  before; add it)
- ✅ "every event needs an end time" →
  `/blog/shared-family-calendar-rules/` (rule 5)

**No external links** — deliberately. The one thing worth citing (Google's
refresh interval) does not exist as a published figure, and citing a forum
thread would be worse than citing nothing.

**The diagnostic list is the reason this post will rank.** Nobody else turns
"my calendar shows the wrong time" into a five-step triage. Keep it as an
ordered list and keep the cheap checks first.

**Schema:** Article + FAQPage. `HowTo` is defensible for the diagnostic.
