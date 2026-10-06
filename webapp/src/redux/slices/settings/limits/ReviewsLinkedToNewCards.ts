import {clampToLimits} from "@src/redux/slices/settings/limits/ClampToLimits";
import {MAX_REVIEWS_PER_DAY_LIMITS} from "@src/redux/slices/settings/limits/SettingLimits";

/** Each new card comes back for review about ten times in the long run, so new cards are a tenth of the reviews. */
const REVIEWS_PER_NEW_CARD = 10;

/**
 * The reviews a day that go with this many new cards while the two are locked together. With no new cards, which is how a learner
 * pauses new words while still doing the ones they have, the reviews stay as they are (`current`): ten times nothing would stop them.
 */
export function reviewsLinkedToNewCards(newCardsPerDay: number, current: number): number {
  if (newCardsPerDay === 0) {
    return current;
  }

  return clampToLimits(newCardsPerDay * REVIEWS_PER_NEW_CARD, MAX_REVIEWS_PER_DAY_LIMITS);
}
