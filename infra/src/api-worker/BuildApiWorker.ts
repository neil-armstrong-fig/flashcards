import alchemy from "alchemy";
import {Worker} from "alchemy/cloudflare";
import type {D1Database, R2Bucket} from "alchemy/cloudflare";
import {apiPath} from "@src/paths/ApiPath";
import {buildLoginLimiter} from "@src/api-worker/rate-limiters/BuildLoginLimiter";
import {buildSpeechLimiter} from "@src/api-worker/rate-limiters/BuildSpeechLimiter";
import {buildSpeechAudio} from "@src/api-worker/kv-namespaces/BuildSpeechAudio";
import {buildSpeechBudget} from "@src/api-worker/kv-namespaces/BuildSpeechBudget";
import {environment} from "@src/api-worker/settings/Environment";
import {secrets} from "@src/secrets/Secrets";

/**
 * The API's Worker, bound to the resources it is given, to the two key-value namespaces (the month's spend counter, and the recordings already made) and the two rate limiters it makes for itself, to the origins it
 * answers, the Google accounts that may sign in, and the Azure and Google secrets. Given its own `workers.dev` address; the custom domain is the owner's to
 * attach by hand. Adopted by name where it already exists.
 *
 * The binding names are what `api/src/env/WorkerEnvironment.ts` reads: change one there and here together.
 */
interface WorkerResources {
  readonly database: D1Database;
  readonly recordings: R2Bucket;
}

export async function buildApiWorker({database, recordings}: WorkerResources): ReturnType<typeof Worker> {
  const speechBudget = await buildSpeechBudget();
  const speechAudio = await buildSpeechAudio();

  return Worker("api", {
    name: "flashcards-api",
    entrypoint: apiPath("src", "ApiWorker.ts"),
    compatibilityDate: "2026-09-01",
    adopt: true,
    url: true,
    bindings: {
      DB: database,
      SPEECH_BUDGET: speechBudget,
      SPEECH_AUDIO: speechAudio,
      RECORDINGS: recordings,
      SPEECH_LIMITER: buildSpeechLimiter(),
      LOGIN_LIMITER: buildLoginLimiter(),
      ALLOWED_ORIGINS: environment.allowedOrigins,
      ALLOWED_EMAILS: environment.allowedEmails,
      AZURE_SPEECH_REGION: environment.azureSpeechRegion,
      AZURE_SPEECH_KEY: alchemy.secret(secrets.AZURE_SPEECH_KEY),
      GOOGLE_OAUTH_CLIENT_ID: alchemy.secret(secrets.GOOGLE_OAUTH_CLIENT_ID),
      GOOGLE_OAUTH_SECRET: alchemy.secret(secrets.GOOGLE_OAUTH_SECRET),
    },
  });
}
