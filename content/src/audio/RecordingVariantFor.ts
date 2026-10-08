import {recordingVariantOf} from "@flashcards/shared/audio/RecordingVariantOf";
import type {RecordingVariant} from "@flashcards/shared/audio/RecordingVariant";
import type {Speed} from "@flashcards/shared/audio/Speed";
import type {SpokenLanguage} from "@flashcards/shared/language/SpokenLanguage";
import type {Voice} from "@flashcards/shared/audio/Voice";

/** The one recording of an English word. The learner is not practising English listening, so it is not theirs to choose. */
export const ENGLISH_VARIANT: RecordingVariant = "female-normal";

/** The one recording of a note of music, named as English's is so that every recording has a voice and a speed in its path. */
export const SINGLE_VARIANT: RecordingVariant = ENGLISH_VARIANT;

/** Which of a text's recordings the learner hears: the voice and speed they chose, except in English and for the notes of music, which have one recording each. */
export function recordingVariantFor(language: SpokenLanguage, voice: Voice, speed: Speed): RecordingVariant {
  if (language === "en" || language === "music") {
    return ENGLISH_VARIANT;
  }

  return recordingVariantOf(voice, speed);
}
