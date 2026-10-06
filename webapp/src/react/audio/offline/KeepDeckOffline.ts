import {deckRecordingPaths} from "@src/audio/deck-recordings/DeckRecordingPaths";
import {ensureRecording} from "@src/audio/recordings/EnsureRecording";
import {keepingFinished, keepingProgressed, keepingStarted} from "@src/redux/slices/offline/OfflineSlice";
import {loadOfflineStatus} from "@src/react/audio/offline/LoadOfflineStatus";
import type {AppStore} from "@src/redux/Store";

/** How many recordings are fetched at once: enough to be quick, few enough not to crowd out a card the learner is studying. */
const AT_ONCE = 4;

/**
 * Fetches every recording of a deck and keeps it on this device, so the whole deck can be heard offline. Never needed: a recording is
 * kept as it is played. Safe to run again, since what is kept is not fetched twice, and a recording that cannot be fetched (no connection,
 * signed out) leaves the deck marked incomplete so the learner can try again.
 */
export async function keepDeckOffline(store: AppStore, deckId: string): Promise<void> {
  if (store.getState().offline.decks[deckId]?.working === true) {
    return;
  }

  const paths = deckRecordingPaths(deckId);
  let done = 0;

  store.dispatch(keepingStarted(deckId));

  for (let at = 0; at < paths.length; at += AT_ONCE) {
    const results = await Promise.all(paths.slice(at, at + AT_ONCE).map(async path => await ensureRecording(path)));

    done += results.filter(kept => kept).length;
    store.dispatch(keepingProgressed({deckId, kept: done}));
  }

  store.dispatch(keepingFinished({deckId, kept: done, total: paths.length}));
  await loadOfflineStatus(store.dispatch);
}
