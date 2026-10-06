import type {RecordingVariant} from "@flashcards/shared/audio/RecordingVariant";
import type {Speed} from "@flashcards/shared/audio/Speed";
import type {Voice} from "@flashcards/shared/audio/Voice";

export function recordingVariantOf(voice: Voice, speed: Speed): RecordingVariant {
  return `${voice}-${speed}`;
}
