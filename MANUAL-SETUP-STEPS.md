# Manual setup steps

Everything that lives outside the repo. Update this file in the same change as anything that adds or removes such a step.
Never put tokens, account ids or zone ids here.

## Order for the online-served model (`docs/online.md`)

The app at **`flashcards.neilarmstrong.dev`** (GitHub Pages) and the Worker at **`flashcards-api.neilarmstrong.dev`**, both on the
`neilarmstrong.dev` Cloudflare zone, so the session cookie is same-site. Do these once, in order:

1. Section 4a: the Google OAuth client, with **both** redirect URIs (local and live).
2. Section 4b: the Cloudflare token, now including **R2**.
3. Section 1 (the repository) and section 2 (the app's domain). The recordings are never committed: they live in
   `private-source/recordings/` (git-ignored) and go to R2.
4. Keep `ALCHEMY_PASSWORD`, the Google client id and secret, the Azure key and the token somewhere safe (a password manager): the
   deploy and CI need the same values.

Then: `provision` (4c), the Worker's custom domain (4d), the audio upload (`pnpm --filter @language-learning/tools upload-audio -- --remote`, with the token in `.env.dev`), the Actions secrets (4e).

## 1. GitHub repository and Pages

1. Create the GitHub repository (public, open source) and push `main`.
2. Settings, Pages: set **Source** to **GitHub Actions**.
3. The first push to `main` runs `.github/workflows/ci.yml`: checks, acceptance tests on the production build, deploy, then
   the same acceptance suite against the live URL.

Until a custom domain is set, the live URL is the project Pages URL (`https://<user>.github.io/<repo>/`). The app is built
for the root path, so it will not work under that sub-path: do step 2 before relying on the deployment, or accept that the
production acceptance job is red until then.

## 2. The app's subdomain, `flashcards.neilarmstrong.dev`

1. Cloudflare DNS: add a **DNS-only** (not proxied) `CNAME` for the chosen subdomain pointing at `neil-armstrong-fig.github.io`.
2. Repo Settings, Pages: set the **Custom domain** and enable **Enforce HTTPS**. No `CNAME` file is needed, because deployment
   is by Actions.

## 3. Audio (Azure AI Speech, the speech engine for every language)

1. Azure portal, create a **Speech** resource (Azure AI services, Speech). Pricing tier **Free**, region **UK South** (any supported region works; the key only works against its own region).
   The free tier needs no credit card, but a new Azure account may still ask for one to sign up.
2. On the resource's **Keys and Endpoint** page, copy **Key 1** and the **Location/Region** (e.g. `uksouth`).
3. Put them in `.env.dev` at the repo root (git-ignored, owner-only) as `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION`. See
   `.env.example` for the names. Never paste a key into a chat, a doc or a commit.
4. Generate the recordings with `tools/` (`tools/AGENTS.md`). It reads the two names from `.env.dev` and spends the free tier's
   0.5 million characters a month: the starter deck uses a few hundred.
5. For the later Worker, the same key is set once with `wrangler secret put AZURE_SPEECH_KEY`.

## 4. The API (Cloudflare Worker): sign-in, similar words, speech

Needed for the "Compare sounds" panel's *Add* box and for signing in. Words shipped with the deck, and reviewing, listening and
everything else, work without it. A Worker holds the Azure key (so it never reaches the browser), signs you in with Google, keeps
the similar words you ask for in a database, and caches every recording Azure makes so a repeated word is paid for once.
**For now it is run locally** (`pnpm start:local`); steps 4b onwards are for deploying it later.

### 4a. A Google OAuth client (needed locally too)

The one thing no tool can create. Only the `openid` and `email` scopes are asked for, which are not sensitive, so no Google
verification is needed. It is a private **test app** with just your own account on it.

1. Create a project: `https://console.cloud.google.com/projectcreate`.
2. Branding and audience: `https://console.cloud.google.com/auth/overview`, *Get started*.
   - App name: anything (shown on the consent screen).
   - **User support email** is a dropdown of the signed-in Google account (and groups it manages): choose your own.
   - **Developer contact email**: your own address.
   - Audience **External**.
3. **Audience**, `https://console.cloud.google.com/auth/audience`: leave the app in **Testing** (do not publish it), and under
   *Test users* add your own Google address. While it is in Testing only listed test users can sign in. (The API also checks the
   address against its own allow-list, `ALLOWED_EMAILS`, so a second line of defence holds if the app is ever published.)
4. The client, `https://console.cloud.google.com/auth/clients/create`:
   - Type **Web application**.
   - Authorised redirect URIs: `http://localhost:8787/api/auth/google/callback` (local development). Add the deployed API's
     `https://flashcards-api.neilarmstrong.dev/api/auth/google/callback` for the live Worker (add both URIs now).
   - Copy the client id and secret; the secret may not be shown again.
5. Put them in `.env.dev` as `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_SECRET`, and set `ALLOWED_EMAILS` and
   `GOOGLE_REDIRECT_URI` (names in `api/.dev.vars.example`) there too. `pnpm api:dev` loads that one file (`wrangler dev --env-file ../.env.dev`),
   so there is no `api/.dev.vars` to keep in step, and Wrangler prefers one if it exists: delete it. Without any of these the API answers 500 and the app shows
   that sign-in cannot be reached. Never paste a secret into a chat, a doc or a commit.
6. Create the local database once: `pnpm --filter @language-learning/api db:migrate:local`.
7. `pnpm start:local`, open `http://localhost:3000`, you land on the **Sign in with Google** screen.

Session cookies are `SameSite=Lax`, so the app and the API must share a registrable domain: `localhost` does, and when deployed the
Worker must have a custom domain one label below the app's (for example `languages-api.example.dev` for `languages.example.dev`),
**not** `workers.dev`.

### 4b. A Cloudflare API token (to deploy)

1. A **Cloudflare account** (the free plan is enough; never enable a paid plan, since the spend guard assumes the free tier).
2. `https://dash.cloudflare.com/<account-id>/api-tokens`, *Create Custom Token*: **Workers** role **Admin** (scope *All Workers*),
   **D1 · Edit** (D1 is its own permission), **Workers KV Storage · Edit** and **Workers R2 Storage · Edit** (the private bucket for recordings and pictures). Account Resources: the account. No zone permissions:
   the custom domain is attached by hand (4d), so the token never touches DNS.

### 4c. The first deploy

From a machine, with these set in the environment (`infra/AGENTS.md` says what each is): `CLOUDFLARE_API_TOKEN`,
`CLOUDFLARE_ACCOUNT_ID`, `AZURE_SPEECH_KEY`, `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_SECRET`, `ALLOWED_EMAILS`, `ALCHEMY_PASSWORD` (any
long random string, e.g. `openssl rand -base64 32`; keep it, CI needs the same one), and `SITE_ORIGINS` (the app's address, once
decided; until then only `http://localhost:3000` is allowed):

```bash
pnpm --filter @language-learning/infra provision
```

It makes the D1 database (migrations applied), the two KV namespaces and the `flashcards-api` Worker. The script is called
`provision` because `pnpm deploy` is a built-in pnpm command.

### 4d. The Worker's custom domain, and the app's address

1. Dashboard, Workers, `flashcards-api`, Settings, Domains & Routes, Add, Custom domain: `flashcards-api.neilarmstrong.dev`: one label below the
   zone (Cloudflare's free certificate covers `<domain>` and `*.<domain>` only), so not `api.flashcards...`.
2. Set the repository variable `VITE_API_ORIGIN` (Settings, Secrets and variables, Actions, Variables) to `https://flashcards-api.neilarmstrong.dev`, so the
   build bakes it in, and `SITE_ORIGINS` to `https://flashcards.neilarmstrong.dev`. Add the API's callback address to the Google client (4a step 4).

### 4e. GitHub Actions secrets

`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `ALCHEMY_PASSWORD`, `AZURE_SPEECH_KEY`, `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_SECRET`,
`ALLOWED_EMAILS`; and the variables above. From then on every green `main` runs `deploy-api` in `.github/workflows/ci.yml`. Until
`CLOUDFLARE_API_TOKEN` exists that job does nothing.

### 4f. Limits (the spend guard)

The Worker refuses past 100,000 characters a month (a fifth of Azure's free 500,000), 20 new recordings a minute per address, 12
characters a request, Korean only, signed-in allow-listed accounts only, allowed origins only. A recording already made is served from
the cache and counts against nothing. Set an Azure budget alert if you ever move the resource off the free tier.
