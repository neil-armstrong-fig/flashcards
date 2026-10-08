import {readJson} from "@src/storage/local-storage/device/ReadJson";
import {SIMILAR_STORAGE_KEY} from "@src/storage/local-storage/similar/SimilarStorageKey";

/** The similar words kept on this device, as `unknown` until the caller has checked it. */
export function readStoredSimilar(): unknown {
  return readJson(SIMILAR_STORAGE_KEY);
}
