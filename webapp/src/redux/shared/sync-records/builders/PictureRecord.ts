import {BEFORE_ANY_CHANGE} from "@src/redux/shared/sync-records/builders/BeforeAnyChange";
import type {PictureType} from "@flashcards/shared/sync/records/PictureType";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

interface Props {
  readonly cardId: string;
  readonly hash: string;
  readonly type: PictureType;
  readonly at: string;
}

/** The change that records the learner's picture on a card: which image, by its hash, and when it was added, which is also what fades it. Whatever is not given is a default. */
export function pictureRecord({
  cardId = "ko-vocab-water/to-english",
  hash = "a".repeat(64),
  type = "image/webp",
  at = BEFORE_ANY_CHANGE,
}: Partial<Props> = {}): RecordChange {
  return {kind: "picture", id: cardId, at, deleted: false, payload: {hash, type}};
}
