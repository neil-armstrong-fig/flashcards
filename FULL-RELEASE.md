# Full release

Work that waits until the app is opened to anyone beyond the sole OAuth test user. Not on the active `TODO.md`.

- [ ] **Delete my data.** Build from scratch: `DELETE /api/account` removing the account's R2 pictures (listed by prefix, paged)
  and its rows in every table in one D1 batch, clearing the session cookie; then a "Delete my account" button in settings with a
  confirmation, which runs "Clear this device" so the device does not keep the old cursor and `flashcards.sync-owner.v1`
  (`docs/sync.md`). Acceptance spec first; the fake API needs the route. Pictures go before the rows.
- [ ] **JSON export.** `GET /api/export`: events, settings and records as a download. Decide whether pictures are hashes only or
  base64 bytes.
