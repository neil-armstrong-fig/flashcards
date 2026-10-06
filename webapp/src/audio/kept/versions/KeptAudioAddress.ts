import {keptAudioPath} from "@src/audio/kept/KeptAudioPath";
import type {KeptRecording} from "@src/audio/kept/types/KeptRecording";

/** The address the page plays a kept recording from, which the service worker answers from the cache. */
export function keptAudioAddress(recording: KeptRecording): string {
  return new URL(keptAudioPath(recording), document.baseURI).href;
}
