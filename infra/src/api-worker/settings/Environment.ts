/**
 * The settings of a deploy that are not secret, read from the environment with the defaults for this project's own account.
 * Someone standing the app up on their own account sets what differs.
 */
export const environment = {
  /**
   * Comma-separated origins allowed to call the API: the site, and the local dev server. Set `SITE_ORIGINS` to the app's own
   * address, which is not decided yet (`TODO.md`); until then only the dev server is allowed, so a deployed API answers nobody else.
   */
  allowedOrigins: process.env["SITE_ORIGINS"] ?? "http://localhost:3000",
  /**
   * Comma-separated Google accounts that may sign in: this is a private test app, so anybody else is turned away after Google. There is
   * no default, since a guess at whose address it is would be wrong: a deploy without it fails (`secrets/`).
   */
  allowedEmails: process.env["ALLOWED_EMAILS"] ?? "",
  /** The Azure Speech resource's region, which its key only works against. */
  azureSpeechRegion: process.env["AZURE_SPEECH_REGION"] ?? "uksouth",
};
