import type {RecordingVariant} from "@language-learning/shared/audio/RecordingVariant";
import type {SpokenLanguage} from "@language-learning/shared/language/SpokenLanguage";

/** One recording the learner asked for: some text in a language, in one of its variants. */
export interface KeptRecording {
  readonly language: SpokenLanguage;
  readonly text: string;
  readonly variant: RecordingVariant;
}
