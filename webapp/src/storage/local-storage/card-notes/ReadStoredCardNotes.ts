import {readJson} from "@src/storage/local-storage/device/ReadJson";
import {CARD_NOTES_STORAGE_KEY} from "@src/storage/local-storage/card-notes/CardNotesStorageKey";

/** The notes kept on this device, as `unknown` until the caller has checked it. */
export function readStoredCardNotes(): unknown {
  return readJson(CARD_NOTES_STORAGE_KEY);
}
