import type {StudyFocus} from "@language-learning/shared/study/StudyFocus";

/** A way of studying only part of a deck's day: every focus but the whole of it. */
export type NarrowFocus = Exclude<StudyFocus, "all">;
