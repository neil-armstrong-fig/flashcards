# AGENTS.md: spaced-repetition

The scheduling domain: when a card comes back, what is due today, which card is next. Plain TypeScript functions over plain
data: no React, no Redux, no DOM, no storage, and **no clock**. Every function that needs the time is handed a `Date`, so every
rule is testable by calling it. It may not import the page, the store or the `content` package (lint enforces it). `docs/scheduling.md` has
the decisions and their sources: read it before changing what a rule means.

```
card/        CardPhase (the four phases), NewCardState, IsStruggling (derived from lapses and the log, never stored), fading/ShouldFadeAids (when to offer taking a note or picture off a card), ReadCardState (validates stored data), setting-aside/ (SuspendCard, UnsuspendCard, BuryCard, MarkHard), types/ (CardState, StudyCard)
scheduling/  ReviewCard, PreviewIntervals (the two functions over ts-fsrs), ReadReviewLogEntry, free-spaced-repetition-scheduler/ (the library instance, grades, and the conversions to and from its card), types/
day/         the study day: DayRolloverHour, StudyDayKey, StudyDayEnd
queue/       NextCard (what to show now), due/ (CardsDueToday the day's workload, CardsAhead, DueCountsOf that workload split by kind), done-today/ (ReviewsDone, NewCardsIntroduced, CardsReviewedToday: what the log says the day has used), siblings/ (NoteIdOfCard, HeldBackCards), timing/, types/
```

## Conventions particular to here

- **`reviewCard` and `previewIntervals` wrap `ts-fsrs` so the library can be swapped.** Only `scheduling/` imports it (those two and
  `free-spaced-repetition-scheduler/`). Nothing else may, and nothing else may name one of its types. They are functions, not a class: the caller passes the
  learner's `desiredRetention` each time and `free-spaced-repetition-scheduler/FreeSpacedRepetitionSchedulerFor` makes the library instance for the call.
- **State is plain data with ISO timestamps** (`CardState`), so it can be stored and read back without a `Date` or a class. The
  library's `Card` exists only inside `scheduling/free-spaced-repetition-scheduler/`.
- **A stored value is `unknown` until a `read…` function has checked it.** Add every new stored field to its reader and its
  test.
- **Limits are per deck and the queue takes one deck at a time:** the caller passes only that deck's cards and log. `newCardsPerDay` caps new cards, `maxReviewsPerDay` caps reviews (soonest due first, less those already done today, `queue/ReviewsDone`); cards being learned are never capped.
- **Order is learning, then reviews, then new cards.** A learning card whose wait is over comes first. When nothing else is
  left, a learning card within `learnAheadMinutes` is shown early rather than ending the session with it waiting. A review is
  due if it falls before the end of the study day, not before the minute.
- **Struggling is derived, not stored.** A card struggles when its lapses reach the learner's threshold and its last three answers are not all good or easy (`card/IsStruggling`). A card that keeps lapsing is a "leech"; the clearing rule is ours.
- **Siblings are held back, not stored.** A card whose other card of the same word was answered today is skipped by `nextCard`
  unless nothing else is left (`queue/siblings/HeldBackCards`, derived from the log). A card id is `<note id>/<direction>`.
- **A suspended or buried card is not available** (`queue/timing/IsAvailable`), so it is never due and never uses the new-card
  allowance. The flags are on `CardState` but the library knows nothing of them: `toCardState` keeps them from the previous state.
- **The study day rolls over at 4am local time**, so studying a little past midnight counts for the same day.
- **A rule is a function of its inputs.** Do not read `Date.now()` or keep module state. Fuzz is off (a decision, `docs/scheduling.md`).
- Behaviour here is inspired by Anki: credit the idea in `REFERENCES.md` and record the decision in `docs/scheduling.md` when it is added.

## Testing

Every rule has a test beside it, one `it(...)` per behaviour, no wrapper `describe`. Build cards with `newCardState` and
override one field; construct the position you need rather than searching for a route to it. The ts-fsrs tests assert shape and
direction (a good answer to a new card is learning, due in ten minutes), not the library's internal numbers, which change
between its releases.
