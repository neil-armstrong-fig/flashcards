import {generatePath, Link} from "react-router";
import {ROUTES} from "@src/react/routes/Routes";
import {SettingsGroup} from "@src/react/pages/settings/components/settings-group/SettingsGroup";
import {SHIPPED_DECKS} from "@flashcards/content/decks/ShippedDecks";

/** One card for each deck: tap it to see what that deck asks of the learner in a day, and how it is heard. */
export function DeckSettings(): React.JSX.Element {
  return (
    <SettingsGroup title="Decks">
      {SHIPPED_DECKS.map(deck => (
        <Link
          key={deck.id}
          to={generatePath(ROUTES.deckSettings, {deckId: deck.id})}
          data-testid={`open-deck-settings-${deck.id}`}
          className="flex min-h-14 items-center justify-between gap-4 rounded-xl bg-ground-raised px-4 py-3"
        >
          <span>{deck.name}</span>

          <span aria-hidden="true" className="text-ink-muted">
            ›
          </span>
        </Link>
      ))}
    </SettingsGroup>
  );
}
