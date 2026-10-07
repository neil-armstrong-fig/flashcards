# AGENTS.md: acceptance-tests

Playwright runs the specs, which drive the real app through a DSL. Four layers, and imports only ever point downwards:

```
src/tests/                        the mapping, "@src/shared/*" and @flashcards/shared, nothing else
src/acceptance-criteria-mapping/  src/dsl/ and src/shared/; never src/tests/
src/dsl/                          itself and src/shared/; never upwards
src/shared/                       helpers more than one layer needs (none yet)
```

Every arrow above is a lint rule, so a violation fails `pnpm checks`. `src/dsl/AGENTS.md` covers building the DSL (the
`*Dsl`/`*Playwright` pairing, naming a method, locators). `src/tests/AGENTS.md` covers writing and organising specs
(`given`/`when`/`then`, `each`, arranging versus asserting).

## What a spec may reach

The DSL, and nothing else: no `page`, `context`, `browser` or `testInfo`, and **never the `webapp` package**. A spec that
imported the scheduler to work out what should be due would agree with it whatever the scheduler did. `@flashcards/shared`
is the exception and is meant to be used: it holds the vocabulary, so `webApp.review.rate("good")` is checked against the same
`Rating` union the app is, and `"gud"` is a compile error. Enforced three ways: the argument type, `withDslOnly` rebuilding the
argument object at runtime, and a lint rule banning Playwright and `@src/dsl/**` under `src/tests/`.

**Do not work around it.** To give a spec a new capability, add the locator work to a `*Playwright`, then the one-line wrapper
on the `*Dsl` beside it.

**Specs name the starter deck's words literally** (`"물"`, `"water"`), because the deck is webapp code they may not import.
Change a word in `content/src/korean/` and the specs that name it change in the same commit.

## Test ids and time

- **Test ids are spelled out, never computed.** The app builds `rate-${rating}`; a DSL that recomputed it the same way would
  agree with the app whatever either did. `ReviewPlaywright` holds a `Record<Rating, Locator>`, so a rating added to the shared
  union without a locator does not compile.
- **Time is the test's.** The fixture installs Playwright's clock before the first load. `webApp.passDays(n)` moves it with
  `setSystemTime` and reloads, as a learner opening the app on a later day would. Never `fastForward` for days: it takes a
  32-bit number of milliseconds, so anything past about 24 days overflows to "cannot fast-forward to the past". Never wait for
  real time.
- **A second device is `secondDevice`**: a browser context of its own (nothing stored is shared) over the same fake account, so what one device
  syncs the other finds. It is not opened until a spec calls `secondDevice.begin()`; `sync.waitUntilUpToDate()` waits for a device to catch up.
- **Every spec starts as a first-time learner** with the starter deck untouched. A "returning learner" fixture seed arrives
  with the first thing worth seeding (`TODO.md`).

## Traps

- **The audio element is faked** (`dsl/web-app/playwright/fake-audio/`), so no sound is made and nothing waits on one. It fetches
  each file it is asked to play, so `found: false` means the manifest names a file the app could not serve. Specs that need the
  service worker (going offline, taking a new release) live in `src/tests/pwa/`, which the ordinary run skips: they need the
  compiled build, and run with `pnpm acceptance-tests:pwa` against `pnpm start:preview`.
- **`.tap()` needs `hasTouch`** and the `desktop` project has none, so it fails there. Use `.click()`, which both projects run.
- **A DSL action that changes the screen waits for the result before returning** (`rate`, `showAnswer`), because the
  app saves before it moves on and a `then` would otherwise race it. Add the same wait to any new action of that kind.
- **If every spec fails at once**, check `curl localhost:3000` (or your port) before debugging anything: the server may have
  died, or be serving an old build.
- **`playwright test --list | tail -1`** gives the spec count with no server running: the cheapest way to confirm a refactor did
  not change coverage.

## Running

```bash
pnpm start:preview                  # terminal 1: compile, then serve the build (what CI tests)
pnpm acceptance-tests               # terminal 2: desktop + mobile projects
pnpm acceptance-tests --project=mobile
pnpm acceptance-tests:pwa              # the service-worker specs (src/tests/pwa/), against the compiled build
pnpm acceptance-tests:headed        # watch it drive
pnpm acceptance-tests:ui            # time-travel debugging
```

`pnpm start` (the dev server) is fine for a few specs while writing one, because hot reload beats a rebuild per edit. Run the
whole suite on the preview build: it is a few bundled files and is what CI tests. `WEBAPP_URL` picks the target; there is no
"environment" concept in the tests, only a URL. Failure screenshots, video and traces land in `test-results/` automatically, so
do not write screenshot code. `pnpm test` here is Vitest for DSL helpers and excludes `src/tests/`.
