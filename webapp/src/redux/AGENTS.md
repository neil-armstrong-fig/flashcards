# AGENTS.md: redux

Use `useAppSelector` and `useAppDispatch` from `@src/redux/shared/Hooks`, never the untyped `react-redux` hooks. Add state as a slice
via `createSlice`. `src/redux/` may not import `src/react/` or `src/audio/` (lint enforces both): state knows nothing of sound, and `react/audio/` puts the two together.

```
redux/
  Store.ts                             the store
  slices/                              one folder per slice, each a piece of state of its own (below); a slice's own types are in its `types/`
    browse/                              the view of the list of every card (search, deck filter, which row has its similars open), gone when the learner leaves it
    account/                             who is signed in (slice), and thunks to load the account and sign in
    card-notes/                          the learner's own note on a card (slice by card id, kept on the device, up to `MAXIMUM_NOTE_LENGTH`), `selectCurrentCardNote`
    card-pictures/                       the learner's own picture on a card: `storage/` (the effects over its own IndexedDB database), the slice (addresses and dates by card id), thunks to load, add (images only, `MAXIMUM_PICTURE_BYTES`) and remove
    similar/                             the similar words a learner added (slice, kept on the device), and thunks to start asking for one, add and remove it
    deck/                                the cards the learner made (slice of `VocabNote`s, kept on the device), the selectors for every note and card being studied (the deck's own, then theirs), `selectSpokenOnScreen`, and thunks to start making or changing one, add, change and remove it
    settings/                            the learner's settings: slice, limits/ (clamping, reading), storage/ (load and keep)
    study/                               the review loop
      StudySlice.ts                      wiring: which action runs which rule
      selectors/                         the derived questions the page asks: SelectCardsDueToday, SelectDeckDueCounts (one deck's cards waiting today split into new, learning and review, via `spaced-repetition/queue/DueCountsOf`)
      initial-state/InitialStudyState.ts  StudyQueueSettings.ts
      actions/<domain>/thunks/           one file per thunk: session/ (LoadStudy, StartSession, RefreshTime, EndSession), answering/ (ShowAnswer, AnswerCard) and setting-aside/ (SetCardAside, UnsuspendAll); `actions/shared/utils/` holds what several domains use
      queue/                             plain functions the slice calls: NextStudyCard, with study-cards/, focus/ (FocusedCards: narrows a deck's cards to a session's focus: all, new or struggling)
      storage/                           the StudyStorage interface (types/), IndexedDb and in-memory implementations
      types/                             StudyState, SessionState, SessionFocus, StudyStatus, AsideKind
  api/                                 one effect function per API call (`ReadKeptNotes`, `AddKeptSimilar`, ...): not a slice's, since the account, deck and similar thunks all make them
  workflows/<domain>/thunks/           thunks that change several slices at once: `custom-note/` (add, remove), `kept-notes/` (bringing the cards kept online down)
  shared/                              what more than one slice uses, and is not a slice itself (no state of its own); like `react/pages/shared/`
    Hooks.ts  AppThunk.ts              typed hooks, the thunk type
    kept-texts/                    `selectKeptTexts`: the texts whose recordings the learner asked for (their own cards, their similar words), as plain `SpokenText`s that `react/audio/` hands to `audio/`
    memory-aids/                   a card's note and picture together: `selectIsFadeOffered` (derived from their dates and the log, via `spaced-repetition/card/fading/`), thunks to remove them or keep them afresh
    device-storage/                readJson / saveJson over localStorage: checked on the way in, quiet on failure
```

## Conventions

- **A slice's state and reducers import no other slice** (`*Slice.ts`, `initial-state/`, `types/`: lint enforces it). Thunks and selectors
  may read another slice through its selectors; a thunk that changes more than one slice goes in `workflows/`.
- **A slice's folder root holds the slice (and its own test) and nothing else.** Everything else sits in a subfolder named for its
  subject: `selectors/`, `initial-state/`, `limits/`, `ids/`, `storage/`, `types/`, `actions/<domain>/thunks/`.
- **A slice is wiring; what its actions mean lives beneath it.** A reducer says which rule an action runs and on what. The
  rule is a plain function in a folder under the slice (`study/queue/`), with its own test beside it. A helper private to the
  slice file can only be reached by dispatching, which makes its edges hard to test.
- **A thunk goes in `<slice>/actions/<domain>/thunks/`**, one file each, so what is a thunk is plain from the path. A standalone action
  creator (`createAction`, not one from `createSlice`) would go in a sibling `<domain>/actions/`; there are none yet, so the folder
  does not exist. A slice's own actions come from `createSlice` and stay in the slice file. A thunk reads state with `getState` and
  reaches the outside only through effect functions, never `indexedDB`. A helper private to a domain's thunks sits beside `thunks/`
  (`answering/utils/`).
- **A fact that can be worked out is derived where it is shown, never stored.** "Due today" is `selectCardsDueToday`, which
  asks `spaced-repetition/`. "New cards introduced today" is counted from the review log; there is no undo, so the log only ever grows by answers
  allowance back with nothing to keep in step. Storing either would be a second copy of a truth to keep in agreement.
- **The store holds `now`**, set by the actions that move time on (load, start session, answer). Reducers stay pure and
  selectors take no clock. A screen left open across the day rollover does not refresh yet (`TODO.md`).
- **Save before the card moves on.** `answerCard` and `setCardAside` set `session.saving`, wait for storage, then dispatch the
  result. Otherwise a tab closed straight after an answer lost it (reloading with no pause lost the last of ten answers every
  time; `docs/scheduling.md`). A failed save is reported and ignored: the learner carries on.
- **What is read back is untrusted.** `IndexedDbStudyStorage.load` passes every record through `readCardState` and
  `readReviewLogEntry` and drops what fails, rather than trusting it. A new field on a stored shape needs its reader taught
  about it, and a change to a stored shape needs the database version raised with an upgrade step.
- **Shipped decks are content; progress is keyed by card id.** A deck update adds cards without touching progress, so an id
  never changes (`content/AGENTS.md`). Cards never answered are not stored: they are new by default.
- **Small settings are kept on the device**, in `localStorage` through `device-storage/`, under a versioned key
  (`settings/storage/SettingsStorageKey.ts`). `createStore` loads them (each field checked alone, falling back to its own
  default) and `keepSettings` writes them back when they change. Change what a stored field means, or remove one, and the key's
  version rises and the loader learns the old shape; a new field with its own fallback does not. What a number may be lives in `settings/limits/`, and the reducer clamps whatever it is handed.
- **A slice stays ignorant of the others.** `study` does not read `settings`: a thunk reads the settings and passes what the
  study reducers need in the action's payload (`queueSettingsOf`). Make the dependency explicit rather than reaching across.

- **Redux does not speak.** No thunk plays, fetches or keeps a recording: `react/audio/` does, from what is on screen
  (`useCardAudio` speaks whenever the card or its side changes, and guards StrictMode's second effect). The player never throws, and a
  card with no recording is silent.
- **A write that needs recordings first is two thunks with the recordings between.** `startCustomNote` (guards, checks, marks the card as
  being made) then `addCustomNote` (the API, then state); likewise `startEditCustomNote`/`editCustomNote` and
  `startSimilarWord`/`addSimilarWord`; and sync is `startNotesSync` then `syncKeptNote` for each card whose recordings arrived.
  `react/audio/own-words/` and `react/audio/sync/` fetch between them and keep the all-or-nothing rule: a failure there dispatches the
  slice's own failure action, so `adding` never sticks.
- **The settings keep the audio choices** (`voice`, `speed`, `listenOnly`), added without raising the key (`LoadSettings.test.ts` proves
  settings kept before them load unharmed).

- **The API is optional.** `loadAccount` asks who is signed in once on start; if the API cannot be reached the status stays `unknown`, which
  hides what needs it (the account section, the _Add_ box) and nothing else. **A card of the learner's own works the same way** (`startCustomNote` then `addCustomNote`, `startEditCustomNote` then `editCustomNote`, `removeCustomNote`: all need sign-in, each is all-or-nothing, the API is the truth). Its id is `ko-custom-<crypto.randomUUID()>`. **Decks are studied separately**: `deckIdOfCard` says which deck a card is in (a made card joins `ko-starter`), a session has a `deckId`, `deckStudyOf` gives the queue only that deck's cards and answers, and each deck's limits live in `settings.deckLimits`. The shipped decks are `SHIPPED_DECKS` (`content/`). The deck's cards are never in `deck` state: `selectCards` is the deck's own, then both cards of each note made, and the study order is kept in step by `cardsAdded` and `cardsRemoved`. A made card's two cards are kept apart by the queue like any word's (`docs/scheduling.md`). Adding a word needs a signed-in learner; `react/audio/` fetches
  its recordings between the thunks, so a learner is never left with a word they cannot play. Signing in brings the words and cards kept
  online down and fetches recordings this device lacks (`react/audio/sync/`). All of it goes through effect functions
  (`api/`, and `audio/` for recordings), which a test replaces with `testing/environment/`.

## Testing

Unit tests call the actions against a real store, opened by `openedStudyStore()` in `src/testing/`. The browser and the API are in
`testing/environment/` (`testEnvironment`: study storage, pictures, the audio played, recordings, kept audio, the account API), and
`testing/SetupWebappTests.ts` `vi.mock`s every effect module to read and write it, fixes the date, counts ids up from `test-1` and puts a
fake `localStorage` in place; a test sets `testEnvironment` up before opening the store and reads it afterwards. Decisions with a rule in them
(`checkedCardWords`, `setAsideIfStruggling`) are pure functions with tests of their own. Test the observable result (what is on the state, what is in storage), not which reducer ran. Mutate to prove a
test bites (root `AGENTS.md`).
