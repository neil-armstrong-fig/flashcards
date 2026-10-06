/** The decks the app ships, by the ids its test ids use. */
export const DECK_IDS = ["ko-starter", "ja-hiragana", "ja-katakana"] as const;

export type DeckId = (typeof DECK_IDS)[number];

/** The deck most specs study: the ten Korean starter words. */
export const STARTER_DECK_ID: DeckId = "ko-starter";

/** Whether text read off the screen names one of the decks the app ships. */
export function isDeckId(text: string): text is DeckId {
  return DECK_IDS.some(id => id === text);
}
