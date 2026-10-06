import type {Speed} from "@language-learning/shared/audio/Speed";
import type {Voice} from "@language-learning/shared/audio/Voice";

/** How the learner asked for Korean to be spoken. */
export interface AudioChoices {
  readonly voice: Voice;
  readonly speed: Speed;
}
