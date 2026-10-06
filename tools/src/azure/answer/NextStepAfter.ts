export const MAX_ATTEMPTS = 5;
const DEFAULT_RETRY_WAIT_MS = 30_000;

/** What to do with an answer from Azure: use it, wait and ask again, or stop. */
export type NextStep = {readonly kind: "use"} | {readonly kind: "wait"; readonly ms: number} | {readonly kind: "stop"};

interface Answer {
  readonly status: number;
  /** The `Retry-After` header, in seconds, or absent where there is none. */
  readonly retryAfter?: string;
  /** Which try this was, from one. */
  readonly attempt: number;
}

/**
 * A 429 is waited out and tried again: most come from a voice's regional capacity rather than the quota (`docs/audio.md`).
 * Anything else that is not a success stops the run, as does a 429 that goes on past the last try.
 */
export function nextStepAfter({status, retryAfter, attempt}: Answer): NextStep {
  if (status >= 200 && status < 300) {
    return {kind: "use"};
  }

  if (status !== 429 || attempt >= MAX_ATTEMPTS) {
    return {kind: "stop"};
  }

  const seconds = Number(retryAfter);

  if (Number.isFinite(seconds) && seconds > 0) {
    return {kind: "wait", ms: seconds * 1_000};
  }

  return {kind: "wait", ms: DEFAULT_RETRY_WAIT_MS};
}
