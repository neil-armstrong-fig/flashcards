import {pictureRecord} from "@src/redux/shared/sync-records/builders/PictureRecord";

it("builds a picture on a card with defaults, and takes what is given over them", () => {
  expect(pictureRecord()).toEqual({
    kind: "picture",
    id: "ko-vocab-water/to-english",
    at: "1970-01-01T00:00:00.000Z",
    deleted: false,
    payload: {hash: "a".repeat(64), type: "image/webp"},
  });
  expect(pictureRecord({hash: "b".repeat(64), type: "image/png", at: "2026-10-05T10:00:00.000Z"})).toMatchObject({
    at: "2026-10-05T10:00:00.000Z",
    payload: {hash: "b".repeat(64), type: "image/png"},
  });
});
