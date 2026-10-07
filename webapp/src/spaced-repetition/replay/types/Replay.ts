import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

/** A card's history played out: where it stands, and the log entry each answer in it made. */
export interface Replay {
  readonly state: CardState;
  readonly log: readonly ReviewLogEntry[];
}
