import type {Rating} from "@flashcards/shared/study/Rating";

/** For each rating, how many milliseconds until the card falls due if it is rated that way. */
export type IntervalPreview = Readonly<Record<Rating, number>>;
