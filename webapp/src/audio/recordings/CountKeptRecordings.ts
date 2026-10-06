import {RECORDINGS_CACHE_NAME} from "@src/audio/recordings/utils/RecordingsCacheName";

/** How many of the recordings at `paths` are on this device now. */
export async function countKeptRecordings(paths: readonly string[]): Promise<number> {
  if (!(await caches.has(RECORDINGS_CACHE_NAME))) {
    return 0;
  }

  const cache = await caches.open(RECORDINGS_CACHE_NAME);
  const kept = new Set((await cache.keys()).map(request => request.url));

  return paths.filter(path => kept.has(new URL(path, document.baseURI).href)).length;
}
