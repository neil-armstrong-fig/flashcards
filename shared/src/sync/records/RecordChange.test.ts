import {
  memoryNotePayloadOf,
  notePayloadOf,
  picturePayloadOf,
  readRecordChange,
  similarPayloadOf,
} from "@flashcards/shared/sync/records/RecordChange";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

const at = "2026-10-05T10:00:00.000Z";
const HASH = "a".repeat(64);

const NOTE = {
  kind: "note",
  id: "ko-custom-abc-123",
  at,
  deleted: false,
  payload: {word: "코끼리", meaning: "elephant", romanisation: "kokkiri"},
};
const SIMILAR = {
  kind: "similar",
  id: "ko-vocab-water|볼",
  at,
  deleted: false,
  payload: {noteId: "ko-vocab-water", text: "볼"},
};
const MEMORY_NOTE = {
  kind: "memory-note",
  id: "ko-vocab-water/to-english",
  at,
  deleted: false,
  payload: {text: "a pool"},
};
const PICTURE = {
  kind: "picture",
  id: "ko-vocab-water/to-english",
  at,
  deleted: false,
  payload: {hash: HASH, type: "image/webp"},
};

it.each([
  ["a card the learner made", NOTE],
  ["a similar word", SIMILAR],
  ["a note on a card", MEMORY_NOTE],
  ["a picture on a card", PICTURE],
])("reads %s", (_name, record) => {
  expect(readRecordChange(record)).toEqual(record);
});

it("reads a removal, which needs no payload, and drops one it is given", () => {
  const removal = {kind: "note", id: "ko-custom-abc-123", at, deleted: true};

  expect(readRecordChange(removal)).toEqual(removal);
  expect(readRecordChange({...removal, payload: NOTE.payload})).toEqual(removal);
});

it("trims the words it reads, as the app does", () => {
  const read = readRecordChange({...MEMORY_NOTE, payload: {text: "  a pool  "}});

  expect(read?.payload).toEqual({text: "a pool"});
});

it.each([
  ["null", null],
  ["an unknown kind", {...NOTE, kind: "deck"}],
  ["a bad moment", {...NOTE, at: "soon"}],
  ["a deleted that is not true or false", {...NOTE, deleted: "no"}],
  ["a card id that is not a learner's own", {...NOTE, id: "ko-vocab-water"}],
  ["a note whose word is not Korean", {...NOTE, payload: {...NOTE.payload, word: "elephant"}}],
  ["a note with no meaning", {...NOTE, payload: {...NOTE.payload, meaning: ""}}],
  ["no payload where there is no removal", {...NOTE, payload: undefined}],
  ["a note on a card whose id is a word and not a card", {...MEMORY_NOTE, id: "ko-vocab-water"}],
  ["a similar whose id does not name its card and word", {...SIMILAR, id: "ko-vocab-water|불"}],
  [
    "a similar word that is not Korean",
    {...SIMILAR, id: "ko-vocab-water|ball", payload: {noteId: "ko-vocab-water", text: "ball"}},
  ],
  ["an empty note on a card", {...MEMORY_NOTE, payload: {text: "   "}}],
  ["a note on a card of more than 280 characters", {...MEMORY_NOTE, payload: {text: "x".repeat(281)}}],
  ["a picture whose hash is not a SHA-256", {...PICTURE, payload: {hash: "abc", type: "image/webp"}}],
  ["a picture of a kind that is not kept", {...PICTURE, payload: {hash: HASH, type: "image/svg+xml"}}],
])("refuses %s", (_name, record) => {
  expect(readRecordChange(record)).toBeUndefined();
});

it("gives each kind's payload from its record, and nothing from another kind's", () => {
  expect(notePayloadOf(NOTE as unknown as RecordChange)).toEqual(NOTE.payload);
  expect(similarPayloadOf(SIMILAR as unknown as RecordChange)).toEqual(SIMILAR.payload);
  expect(memoryNotePayloadOf(MEMORY_NOTE as unknown as RecordChange)).toEqual(MEMORY_NOTE.payload);
  expect(picturePayloadOf(PICTURE as unknown as RecordChange)).toEqual(PICTURE.payload);
  expect(notePayloadOf(SIMILAR as unknown as RecordChange)).toBeUndefined();
  expect(memoryNotePayloadOf(SIMILAR as unknown as RecordChange)).toBeUndefined();
  expect(picturePayloadOf({kind: "picture", id: "x/to-english", at, deleted: true})).toBeUndefined();
});
