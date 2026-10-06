# shared

Two things used by every other package: the base tool config (`config/`: ESLint, Prettier, TypeScript, Vitest) and a small vocabulary (`src/`: `Rating`, `Voice`, `Speed`, `Theme`, the text checks, byte ranges).

The vocabulary lives here, not in the webapp, because `acceptance-tests` may not import the webapp but must use the same words as the app. Nothing here depends on another package. See [AGENTS.md](AGENTS.md).
