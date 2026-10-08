import {RECORDINGS_CACHE_NAME} from "@src/audio/recordings/utils/RecordingsCacheName";
import {runtime} from "@src/environment/Runtime";

const AUDIO_PREFIX = "audio/";

/** The recordings being fetched now, by path, so asking for one already on its way waits for it instead of fetching it twice. */
const fetching = new Map<string, Promise<boolean>>();

/**
 * Makes sure the recording at `path` (`audio/<language>/<variant>/<name>.mp3`, as `audioUrlOf` gives it) is kept on this device,
 * fetching it if it is not. A recording is fetched from the API with the learner's session (it answers 401 to anyone else) and put in
 * the browser's cache under the address the page plays it from, where the service worker serves it (`sw/recordings/RegisterRecordingsFromCache.ts`). Once kept
 * it is never fetched again: a recording is named by a hash of what it says. Resolves to whether it is there to play: false where it
 * could not be fetched (not signed in, or no connection and not yet kept). Never rejects.
 */
export async function ensureRecording(path: string): Promise<boolean> {
  const under = fetching.get(path);

  if (under !== undefined) {
    return await under;
  }

  const started = keep(path).finally(() => fetching.delete(path));

  fetching.set(path, started);

  return await started;
}

async function keep(path: string): Promise<boolean> {
  try {
    const cache = await caches.open(RECORDINGS_CACHE_NAME);
    const address = new URL(path, document.baseURI).href;

    if ((await cache.match(address)) !== undefined) {
      return true;
    }

    const response = await fetch(`${runtime.apiOrigin}/api/audio/${path.slice(AUDIO_PREFIX.length)}`, {
      credentials: "include",
    });

    if (!response.ok) {
      return false;
    }

    await cache.put(address, response);

    return true;
  } catch (error) {
    console.error("A recording could not be fetched.", error);

    return false;
  }
}
