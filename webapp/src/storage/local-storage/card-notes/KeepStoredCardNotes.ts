import {saveJson} from "@src/storage/local-storage/device/SaveJson";
import {CARD_NOTES_STORAGE_KEY} from "@src/storage/local-storage/card-notes/CardNotesStorageKey";

/** Keeps the notes on this device. */
export function keepStoredCardNotes(stored: unknown): void {
  saveJson(CARD_NOTES_STORAGE_KEY, stored);
}
