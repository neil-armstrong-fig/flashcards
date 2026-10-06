import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

/** How many good or easy answers in a row clear a struggling card: forgetting it again starts the count over. */
export const ANSWERS_THAT_CLEAR_A_STRUGGLE = 3;

/**
 * Whether the learner keeps struggling with this card: either it has lapsed (been forgotten once it was being reviewed) at
 * least `threshold` times and its latest answers are not yet a clean run, or the learner marked it as hard and the answers
 * given since are not yet a clean run. `cardLog` is this card's answers, oldest first. Nothing about it is stored beyond the
 * lapse count and when it was marked: a card clears itself by good behaviour and returns if it is forgotten again.
 */
export function isStruggling(state: CardState, cardLog: readonly ReviewLogEntry[], threshold: number): boolean {
  if (state.lapses >= threshold && !isCleanRun(cardLog)) {
    return true;
  }

  const markedAt = state.markedHardAt;

  if (markedAt === undefined) {
    return false;
  }

  return !isCleanRun(cardLog.filter(entry => entry.reviewedAt >= markedAt));
}

function isCleanRun(answers: readonly ReviewLogEntry[]): boolean {
  const latest = answers.slice(-ANSWERS_THAT_CLEAR_A_STRUGGLE);

  return (
    latest.length === ANSWERS_THAT_CLEAR_A_STRUGGLE &&
    latest.every(entry => entry.rating === "good" || entry.rating === "easy")
  );
}
