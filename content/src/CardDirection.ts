/**
 * Which way a card asks. A word is learned both ways: from the language being learned into English, which is reading it,
 * and from English into the language being learned, which is saying it. Reading comes first in a deck.
 */
export const CARD_DIRECTIONS = ["to-english", "from-english"] as const;

export type CardDirection = (typeof CARD_DIRECTIONS)[number];
