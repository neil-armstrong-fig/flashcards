import type {Rating} from "@language-learning/shared/study/Rating";

export interface RateShortcut {
  readonly kind: "rate";
  readonly rating: Rating;
}
