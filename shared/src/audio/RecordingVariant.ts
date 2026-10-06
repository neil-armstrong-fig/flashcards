import type {Speed} from "@language-learning/shared/audio/Speed";
import type {Voice} from "@language-learning/shared/audio/Voice";

/** The four recordings of one text, named as the folder that holds them: `female-normal`, `male-slower`. */
export type RecordingVariant = `${Voice}-${Speed}`;
