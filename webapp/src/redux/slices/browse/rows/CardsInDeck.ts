import {deckIdOfCard} from "@src/redux/slices/deck/ids/DeckIdOfCard";
import type {DeckCard} from "@flashcards/content/types/DeckCard";
import type {DeckFilter} from "@src/redux/slices/browse/types/DeckFilter";

/** The cards studied in one deck, or all of them for `all`. A card the learner made counts as the Korean starter deck's. */
export function cardsInDeck(cards: readonly DeckCard[], deck: DeckFilter): readonly DeckCard[] {
  if (deck.kind === "all") {
    return cards;
  }

  return cards.filter(card => deckIdOfCard(card.id) === deck.deckId);
}
