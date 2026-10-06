import {HIRAGANA_DECK} from "@language-learning/content/japanese/HiraganaDeck";
import {KATAKANA_DECK} from "@language-learning/content/japanese/KatakanaDeck";
import {STARTER_DECK} from "@language-learning/content/korean/StarterDeck";
import type {Deck} from "@language-learning/content/types/Deck";

/**
 * Every deck the app ships, in the order the home screen lists them. A session studies one deck at a time, so the order only
 * decides the rows. For now they are all for the one account. The audio tool records all of them.
 */
export const SHIPPED_DECKS: readonly Deck[] = [STARTER_DECK, HIRAGANA_DECK, KATAKANA_DECK];
