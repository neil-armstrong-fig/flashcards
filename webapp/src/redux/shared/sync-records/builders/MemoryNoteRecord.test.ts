import {memoryNoteRecord} from "@src/redux/shared/sync-records/builders/MemoryNoteRecord";

it("builds a note on a card with defaults, and takes what is given over them", () => {
  expect(memoryNoteRecord()).toEqual({
    kind: "memory-note",
    id: "ko-vocab-water/to-english",
    at: "1970-01-01T00:00:00.000Z",
    deleted: false,
    payload: {text: "a note"},
  });
  expect(memoryNoteRecord({cardId: "ko-vocab-fire/from-english", text: "hot"})).toMatchObject({
    id: "ko-vocab-fire/from-english",
    payload: {text: "hot"},
  });
});
