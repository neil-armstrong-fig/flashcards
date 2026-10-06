import type {CardPhase} from "@src/spaced-repetition/card/CardPhase";

/**
 * Everything the scheduler remembers about one card. Plain data with ISO timestamps, so it can be stored and read back
 * without a Date or a class in the way. A stored value is `unknown` until proven otherwise: see `ReadCardState`.
 */
export interface CardState {
  readonly phase: CardPhase;
  readonly due: string;
  readonly stability: number;
  readonly difficulty: number;
  readonly scheduledDays: number;
  readonly learningSteps: number;
  readonly reps: number;
  readonly lapses: number;
  /** When it was last answered, as an ISO timestamp. Absent for a card never answered. */
  readonly lastReview?: string;
  /** Hidden until the learner brings it back. A suspended card is never due. */
  readonly suspended: boolean;
  /** When the learner marked the card as hard, as an ISO timestamp. Absent when it is not marked. It counts as struggling until good answers given since then clear it. */
  readonly markedHardAt?: string;
  /** Hidden until this moment (the end of the study day it was buried on), as an ISO timestamp. Absent when it is not buried. */
  readonly buriedUntil?: string;
}
