# content

The decks: every word the app teaches, as typed data (`korean/`, `japanese/`), how a note becomes two cards (`cards/`), and the manifest of recordings made for them (`audio/`).

**Why it is a package of its own.** The words started inside `webapp/`. It became a package when `tools/` needed the same words to know which recordings to make, and the webapp, the CLI and (later) the API must read one list. It is plain data with no React or Redux, so anything above it can import it.

Imports `shared` only. See [AGENTS.md](AGENTS.md).
