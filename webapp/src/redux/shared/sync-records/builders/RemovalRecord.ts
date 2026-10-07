import {BEFORE_ANY_CHANGE} from "@src/redux/shared/sync-records/builders/BeforeAnyChange";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";
import type {RecordKind} from "@flashcards/shared/sync/records/RecordKind";

interface Props {
  readonly kind: RecordKind;
  readonly id: string;
  readonly at: string;
}

/** The change that records something of the learner's being removed, which stays so that a device that has not heard of it is told. Whatever is not given is a default. */
export function removalRecord({
  kind = "note",
  id = "ko-custom-default",
  at = BEFORE_ANY_CHANGE,
}: Partial<Props> = {}): RecordChange {
  return {kind, id, at, deleted: true};
}
