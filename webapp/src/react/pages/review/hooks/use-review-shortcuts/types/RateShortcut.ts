import type {Rating} from "@flashcards/shared/study/Rating";

export interface RateShortcut {
  readonly kind: "rate";
  readonly rating: Rating;
}
