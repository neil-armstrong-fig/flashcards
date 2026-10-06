import {recordingVariantFor} from "@flashcards/content/audio/RecordingVariantFor";
import {SPEEDS} from "@flashcards/shared/audio/Speed";
import {VOICES} from "@flashcards/shared/audio/Voice";
import type {KeptVersion} from "@src/audio/kept/types/KeptVersion";
import type {SpokenLanguage} from "@flashcards/shared/language/SpokenLanguage";

/** Every version a text is kept in: all the voices and speeds for Korean, the one there is for English. */
export function versionsOf(language: SpokenLanguage): KeptVersion[] {
  const all = VOICES.flatMap(voice => {
    return SPEEDS.map(speed => ({variant: recordingVariantFor(language, voice, speed), voice, speed}));
  });

  return all.filter((version, index) => all.findIndex(other => other.variant === version.variant) === index);
}
