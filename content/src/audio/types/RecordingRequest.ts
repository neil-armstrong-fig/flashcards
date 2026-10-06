import type {SpokenLanguage} from "@flashcards/shared/language/SpokenLanguage";
import type {Speed} from "@flashcards/shared/audio/Speed";
import type {Voice} from "@flashcards/shared/audio/Voice";

/** Which recording is wanted: what is said, in which language, by which voice, how fast. English has one voice, whatever was chosen. */
export interface RecordingRequest {
  readonly language: SpokenLanguage;
  readonly text: string;
  readonly voice: Voice;
  readonly speed: Speed;
}
