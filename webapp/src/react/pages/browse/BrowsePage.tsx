import {useEffect, useMemo} from "react";
import {Link} from "react-router";
import {AddCardForm} from "@src/react/pages/browse/components/add-card-form/AddCardForm";
import {BrowseCard} from "@src/react/pages/browse/components/browse-card/BrowseCard";
import {BrowseSearch} from "@src/react/pages/browse/components/browse-search/BrowseSearch";
import {browseLeft} from "@src/redux/slices/browse/BrowseSlice";
import {browseRowsOf} from "@src/redux/slices/browse/rows/BrowseRowsOf";
import {cardsInDeck} from "@src/redux/slices/browse/rows/CardsInDeck";
import {DeckFilterField} from "@src/react/pages/browse/components/deck-filter/DeckFilterField";
import {ROUTES} from "@src/react/routes/Routes";
import {selectCards} from "@src/redux/slices/deck/selectors/SelectCards";
import {SpeedSwitch} from "@src/react/components/speed-switch/SpeedSwitch";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";
import {VoiceSwitch} from "@src/react/components/voice-switch/VoiceSwitch";

/** Every card in the deck, both directions of every word, with where each is in its life, a search, and a button to hear each one. */
export function BrowsePage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const states = useAppSelector(state => state.study.cards);
  const now = useAppSelector(state => state.study.now);
  const query = useAppSelector(state => state.browse.query);
  const deck = useAppSelector(state => state.browse.deck);
  const cards = useAppSelector(selectCards);
  const rows = useMemo(
    () => browseRowsOf(cardsInDeck(cards, deck), states, new Date(now), query),
    [cards, deck, states, now, query],
  );

  useEffect(() => {
    return () => {
      dispatch(browseLeft());
    };
  }, [dispatch]);

  return (
    <main data-testid="browse-screen" className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">All cards</h1>

        <Link to={ROUTES.home} data-testid="close-browse" className="text-ink-muted underline">
          Done
        </Link>
      </header>

      <AddCardForm />

      <DeckFilterField />

      <BrowseSearch />

      <p data-testid="romanisation-system" className="text-sm text-ink-muted">
        Korean words are written in Latin letters with the Revised Romanization of Korean, the official South Korean
        system.
      </p>

      <div className="flex gap-2 text-sm">
        <VoiceSwitch testId="browse-switch-voice" className="flex-1 rounded-full bg-ground-raised px-3 py-2" />

        <SpeedSwitch testId="browse-switch-speed" className="flex-1 rounded-full bg-ground-raised px-3 py-2" />
      </div>

      <p className="text-sm text-ink-muted">
        <span data-testid="browse-count">{rows.length}</span> cards
      </p>

      {rows.length === 0 && (
        <p data-testid="browse-nothing-found" className="text-ink-muted">
          No card matches that.
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {rows.map(row => (
          <BrowseCard key={row.id} row={row} />
        ))}
      </ul>
    </main>
  );
}
