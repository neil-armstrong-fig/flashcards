# AGENTS.md

Flash Cards: a spaced-repetition app for learning languages (Korean first, then Japanese, then Dutch), installable as an offline-first PWA.
Standalone: no Anki integration; Anki's ideas are credited in `REFERENCES.md`. Practices (code, tests, structure) follow janggi
(https://github.com/neil-armstrong-fig/janggi, `REFERENCES.md`). pnpm workspace, seven packages:

| Package             | Contains                                                                                 | May import                             | Guidance                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------- |
| `webapp/`           | The app: Vite, React 19, Redux Toolkit, Tailwind v4, PWA                                 | itself, `shared` and `content`         | `webapp/AGENTS.md`, plus one in each of `src/react/`, `src/redux/`, `src/spaced-repetition/` |
| `content/`          | The decks (words as typed data, how a note becomes cards) and the manifest of recordings | itself and `shared`                    | `content/AGENTS.md`                                                                          |
| `api/`              | The Cloudflare Worker: Google sign-in, the learner's similar words (D1), speech (Azure key stays here)                | itself and `shared`                    | `api/AGENTS.md`                                                                              |
| `infra/`            | The API's Cloudflare resources as code (Alchemy), and its deploy                         | nothing (names the Worker by path)     | `infra/AGENTS.md`                                                                            |
| `tools/`            | Command-line tools: the audio generator (Azure AI Speech)                                | itself, `shared` and `content`         | `tools/AGENTS.md`                                                                            |
| `acceptance-tests/` | The Playwright specs and the DSL that drives the app                                     | itself and `@flashcards/shared` | `acceptance-tests/AGENTS.md`, plus `src/dsl/` and `src/tests/`                               |
| `shared/`           | Vocabulary the app and the specs both use, and the base tool config                      | nothing: the bottom of the graph       | `shared/AGENTS.md`                                                                           |

The scheduling logic is a folder in `webapp/`, not a package, because nothing else uses it and `acceptance-tests` may not
import `webapp`, so a spec can never recompute an expectation from the code it is testing. Make it a package when a second
consumer appears (an API). The decks became `content/` when `tools/` needed the same words.

## Read first

- `TODO.md` is the task tracker and `docs/PLAN.md` the design. Both are kept current, in the same change as the work.
- `docs/` holds research and decisions the code rests on, linked from the code they justify (`docs/scheduling.md` now). Add a
  document only when losing the reasoning would mean someone re-deriving it.
- `REFERENCES.md` credits ideas, libraries and data. Add an entry in the same change that introduces one.
- `MANUAL-SETUP-STEPS.md` lists everything outside the repo (Pages, DNS, secrets). Update it in the same pass as any change
  that creates, renames or removes one. Never put a token, account id or personal address in it.

## Before changing code

1. Identify every package and folder in scope and read each applicable `AGENTS.md` on the path to the file in full, before
   planning. The root and the current package's are normally already in your context.
2. Inspect the nearest existing implementation and test that set the local structure and naming. If none exists, say so.
3. Before editing, say which instruction files and reference implementations you used.
4. Re-read a file immediately before changing it, and prefer a targeted edit to rewriting it.
5. Before finishing, re-read the applicable instructions and review your diff against them, fixing deviations lint cannot
   see. Report the outcome of every gate you ran (`pnpm checks`, the acceptance suite), including one that could not run and
   why. Anything needing the developer's decision is flagged there too.

## Commands

Run from the repository root. While working, scope tools to what you changed (`pnpm --filter @flashcards/webapp exec
vitest run src/redux`).

```bash
pnpm checks                # lint + format check + type check + unit tests, every package: the gate (--max-warnings=0)
pnpm format                # apply Prettier (scope it: see "More than one session")
pnpm start                 # dev server on http://localhost:3000: fine for a few specs or work in progress
pnpm start:preview         # compile, then serve the build on :3000: what CI tests, and the whole suite should run against
pnpm acceptance-tests      # needs one of the two above running in another terminal (--project=mobile for one project)
pnpm acceptance-tests:pwa  # the service-worker specs (offline, new release): need `pnpm start:preview`, not the dev server
pnpm install-browsers      # one-time Playwright chromium download
pnpm api:dev               # the API on :8787 with wrangler (reads the root .env.dev: names in api/.dev.vars.example; MANUAL-SETUP-STEPS.md 4a)
pnpm start:local           # the API and the dev server together, the app talking to the local API
```

If port 3000 is taken (the developer's own dev server, for one), do not kill it: serve your own build with
`pnpm --filter @flashcards/webapp exec vite preview --port 3100` and run the specs with
`WEBAPP_URL=http://localhost:3100 pnpm acceptance-tests`. The build is a snapshot, so restart it after any change to the app
or you test stale code. Stop a server you started by its PID (`lsof -ti :3100 | xargs -r kill`), never `pkill -f <text>`,
which also matches the shell running the command.

## How work is done here

This project is Acceptance Test Driven. **Write the acceptance spec first**, watch it fail for the right reason, then make it
pass. See `acceptance-tests/AGENTS.md`.

**A passing test proves nothing until you have watched it fail.** For a test written after the code, or cover you inherited,
the way to prove it is **mutation**: break what the test claims to cover, run it, confirm it fails for the right reason, then
restore. **`grep` the file after mutating** (Prettier can silently reflow a multi-line mutation away, giving a false green),
and **note which tests fell**: the wrong ones, or too many, mean the cover is in the wrong place.

**Do not wrap a unit test file in a top-level `describe`.** The filename names the single export it covers: write `it(...)`
at the top level. Use `describe` only where its name says something the `it` names would each have to repeat (a subject with
states, or genuinely different setups). Acceptance specs are the opposite: their `given`/`when` nesting is the specification.

**Where a state cannot be reached by tapping, unit test the pure function underneath it**, and let the spec cover only what
a learner can do. Never add a test-only door into the app.

## Code style

Prettier owns formatting (120 columns, `pnpm format`) and the shared ESLint config owns the rest. What they will not tell you:

- **A filename is PascalCase and names its single export**, hooks included (`UseThing.ts` exports `useThing`). A test takes
  its subject's name and sits beside it. A file with two exported things is two files, except a type and its type guard (`DeckId.ts` exports `DeckId` and `isDeckId`).
- **A file with a class holds that class and nothing else** but the interfaces it needs and its constants, above it. A helper
  that uses the class's state is a `private` method below its caller. A pure helper worth testing alone is its own file in a
  subfolder beneath.
- **Locality over layers.** A file lives as close to its caller as it can, in a subdirectory of it. A helper used by one file
  goes in a folder beneath it, never beside it. Something shared rises to its callers' nearest common ancestor and no further.
- **An entry point with helpers gets a folder of its own**, so the parent does not fill with one-file domain folders: a handler
  is `notes/remove-note/RemoveNote.ts`, its own helpers are in `remove-note/utils/`, and what several siblings use is in the
  parent's `shared/utils/` (`notes/shared/utils/`), named `shared` so it reads as off the main path. Here `utils/` is the
  folder's shape, which is its whole point. A pattern, not a rule: a lone handler, a layer (`database/` queries, redux slices) or
  a set of peers (`cors/`) does not need it. When a file clearly breaks the locality rules, move it and fix the imports and docs.
- **A folder's root is its table of contents.** The few entry points stay at the top and everything else drops into a subfolder
  named for its subject. Around six files is where a folder starts reading as a bucket: a smell, not a limit.
- **Name a folder for its subject, not its shape.** `queue/`, `storage/`, `timing/` say what is inside. `helpers/`, `common/`
  and `misc/` do not exist, and `utils/` is the last resort. `types/` is allowed: exported named types reused by other files,
  one per file, beside the highest caller that shares them. A type used by one file stays in it, and a type guard lives in the file of the type it narrows to (`DeckId.ts`), not in an `Is…` file of its own.
- **A union of literals is read off the list.** Declare it `as const` and derive the type (`(typeof X)[number]`).
- **Give every type a name.** No inline object type or union in a signature, field or `Record` value. A component's own
  `Props` is the exception (named `Props`, not exported).
- **Three parameters at most**; past that take one object. What a function acts through (a clock, a store) may stay
  positional ahead of it.
- **Declare functions below their callers**, as `function` declarations (an arrow `const` is in the temporal dead zone above
  its line). Components are the one exception (`webapp/src/react/AGENTS.md`).
- **Guards and early returns over nesting.** Return early, cheap guard first. A guard sits directly under the line it checks.
  An `if` with an `else` is braced on both sides. Two `if`s sharing a leading test nest.
- **A ternary is the last resort.** Never `return cond ? a : b`: write `if (cond) { return a; }` then `return b;`.
- **An arrow whose expression body runs onto a second line takes a block and a `return`.**
- **No `../` imports.** Use the `@src/*` alias each package maps to its own `src/`. Same-folder `./x` is fine.
- **Explicit return types**, `import type` for type-only imports, named exports over default.
- **A stored or received value is `unknown` until a function has checked it.** Never cast it.
- **`undefined`, never `null`, for "nothing".** Use an optional field (`email?: string`) or `T | undefined`, not `T | null`, so absence is one
  type that plays with `?` and `??`. Where an SDK speaks `null` (`Headers.get`, `URLSearchParams.get`, R2 and KV `get`, `localStorage`, DOM
  and Playwright calls, `new Response(null)`, a react-router loader, `useRef`), map it to `undefined` at the call and let only `undefined`
  past it. A reader of stored data still accepts an old `null` and returns `undefined`.
  `x == null` and `x != null` are allowed and mean "null or undefined" (`eqeqeq`'s `"smart"` option); write `=== undefined` where only
  `undefined` is meant.
- **No interface exists only to be faked.** Decisions are pure functions: they take what they need and return a result. I/O is a
  plain function that imports what it touches (`fetch`, the disk, `workerEnvironment`) and does one thing. What never varies in a
  process (a folder, an origin) is one `export const` runtime object (`tools/src/runtime/Runtime.ts`); state that changes is a
  store (Redux in the webapp). A test passes values to a pure function, or runs the flow with `fetch` stubbed and the runtime or
  `workerEnvironment` set, or `vi.mock`s the effect modules (as `api/src/testing/SetupApiTests.ts` and `webapp/src/testing/SetupWebappTests.ts` do, over an in-memory environment).
  No `*Dependencies` bag, and no stand-in is ever handed to the code under test.
- **Copy is UK English**, plain and concrete.

## Import boundaries

Enforced by ESLint (`no-restricted-imports`, built by `restrictedImports(...)` in `shared/config/eslint.base.js`), so a
violation fails `pnpm checks`. A workspace package added later is denied by default: add it to `allowedPackages` in that
package's `eslint.config.js`. Folder-level layering is in each package's `AGENTS.md` (webapp's covers `react/` to `redux/` to
`spaced-repetition/`; `content/` is plain data below it). **Never write `"no-restricted-imports"` directly in an override**: flat config replaces a
rule rather than merging it, so the boundary silently vanishes for those files. Call `restrictedImports({...})`.

`shared/` is compiled as raw source by whoever imports it, so inside `shared` a file imports another by the package's own name
(`@flashcards/shared/study/Rating`), never `@src` (it would resolve into the importing package's tree).

## Private material and secrets

`private-source/` is local, git-ignored working material (voice samples, drafts, scratch scripts). It is not part of the public
repository: never commit, publish, move out of the ignore, or delete it. Generated audio is never committed: it lives in
`private-source/recordings/` and is served privately (`docs/online.md`).

Secrets live in `.env.dev` at the repo root (git-ignored, owner-only; names in `.env.example`). **Never read its values**: list
names with `sed -E 's/^([A-Za-z_]+)=.*/\1/' .env.dev`, load it into a subshell (`set -a; . ./.env.dev; set +a`) to run a tool,
and mask the key in any output. Never put a key in a chat, a doc, a commit or a command line.

## Git and other sessions

**The developer stages and commits themselves**, using the index as an in-progress review snapshot. Treat staged and unstaged
files as equally active working material: keep editing either, but never run `git add`, commit, branch, push, `git stash`,
`checkout`, `restore`, `reset` or `clean`. Say what changed instead. Reading (`git status`, `git diff`) is always safe, but
`git status` shows everyone's work: do not report it as a description of yours.

Several sessions may share this working tree and nothing announces a new one. Format and lint only the files you touched
(`pnpm --filter <pkg> exec prettier --write <files>`), never repo-wide `pnpm format` or `lint:fix`.

## Ask before

- **Adding or upgrading any dependency.** Versions are exact-pinned, each with a one-line rationale, in the `catalog:` of
  `pnpm-workspace.yaml`. A supply-chain policy there rejects any release under seven days old, and nothing updates
  automatically. After a gap since the last work, check `pnpm outdated -r` and propose bumps; do not apply them unasked.
- **Deleting or rebuilding `pnpm-lock.yaml`.**
- **Any commit, branch or push** (see above), and **any DNS or GitHub Pages change.**

## Gotchas that will waste your time

- **Do not upgrade TypeScript past 6.0.3.** `typescript-eslint` cannot read TypeScript 7's AST and ESLint crashes at startup.
- **Do not add `baseUrl` to a tsconfig.** TS 6 made it an error: `paths` resolve relative to the tsconfig.
- **Root-level files (`AGENTS.md`, `docs/`, `TODO.md`) get no Prettier config from a package directory** and fall back to 80
  columns, rewrapping content you never touched. Edit them by hand.
- **`pnpm setup` is a built-in pnpm command**, not ours. The script is `pnpm install-browsers`.
- **On Linux/WSL, Chromium needs system libraries once**, or every spec fails on launch with `libnspr4.so`:
  `pnpm --filter @flashcards/acceptance-tests exec playwright install-deps chromium` (needs sudo).
- **Playwright reports every test's location as `AcceptanceCriteriaMapping.ts`**, because it reads the caller of `test()`.
  Failure output still points at the real spec line.

## CI and deployment

`.github/workflows/ci-cd.yml` runs `checks`, then the acceptance suite against a production build, then deploys `main` to GitHub
Pages gated on both, then runs the same suite against the live URL. The app is always served from the root of its own
(sub)domain, so there is no base path and the DSL navigates with `goto("./")`. The custom domain is set in the repo's Pages
settings with no `CNAME` file, because the deploy is an Actions artifact (`MANUAL-SETUP-STEPS.md`).

## Keeping context small

Every tool result is re-read on each later call, so a large one is paid for repeatedly. Read the part of a file you need
(`grep -n`, then a ranged read), never `cat` a source file or sweep a directory. This file and the current package's are
already loaded: do not `cat` them. `pnpm checks` is quiet when it passes, so never skip a check to save context. Every session
pays for each `AGENTS.md` in its chain in full, so when you add to one, take out whatever the addition supersedes. Add a nested
file to a folder once folder-specific guidance has accumulated there, and keep each file specific to its folder.
