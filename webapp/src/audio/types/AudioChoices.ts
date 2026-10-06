import type {Speed} from "@flashcards/shared/audio/Speed";
import type {Voice} from "@flashcards/shared/audio/Voice";

/** How the learner asked for Korean to be spoken. */
export interface AudioChoices {
  readonly voice: Voice;
  readonly speed: Speed;
}
