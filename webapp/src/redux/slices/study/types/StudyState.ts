import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {SessionState} from "@src/redux/slices/study/types/SessionState";
import type {StudyStatus} from "@src/redux/slices/study/types/StudyStatus";

export interface StudyState {
  readonly status: StudyStatus;
  /** Deck order, which is the order new cards are introduced in. */
  readonly cardOrder: readonly string[];
  readonly cards: Readonly<Record<string, CardState>>;
  readonly log: readonly ReviewLogEntry[];
  /** The moment the state was last brought up to date, as an ISO timestamp. What "due today" is measured against. */
  readonly now: string;
  /** Absent when no session is open. */
  readonly session?: SessionState;
}
