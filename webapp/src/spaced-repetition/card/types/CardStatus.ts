import type {CardStatusKind} from "@src/spaced-repetition/card/CardStatusKind";

export interface CardStatus {
  readonly kind: CardStatusKind;
  /** For a `scheduled` card, how long until it is due, in milliseconds; otherwise absent. */
  readonly dueInMs?: number;
}
