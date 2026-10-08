# On-device storage: a library, and out of Redux

**Decided 2026-10-08: use `idb`. Done** (pinned 8.0.3; see "Done" at the end). **Moving storage out of `redux/` into
`webapp/src/storage/`: done** (see "Out of Redux" below for what was built).

## What there was before the move

- **IndexedDB, by hand.** `redux/slices/study/storage/indexed-db/` (`OpenStudyDatabase`, `BackfillEvents`, `PutEvents`,
  `MarkEventsUnsent`, `StudyStores`), `redux/slices/card-pictures/indexed-db/`, and `redux/shared/indexed-db/` (`requestResult`
  and `transactionDone`, which are the promise wrappers a library would give for free). One `flashcards` database at version 4
  with a chain of `oldVersion < n` upgrade steps, and a separate picture database.
- **localStorage, by `readJson` / `saveJson`** (`redux/shared/device-storage/`), used by settings, deck, notes, similar,
  account, sync cursors and owner. Every key is read as `unknown` and checked by its own loader.
- **Where it sits.** `storage/` folders hang off each slice or workflow, and thunks call them. Reducers and selectors are
  already pure and never touch storage. So the I/O is not in the reducers; it is in `redux/` only as a folder, and
  `redux/` is the only layer allowed to know about it. The test setup mocks about a dozen `redux/**/storage/*` modules by path
  (`SetupWebappTests.ts`), which is the cost of the I/O living inside the layer that is under test.

## A library: use `idb`

| Option         | Size (approx.)     | Fits?                                                                                                        |
| -------------- | ------------------ | ------------------------------------------------------------------------------------------------------------ |
| **`idb`** 8.x  | about 1.2 kB brotli | Yes. Promise wrapper over the same API (ISC licence, Jake Archibald, still releasing). `openDB` takes an `upgrade(db, oldVersion, newVersion, transaction)` callback, which maps one to one onto what we have, and a typed `DBSchema` gives typed stores and keys. |
| `idb-keyval`   | under 1 kB         | No. Key and value only: our stores are keyed by compound keys (`["cardId", "at", "kind"]`) and scanned.      |
| Dexie 4.x      | about 50 kB (unconfirmed) | No. Queries and live queries we do not need; a second schema language; the largest of the three; one thesis measured it 2 to 4 times slower than `idb` on inserts (50k to 1M rows, so not our scale). |
| RxDB, PouchDB  | large              | No. They bring their own sync and conflict model; ours is the event log (`docs/sync.md`).                    |

What `idb` would delete: `requestResult`, `transactionDone`, and the callback-style `onupgradeneeded` plumbing. What it would not
change: the store layout, the version chain, the `readCardState`-style validation on the way out (still `unknown` until checked).

Tests: `fake-indexeddb` (Apache-2.0, 6.x) would let the real IndexedDB code run under Vitest, so some of the in-memory
stand-ins (`MemoryStudyStorage`, `MemoryCardPictures`) could go and the real module be tested instead. Check whether that is a
win before removing them: the stand-ins also serve the acceptance-free unit tests of thunks.

Every `index-db/` module now has a real test beside it (study, pictures, sync events, sync records); the stand-ins stay for the thunk tests.

`fake-indexeddb` 6.2.5 is added (a dev dependency of `webapp`, approved). `idb` is pinned at **8.0.3**, not
the newest 8.0.4, which was published on 2026-10-06 and so falls inside the seven-day window.

## Out of Redux

Built: a top-level `webapp/src/storage/` beside `audio/`, plain TypeScript with no React and no Redux, in folders by subject:

```
storage/
  local-storage/   device/ (readJson / saveJson, the only code that calls localStorage), then a folder per subject:
                   settings/ setting-times/ card-notes/ similar/ deck/ account/ (the key and ReadStoredX / KeepStoredX:
                   read gives back `unknown`, keep takes `unknown`), sync/cursors/ sync/owner/ sync/records-adopted/
  index-db/        study/ (LoadStoredStudy, RecordAnswer, SaveCard, database/, types/), pictures/ (the picture effects,
                   database/, stored-picture/, types/), sync/events/ and sync/records/ (over the study database)
```

- `redux/` and `react/` may import `storage/`; `storage/` may import `spaced-repetition/`, `shared` and `content` but not `redux/`,
  `react/` or `audio/` (`webapp/eslint.config.js`). `spaced-repetition/` and `audio/` may not import it.
- Storage owns every key, store name, database version and upgrade step, so no thunk or slice sees one.
- For IndexedDB it also owns the stored shapes and the checking on the way in (`StoredCard`, `PulledProgress`, `KeptPicture`).
- For localStorage it returns `unknown` and the slice's pure reader checks it (`readSettings`, `loadCardNotes`): clamping, defaults and
  the Korean-word check are the slice's rules, and `readSettings` is also used for settings that arrive from sync.
- The slice folders' `persistence/` hold the redux side only: `Load*` (read the stored value, check it, give the state) and `Keep*`
  (the store subscriber that writes when the slice changes).
- The one rule storage had to copy is the retention default in the version-2 upgrade (`BackfillEvents`), which can no longer ask the settings slice.
- `SetupWebappTests.ts` still mocks the effect modules by path, now all under `@src/storage/`.

## Sources

- idb: https://github.com/jakearchibald/idb
- Comparison write-ups used (secondary, sizes approximate): https://rxdb.info/articles/indexeddb/best-indexeddb-wrapper.html and
  https://docs.bswen.com/blog/2026-04-07-indexeddb-libraries-dexie-idb-rxdb
- Dexie vs idb thesis: https://trepo.tuni.fi/handle/10024/158831

## Done

`idb` 8.0.3 is in the catalog and `webapp`. `OpenStudyDatabase` and `OpenPictureDatabase` use `openDB` with typed schemas
(`indexed-db/types/StudyDatabase`, `PictureDatabase`: every value is `unknown`, so what is read back still has to pass a reader), the
upgrade steps are the same but create the stores first and then run the data steps (`backfillEvents`, `markEventsUnsent`, now
async), and `redux/shared/indexed-db/` (`requestResult`, `transactionDone`) is gone. A multi-store write is
`await Promise.all([...puts, transaction.done])`, which keeps it all-or-nothing and reports one failure.

**Proved by `OpenStudyDatabase.test.ts`** (with `fake-indexeddb`), which builds a version 1, 2 and 3 database and opens each. The
acceptance runs cannot: each starts with an empty database, so `backfillEvents` only ever saw empty stores and `markEventsUnsent` (a
version 2 database going to 4) never ran. Both were rewritten, and are now run over each old version.
