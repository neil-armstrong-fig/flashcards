import type {Rating} from "@flashcards/shared/study/Rating";
import type {ReviewOutcome} from "@src/spaced-repetition/scheduling/types/ReviewOutcome";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/** An answer just given: what it was, when, how much to remember was aimed for, and what it did to the card. */
export interface AnswerEventsRequest {
  readonly cardId: string;
  readonly rating: Rating;
  readonly now: Date;
  readonly retention: number;
  readonly outcome: ReviewOutcome;
  readonly previous: StudyCard;
}
