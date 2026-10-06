import {isRecord} from "@src/json/IsRecord";
import {koreanWordFrom} from "@language-learning/shared/language/KoreanText";
import type {SimilarWord} from "@src/database/types/SimilarWord";

/** The longest a note's id may be: ours are `ko-vocab-water`, so this is room, and not a place to put anything else. */
const MAX_NOTE_ID_LENGTH = 64;
const NOTE_ID = /^[a-z0-9-]+$/;

/** A word to keep with a note, or `undefined` for anything else. Nothing in the body is trusted until it has been checked. */
export function similarRequestFrom(body: unknown): SimilarWord | undefined {
  if (!isRecord(body)) {
    return undefined;
  }

  const {noteId, text} = body;

  if (
    typeof noteId !== "string" ||
    noteId.length > MAX_NOTE_ID_LENGTH ||
    !NOTE_ID.test(noteId) ||
    typeof text !== "string"
  ) {
    return undefined;
  }

  const word = koreanWordFrom(text);

  if (word === undefined) {
    return undefined;
  }

  return {noteId, text: word};
}
