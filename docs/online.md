# Served online, cached on the device

Status: **built and run locally end to end; not deployed** (`MANUAL-SETUP-STEPS.md` is the deploy checklist). Decided 2026-10-06.

## Why

The recordings are generated audio the project keeps private: they are served only to a signed-in learner, from storage that is not
the public site, and the app keeps a local copy so it still works offline. The same move gives the learner's decks and cards
somewhere to live (D1) and a place for pictures (R2), which `docs/decks.md` and `docs/sync.md` need.

## The shape

See [`architecture.md`](architecture.md) for the implemented Cloudflare
resources, what its namespaces do and every current API route.

```
GitHub Pages (static app, public)        Cloudflare (private)
  <app host>                      <--->    <api host>  (the Worker)
  code, the words of the shipped decks,        D1: users, sessions, notes, decks, similars, sync log
  the manifest of recording names              R2: recordings, pictures
  NO audio                                     KV: the speech cache
```

- **The app and the words stay public.** The decks' words and the recording *names* (hashes) reveal nothing. Only the audio bytes are
  private.
- **Audio:** `GET /api/audio/<language>/<variant>/<hash>.mp3` answers 401 without a good session and otherwise streams the object from
  R2, with `Cache-Control: private, max-age=31536000, immutable` (a recording is a pure function of its name) and byte ranges, which
  iOS needs to play it. No directory listing, no public bucket, no signed URL to share.
- **The generator** (`tools/`) writes recordings to a local, git-ignored folder, and `upload-audio` sends what is missing to R2.
  `recordings.json` stays in `content/`. `webapp/public/audio/` is git-ignored: the app build holds no audio.
- **The app's local copy:** a recording is fetched with the session cookie, kept in the **Cache API** (`recordings-v1`), and played
  from that, so it is fetched once and works offline after. A deck has a **"Keep offline"** action that fetches every recording the
  deck needs, a few at a time, with progress. The service worker precaches no audio: it serves the Cache API copy and passes anything
  else to the network. Signing out takes the recordings off the device.
- **Who is signed in:** the whole app sits behind sign-in. Signed out, the learner sees only the sign-in screen. A Google account on
  `ALLOWED_EMAILS` is the only way in (`api/AGENTS.md`).
- **Where the cookie works:** the deployed app and Worker share a registrable domain, so the `SameSite=Lax` session cookie is sent on
  the app's requests to the Worker. For `pnpm start:deployed`, a local proxy keeps both browser-facing hosts on `localhost` and
  forwards `/api/*` to the Worker; its allowed origins include the local app for return-address and CSRF checks. The deployed API
  host is one label below the domain (`flashcards-api`, not `api.flashcards`) because Cloudflare's free certificate covers
  `*.<domain>` and no deeper.

## What is left

1. **Deploy** (`MANUAL-SETUP-STEPS.md`): Cloudflare token, `provision`, Google OAuth redirect for the live host, `SITE_ORIGINS` and
   `ALLOWED_ORIGINS`, DNS for both hosts, the Pages custom domain, the Actions secrets, `upload-audio -- --remote`.
2. **Decks, full stack** (`docs/decks.md`): D1 `decks`, `deck_id` on notes, the routes, the fake API, and the sync of decks and each
   card's deck. Then Japanese and Dutch cards, then the dictionary.
3. **The rest of `docs/sync.md`.**

Real deployment and Google sign-in on the live host need the owner's accounts. Everything else runs locally: `wrangler` emulates D1,
R2 and KV, and the specs run against the fake API, which serves a recording behind a session.

## Open points

1. **Keep the speech cache in KV or move it to R2?** Recordings made on demand for the learner's own words are cached in KV
   (`speech/cache/`). R2 holds more and is cheaper to read; KV is fine at this size. Leave it, and move later if it matters.
2. **Pictures** use the same R2 bucket under their own prefix and the same session check.
