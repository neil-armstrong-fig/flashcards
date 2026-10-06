import {noteIdOfCard} from "@src/spaced-repetition/queue/siblings/NoteIdOfCard";
import {studyDayKey} from "@src/spaced-repetition/day/StudyDayKey";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/**
 * The cards whose other card of the same word was answered during the study day `now` falls in. They are held back so the
 * two directions of a word do not come up together. Derived from the log, like the new-card count, so nothing is stored.
 */
export function heldBackCards(cards: readonly StudyCard[], log: readonly ReviewLogEntry[], now: Date): StudyCard[] {
  const today = studyDayKey(now);
  const answeredToday = log.filter(entry => studyDayKey(new Date(entry.reviewedAt)) === today);

  return cards.filter(card => {
    return answeredToday.some(entry => {
      return entry.cardId !== card.id && noteIdOfCard(entry.cardId) === noteIdOfCard(card.id);
    });
  });
}
