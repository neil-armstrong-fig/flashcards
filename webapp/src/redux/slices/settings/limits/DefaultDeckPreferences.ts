import type {DeckPreferences} from "@src/redux/slices/settings/types/DeckPreferences";

/** The male voice at normal speed, with the words shown. */
export const DEFAULT_DECK_PREFERENCES: DeckPreferences = {voice: "male", speed: "normal", hideTarget: false};
