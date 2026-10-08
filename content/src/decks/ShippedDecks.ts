import {HIRAGANA_COMBINED_DECK} from "@flashcards/content/japanese/HiraganaCombinedDeck";
import {HIRAGANA_DECK} from "@flashcards/content/japanese/HiraganaDeck";
import {KATAKANA_COMBINED_DECK} from "@flashcards/content/japanese/KatakanaCombinedDeck";
import {KATAKANA_DECK} from "@flashcards/content/japanese/KatakanaDeck";
import {KATAKANA_FOREIGN_DECK} from "@flashcards/content/japanese/KatakanaForeignDeck";
import {SHEET_MUSIC_DECK} from "@flashcards/content/music/sheet-music/SheetMusicDeck";
import {SOUNDS_ALIKE_DECK} from "@flashcards/content/korean/sounds-alike/SoundsAlikeDeck";
import {PRONUNCIATION_DECK} from "@flashcards/content/korean/pronunciation/PronunciationDeck";
import {STARTER_DECK} from "@flashcards/content/korean/StarterDeck";
import type {Deck} from "@flashcards/content/types/Deck";

/**
 * Every deck the app ships, in the order the home screen lists them. A session studies one deck at a time, so the order only
 * decides the rows. For now they are all for the one account. The audio tool records all of them.
 */
export const SHIPPED_DECKS: readonly Deck[] = [
  STARTER_DECK,
  PRONUNCIATION_DECK,
  SOUNDS_ALIKE_DECK,
  HIRAGANA_DECK,
  HIRAGANA_COMBINED_DECK,
  KATAKANA_DECK,
  KATAKANA_COMBINED_DECK,
  KATAKANA_FOREIGN_DECK,
  SHEET_MUSIC_DECK,
];
