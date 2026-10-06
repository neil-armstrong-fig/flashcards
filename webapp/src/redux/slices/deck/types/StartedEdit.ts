import type {CardWords} from "@src/redux/slices/deck/types/CardWords";
import type {VocabNote} from "@language-learning/content/types/VocabNote";

/** A change to a card the learner made, begun: the words as checked, and the card as it was, so what changed can be told. */
export interface StartedEdit {
  readonly words: CardWords;
  readonly previous: VocabNote;
}
