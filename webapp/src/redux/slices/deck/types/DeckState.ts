import type {VocabNote} from "@language-learning/content/types/VocabNote";

export interface DeckState {
  /** The cards the learner made, oldest first, as notes: each is studied as two cards. The deck's own notes are not here. */
  readonly notes: readonly VocabNote[];
  /** True while a card's recordings are being fetched. */
  readonly adding: boolean;
  /** Why the last card could not be added or deleted. Absent when there is none. */
  readonly error?: string;
  /** Why the last edit of a card was refused. Kept apart from `error` so the add form does not show it. */
  readonly editError?: string;
}
