import type {StudyFocus} from "@flashcards/shared/study/StudyFocus";

/** A way of studying only part of a deck's day: every focus but the whole of it. */
export type NarrowFocus = Exclude<StudyFocus, "all">;
