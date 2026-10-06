import {RECORDINGS_CACHE_NAME} from "@src/audio/recordings/utils/RecordingsCacheName";

/** Removes every recording kept on this device, so whoever uses it next, signed in or not, holds none. */
export async function forgetAllRecordings(): Promise<void> {
  await caches.delete(RECORDINGS_CACHE_NAME);
}
