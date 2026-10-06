import {KEPT_AUDIO_CACHE_NAME} from "@src/audio/kept/versions/KeptAudioCacheName";
import {keptAudioAddress} from "@src/audio/kept/versions/KeptAudioAddress";
import {runtime} from "@src/environment/Runtime";
import {versionsOf} from "@src/audio/kept/versions/VersionsOf";
import type {KeptVersion} from "@src/audio/kept/types/KeptVersion";
import type {SpokenLanguage} from "@language-learning/shared/language/SpokenLanguage";

/**
 * Asks the speech API (`api/`) for the text in every version and keeps the recordings in the browser's cache, from which the service
 * worker serves them at `keptAudioPath`, so they play offline for good. Every version of a Korean text is fetched together, so switching
 * voice or speed later needs no connection; an English text has the one. Throws if any could not be had, keeping none. The key to Azure
 * is never here: the API holds it.
 */
export async function keepAudio(language: SpokenLanguage, text: string): Promise<void> {
  const kept = await Promise.all(
    versionsOf(language).map(async version => ({
      variant: version.variant,
      response: await fetchVersion(language, text, version),
    })),
  );
  const cache = await caches.open(KEPT_AUDIO_CACHE_NAME);

  for (const {variant, response} of kept) {
    await cache.put(keptAudioAddress({language, text, variant}), response);
  }
}

async function fetchVersion(language: SpokenLanguage, text: string, {voice, speed}: KeptVersion): Promise<Response> {
  const response = await fetch(`${runtime.apiOrigin}/api/speech`, {
    method: "POST",
    credentials: "include",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({language, text, voice, speed}),
  });

  if (!response.ok) {
    throw new Error(`The speech service answered ${response.status}.`);
  }

  return response;
}
