import {runtime} from "@src/environment/Runtime";
import {audioFileOf} from "@src/audio/audio-file/AudioFileOf";
import {keptAudioPath} from "@src/audio/kept/KeptAudioPath";
import {recordingVariantFor} from "@language-learning/content/audio/RecordingVariantFor";
import type {RecordingRequest} from "@language-learning/content/audio/types/RecordingRequest";
import type {SpokenText} from "@language-learning/content/types/SpokenText";

/**
 * Where the recording asked for is: the one recorded ahead of time if the recordings manifest names it, else the one the learner asked for and
 * the device kept, else nowhere (`undefined`: the app is silent rather than guess an address).
 */
export function audioUrlOf(
  kept: readonly SpokenText[],
  {language, text, voice, speed}: RecordingRequest,
): string | undefined {
  const file = audioFileOf(runtime.audioRecordings, {language, text, voice, speed});

  if (file !== undefined) {
    return `audio/${file}`;
  }

  if (kept.some(keptText => keptText.language === language && keptText.text === text)) {
    return keptAudioPath({language, text, variant: recordingVariantFor(language, voice, speed)});
  }

  return undefined;
}
