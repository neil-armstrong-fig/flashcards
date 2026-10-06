import type {Speed} from "@flashcards/shared/audio/Speed";
import type {Voice} from "@flashcards/shared/audio/Voice";

/** The four recordings of one text, named as the folder that holds them: `female-normal`, `male-slower`. */
export type RecordingVariant = `${Voice}-${Speed}`;
