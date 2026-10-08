import {readJson} from "@src/storage/local-storage/device/ReadJson";
import {DECK_STORAGE_KEY} from "@src/storage/local-storage/deck/DeckStorageKey";

/** The cards the learner made kept on this device, as `unknown` until the caller has checked it. */
export function readStoredDeck(): unknown {
  return readJson(DECK_STORAGE_KEY);
}
