import {queryChanged} from "@src/redux/slices/browse/BrowseSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** A box to narrow the list to the cards that match some words, meanings or romanisation. */
export function BrowseSearch(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const query = useAppSelector(state => state.browse.query);

  return (
    <input
      type="search"
      data-testid="browse-search"
      value={query}
      placeholder="Search words, meanings or romanisation"
      aria-label="Search the cards"
      onChange={event => dispatch(queryChanged(event.currentTarget.value))}
      className="rounded-xl bg-ground-raised px-4 py-3"
    />
  );
}
