import type {DeckFilter} from "@src/redux/slices/browse/types/DeckFilter";

/** What the list of every card is showing: the search, the deck, and which row has its similars open (one at a time). */
export interface BrowseState {
  readonly query: string;
  readonly deck: DeckFilter;
  readonly similarsOpenFor?: string;
}
