# AGENTS.md: webapp

Vite, React 19, Redux Toolkit and Tailwind v4, client-side rendered, installable as a PWA that works offline. Read the
`AGENTS.md` in `src/react/`, `src/redux/` or `src/spaced-repetition/` before touching it, as well as this one.
`src/sw/` (the service worker) has none yet: nothing folder-specific has accumulated there.

```
src/
  main.tsx              makes the store and renders the app
  index.css             Tailwind, the @theme colour tokens (dark) and the light palette that replaces them (`data-theme`, or the device), global base rules
  react/                components, nested by who uses them
  redux/                the store: slices, actions, selectors, storage
  audio/                recordings: the player, fetching and keeping them in a browser cache, which one a text, voice and speed names. Plain functions
  environment/          what never varies while the page lives (`Runtime`: the API's address, the manifest of recordings). Not `testing/environment/`, which is the in-memory fakes
  spaced-repetition/    when a card comes back, what is due today, which card is next: plain functions over plain data
  sw/                   the service worker: precaches the build; a new release waits for the update prompt
  testing/              what unit tests need: `SetupWebappTests.ts` (runs before every test file), `environment/` (`testEnvironment`: the browser and the API in memory, in folders by subject), `OpenedStudyStore`, `StoreProviderOf` (for a hook test), `AddedCustomNote` and `AddedSimilarWord` (set a test up without fetching recordings)
```

## Import layering

Enforced by ESLint alongside the workspace table in the root `AGENTS.md`. A violation is a lint error.

- One-way: `react/` imports `redux/` and `audio/`; `redux/` imports `spaced-repetition/` and the `content` package. `redux/` may not
  import `react/` or `audio/`: components depend on state, never the reverse, and state knows nothing of sound.
- `audio/` is plain TypeScript over `environment/` and the `content` and `shared` packages: no React, no Redux, no `redux/`, no
  `spaced-repetition/`. It is handed what it needs as plain arguments (the texts kept, the voice and speed), never the store. Where
  state and sound meet is `react/audio/`: it reads state, calls `audio/`, and dispatches. `environment/` imports packages only.
- `spaced-repetition/` is plain TypeScript. It may not import React, Redux, the page, the store, or `content`.
  The page and the store call into them; they know nothing of either.
- This package may import `@language-learning/shared` and `@language-learning/content` (the decks and recordings) and nothing else from the workspace.

Lint rules come from `@eslint-react/eslint-plugin` (React 19 aware) plus `eslint-plugin-react-hooks`. The legacy
`eslint-plugin-react` is deliberately not used: do not reintroduce it.

## Conventions

- **The app is served from `/`**, the root of its own (sub)domain. Do not hardcode absolute asset paths, and keep the PWA
  manifest's `start_url` and `scope` at `/`.
- **Tailwind v4 has no config file.** Use utilities in JSX. Colour tokens live in the `@theme` block in `index.css`
  (`bg-ground`, `text-accent`), never hex in JSX, and genuinely global rules go in its `@layer base`. A class list that changes
  with state goes through `clsx`: fixed classes as one string, each conditional as `flag && "class"`, paired with
  `!flag && "other"`, never a ternary and never a template string.
- **Mobile first.** Check any layout work against the `mobile` acceptance project.
- **Effects are plain functions that import what they touch; decisions are pure** (root `AGENTS.md`). A thunk reads state, calls pure
  functions for every decision, calls an effect function for I/O (`redux/slices/study/storage/RecordAnswer`, `redux/api/AddKeptNote`) and
  dispatches. What never varies for the page's life is `environment/Runtime.ts` (the API's address, the manifest of recordings). Time
  is `new Date()` and a new id is `crypto.randomUUID()`, read in the thunk: the pure functions below are handed them.
- **Never block the learner on storage.** A database that cannot be read or written is reported with `console.error` and the
  learner carries on in memory.

## Testing

**Do not write component or page tests.** Behaviour a learner can see is covered by the Playwright specs in
`acceptance-tests/`, which drive the real app. Vitest here runs on `node`; a hook test opts in to `jsdom` with `// @vitest-environment jsdom`.

| Code                                          | Tested by                                                                                                                                                                                                                                                                              |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Components and pages (`src/react/`)           | acceptance specs, not unit tests                                                                                                                                                                                                                                                       |
| Reducers, actions, selectors, plain functions | Vitest, called directly: no DOM, no React Testing Library                                                                                                                                                                                                                              |
| Custom hooks (`react/audio/`)                 | Vitest on jsdom with `renderHook` (the pattern of janggi, https://github.com/neil-armstrong-fig/janggi), over a real store from `testing/StoreProviderOf.tsx`. Prefer a plain function; a hook test is for what is in the hook (an effect that fires once, not twice under StrictMode) |

## PWA and icon

`vite-plugin-pwa` in `injectManifest` mode builds `src/sw/ServiceWorker.ts` with `registerType: "prompt"`: a new release waits
until the page's update prompt (`react/components/release-update/`) asks it to take over. The development server
deliberately does not register the production worker, so anything about the worker needs a compiled build. The icon is
the hand-made `public/icon.svg`, with PNGs rasterised from it (`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`): our own artwork only, never another project's.

## Commands

```bash
pnpm --filter @language-learning/webapp start     # or `pnpm start` from the root
pnpm --filter @language-learning/webapp test      # Vitest
pnpm --filter @language-learning/webapp compile   # tsc --noEmit && vite build, output in build/
```
