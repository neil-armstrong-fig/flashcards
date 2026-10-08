import {allowedOrigins} from "@src/api-worker/settings/allowed-origins/AllowedOrigins";

/**
 * The settings of a deploy that are not secret, read from the environment with the defaults for this project's own account.
 * Someone standing the app up on their own account sets what differs.
 */
export const environment = {
  /**
   * Comma-separated origins allowed to call the API: the configured sites, plus the local dev server through its deployed-API proxy.
   */
  allowedOrigins: allowedOrigins(process.env["SITE_ORIGINS"]),
  /**
   * Comma-separated Google accounts that may sign in: this is a private test app, so anybody else is turned away after Google. There is
   * no default, since a guess at whose address it is would be wrong: a deploy without it fails (`secrets/`).
   */
  allowedEmails: process.env["ALLOWED_EMAILS"] ?? "",
  /** The public half of the key reminders' pushes are signed with, which the app subscribes with, and how a push service may reach the sender. No defaults: a deploy without them fails (`secrets/`). */
  vapidPublicKey: process.env["VAPID_PUBLIC_KEY"] ?? "",
  vapidSubject: process.env["VAPID_SUBJECT"] ?? "",
  /** The Azure Speech resource's region, which its key only works against. */
  azureSpeechRegion: process.env["AZURE_SPEECH_REGION"] ?? "uksouth",
};
