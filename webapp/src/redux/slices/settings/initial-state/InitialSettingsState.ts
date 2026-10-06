import {DEFAULT_DAILY_GOAL_CARDS} from "@src/redux/slices/settings/daily-goal/DailyGoal";
import {DEFAULT_DECK_PREFERENCES} from "@src/redux/slices/settings/limits/DefaultDeckPreferences";
import {DEFAULT_DECK_LIMITS} from "@src/redux/slices/settings/limits/DefaultDeckLimits";
import {SHIPPED_DECKS} from "@flashcards/content/decks/ShippedDecks";
import type {SettingsState} from "@src/redux/slices/settings/types/SettingsState";

/** Each deck starts with the default limits (`DefaultDeckLimits`), and the goal of twenty cards reviewed. The colours follow the device. Each deck starts with the words shown, spoken by the male voice at normal speed (`DefaultDeckPreferences`), as does everything outside a deck. */
export const INITIAL_SETTINGS_STATE: SettingsState = {
  dailyGoalCards: DEFAULT_DAILY_GOAL_CARDS,
  deckLimits: Object.fromEntries(SHIPPED_DECKS.map(deck => [deck.id, DEFAULT_DECK_LIMITS])),
  desiredRetentionPercent: 90,
  strugglingAfter: 8,
  setAsideWhenStruggling: false,
  deckPreferences: Object.fromEntries(SHIPPED_DECKS.map(deck => [deck.id, DEFAULT_DECK_PREFERENCES])),
  voice: "male",
  speed: "normal",
  theme: "system",
};
