import {DeckSettingsOfDeck} from "@src/react/pages/settings/components/deck-settings/components/deck-settings-of-deck/DeckSettingsOfDeck";
import {SHIPPED_DECKS} from "@flashcards/content/decks/ShippedDecks";

/** What each deck asks of the learner in a day (reviews are ten for every new card, unless unlocked), and how it is heard. */
export function DeckSettings(): React.JSX.Element {
  return (
    <>
      {SHIPPED_DECKS.map(deck => (
        <DeckSettingsOfDeck key={deck.id} deckId={deck.id} name={deck.name} />
      ))}
    </>
  );
}
