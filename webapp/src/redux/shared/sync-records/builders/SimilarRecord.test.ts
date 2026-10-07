import {similarRecord} from "@src/redux/shared/sync-records/builders/SimilarRecord";

it("builds a similar word with defaults, named by its card and the word", () => {
  expect(similarRecord()).toEqual({
    kind: "similar",
    id: "ko-vocab-water|볼",
    at: "1970-01-01T00:00:00.000Z",
    deleted: false,
    payload: {noteId: "ko-vocab-water", text: "볼"},
  });
});

it("names the record by the card and word that are given", () => {
  const record = similarRecord({noteId: "ko-custom-1", text: "고기리"});

  expect(record.id).toBe("ko-custom-1|고기리");
  expect(record.payload).toEqual({noteId: "ko-custom-1", text: "고기리"});
});
