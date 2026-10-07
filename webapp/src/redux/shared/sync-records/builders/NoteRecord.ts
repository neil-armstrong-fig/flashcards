import {BEFORE_ANY_CHANGE} from "@src/redux/shared/sync-records/builders/BeforeAnyChange";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

interface Props {
  readonly id: string;
  readonly word: string;
  readonly meaning: string;
  readonly romanisation: string;
  readonly at: string;
}

/** The change that records a card the learner made, as it now reads. Whatever is not given is a default, so a test names only what it is about. */
export function noteRecord({
  id = "ko-custom-default",
  word = "코끼리",
  meaning = "elephant",
  romanisation = "kokkiri",
  at = BEFORE_ANY_CHANGE,
}: Partial<Props> = {}): RecordChange {
  return {kind: "note", id, at, deleted: false, payload: {word, meaning, romanisation}};
}
