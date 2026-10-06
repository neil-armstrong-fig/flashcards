import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/** When a card falls due, in milliseconds since the epoch. */
export function dueTime(card: StudyCard): number {
  return new Date(card.state.due).getTime();
}
