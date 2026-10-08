import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

/** What other devices' events changed here: each card they touched as it now stands, and every answer in those cards' histories. */
export interface PulledProgress {
  readonly cards: Readonly<Record<string, CardState>>;
  readonly log: readonly ReviewLogEntry[];
}
