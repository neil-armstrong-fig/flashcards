import type {Rating} from "@language-learning/shared/study/Rating";
import type {IntervalPreview} from "@src/spaced-repetition/scheduling/types/IntervalPreview";
import type {PreviewRequest} from "@src/spaced-repetition/scheduling/types/PreviewRequest";
import {freeSpacedRepetitionSchedulerFor} from "@src/spaced-repetition/scheduling/free-spaced-repetition-scheduler/FreeSpacedRepetitionSchedulerFor";
import {gradeOfRating} from "@src/spaced-repetition/scheduling/free-spaced-repetition-scheduler/GradeOfRating";
import {toFreeSpacedRepetitionSchedulerCard} from "@src/spaced-repetition/scheduling/free-spaced-repetition-scheduler/ToFreeSpacedRepetitionSchedulerCard";

/** How long until the card comes back for each rating, so the buttons can say so before one is chosen. */
export function previewIntervals({card, now, desiredRetention}: PreviewRequest): IntervalPreview {
  const options = freeSpacedRepetitionSchedulerFor(desiredRetention).repeat(
    toFreeSpacedRepetitionSchedulerCard(card.state),
    now,
  );
  const untilDue = (rating: Rating): number => {
    return options[gradeOfRating(rating)].card.due.getTime() - now.getTime();
  };

  return {
    again: untilDue("again"),
    hard: untilDue("hard"),
    good: untilDue("good"),
    easy: untilDue("easy"),
  };
}
