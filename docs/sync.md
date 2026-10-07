# Syncing everything, with a copy kept on the device

Status: **decided** (2026-10-07), not yet built. The four decisions at the end are settled. The decision it rests on: *sync
everything, and cache locally so the app works offline*. Today the learner's own cards and their similars sync through the API
(`/api/notes`, `/api/similar`); progress, settings, notes and pictures live only on the device.

## Principles

- **The device is the source of truth for the screen.** Every read and write is local and instant; sync runs behind it. A learner
  with no signal studies exactly as now, and what they did is sent later. Nothing waits on the network.
- **Signed-in only.** Without an account the app is as it is today. The first sign-in on a device with progress **merges** (the
  union of the two sides, by the rules below); it never replaces one side with the other.
- **Nothing is lost silently.** Where two devices disagree, a rule picks one value, and anything it drops is still in the append-only
  review log.
- **Local storage is not enough.** It holds 5 MB of strings and blocks the page. Everything with weight (progress, pictures,
  recordings) is in IndexedDB, as progress and pictures already are, and recordings in the Cache API through the service
  worker. Ask the browser for durable storage (`navigator.storage.persist()`) once signed in, so it does not evict a learner's
  data when space runs short.

## What is synced, and how two devices are reconciled

| Thing                                 | Today                         | Rule when two devices disagree                                                                                                                                                              |
| ------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Review log (every answer)             | IndexedDB, device             | **Union by id** (`cardId` + time of answer). Append-only, so no conflict.                                                                                                                   |
| A card's state (due date, stability…) | IndexedDB, device             | **Replayed from the merged event log** (decision 1). No per-card timestamp.                                                                                                                   |
| Settings                              | localStorage, device          | **Latest wins, per setting** (a timestamp each). Some stay per device (decision 2).                                                                                                         |
| The learner's own cards               | API (D1) and device           | As now, plus a **tombstone** for a delete, so a card deleted on one device is not brought back by another.                                                                                    |
| Similars the learner added            | API (D1) and device           | As now, plus tombstones.                                                                                                                                                                    |
| Memory aids: a note per card          | device                        | **Latest wins, per card.**                                                                                                                                                                   |
| Memory aids: a picture per card       | IndexedDB, device             | Latest wins, per card. The image is a blob in **R2**, keyed by account and content hash, and the metadata (which card, which hash) syncs like a note. Uploads and downloads are lazy.        |
| Recordings of the learner's own words | KV (server cache), device     | Nothing to merge: a recording is a pure function of text, voice and speed. Fetched on demand and kept on the device.                                                                        |

## Transport

One endpoint, one cursor, for every entity except image bytes:

- The server keeps, per account, a **change log in D1**: `(seq, kind, id, payload, updatedAt, deleted)` with `seq` rising by one
  for each write. `kind` is one of `answer`, `card-state`, `setting`, `note`, `similar`, `memory-note`, `picture`.
- `POST /api/sync` with `{cursor, changes}`: the server applies the client's changes by the rules above, then returns every change
  after `cursor` and the new cursor. Idempotent: sending a change twice does nothing the second time, so a dropped response is safe.
- Images: `PUT /api/pictures/:hash` and `GET /api/pictures/:hash` to R2. The `picture` change names the hash; the device fetches
  the bytes when it needs them and keeps them.
- **When it runs:** at start, when the app returns to the foreground, a few seconds after the last answer (debounced), and when the
  browser says it is back online. The Background Sync API is not on iOS, so nothing relies on it.
- **Failure is quiet:** a failed sync is retried later and the learner is never blocked. A small "not synced yet" indicator is
  enough.

The existing per-entity routes move behind `/api/sync` once it works, so there is one path to test and keep correct.

## Pictures

Pictures are the one thing large enough to need care. They used to be refused over 5 MB and never resized (they still are over 5 MB, as the file chosen). Resizing before upload is
the simplest place: **the device draws the image on a canvas at a sensible size (say 1280 px on the long side, JPEG or WebP) before
keeping or sending it.** That is free, works offline, and means the stored and synced copy is small. The Worker still enforces a
ceiling (it rejects a body over 1 MB, say). Doing it in the Worker instead needs a Cloudflare image-transform binding, which has
its own quota and does nothing for a picture added offline. See decision 3.

## How it is tested

Acceptance specs run with a **fake API** already (`createFakeApi`). Sync adds a fake API whose state is shared by two browser
contexts, so a spec is two learners' devices: answer a card on one, open the other, and see it is no longer due; add a note offline,
go online, and see it arrive; delete a card on one and see it gone on the other and not restored. The merge rules are pure
functions and unit tested (the same union and latest-wins functions run in the app and in the Worker, in `shared/`).

## Decisions (2026-10-07)

1. **A card's state is rebuilt by replaying the merged log through FSRS.** So the log becomes an *event* log: `answer` (with the
   retention used), `suspend`, `unsuspend`, `bury` (with `until`) and `hard`. Auto-suspend is written as an ordinary `suspend`
   event when it happens, so a replay never reads settings. Events are ordered by (time, id), the same on every device. The card
   store is a cache of the replay. The Worker never replays: it stores events and unions them by id, so only the clients need the
   scheduler. Existing devices migrate once: each old log entry becomes an `answer` event, and each `suspended`, `markedHardAt` or
   `buriedUntil` flag becomes one event, so a replay reproduces today's state (a unit test proves it). A ts-fsrs upgrade changes
   what a replay gives, so it needs a replay-equality test first.
2. **Per device: theme, voice and speed.** Everything else (limits, goal, retention, struggling rules, deck preferences) is shared,
   latest wins per setting.
3. **Pictures are resized on the device** (canvas, about 1280 px, JPEG or WebP); the Worker rejects a body over 1 MB.
4. **Account deletion and JSON export come after sync works**, not in the first version.

## Built so far

- `shared/src/sync/`: `card-events/` (`CardEvent`, `cardEventId`), `settings/` and `records/` (below), and `isLaterChoice`. `webapp/src/spaced-repetition/replay/`: `replayEvents` (a card's state from its
  events, any order) and `eventsFromStoredStudy` (the one-off backfill).
- The study database is at version 2: an `events` store beside `cards` and `log`, written in the same transaction as each answer,
  suspend, bury, unsuspend and hard. The upgrade backfills it from what the device already holds. `cards` stays the cache the
  screen reads and `log` still counts the day's new cards; neither is replaced yet.

- The API: `POST /api/sync` with `{cursor, events, settings, recordCursor, records}`, answering `{cursor, more, events, settings,
  recordCursor, moreRecords, records}`, over `card_events`, `synced_settings` and `synced_records`, all made by the one migration
  `0001_add_sync_and_drop_notes_and_similar_words`.

- The app: `syncProgress` (`webapp/src/redux/workflows/sync/`) sends the events still in the `unsent` store (a copy made with every
  event this device writes), takes in the answer, replays each touched card from its whole history in one IndexedDB transaction,
  and saves the cursor (per account, in localStorage). It runs after sign-in on start, when the app returns to the foreground,
  when the browser comes back online, and four seconds after the last answer. The home screen shows `sync-status`.
- Two-device specs: `acceptance-tests/src/tests/sync/` over `secondDevice` and a fake account both devices share.
- Settings: `dailyGoalCards`, `deckLimits`, `strugglingAfter`, `setAsideWhenStruggling` and `desiredRetentionPercent` sync, each whole
  (a deck's limits are one setting), the later choice winning (`synced_settings`; `isLaterChoice` in `shared/`).
  Each device notes when it chose each (`flashcards.setting-times.v1`), sends them with every sync and takes any later one the API
  returns. Theme, voice, speed and every deck's own choices (`deckPreferences`) stay on the device. Times are compared as moments
  and written to the API as UTC ISO. Clocks differ between devices, so a choice made on a clock that is behind loses.
- A device holds one account's progress: the first to sync it owns it (`flashcards.sync-owner.v1`), and another account signing in
  is left unsynced rather than merged. A pull waits while an answer or a card being set aside is saved, so its result is not written
  over by the answer's own, which was worked out without it. Hiding, bringing back and marking hard are saved too quickly to need it.
- **Records** are what the learner makes, one thing each: `note` (their own card), `similar`, `memory-note` and `picture` (`RecordChange`
  in `shared/`). The later change to a thing wins, and a removal is a record with `deleted` set, so a device that has not heard of it is
  told rather than bringing the thing back. A changed record takes the next `seq`, which is the cursor a device reads from, apart from
  the events'. The migration that makes the table drops the old `notes` and `similar_words` tables without copying them: the cards
  and similar words made before sync were test data and are made again. `/api/notes` and `/api/similar` are gone.
- On the device, every change the learner makes is kept in the `records` store (the latest this device knows of each thing) and the
  `unsent-records` store (to send), by `recordLocalChange`, and the app never waits for the API: **adding, editing and deleting a card,
  a similar, a note or a picture work with no signal**. What still needs one is making a recording (adding or changing the words of a
  card or similar word): Azure is reached through the API, and a card that cannot be played is not added. Before anything is sent,
  `adoptLocalRecords` (once) makes records of what the device held from before, dated as the beginning of time where they have no
  date, so they lose to any change made since. A pull takes a change unless the device knows of a later one (`ApplyPulledRecords`), and
  taking one is idempotent. Recordings of words that arrived are then fetched (`react/audio/sync/KeepRecordingsOfOwnWords`).
- **Pictures** are re-encoded on the device (WebP, or JPEG where the browser cannot, at most 1280 px on the long side, at most 1 MB:
  `processPicture`), named by the SHA-256 of their bytes, sent to a private R2 bucket (`PUT /api/pictures/<hash>`, checked against the
  bytes, per account) before the record that announces them, and fetched by the device that hears of one. The 5 MB limit on the file
  chosen stays.
- Known limits: the picture bytes are fetched as soon as a record is heard rather than when needed. A learner who deletes a card on
  one device while another adds a similar word to it leaves that similar behind there until the card's removal reaches it (it is
  cleared then, with the card). Two devices editing the same card at once keep the later edit whole, not word by word.

## Order of work

1. Merge functions in `shared/`, unit tested. 2. The D1 change log and `/api/sync` with a fake-API spec. 3. Progress and settings
sync. 4. Notes and similars move behind it, with tombstones. 5. Pictures: resize, R2, lazy download. 6. The indicator and
durable storage. All of it needs the API deployed to be used for real (`MANUAL-SETUP-STEPS.md`), but 1 to 5 can be built and
specified against the fake API before then.
