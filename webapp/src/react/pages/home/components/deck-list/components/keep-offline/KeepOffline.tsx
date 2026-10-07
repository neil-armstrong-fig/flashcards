import {keepDeckOffline} from "@src/react/audio/offline/KeepDeckOffline";
import {useAppSelector, useAppStore} from "@src/redux/shared/Hooks";

interface Props {
  readonly deckId: string;
}

/**
 * How much of a deck's audio is on this device, and a button to fetch the rest so the whole deck can be heard offline. Never needed:
 * a recording is kept as it is played, which is the default. Nothing where the deck has no recordings.
 */
export function KeepOffline({deckId}: Props): React.JSX.Element | undefined {
  const store = useAppStore();
  const offline = useAppSelector(state => state.offline.decks[deckId]);

  if (offline === undefined || offline.total === 0) {
    return undefined;
  }

  const complete = !offline.working && offline.kept >= offline.total;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
      <span>
        <span data-testid={`offline-kept-${deckId}`}>{offline.kept}</span> of{" "}
        <span data-testid={`offline-total-${deckId}`}>{offline.total}</span> recordings on this device
      </span>

      {offline.working && <span>Keeping…</span>}

      {!offline.working && !complete && (
        <button
          type="button"
          data-testid={`keep-offline-${deckId}`}
          onClick={() => void keepDeckOffline(store, deckId)}
          className="min-h-11 rounded-full bg-ground px-4 py-2"
        >
          Keep offline
        </button>
      )}

      {complete && <span data-testid={`offline-done-${deckId}`}>Kept for offline use</span>}

      {offline.incomplete && (
        <span data-testid={`offline-error-${deckId}`} role="alert">
          Some recordings could not be fetched. Check your connection and try again.
        </span>
      )}
    </div>
  );
}
