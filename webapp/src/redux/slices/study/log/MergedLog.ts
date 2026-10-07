import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

/**
 * The log with the answers a sync has worked out again put in it. An answer is the one it was when it has the same card and moment, and
 * what is worked out now replaces it: replaying another device's answers beside this one's can change which of two was the first to
 * introduce a card, and so the phase it was answered from, which is what counts the day's new cards. An answer not in the log is added.
 */
export function mergedLog(log: readonly ReviewLogEntry[], worked: readonly ReviewLogEntry[]): ReviewLogEntry[] {
  const replacements = new Map(worked.map(entry => [keyOf(entry), entry]));
  const kept = log.map(entry => replacements.get(keyOf(entry)) ?? entry);
  const held = new Set(log.map(keyOf));

  return [...kept, ...worked.filter(entry => !held.has(keyOf(entry)))];
}

function keyOf(entry: ReviewLogEntry): string {
  return `${entry.cardId}|${entry.reviewedAt}`;
}
