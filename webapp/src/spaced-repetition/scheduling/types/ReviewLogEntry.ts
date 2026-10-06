import type {CardPhase} from "@src/spaced-repetition/card/CardPhase";
import type {Rating} from "@language-learning/shared/study/Rating";

/** One answer, remembered. The log is how "new cards introduced today" is counted. */
export interface ReviewLogEntry {
  readonly cardId: string;
  readonly rating: Rating;
  readonly phaseBefore: CardPhase;
  readonly reviewedAt: string;
  readonly scheduledDays: number;
  readonly due: string;
}
