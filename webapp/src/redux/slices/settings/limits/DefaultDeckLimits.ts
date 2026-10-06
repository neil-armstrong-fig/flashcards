import type {DeckLimits} from "@src/redux/slices/settings/types/DeckLimits";

/** The defaults: twenty new cards a day, and two hundred reviews, which is ten for each new card, with the two locked together. */
export const DEFAULT_DECK_LIMITS: DeckLimits = {newCardsPerDay: 20, maxReviewsPerDay: 200, limitsUnlocked: false};
