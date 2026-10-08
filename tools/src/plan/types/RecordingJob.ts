import type {SpokenLanguage} from "@flashcards/shared/language/SpokenLanguage";
import type {RecordingVariant} from "@flashcards/shared/audio/RecordingVariant";

/** One recording to have: what is said, who says it, how fast, and where the file goes. */
export interface RecordingJob {
  readonly language: SpokenLanguage;
  readonly text: string;
  readonly variant: RecordingVariant;
  /** The Azure voice that says it, or `tone` for a note of music, which is generated and not sent to Azure. */
  readonly voiceName: string;
  /** The Azure locale the voice speaks, such as `ko-KR`. */
  readonly locale: string;
  /** The speech markup prosody rate, or `default` for none. */
  readonly rate: string;
  /** The path under `audio/`. */
  readonly file: string;
}
