import type {RecordingVariant} from "@language-learning/shared/audio/RecordingVariant";
import type {Speed} from "@language-learning/shared/audio/Speed";
import type {Voice} from "@language-learning/shared/audio/Voice";

export function recordingVariantOf(voice: Voice, speed: Speed): RecordingVariant {
  return `${voice}-${speed}`;
}
