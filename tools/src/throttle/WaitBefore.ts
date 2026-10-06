/** How long to wait before a request may begin, given when the last one did: what is left of the interval, or nothing. */
export function waitBefore(lastStartedAt: number | undefined, intervalMs: number, now: number): number {
  if (lastStartedAt === undefined) {
    return 0;
  }

  return Math.max(0, lastStartedAt + intervalMs - now);
}
