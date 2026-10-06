# Flash Cards: design

> Living document. Task-level tracking is in `../TODO.md`. Update both when scope changes.

## Goal

A standalone, offline-first PWA for daily language study (30 to 60 minutes a day) that:

- makes card creation easy and gives every card good audio
- has a feedback loop for cards the learner struggles with, so they can attach a picture or a note and remove it later once the
  card gets easy
- keeps the habit with one daily card target (and, later, an evening reminder if it is not met)
- starts with Korean, then Japanese (hiragana, katakana, very basic sentences), then Dutch

Decisions:

- **Standalone app.** No integration with any other flashcard program.
- **Audio:** neural text-to-speech from Azure for every language, generated once by a command-line tool and served privately
  (`docs/audio.md`, `docs/online.md`).
- **Authoring is in-app.** Cards can have an optional picture and a note (a mnemonic) that can be added and removed.
- **Process:** full acceptance-test-driven development (ATDD) in a pnpm workspace, with practices taken from janggi
  (https://github.com/neil-armstrong-fig/janggi, `REFERENCES.md`).
- The app is served from the root of its own (sub)domain on GitHub Pages, so there is no base path.

## Practices in use

- pnpm workspace with a strict dependency catalog (`pnpm-workspace.yaml`): exact pins, a minimum release age, TypeScript pinned at 6.x.
- `shared/config/*`: base `tsconfig`, Prettier (120 columns), ESLint (`restrictedImports` enforces the package boundaries) and Vitest.
- Webapp: Vite, React 19, Redux Toolkit, Tailwind v4, `vite-plugin-pwa` (`injectManifest`, `registerType: "prompt"`), the `@src/*`
  alias, versioned `localStorage` keys, validated loads.
- Acceptance tests: Playwright wrapped in a Given/When/Then mapping (`AcceptanceCriteriaMapping.ts`) over a DSL layer (`*Dsl` with no
  locators, paired with `playwright/*Playwright`). Test ids are a typed contract (`testid-contract.md`). Specs arrange in `beforeEach`
  and assert in `then`, enforced by lint (only `get*`, `is*` and `can*` are allowed inside `then`). Desktop and mobile (Pixel 5) projects.
- CI (`.github/workflows/ci-cd.yml`): checks, then the acceptance suite against the production build, then deploy to Pages, then the same
  suite against the live URL.
- Process docs: root and per-folder `AGENTS.md`, `MANUAL-SETUP-STEPS.md` (everything outside the repo), `docs/` for research notes.

## Architecture

```
flashcards/
  AGENTS.md  REFERENCES.md  MANUAL-SETUP-STEPS.md  TODO.md  docs/
  pnpm-workspace.yaml  .nvmrc  .github/workflows/ci-cd.yml
  shared/            vocabulary the app and the specs both use (Rating, Language...), and config/* for every package
  webapp/            Vite + React + Redux + Tailwind PWA
    src/react/               components, nested by who uses them
    src/redux/               the store: slices, actions, selectors, storage
    src/audio/               recordings: fetching, keeping and playing them; plain functions that know nothing of the store or the page
    src/environment/         what never varies while the page lives (`Runtime`: the API's address, the manifest of recordings)
    src/spaced-repetition/   pure domain logic: FSRS scheduling, what is due today, which card is next
    src/sw/                  the service worker
  content/           the decks, how a note becomes cards, and the manifest of recordings
  api/               Cloudflare Worker: Google sign-in, similar words and notes (D1), recordings (R2), speech (Azure key stays here)
  infra/             the API's Cloudflare resources as code (Alchemy)
  tools/             CLI: the audio generator and uploader
  acceptance-tests/  Playwright specs and the DSL that drives the app
```

The scheduling logic is a folder in `webapp/`, not a package: only the webapp uses it, and `acceptance-tests` may not import
`webapp`, so a spec can never recompute its expectation from the code under test. It becomes a package when a second consumer
appears. The deck data did when `tools/` needed it, and is now `content/`.

Key design choices:

- **Scheduler:** FSRS via the open-source `ts-fsrs` library, wrapped in `webapp/src/spaced-repetition/` so it is swappable
  (`docs/scheduling.md`).
- **Persistence:** Redux slices backed by `localStorage` for small state (settings). Review history, card state and learner pictures go
  in IndexedDB, because images will not fit in `localStorage`. Keys are versioned and loads are validated.
- **Card model:** a *note* has fields (today `vocab` and `kana`; `sentence`, `grammar` and `cloze` are planned). Each note generates
  two cards, target language to English and English to target. The learner's memory aids are kept apart from the card, by card id: a
  note (`redux/slices/card-notes/`, `localStorage`) and a picture (`redux/slices/card-pictures/`, a blob in its own IndexedDB
  database), each dated so fading can count the answers given since. Both are on the device only for now.
- **Content updates vs. user data:** shipped decks are versioned content. The learner's scheduling state and memory aids are keyed by
  stable card ids, so a deck update never wipes progress.

### Features

- FSRS scheduling, learning and relearning steps, a desired-retention setting, daily new-card and review limits per deck.
- **Struggling cards:** a card that lapses a set number of times is flagged (and can be flagged by hand). This is the trigger for the
  struggling-card loop below. Suspend and bury are built. Undo of the last answer was built and then removed on purpose: the learner
  lives with the decision, which keeps the log and the schedule simple.
- Look ahead at cards not yet due without changing their schedule, and study only the new or only the struggling ones.
- Audio on card show, with replay, in both directions.
- Not planned: add-ons, a full deck-options screen, and statistics beyond what a learner needs to keep the habit.

### Struggling-card feedback loop

1. A card becomes struggling (lapse threshold, configurable) or the learner taps "This is hard".
2. It appears in a **Struggling** list and as a prompt after the session.
3. The learner adds a picture (upload or paste) and/or a note. Both render on the card back.
4. After three good or easy answers in a row since the newest aid was added (`shouldFadeAids`), the app offers to remove the aid
   ("fading"). The learner can always remove it by hand.

### Daily goal and reminder

- One daily goal: a number of cards, adjustable in settings. The home screen counts the different cards answered today against it.
  No XP, levels, badges, streaks or heatmap: decided against.
- A reminder notification at about 8pm local time if the goal has not been met that day. A PWA cannot fire a timed notification while
  closed without push, so this needs a Web Push subscription held by the API Worker with a scheduled (cron) trigger that skips
  learners who have met the goal. It waits for the deployed API.

### Audio

See `docs/audio.md` (voices, the generator, playback) and `docs/online.md` (the private bucket and the device's copy).

## Phases

Each phase starts with failing acceptance tests (ATDD) and ends with `pnpm checks` and the acceptance suite green. `TODO.md` says where
each stands.

0. **Scaffold and harness.**
1. **Core review loop.**
2. **Korean content and audio.**
3. **Authoring and the struggling loop.**
4. **Daily goal reminder.**
5. **Japanese:** kana, then basic sentences.
6. **Backend:** sign-in, runtime audio, pictures, sync.
7. **Later:** Dutch.

## Verification

- Every phase: `pnpm checks` (lint, format, types, unit tests) and the acceptance suite run against the production build
  (`pnpm start:preview`) on desktop and mobile projects.
- Mutation check on new tests: break the code, see the test fail for the right reason.
- Manual: install the PWA on desktop and Android, then review a card offline with audio playing.
