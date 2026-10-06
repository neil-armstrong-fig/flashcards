import type {Rating} from "@flashcards/shared/study/Rating";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/** A card being answered: which answer, when, and how much of the learner's reviewing they want to remember. */
export interface ReviewRequest {
  readonly card: StudyCard;
  readonly rating: Rating;
  readonly now: Date;
  /** The chance of remembering a card at the moment it comes up again, from 0 to 1. Higher means more reviews. */
  readonly desiredRetention: number;
}
