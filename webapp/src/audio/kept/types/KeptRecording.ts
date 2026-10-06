import type {RecordingVariant} from "@flashcards/shared/audio/RecordingVariant";
import type {SpokenLanguage} from "@flashcards/shared/language/SpokenLanguage";

/** One recording the learner asked for: some text in a language, in one of its variants. */
export interface KeptRecording {
  readonly language: SpokenLanguage;
  readonly text: string;
  readonly variant: RecordingVariant;
}
