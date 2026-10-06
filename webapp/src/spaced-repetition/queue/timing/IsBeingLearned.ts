import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/** Whether a card is on its learning steps, for the first time or after a lapse, rather than new or in review. */
export function isBeingLearned(card: StudyCard): boolean {
  return card.state.phase === "learning" || card.state.phase === "relearning";
}
