import {recordingVariantFor} from "@language-learning/content/audio/RecordingVariantFor";
import type {AudioManifest} from "@language-learning/content/audio/types/AudioManifest";
import type {RecordingRequest} from "@language-learning/content/audio/types/RecordingRequest";

/** The path under `audio/` of the recording asked for, or `undefined` when the manifest does not name one. */
export function audioFileOf(
  manifest: AudioManifest,
  {language, text, voice, speed}: RecordingRequest,
): string | undefined {
  return manifest[language]?.[text]?.[recordingVariantFor(language, voice, speed)];
}
