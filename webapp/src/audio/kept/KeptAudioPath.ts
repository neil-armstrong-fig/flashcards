import type {KeptRecording} from "@src/audio/kept/types/KeptRecording";

/**
 * Where a kept recording, of a word or meaning the learner added, is served from: the service worker answers this address from the
 * cache it was put in (`sw/recordings/RegisterRecordingsFromCache.ts`). The text is in the path so one address is one recording.
 */
export function keptAudioPath({language, text, variant}: KeptRecording): string {
  return `kept-audio/${language}/${variant}/${encodeURIComponent(text)}.mp3`;
}
