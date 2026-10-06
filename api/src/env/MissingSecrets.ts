import type {workerEnvironment} from "@src/env/WorkerEnvironment";

type Needed =
  "AZURE_SPEECH_KEY" | "AZURE_SPEECH_REGION" | "GOOGLE_OAUTH_CLIENT_ID" | "GOOGLE_OAUTH_SECRET" | "ALLOWED_EMAILS";

const NEEDED: readonly Needed[] = [
  "AZURE_SPEECH_KEY",
  "AZURE_SPEECH_REGION",
  "GOOGLE_OAUTH_CLIENT_ID",
  "GOOGLE_OAUTH_SECRET",
  "ALLOWED_EMAILS",
];

/** The names of what the Worker cannot work without and does not have, so a deploy that forgot one says which. */
export function missingSecrets(environment: Partial<Pick<typeof workerEnvironment, Needed>>): Needed[] {
  return NEEDED.filter(name => !environment[name]);
}
