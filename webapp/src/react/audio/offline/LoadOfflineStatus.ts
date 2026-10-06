import {countKeptRecordings} from "@src/audio/recordings/CountKeptRecordings";
import {counted} from "@src/redux/slices/offline/OfflineSlice";
import {deckRecordingPaths} from "@src/audio/deck-recordings/DeckRecordingPaths";
import {SHIPPED_DECKS} from "@language-learning/content/decks/ShippedDecks";
import type {AppDispatch} from "@src/redux/Store";

/** Counts, for every deck, the recordings it has and how many of them are on this device. Run when the app opens, and after anything that changes what is kept. */
export async function loadOfflineStatus(dispatch: AppDispatch): Promise<void> {
  const decks = await Promise.all(
    SHIPPED_DECKS.map(async ({id}) => {
      const paths = deckRecordingPaths(id);

      return {deckId: id, kept: await countKeptRecordings(paths), total: paths.length};
    }),
  );

  dispatch(counted(decks));
}
