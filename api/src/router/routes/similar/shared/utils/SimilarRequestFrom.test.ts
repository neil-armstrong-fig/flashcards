import {similarRequestFrom} from "@src/router/routes/similar/shared/utils/SimilarRequestFrom";

it("accepts a Korean word for a note", () => {
  expect(similarRequestFrom({noteId: "ko-vocab-water", text: " 볼 "})).toEqual({
    noteId: "ko-vocab-water",
    text: "볼",
  });
});

it.each([
  ["not an object", "볼"],
  ["no note", {text: "볼"}],
  ["a note id with odd characters", {noteId: "ko vocab/../x", text: "볼"}],
  ["a very long note id", {noteId: "a".repeat(65), text: "볼"}],
  ["English", {noteId: "ko-vocab-water", text: "ball"}],
  ["no text", {noteId: "ko-vocab-water"}],
])("refuses %s", (_name, body) => {
  expect(similarRequestFrom(body)).toBeUndefined();
});
