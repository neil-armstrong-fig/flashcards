import type {ReviewOutcome} from "@src/spaced-repetition/scheduling/types/ReviewOutcome";
import type {ReviewRequest} from "@src/spaced-repetition/scheduling/types/ReviewRequest";
import {freeSpacedRepetitionSchedulerFor} from "@src/spaced-repetition/scheduling/free-spaced-repetition-scheduler/FreeSpacedRepetitionSchedulerFor";
import {gradeOfRating} from "@src/spaced-repetition/scheduling/free-spaced-repetition-scheduler/GradeOfRating";
import {toCardState} from "@src/spaced-repetition/scheduling/free-spaced-repetition-scheduler/ToCardState";
import {toFreeSpacedRepetitionSchedulerCard} from "@src/spaced-repetition/scheduling/free-spaced-repetition-scheduler/ToFreeSpacedRepetitionSchedulerCard";

/** The card as it stands after being answered at `now`, and the log entry for it. The card passed in is not changed. */
export function reviewCard({card, rating, now, desiredRetention}: ReviewRequest): ReviewOutcome {
  const {card: next} = freeSpacedRepetitionSchedulerFor(desiredRetention).next(
    toFreeSpacedRepetitionSchedulerCard(card.state),
    now,
    gradeOfRating(rating),
  );
  const state = toCardState(next, card.state);

  return {
    state,
    log: {
      cardId: card.id,
      rating,
      phaseBefore: card.state.phase,
      reviewedAt: now.toISOString(),
      scheduledDays: state.scheduledDays,
      due: state.due,
    },
  };
}
