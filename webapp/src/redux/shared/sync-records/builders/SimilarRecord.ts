import {BEFORE_ANY_CHANGE} from "@src/redux/shared/sync-records/builders/BeforeAnyChange";
import {similarRecordId} from "@src/redux/shared/sync-records/builders/SimilarRecordId";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

interface Props {
  readonly noteId: string;
  readonly text: string;
  readonly at: string;
}

/** The change that records a word the learner added to a card's similar words. Whatever is not given is a default. */
export function similarRecord({
  noteId = "ko-vocab-water",
  text = "볼",
  at = BEFORE_ANY_CHANGE,
}: Partial<Props> = {}): RecordChange {
  return {kind: "similar", id: similarRecordId(noteId, text), at, deleted: false, payload: {noteId, text}};
}
