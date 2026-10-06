import {DEFAULT_DECK_LIMITS} from "@src/redux/slices/settings/limits/DefaultDeckLimits";
import {INITIAL_SETTINGS_STATE} from "@src/redux/slices/settings/initial-state/InitialSettingsState";
import {MAX_REVIEWS_PER_DAY_LIMITS, NEW_CARDS_PER_DAY_LIMITS} from "@src/redux/slices/settings/limits/SettingLimits";
import {readLimitedInteger} from "@src/redux/slices/settings/limits/ReadLimitedInteger";
import type {DeckLimits} from "@src/redux/slices/settings/types/DeckLimits";

/** The limits of every deck the app ships, from what was kept. What was kept is untrusted: a bad field falls back to its default alone. */
export function readDeckLimits(stored: unknown): Readonly<Record<string, DeckLimits>> {
  const limits: Record<string, DeckLimits> = {};

  for (const deckId of Object.keys(INITIAL_SETTINGS_STATE.deckLimits)) {
    limits[deckId] = readOneDeck(
      typeof stored === "object" && stored !== null ? Reflect.get(stored, deckId) : undefined,
    );
  }

  return limits;
}

function readOneDeck(stored: unknown): DeckLimits {
  if (typeof stored !== "object" || stored === null) {
    return DEFAULT_DECK_LIMITS;
  }

  return {
    newCardsPerDay:
      readLimitedInteger(Reflect.get(stored, "newCardsPerDay"), NEW_CARDS_PER_DAY_LIMITS) ??
      DEFAULT_DECK_LIMITS.newCardsPerDay,
    maxReviewsPerDay:
      readLimitedInteger(Reflect.get(stored, "maxReviewsPerDay"), MAX_REVIEWS_PER_DAY_LIMITS) ??
      DEFAULT_DECK_LIMITS.maxReviewsPerDay,
  };
}
