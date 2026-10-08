import {requiredEnvironment} from "@src/secrets/required-environment/RequiredEnvironment";

/**
 * The secrets a deploy needs, read from the environment once and available to whatever needs them: the Azure Speech key and the Google OAuth client's id and secret, which become Worker
 * secrets, the reminders' VAPID private key (its public key and subject are plain settings, named here so a deploy missing them fails too), the Google accounts allowed to sign in, and the password Alchemy encrypts secrets with in its state.
 *
 * Importing this is what checks they are set, all of them named together, so a deploy with one missing fails before it has made
 * anything. They are never written down here or passed through arguments; see `infra/AGENTS.md` for where they come from.
 */
export const secrets = requiredEnvironment(process.env, [
  "AZURE_SPEECH_KEY",
  "GOOGLE_OAUTH_CLIENT_ID",
  "GOOGLE_OAUTH_SECRET",
  "ALLOWED_EMAILS",
  "VAPID_PRIVATE_KEY",
  "VAPID_PUBLIC_KEY",
  "VAPID_SUBJECT",
  "ALCHEMY_PASSWORD",
]);
