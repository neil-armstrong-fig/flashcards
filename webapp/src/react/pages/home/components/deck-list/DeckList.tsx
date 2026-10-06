import {DeckRow} from "@src/react/pages/home/components/deck-list/components/deck-row/DeckRow";
import {SHIPPED_DECKS} from "@flashcards/content/decks/ShippedDecks";

/** Every deck with what is waiting in it today, and a button to study it on its own: a session never mixes decks. */
export function DeckList(): React.JSX.Element {
  return (
    <ul aria-label="Decks" className="flex flex-col gap-3">
      {SHIPPED_DECKS.map(deck => (
        <DeckRow key={deck.id} deckId={deck.id} name={deck.name} />
      ))}
    </ul>
  );
}
