import {recordingVariantOf} from "@language-learning/shared/audio/RecordingVariantOf";
import type {RecordingVariant} from "@language-learning/shared/audio/RecordingVariant";
import type {Speed} from "@language-learning/shared/audio/Speed";
import type {SpokenLanguage} from "@language-learning/shared/language/SpokenLanguage";
import type {Voice} from "@language-learning/shared/audio/Voice";

/** The one recording of an English word. The learner is not practising English listening, so it is not theirs to choose. */
export const ENGLISH_VARIANT: RecordingVariant = "female-normal";

/** Which of a text's recordings the learner hears: the voice and speed they chose, except in English. */
export function recordingVariantFor(language: SpokenLanguage, voice: Voice, speed: Speed): RecordingVariant {
  if (language === "en") {
    return ENGLISH_VARIANT;
  }

  return recordingVariantOf(voice, speed);
}
