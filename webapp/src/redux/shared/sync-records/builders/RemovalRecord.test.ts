import {removalRecord} from "@src/redux/shared/sync-records/builders/RemovalRecord";

it("builds a removal with defaults, which has no payload", () => {
  expect(removalRecord()).toEqual({
    kind: "note",
    id: "ko-custom-default",
    at: "1970-01-01T00:00:00.000Z",
    deleted: true,
  });
});

it("takes the kind, the id and the moment that are given", () => {
  expect(removalRecord({kind: "picture", id: "ko-vocab-water/to-english", at: "2026-10-05T10:00:00.000Z"})).toEqual({
    kind: "picture",
    id: "ko-vocab-water/to-english",
    at: "2026-10-05T10:00:00.000Z",
    deleted: true,
  });
});
