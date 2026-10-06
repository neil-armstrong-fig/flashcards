# AGENTS.md: infra

The Cloudflare resources for the API, as code, with [Alchemy](https://alchemy.run) (the 0.x line: `latest` on npm is the 2.0 beta
rewrite). Modelled on janggi's `infra/` (https://github.com/neil-armstrong-fig/janggi). `src/ApiInfrastructure.ts` puts together `src/api-database/` (the D1 database, with the migrations Drizzle
generated into `api/migrations/`), `src/api-buckets/` (the private R2 bucket of recordings, kept when the rest is destroyed) and
`src/api-worker/` (the Worker bound to them, with its two rate limiters and its two KV namespaces: the month's character counter and the recordings cache). It is what someone
standing the app up on their own Cloudflare account runs, and what CI runs for this one.

It imports no other package: it names the Worker's entry file by path (`src/paths/ApiPath.ts`, checked to exist), and Alchemy
bundles and uploads it.

## What it does not do, on purpose

- **The domain.** The Worker gets its `workers.dev` address, **but sign-in needs a custom domain** on the app's registrable domain (the session cookie is `SameSite=Lax`): a dashboard step, `MANUAL-SETUP-STEPS.md` 4d. The webapp finds the API at
  `VITE_API_ORIGIN` at build time (`MANUAL-SETUP-STEPS.md`, step 4).
- **The site's address.** `SITE_ORIGINS` is the comma-separated deployed origins the Worker answers. The local dev server is always
  added for `pnpm start:deployed`; set the deployed origins before a deploy that matters.
- **The Google OAuth client**, which Google lets nobody create from code. Create one (`MANUAL-SETUP-STEPS.md` 4a) and give this its id and secret.
- **GitHub**: repository secrets and variables, Pages. Manual.

## Running it

```bash
export CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... AZURE_SPEECH_KEY=... GOOGLE_OAUTH_CLIENT_ID=... GOOGLE_OAUTH_SECRET=... ALLOWED_EMAILS=... ALCHEMY_PASSWORD=...   # never in a chat, a doc or a commit
pnpm --filter @flashcards/infra provision     # creates or adopts by name, deploys, prints the address
pnpm --filter @flashcards/infra destroy       # removes what it made
```

Secrets are read once by `src/secrets/Secrets.ts`, which names every missing one together before anything is made, and are
never passed through arguments. `.env.dev` holds `AZURE_SPEECH_KEY`: load it in a subshell (`set -a; . ./.env.dev; set +a`),
never read its values. The token needs Workers (Admin), D1 (Edit), Workers KV Storage (Edit) and Workers R2 Storage (Edit), and no zone permission.

**This was type-checked and unit tested but never run against Cloudflare**: no token was available. Expect to fix the first
real `provision`. CI keeps no Alchemy state between runs (`ALCHEMY_CI_STATE_STORE_CHECK=false`), which works because the resources
are adopted by name; renaming or removing one leaves the old behind (the tradeoff janggi's `docs/alchemy-state.md` lays
out). The CI job is inert until `CLOUDFLARE_API_TOKEN` exists.

## Layout

```
src/ApiInfrastructure.ts   the file a deploy runs, and the whole of what is infrastructure
src/api-database/          BuildApiDatabase: the D1 database and its migrations
src/api-buckets/           BuildRecordings: the private R2 bucket (`delete: false`, so `destroy` leaves the recordings)
src/api-worker/            BuildApiWorker, rate-limiters/ (BuildSpeechLimiter and BuildLoginLimiter: the namespace ids and numbers match api/wrangler.jsonc); kv-namespaces/ (BuildSpeechBudget and BuildSpeechAudio); settings/
src/secrets/               `export const secrets`, checked on import; required-environment/
src/paths/ApiPath.ts       absolute paths into the API package, checked to exist
```
