# Syncing everything, with a copy kept on the device

Status: **design, to be confirmed** (2026-10-06). Nothing here is built. The decision it rests on: *sync
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
| A card's state (due date, stability…) | IndexedDB, device             | **Latest `updatedAt` wins, per card** (a field to add). The log keeps the loser's answer. See decision 1.                                                                                    |
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

Pictures are the one thing large enough to need care. Today they are refused over 5 MB and never resized. Resizing before upload is
the simplest place: **the device draws the image on a canvas at a sensible size (say 1280 px on the long side, JPEG or WebP) before
keeping or sending it.** That is free, works offline, and means the stored and synced copy is small. The Worker still enforces a
ceiling (it rejects a body over 1 MB, say). Doing it in the Worker instead needs a Cloudflare image-transform binding, which has
its own quota and does nothing for a picture added offline. See decision 3.

## How it is tested

Acceptance specs run with a **fake API** already (`createFakeApi`). Sync adds a fake API whose state is shared by two browser
contexts, so a spec is two learners' devices: answer a card on one, open the other, and see it is no longer due; add a note offline,
go online, and see it arrive; delete a card on one and see it gone on the other and not restored. The merge rules are pure
functions and unit tested (the same union and latest-wins functions run in the app and in the Worker, in `shared/`).

## Decisions to make

1. **A card's state: latest wins (recommended) or replay the log?** Latest-wins is simple and loses at most the effect of one
   review when two devices answer the same card offline (the log still has it). Replaying the merged log through FSRS is exact but
   needs suspend, bury and "this is hard" recorded as events too, and a scheduler that gives identical results on every device.
2. **Which settings are per device?** Suggested: theme, voice and speed per device (a phone may want a different voice from a
   laptop); limits, goal, retention and struggling rules shared.
3. **Resize pictures on the device (recommended) or in the Worker?**
4. **Deleting an account and exporting data.** Syncing everything makes these a real obligation: a "delete my data" button and a JSON
   export. In or out of the first version?

## Order of work

1. Merge functions in `shared/`, unit tested. 2. The D1 change log and `/api/sync` with a fake-API spec. 3. Progress and settings
sync. 4. Notes and similars move behind it, with tombstones. 5. Pictures: resize, R2, lazy download. 6. The indicator and
durable storage. All of it needs the API deployed to be used for real (`MANUAL-SETUP-STEPS.md`), but 1 to 5 can be built and
specified against the fake API before then.
