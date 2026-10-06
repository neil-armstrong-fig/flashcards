import {recordingVariantOf} from "@flashcards/shared/audio/RecordingVariantOf";
import type {RecordingVariant} from "@flashcards/shared/audio/RecordingVariant";
import type {Speed} from "@flashcards/shared/audio/Speed";
import type {SpokenLanguage} from "@flashcards/shared/language/SpokenLanguage";
import type {Voice} from "@flashcards/shared/audio/Voice";

/** The one recording of an English word. The learner is not practising English listening, so it is not theirs to choose. */
export const ENGLISH_VARIANT: RecordingVariant = "female-normal";

/** Which of a text's recordings the learner hears: the voice and speed they chose, except in English. */
export function recordingVariantFor(language: SpokenLanguage, voice: Voice, speed: Speed): RecordingVariant {
  if (language === "en") {
    return ENGLISH_VARIANT;
  }

  return recordingVariantOf(voice, speed);
}
