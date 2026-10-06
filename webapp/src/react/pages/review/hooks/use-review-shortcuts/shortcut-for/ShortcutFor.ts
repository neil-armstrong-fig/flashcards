import {REVIEW_KEYS} from "@src/react/pages/review/hooks/use-review-shortcuts/shortcut-for/ReviewKeys";
import type {AsideKind} from "@src/redux/slices/study/types/AsideKind";
import type {Rating} from "@flashcards/shared/study/Rating";
import type {ReviewScreenState} from "@src/react/pages/review/hooks/use-review-shortcuts/types/ReviewScreenState";
import type {ReviewShortcut} from "@src/react/pages/review/hooks/use-review-shortcuts/types/ReviewShortcut";

/**
 * What a key does on the review screen, or `undefined` for a key that does nothing. The keys are `REVIEW_KEYS`: space
 * shows the answer and then rates it good, 1 to 4 rate again, hard, good and easy once the answer is up, - buries the card, @
 * suspends it.
 */
export function shortcutFor(key: string, state: ReviewScreenState): ReviewShortcut | undefined {
  if (!state.hasCard) {
    return undefined;
  }

  const how = asideFor(key);

  if (how !== undefined && !state.lookingAhead) {
    return {kind: "setAside", how};
  }

  if (!state.answerShown && isAdvance(key)) {
    return {kind: "showAnswer"};
  }

  if (!state.answerShown) {
    return undefined;
  }

  if (state.lookingAhead && isAdvance(key)) {
    return {kind: "next"};
  }

  if (state.lookingAhead) {
    return undefined;
  }

  if (isAdvance(key)) {
    return {kind: "rate", rating: "good"};
  }

  const rating = ratingFor(key);

  if (rating !== undefined) {
    return {kind: "rate", rating};
  }

  return undefined;
}

function isAdvance(key: string): boolean {
  return REVIEW_KEYS.advance.some(advance => advance === key);
}

function asideFor(key: string): AsideKind | undefined {
  return Object.entries(REVIEW_KEYS.setAside).find(([bound]) => bound === key)?.[1];
}

function ratingFor(key: string): Rating | undefined {
  return Object.entries(REVIEW_KEYS.rate).find(([bound]) => bound === key)?.[1];
}
