import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

/** Everything kept between visits. Cards that have never been answered are not stored: they are new by default. */
export interface StoredStudy {
  readonly cards: Readonly<Record<string, CardState>>;
  readonly log: readonly ReviewLogEntry[];
}
