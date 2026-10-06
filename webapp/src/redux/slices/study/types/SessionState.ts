import type {SessionFocus} from "@src/redux/slices/study/types/SessionFocus";
import type {IntervalPreview} from "@src/spaced-repetition/scheduling/types/IntervalPreview";

/** A review session in progress. `currentCardId` is absent once everything due has been done. */
export interface SessionState {
  /** The deck being studied: a session never mixes decks. */
  readonly deckId: string;
  /** Which part of the deck's day is being studied. */
  readonly focus: SessionFocus;
  readonly currentCardId?: string;
  readonly answerShown: boolean;
  /** When the card would return for each rating. Worked out when the answer is shown, which is when it is needed. */
  readonly intervals?: IntervalPreview;
  /** True while an answer or a set-aside is being written to storage. The card does not move on until it is saved. */
  readonly saving: boolean;
  /** In a look ahead, the cards already looked at, so none comes up twice. Empty in every other session. */
  readonly previewed: readonly string[];
}
