# api

A Cloudflare Worker the app calls for what a card never needs: Google sign-in, the learner's own cards and similar words (D1), recordings served from a private R2 bucket, and speech from Azure (the key stays here).

Imports `shared` only. Run it locally with `pnpm api:dev`. See [AGENTS.md](AGENTS.md).
