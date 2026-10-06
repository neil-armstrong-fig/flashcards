import {fsrs} from "ts-fsrs";
import type {FSRS} from "ts-fsrs";

/**
 * The Free Spaced Repetition Scheduler (`ts-fsrs`), aiming for `desiredRetention` (0 to 1). A
 * library instance fixes its retention when made and keeps no state between calls, so each call makes its own. Fuzz is off, so
 * every interval is exact (`docs/scheduling.md`).
 */
export function freeSpacedRepetitionSchedulerFor(desiredRetention: number): FSRS {
  return fsrs({request_retention: desiredRetention, enable_fuzz: false});
}
