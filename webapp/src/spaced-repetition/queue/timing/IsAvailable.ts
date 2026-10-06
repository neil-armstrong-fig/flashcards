import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/** Whether a card may be shown at all right now: not suspended, and not buried until later. */
export function isAvailable(card: StudyCard, now: Date): boolean {
  if (card.state.suspended) {
    return false;
  }

  if (card.state.buriedUntil === undefined) {
    return true;
  }

  return new Date(card.state.buriedUntil).getTime() <= now.getTime();
}
