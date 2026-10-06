# Flash Cards

A spaced-repetition app for learning languages. Only personal access for now. It installs as a PWA, works offline, and speaks every card.

## Development

Requires Node 24.13.1 (`.nvmrc`) and pnpm.

```sh
pnpm install
pnpm install-browsers      # once, for the acceptance tests
pnpm start                 # dev server on http://localhost:3000
pnpm checks                # lint, format, types and unit tests
pnpm start:preview         # production build on http://localhost:3000
pnpm acceptance-tests      # in another terminal, against the preview
```

Work is acceptance-test driven: see `AGENTS.md`. The design is in `docs/PLAN.md` and what is next is in `TODO.md`.

## Licence

MIT. See `LICENSE`.
