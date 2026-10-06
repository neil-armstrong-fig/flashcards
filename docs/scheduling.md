# Scheduling decisions

Why `webapp/src/spaced-repetition/` and the review loop behave as they do. Read this before changing what a rule means.

## The algorithm

The Free Spaced Repetition Scheduler (FSRS), through `ts-fsrs` 5.4.2, called only from `scheduling/` (`reviewCard`, `previewIntervals`) so the library can be swapped.

- **Desired retention is 0.9 by default**, the library default, and the learner can choose 70 to 97 percent in the settings. It is passed
  to `reviewCard` and `previewIntervals` on every call, read from the settings, so a change applies to the next answer. Intervals already given are not recomputed.
- **Fuzz is off, decided.** Fuzz (`enableFuzz`) spreads intervals a little so cards added
  together do not all fall due together. We leave it off: with a deck this small there is little to spread,
  intervals stay exact so a test can assert them, and a learner can predict when a card returns. Revisit when decks are in the
  hundreds of cards.
- **Learning steps are the library's defaults, 1 minute then 10 minutes**, and a lapsed card relearns after 10
  minutes. A new card rated good goes to 10 minutes and graduates on the second good. Rated easy, it graduates at once to a
  review days away. A forgotten review card goes to relearning and its lapse is counted (the count feeds leech detection in
  Phase 3).
- **ts-fsrs's `elapsed_days` is deprecated** (removed in 6.0.0) and recomputed from `last_review`. `ToFreeSpacedRepetitionSchedulerCard` sends 0 only
  because the type still requires the field. The 6.x line is still beta, so we are on the latest stable 5.x.
- Tests assert shape and direction, not the library's numbers, which change between its releases.

## What is due today

- **The study day rolls over at 4am local time**, not midnight, so studying a little past midnight counts for
  the day you think of as today.
- **Order is learning, then reviews, then new cards.** A learning card whose wait is over comes first; reviews, longest
  waiting first; then new cards in deck order.
- **A review is due if it falls before the end of the study day**, not before the current minute: a card scheduled for
  "tomorrow" is available from the start of tomorrow, not from the hour you last saw it.
- **Learn ahead is 20 minutes.** When nothing else is waiting, a learning card due within 20 minutes is shown early rather than
  ending the session with it still waiting.
- **Reviews follow new cards, ten for each.** Each deck's reviews a day are locked to ten times its new cards a day, so the daily work
  stays in balance (a new card comes back for review about ten times in the long run). Unlocking a deck sets them apart; locking again
  puts them back to ten times. Choosing no new cards leaves the reviews as they are, so pausing new words does not pause reviewing.
  Limits kept before the lock existed are unlocked unless they already keep the ratio, so no one's choice changes.
- **New cards are limited to 20 a day.** The count is derived from the review log (answers whose card was new that study day),
  not stored, so there is nothing to keep in step with it.
- "Due today" on the home screen and "remaining" in a session count the same set: learning cards due before the end of the
  day, reviews due, and the new cards the allowance leaves.

## Cards and directions

A word is a note and is studied as two cards, target language to English and English to target language, because reading a
word and producing it are separate skills. A deck lists all its cards one way and then all of them the other, so the two
cards of a word are never adjacent. The new-card allowance counts cards, not words, so twenty a day is ten words learned both
ways.

**Siblings do not come up together.** Once one card of a word has been answered in the study
day, its other card is held back (`queue/HeldBackCards`) and `nextCard` picks from the rest. When nothing else is left to
show, the held-back card is shown anyway, because the siblings are the last cards standing. Held-back cards are still part of
the day's work, so "due today" and "remaining" do not change. Nothing is stored: the held-back set is
derived from the review log, as the new-card count is, so it cannot disagree with it, and it never touches the learner's own
bury. A learning sibling that is minutes away still counts as something else to show, so the held-back card waits behind it.
Being left with only siblings is a sign the learner finds the word hard, which is worth feeding to the Struggling list
(Phase 3, not built).

## Suspending and burying

Both hide a card without answering it. **Burying** hides it until the end of the study day it was buried on, so it returns with
the next one. **Suspending** hides it until the learner brings it back (all at once, from the settings, for now). A hidden
card is never due and does not use up the day's new-card allowance. Neither touches the card's schedule, so unsuspending
picks up where it left off. A card stored before these existed reads as neither (`readCardState`). They are saved before the
card moves on, like an answer.

## Staying current

`study.now` is the moment "due today" is measured against. It moves on when the learner acts, every minute while the app is
open, and when a hidden tab is shown again (a timer in a background tab may not have run for hours). Otherwise a phone left open
overnight would show yesterday's count.

## Saving

**An answer is saved before the card moves on.** First version: the screen advanced immediately and the IndexedDB write
finished in the background. Reloading with no pause after answering ten cards left one still due, every time; with a 500 ms
pause it was kept. A transaction still in flight when the page unloads is not reliably committed, so closing the tab straight
after the last answer lost it. Now `answerCard` and `setCardAside` set `session.saving`, wait for storage, then dispatch, and the
rating buttons are disabled meanwhile so a second tap cannot answer twice. The cost is a few milliseconds of latency, and the
guarantee is that what is on screen is never ahead of what survives a closed tab. A failed save is reported with
`console.error` and the learner carries on in memory.

## Not decided yet

Learning-step and lapse settings, leech threshold, bury and suspend, a custom rollover hour, and the first-answer-of-the-day
edge when a session spans the rollover. They are on `TODO.md` as they come due.
