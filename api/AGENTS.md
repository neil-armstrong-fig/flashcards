# AGENTS.md: api

A Cloudflare Worker (modelled on janggi's `api/` (https://github.com/neil-armstrong-fig/janggi)) that the app calls for four things, none of which a card ever needs:

- **Sign-in with Google** for a private test app: `GET /api/auth/google`, the callback, `POST /api/auth/logout`, `GET /api/me`. An
  authorization-code flow with PKCE through `oauth4webapi`, asking for `openid email`. The person is let in only if Google says the
  email is verified **and** it is on `ALLOWED_EMAILS`; anyone else is sent back signed out. The session is a random token in a
  `HttpOnly; Secure; SameSite=Lax` cookie, and only its SHA-256 is stored.
- **The learner's similar words**, kept per account in D1: `GET` and `POST /api/similar` (`{noteId, text}`, idempotent).
- **The learner's own cards**, kept per account in D1: `GET`, `POST`, `PUT` and `DELETE /api/notes` (`{id, word, meaning, romanisation}`; the
  id is `ko-custom-…`; `POST` is idempotent; `PUT` changes the words of an existing note (404 if it is not the account's), keeping its id and similars; `DELETE {id}` also deletes the similar words kept with that note, in one batch).
- **Recordings**: `GET /api/audio/<language>/<voice>-<speed>/<hash>.mp3` streams a recording made ahead of time from the **private R2 bucket**
  (`RECORDINGS`) to a signed-in account, with byte ranges (iOS needs them) and `Cache-Control: private, max-age=31536000, immutable`. 401
  without a session, and 404 for any name the app does not make (`router/routes/audio/recording-key/`). The bucket is never public (`docs/online.md`). `tools/` uploads them (`upload-audio`).
- **Speech**: `POST /api/speech` with `{language, text, voice, speed}` returns an MP3 from Azure AI Speech: `ko` is a Korean word
  in the chosen voice and speed, `en` an English meaning (up to 40 characters) in the one English voice at normal speed. The **Azure key stays
  here**, never in the browser.

It may import `@flashcards/shared` (the voice tables, SSML, the text checks) and nothing else in the workspace. The webapp
may not import it at all.

## What is refused, and in what order

`router/RouteRequest.ts`: a preflight is answered; a path and method that are not in `router/dispatch/HttpRoutes.ts` get 404 and nothing
more is looked at; a POST from an origin not in `ALLOWED_ORIGINS` is 403 (CSRF; `SameSite=Lax` is the second line); then the route,
which for everything but sign-in goes through `forSignedInAccount` (401 without a good session). Speech (`router/routes/speech/speak-for-account/`): the body
must be Korean of one to twelve characters with a real voice and speed, or English of up to forty characters (400); **a recording already made is handed back at once and
counts against nothing** (the cache, below); a caller past 20 a minute gets 429 (`SPEECH_LIMITER`); a month past its character ceiling
gets 503 (`SPEECH_BUDGET`, default 100,000, a fifth of the free tier; `MONTHLY_CHARACTER_CEILING` changes it). The cheap refusals
come first and a refused request is never counted. The count is read then written, not atomic: a ceiling to be near. Azure's own
errors become a bare 502, with nothing about Azure or the key.

**The recordings cache** (`speech/cache/`, the `SPEECH_AUDIO` KV namespace): every recording Azure makes is kept under
`speech:<language>:<voice>-<speed>:<word>`, so asking for the same word again, by anyone, costs no characters. Very worthwhile for single words,
which are asked for again and again. KV is global and durable and free at this size (about 11 KB each; a gigabyte; a thousand writes a
day), and nothing expires: a recording of a word does not go stale.

## Layout

```
src/ApiWorker.ts        the default export: checks the secrets, then routes
src/router/             RouteRequest; cors/ (origins, credentials, CSRF); dispatch/ (the one list of routes, who answers each, the sign-in guard); routes/ (one folder per resource, then one per handler (`notes/remove-note/RemoveNote.ts`), its own helpers in a `utils/` beside it, those shared by several handlers in the resource's `shared/utils/`; audio/serve/ is ServeRecording: ranges, headers, and audio/recording-key/ is which names are recordings);
                        session/ (token, cookie, hash, who is signed in); sign-in/ (start-sign-in/, finish-sign-in/, and shared/ with google/, oauth/ attempt cookie,
                        utils/ (ClientOf, LoginAllowed); the allow-list is in finish-sign-in/utils/); respond/
src/database/           Database.ts (Drizzle over D1), schema/, and one file per query; types/. A test replaces the queries
src/buckets/            recordings/ (ReadRecording: a recording read from the R2 bucket, whole or by range; types/: what the bucket and a stored recording are)
src/speech/             what a speech request reaches out to: budget/, cache/ (ReadCachedSpeech, KeepSpeech: effects over the KV binding), azure/, and types/SpeechRequest. The route, `router/routes/speech/speak-for-account/`, holds the logic and its body check (nothing trusted till checked); it reads the bindings at the point of use
src/env/                WorkerEnvironment: the bindings, secrets and variables. MissingSecrets
src/testing/            SetupApiTests (mocks the database and Google), ApiHarness, TestGoogle
```

No ternaries here (lint): a guard that returns early reads one condition at a time.

## The database

Drizzle writes the SQL and Wrangler applies it. **Never** run `drizzle-kit migrate` or `push` against D1 as well.

```bash
pnpm --filter @flashcards/api db:generate         # after changing src/database/schema/, writes migrations/ (commit them)
pnpm --filter @flashcards/api db:migrate:local    # makes or updates the local database under .wrangler/
```

Tables: `users` (Google subject, email), `sessions` (hash of the token, expiry), `similar_words` (account, note id, text), `notes`
(account, id, word, meaning, romanisation, added at). A change
to a stored shape is a new migration, never an edit to an old one.

## Running and testing

```bash
pnpm start:local            # from the repo root: this API on :8787 and the app on :3000 (the one origin it allows)
pnpm --filter @flashcards/api test    # plain node: the code is plain functions, `cloudflare:workers` is a stub
```

Needs these in the root `.env.dev` (git-ignored; names in `.dev.vars.example`): `AZURE_SPEECH_KEY`, `GOOGLE_OAUTH_CLIENT_ID`,
`GOOGLE_OAUTH_SECRET`, `ALLOWED_EMAILS` and `GOOGLE_REDIRECT_URI`. `start` passes `--env-file ../.env.dev`, so every name in it becomes a
local binding. Do not keep an `api/.dev.vars`: Wrangler prefers it. The Google client is made by hand (`MANUAL-SETUP-STEPS.md`
section 4a). Without those the Worker answers 500 and logs which are missing.

**What has and has not been run.** Unit tests cover the whole of it (144). Under `wrangler dev` with a local D1, the migration applied,
`/api/me` and the speech were 401 without a session, the preflight was 204, and the sign-in redirect went to Google with a PKCE
challenge and an attempt cookie. The app itself is behind this sign-in (`webapp/src/redux/slices/account/selectors/SelectAccess.ts`). A real recording through the earlier version of the speech route worked against Azure. **The Google
round trip has not been run**: it needs your OAuth client.

**Production is declared in `infra/`, not in `wrangler.jsonc`**, which is for local dev alone: change a binding, name or limit in both.
Acceptance specs fake this API (`acceptance-tests/src/dsl/web-app/playwright/fake-api/`), so a run never reaches it.
