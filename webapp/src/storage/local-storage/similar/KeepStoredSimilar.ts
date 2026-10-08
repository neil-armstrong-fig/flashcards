import {saveJson} from "@src/storage/local-storage/device/SaveJson";
import {SIMILAR_STORAGE_KEY} from "@src/storage/local-storage/similar/SimilarStorageKey";

/** Keeps the similar words on this device. */
export function keepStoredSimilar(stored: unknown): void {
  saveJson(SIMILAR_STORAGE_KEY, stored);
}
