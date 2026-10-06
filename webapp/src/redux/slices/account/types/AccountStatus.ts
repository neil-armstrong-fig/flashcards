/**
 * Whether anyone is signed in. `unknown` until the API has been asked; then `signedIn` or `signedOut`; or `unreachable` where the API
 * could not be asked at all (offline, or not running).
 */
export const ACCOUNT_STATUSES = ["unknown", "unreachable", "signedOut", "signedIn"] as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];
