import {BEFORE_ANY_CHANGE} from "@src/redux/shared/sync-records/builders/BeforeAnyChange";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

interface Props {
  readonly cardId: string;
  readonly text: string;
  readonly at: string;
}

/** The change that records the learner's note on a card, as it now reads; `at` is also when it was written, which is what fades it. Whatever is not given is a default. */
export function memoryNoteRecord({
  cardId = "ko-vocab-water/to-english",
  text = "a note",
  at = BEFORE_ANY_CHANGE,
}: Partial<Props> = {}): RecordChange {
  return {kind: "memory-note", id: cardId, at, deleted: false, payload: {text}};
}
