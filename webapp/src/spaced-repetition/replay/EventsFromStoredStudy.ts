import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

interface StoredStudyAsEvents {
  readonly cards: Readonly<Record<string, CardState>>;
  readonly log: readonly ReviewLogEntry[];
  /** The retention the learner has chosen now, from 0 to 1: the log never recorded the one each answer used. */
  readonly retention: number;
  /** When this is done, for a card that was set aside but never answered. */
  readonly now: Date;
}

/**
 * The events a device that predates them would have recorded: one `answer` for each log entry, and one event for each way a card
 * is set aside or flagged now. Those are dated when the card was last answered (or `now`), after its answers, so a replay lands on
 * the state the card has today.
 */
export function eventsFromStoredStudy({cards, log, retention, now}: StoredStudyAsEvents): CardEvent[] {
  const answers = log.map((entry): CardEvent => {
    return {cardId: entry.cardId, kind: "answer", at: entry.reviewedAt, rating: entry.rating, retention};
  });
  const flags = Object.entries(cards).flatMap(([cardId, state]) => flagEvents(cardId, state, now));

  return [...answers, ...flags];
}

function flagEvents(cardId: string, state: CardState, now: Date): CardEvent[] {
  const at = state.lastReview ?? now.toISOString();
  const events: CardEvent[] = [];

  if (state.markedHardAt) {
    events.push({cardId, kind: "hard", at: state.markedHardAt});
  }

  if (state.buriedUntil) {
    events.push({cardId, kind: "bury", at, until: state.buriedUntil});
  }

  if (state.suspended) {
    events.push({cardId, kind: "suspend", at});
  }

  return events;
}
