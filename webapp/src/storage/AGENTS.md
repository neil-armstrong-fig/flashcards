# AGENTS.md: storage

The device's localStorage and IndexedDB behind plain functions. Redux calls `readStoredSettings()` or `recordAnswer(...)` and never
sees a key, a store name, a version or a database. Plain TypeScript: it may not import React, Redux, `redux/`, `react/` or `audio/`
(lint enforces it), and `spaced-repetition/` and `audio/` may not import it. It may import `spaced-repetition/` for the readers.

- **Two folders, one per mechanism**: `local-storage/` (`device/` is the only code that calls `localStorage`; then a folder per subject:
  `settings/`, `card-notes/`, `sync/cursors/`, ...) and `index-db/` (`study/`, `pictures/`, `sync/events/`, `sync/records/`; each
  `database/` folder is the only code that calls `idb`). One exported function per file. `sync/` appears in both, by mechanism.
- **Keys, database names, versions and store names are private to this folder.** A new key is `flashcards.<name>.v1`; change what a
  stored field means and the version rises. A change to an IndexedDB shape raises `DATABASE_VERSION` with an upgrade step, and never
  edits an old step.
- **localStorage gives back and takes `unknown`**: the slice's pure reader checks it, because the clamping and defaults are its rules
  (`readSettings`). **IndexedDB gives back checked, storage-owned shapes** (`StoredStudy`, `PulledProgress`, `KeptPicture`): what is
  read back is untrusted, so anything that fails its reader is dropped.
- **Never block the learner.** A write that fails is reported with `console.error` and the learner carries on in memory.
- **Tests** mock these modules by path in `testing/SetupWebappTests.ts` (backed by `testing/environment/`); localStorage is a fake there.
  A new effect module needs a `vi.mock` there, or a test reaches for the real database.
