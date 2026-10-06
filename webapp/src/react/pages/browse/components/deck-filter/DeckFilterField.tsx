import {SHIPPED_DECKS} from "@flashcards/content/decks/ShippedDecks";
import {ALL_DECKS} from "@src/redux/slices/browse/rows/AllDecks";
import {deckFilterChosen} from "@src/redux/slices/browse/BrowseSlice";
import type {DeckFilter} from "@src/redux/slices/browse/types/DeckFilter";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** The option that means every deck: no shipped deck has this for an id. */
const EVERY_DECK = "all";

/** Narrows the list of cards to one deck, or shows every deck. */
export function DeckFilterField(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const deck = useAppSelector(state => state.browse.deck);

  return (
    <select
      data-testid="browse-deck-filter"
      aria-label="Show the cards of"
      value={optionOf(deck)}
      onChange={event => dispatch(deckFilterChosen(filterOf(event.currentTarget.value)))}
      className="rounded-xl bg-ground-raised px-4 py-3"
    >
      <option value={EVERY_DECK}>All decks</option>

      {SHIPPED_DECKS.map(deck => (
        <option key={deck.id} value={deck.id}>
          {deck.name}
        </option>
      ))}
    </select>
  );
}

function optionOf(deck: DeckFilter): string {
  if (deck.kind === "all") {
    return EVERY_DECK;
  }

  return deck.deckId;
}

/** The filter an option stands for: a shipped deck by its id, and anything else is every deck. */
function filterOf(option: string): DeckFilter {
  const chosen = SHIPPED_DECKS.find(each => each.id === option);

  if (chosen === undefined) {
    return ALL_DECKS;
  }

  return {kind: "deck", deckId: chosen.id};
}
