import type {CardState} from "@src/spaced-repetition/card/types/CardState";

/** A card as stored: its id is the key, so one record per card. */
export interface StoredCard {
  readonly id: string;
  readonly state: CardState;
}
