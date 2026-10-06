import {DeckLimitsOfDeck} from "@src/react/pages/settings/components/deck-limits/components/deck-limits-of-deck/DeckLimitsOfDeck";
import {SHIPPED_DECKS} from "@flashcards/content/decks/ShippedDecks";

/** How many new cards and reviews each deck asks of the learner in a day. Reviews are about ten for every new card, in the long run. */
export function DeckLimits(): React.JSX.Element {
  return (
    <>
      {SHIPPED_DECKS.map(deck => (
        <DeckLimitsOfDeck key={deck.id} deckId={deck.id} name={deck.name} />
      ))}
    </>
  );
}
