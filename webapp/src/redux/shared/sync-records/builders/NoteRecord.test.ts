import {noteRecord} from "@src/redux/shared/sync-records/builders/NoteRecord";

it("builds a card of the learner's with defaults for whatever is not given", () => {
  expect(noteRecord()).toEqual({
    kind: "note",
    id: "ko-custom-default",
    at: "1970-01-01T00:00:00.000Z",
    deleted: false,
    payload: {word: "코끼리", meaning: "elephant", romanisation: "kokkiri"},
  });
});

it("takes what is given over the defaults, and leaves the rest as they were", () => {
  expect(noteRecord({id: "ko-custom-1", meaning: "tusker", at: "2026-10-05T10:00:00.000Z"})).toEqual({
    kind: "note",
    id: "ko-custom-1",
    at: "2026-10-05T10:00:00.000Z",
    deleted: false,
    payload: {word: "코끼리", meaning: "tusker", romanisation: "kokkiri"},
  });
});
