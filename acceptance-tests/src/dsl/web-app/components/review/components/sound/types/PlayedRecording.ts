import type {SpokenLanguage} from "@language-learning/shared/language/SpokenLanguage";
import type {Speed} from "@language-learning/shared/audio/Speed";
import type {Voice} from "@language-learning/shared/audio/Voice";

/** One recording the app started playing, as the fake audio element saw it. */
export interface PlayedRecording {
  /** What was spoken: the language taught, or English. */
  readonly language: SpokenLanguage;
  /** The recording's path under `audio/`, which names its language, voice, speed and a hash of what is said. */
  readonly file: string;
  readonly voice: Voice;
  readonly speed: Speed;
  /** Whether the file could be fetched when it was played: false means the manifest names a file the app cannot serve. */
  readonly found: boolean;
}
