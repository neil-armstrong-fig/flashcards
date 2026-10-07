# Infrastructure architecture

This is the current, implemented shape of the online infrastructure. The route
list comes from
[`HTTP_ROUTES`](../api/src/router/dispatch/HttpRoutes.ts); planned deck, lookup,
picture and sync routes are not shown.

## Why the namespaces exist

A Cloudflare KV namespace is an independent key/value store bound to the Worker.
The two namespaces keep unrelated data and lifecycles separate:

| Binding | Kind | Purpose |
| --- | --- | --- |
| `SPEECH_BUDGET` | KV namespace | Holds one character counter per month, so the Worker can stop before it exceeds the Azure Speech allowance. |
| `SPEECH_AUDIO` | KV namespace | Caches generated MP3s by what was spoken and how, so an identical request does not call or charge Azure twice. |

The rate limiters also have namespace IDs, but these are not KV stores. Cloudflare
uses each stable ID as a separate counter space: `2001` counts speech cache
misses (20 per minute per client address), while `2002` counts Google sign-in
starts and callbacks (10 per minute per client address). One kind of traffic can
therefore never consume the other one's allowance.

## Current topology and routes

```mermaid
flowchart LR
  operator["infra/<br/>Alchemy"]
  app["GitHub Pages<br/>PWA in the browser"]
  apiDomain["Custom API domain<br/>attached manually"]
  google["Google OAuth"]
  azure["Azure Speech"]

  subgraph cloudflare[Cloudflare]
    subgraph worker[flashcards-api Worker]
      gateway["OPTIONS preflight<br/>CORS, exact route match and CSRF check"]
      authStart["GET /api/auth/google"]
      authCallback["GET /api/auth/google/callback"]
      logout["POST /api/auth/logout"]
      session["D1 session guard"]
      me["GET /api/me"]
      similar["GET /api/similar<br/>POST /api/similar<br/>DELETE /api/similar"]
      notes["GET /api/notes<br/>POST /api/notes<br/>PUT /api/notes<br/>DELETE /api/notes"]
      speech["POST /api/speech"]
      audio["GET /api/audio/*"]
      pictures["GET and PUT /api/pictures/*"]
      sync["POST /api/sync"]
    end

    database[("D1: flashcards<br/>users, sessions, card events, settings, records")]
    recordings[("Private R2<br/>flashcards-recordings")]
    pictureBucket[("Private R2<br/>flashcards-pictures")]
    speechAudio[("KV: SPEECH_AUDIO<br/>generated MP3 cache")]
    speechBudget[("KV: SPEECH_BUDGET<br/>monthly character count")]
    loginLimiter["Rate limiter 2002<br/>10 sign-in requests/minute/address"]
    speechLimiter["Rate limiter 2001<br/>20 speech misses/minute/address"]
    config["Settings and secrets<br/>origins, allow-list, Google and Azure"]
  end

  operator -. "provisions and binds" .-> gateway
  app -->|HTTPS with session cookie| apiDomain --> gateway
  config --> gateway

  gateway --> authStart
  gateway --> authCallback
  gateway --> logout
  gateway --> session
  session --> me
  session --> similar
  session --> notes
  session --> speech
  session --> audio
  session -->|validate session| database

  authStart --> loginLimiter
  authStart -->|redirect browser| google
  google -->|OAuth code| authCallback
  authCallback --> loginLimiter
  authCallback -->|create account and session| database
  logout -->|delete session when present| database
  similar --> database
  notes --> database

  speech -->|read first| speechAudio
  speech -->|cache miss| speechLimiter
  speechLimiter --> speechBudget
  speechBudget --> azure
  azure -->|cache generated MP3| speechAudio
  audio -->|private range read| recordings
  pictures -->|by account and hash| pictureBucket
  sync --> database
```

Alchemy creates or adopts the Worker, D1 database, R2 buckets, KV namespaces and
rate limiters, then binds them to the Worker. The custom domain is deliberately a
manual Cloudflare dashboard step. The R2 bucket has no public address and is kept
when the rest of the Alchemy application is destroyed.

Every route after the session guard returns `401` without a current session. The
logout route is intentionally outside that guard: it succeeds even when there is
no session, and deletes the session from D1 only when the request carries one.
The speech limiter is consulted only after the MP3 cache misses.
