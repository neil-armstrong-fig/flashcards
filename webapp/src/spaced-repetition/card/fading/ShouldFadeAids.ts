import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

/** How many good or easy answers in a row, since a note or picture was put on a card, show the card no longer needs it. */
export const ANSWERS_THAT_FADE_AN_AID = 3;

/**
 * Whether it is time to offer taking a memory aid off a card: the latest answers given since the aid was added (`addedAt`, an
 * ISO timestamp) are all good or easy, and there are enough of them. `cardLog` is this card's answers, oldest first. Forgetting
 * the card, or answering it hard, starts the run over.
 */
export function shouldFadeAids(addedAt: string, cardLog: readonly ReviewLogEntry[]): boolean {
  const since = cardLog.filter(entry => entry.reviewedAt >= addedAt);
  const latest = since.slice(-ANSWERS_THAT_FADE_AN_AID);

  return (
    latest.length === ANSWERS_THAT_FADE_AN_AID &&
    latest.every(entry => entry.rating === "good" || entry.rating === "easy")
  );
}
