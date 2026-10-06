import type {RecordingVariant} from "@flashcards/shared/audio/RecordingVariant";
import type {Speed} from "@flashcards/shared/audio/Speed";
import type {Voice} from "@flashcards/shared/audio/Voice";

/** One way a text is said: the voice and speed that make its recording, and the name of that variant. */
export interface KeptVersion {
  readonly variant: RecordingVariant;
  readonly voice: Voice;
  readonly speed: Speed;
}
