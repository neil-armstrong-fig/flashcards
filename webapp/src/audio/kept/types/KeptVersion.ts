import type {RecordingVariant} from "@language-learning/shared/audio/RecordingVariant";
import type {Speed} from "@language-learning/shared/audio/Speed";
import type {Voice} from "@language-learning/shared/audio/Voice";

/** One way a text is said: the voice and speed that make its recording, and the name of that variant. */
export interface KeptVersion {
  readonly variant: RecordingVariant;
  readonly voice: Voice;
  readonly speed: Speed;
}
