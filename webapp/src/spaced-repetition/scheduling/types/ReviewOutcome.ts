import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

/** What answering a card changes: its new state, and the log entry to keep. */
export interface ReviewOutcome {
  readonly state: CardState;
  readonly log: ReviewLogEntry;
}
