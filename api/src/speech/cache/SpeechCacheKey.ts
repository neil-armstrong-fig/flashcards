import type {SpeechRequest} from "@src/speech/types/SpeechRequest";

/**
 * What a recording is kept under: the language, the voice, the speed and the word. The same three things always make the same recording, so
 * they are all there is to a key, and a different language, voice or speed is a different recording. The key is plain text, so what is in
 * the cache can be read off it.
 */
export function speechCacheKey({language, text, voice, speed}: SpeechRequest): string {
  return `speech:${language}:${voice}-${speed}:${text}`;
}
