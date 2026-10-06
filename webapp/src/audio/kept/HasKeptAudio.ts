import {KEPT_AUDIO_CACHE_NAME} from "@src/audio/kept/versions/KeptAudioCacheName";
import {keptAudioAddress} from "@src/audio/kept/versions/KeptAudioAddress";
import {versionsOf} from "@src/audio/kept/versions/VersionsOf";
import type {SpokenLanguage} from "@flashcards/shared/language/SpokenLanguage";

/** Whether this device already has every recording of the text, kept. */
export async function hasKeptAudio(language: SpokenLanguage, text: string): Promise<boolean> {
  const cache = await caches.open(KEPT_AUDIO_CACHE_NAME);
  const kept = await Promise.all(
    versionsOf(language).map(async ({variant}) => await cache.match(keptAudioAddress({language, text, variant}))),
  );

  return kept.every(response => response !== undefined);
}
