import type {Speed} from "@language-learning/shared/audio/Speed";

/** The SSML prosody rate for each speed. Slower is `-15%` and no lower: any slower sounds distorted (`docs/audio.md`). */
export const SPEED_RATES: Record<Speed, string> = {
  normal: "default",
  slower: "-15%",
};
