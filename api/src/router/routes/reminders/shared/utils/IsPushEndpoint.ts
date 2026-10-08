const MAX_ENDPOINT_LENGTH = 2048;

/** The address a push service gave, which the Worker will later post to: https only. */
export function isPushEndpoint(value: unknown): value is string {
  if (typeof value !== "string" || value.length > MAX_ENDPOINT_LENGTH) {
    return false;
  }

  return URL.canParse(value) && new URL(value).protocol === "https:";
}
