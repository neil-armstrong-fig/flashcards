# AGENTS.md: tools

Command-line tools that make content for the app. Nothing imports this package. It may import `@flashcards/shared` and
`@flashcards/content` (the words, and the manifest's types), never `webapp`.

## The audio generator

```bash
(set -a; . ./.env.dev; set +a; cd tools && node --import ./loader/register.js src/main.ts)   # from the repo root
pnpm --filter @flashcards/tools generate-audio                                          # the same, if .env.dev is wanted loaded by Node
```

It makes every recording the decks need that is not already in `private-source/recordings/` (git-ignored: the recordings are never in the repository or the public site), then writes
`content/src/audio/recordings.json`. Re-running costs nothing for what exists: a file is named by a hash of the text, the voice
and the rate, so only a new or changed word is sent to Azure. The manifest is written even if a recording fails, so a stopped
run keeps what it made. Stale files from a changed word are not deleted.

- **The key is never read here, printed or put on a command line**: `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` come from the
  environment (`.env.example` names them), and the code names the failing status, never the key.
- **Throttled to the free tier**: one request every 3.3 seconds (20 a minute, not adjustable), and a 429 is waited out
  (`Retry-After`, else 30 seconds) up to five tries. A thousand words is four thousand requests, about four hours the first time.
- **Voices and the speed rate are tables** (`src/voices/`), taken from `docs/audio.md`. A language joins `AZURE_VOICES` when its
  voices are chosen by ear. Slower is `-15%`, never lower.
- Every recording's text must be words the project holds the rights to speak (`docs/audio.md`).

## Uploading the recordings

```bash
pnpm --filter @flashcards/tools upload-audio            # into the local bucket `pnpm api:dev` serves from
pnpm --filter @flashcards/tools upload-audio -- --remote   # into the real private R2 bucket
```

It puts every recording in `private-source/recordings/` into the R2 bucket `flashcards-recordings` with `wrangler r2 bulk put`
(`src/upload-main.ts`; `src/upload/UploadListOf.ts` picks the files that are recordings). The API serves them to a signed-in learner only
(`api/AGENTS.md`). `--remote` needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in `.env.dev`. Putting one again replaces it with the
same bytes, so it can be run after every `generate-audio`.

## Running TypeScript

Node runs the files by stripping types, so no build step and no runner dependency. Node does not know the `@src/*` alias the code
is written with, so `loader/` registers a resolve hook that maps it. Use `import type` for types, and no syntax that needs
compiling (enums, constructor parameter properties). Vitest and `tsc` read the alias from `tsconfig.json`. If a runner such as
`tsx` is ever added (it needs asking), the loader can go.

## Layout and tests

```
src/main.ts        reads the environment into the runtime and runs the command
src/upload-main.ts, src/upload/   UploadListOf: which files are recordings, and where they go in the bucket
src/runtime/       `export const runtime` (folders, interval, the Azure account, when the last request began), `sleep`: a process is
                   start, work, exit, so its state is one object that commands fill and effects read
src/generate/      GenerateAudio: the loop. MissingJobs is pure; files/ are the disk effects (PresentRecordings, SaveRecording, WriteManifest)
src/plan/          RecordingsNeeded: the decks to the list of recordings
src/azure/         SynthesiseRecording (the effect: fetch and retry), request/RequestOf and answer/NextStepAfter (pure)
src/naming/        RecordingFileOf: the hashed path
src/throttle/      WaitForTurn (the effect) over WaitBefore (pure: how long to wait)
src/manifest/      ManifestOf
src/voices/        which Azure voice and rate each choice means
```

Decisions are pure functions tested by value. Effects import what they touch (`fetch`, the disk, `runtime`), so nothing is handed in:
`GenerateAudio.test.ts` runs the real loop in a temp folder with `fetch` stubbed, and `vi.mock`s `runtime/Sleep` so nothing waits.
