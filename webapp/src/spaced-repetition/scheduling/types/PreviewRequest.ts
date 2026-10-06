import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/** A card about to be answered: when, and how much of the learner's reviewing they want to remember. */
export interface PreviewRequest {
  readonly card: StudyCard;
  readonly now: Date;
  /** The chance of remembering a card at the moment it comes up again, from 0 to 1. Higher means more reviews. */
  readonly desiredRetention: number;
}
