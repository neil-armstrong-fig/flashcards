import type {CardState} from "@src/spaced-repetition/card/types/CardState";

/** A card the learner studies: a stable identity, and what the scheduler knows about it. */
export interface StudyCard {
  readonly id: string;
  readonly state: CardState;
}
