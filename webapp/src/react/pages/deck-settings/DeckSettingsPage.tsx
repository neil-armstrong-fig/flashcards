import {BackLink} from "@src/react/components/back-link/BackLink";
import {DeckSettingsOfDeck} from "@src/react/pages/deck-settings/components/deck-settings-of-deck/DeckSettingsOfDeck";
import {Navigate, useParams} from "react-router";
import {ROUTES} from "@src/react/routes/Routes";
import {SHIPPED_DECKS} from "@flashcards/content/decks/ShippedDecks";

/** One deck's settings on a screen of its own: what it asks of the learner in a day, and how it is heard. */
export function DeckSettingsPage(): React.JSX.Element {
  const {deckId} = useParams();
  const deck = SHIPPED_DECKS.find(shipped => shipped.id === deckId);
  if (deck === undefined) {
    return <Navigate to={ROUTES.settings} replace />;
  }

  return (
    <main data-testid="deck-settings-screen" className="mx-auto flex max-w-xl flex-col gap-6 p-4">
      <BackLink to={ROUTES.settings} testId="back-from-deck-settings" label="Back to the settings" />

      <DeckSettingsOfDeck deckId={deck.id} name={deck.name} />
    </main>
  );
}
