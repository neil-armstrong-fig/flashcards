import type {CardPhase} from "@src/spaced-repetition/card/CardPhase";
import type {DueCounts} from "@src/spaced-repetition/queue/types/DueCounts";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/** Counts the cards chosen for today by kind, so the split can never disagree with the total: it is made from the same cards. */
export function dueCountsOf(dueToday: readonly StudyCard[]): DueCounts {
  return {
    new: countInPhases(dueToday, ["new"]),
    learning: countInPhases(dueToday, ["learning", "relearning"]),
    review: countInPhases(dueToday, ["review"]),
  };
}

function countInPhases(cards: readonly StudyCard[], phases: readonly CardPhase[]): number {
  return cards.filter(card => phases.includes(card.state.phase)).length;
}
