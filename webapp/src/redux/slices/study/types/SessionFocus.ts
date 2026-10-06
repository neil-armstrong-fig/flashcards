import type {StudyFocus} from "@flashcards/shared/study/StudyFocus";

/** What a session studies of the deck's day, with what deciding "struggling" needs, so a reducer can work it out from the log. */
export interface SessionFocus {
  readonly kind: StudyFocus;
  /** The learner's struggling threshold when the session began (`settings.strugglingAfter`). */
  readonly strugglingAfter: number;
}
