import {saveJson} from "@src/storage/local-storage/device/SaveJson";
import {DECK_STORAGE_KEY} from "@src/storage/local-storage/deck/DeckStorageKey";

/** Keeps the cards the learner made on this device. */
export function keepStoredDeck(stored: unknown): void {
  saveJson(DECK_STORAGE_KEY, stored);
}
