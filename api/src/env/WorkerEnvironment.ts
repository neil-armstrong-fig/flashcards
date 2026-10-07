import {env} from "cloudflare:workers";
import type {PicturesBucket} from "@src/buckets/pictures/types/PicturesBucket";
import type {RecordingsBucket} from "@src/buckets/recordings/types/RecordingsBucket";

// The Worker's bindings, variables and secrets; see wrangler.jsonc for where each one comes from.
interface ApiWorkerEnv {
  // The database: accounts, sessions, and the similar words a learner asked for.
  DB: D1Database;
  // Rate Limiting bindings, one counter each: speech requests, and sign-in attempts, by the address they come from.
  SPEECH_LIMITER: RateLimit;
  LOGIN_LIMITER: RateLimit;
  // The month's count of characters sent to Azure, one key a month. The spend guard (`speech/budget/`).
  SPEECH_BUDGET: KVNamespace;
  // Every recording Azure has made, by what was said and how: asked for twice, it is paid for once (`speech/cache/`).
  SPEECH_AUDIO: KVNamespace;
  // The private bucket of recordings, served to a signed-in account only (`recordings/`, `GET /api/audio/*`). Never public.
  RECORDINGS: RecordingsBucket;
  // The private bucket of the learner's pictures, each kept under the account and the hash of its bytes (`router/routes/pictures/`). Never public.
  PICTURES: PicturesBucket;
  // Comma-separated origins allowed to call the API with credentials: the site, plus the dev server locally.
  ALLOWED_ORIGINS: string;
  // Comma-separated Google accounts allowed to sign in. This is a private test app: anyone else is turned away after Google.
  ALLOWED_EMAILS: string;
  // The Azure Speech resource's region, such as `uksouth`.
  AZURE_SPEECH_REGION: string;
  // Secrets: set with `wrangler secret put`, or in .dev.vars locally. Never committed.
  AZURE_SPEECH_KEY: string;
  GOOGLE_OAUTH_CLIENT_ID: string;
  GOOGLE_OAUTH_SECRET: string;
  // Only for local dev, in `.dev.vars`: `wrangler dev` may report another host than the one registered with Google, so the callback
  // address is given outright, as `http://localhost:8787/api/auth/google/callback`.
  GOOGLE_REDIRECT_URI?: string;
  // Optional: the most characters to send to Azure in a month. The free tier is 500,000; the default is a fifth of it.
  MONTHLY_CHARACTER_CEILING?: string;
}

// Read from the runtime's global `env` rather than passed down from `fetch`, and always read at the point of use, never copied
// into a module-level `const`: a Worker is serverless, so an isolate can outlive a change to a variable or secret, and a value
// captured once at load would go on being served stale. `env` is typed as an empty interface until augmented, hence the cast.
export const workerEnvironment = env as ApiWorkerEnv;
