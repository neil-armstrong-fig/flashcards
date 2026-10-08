import {readStoredPicture} from "@src/storage/index-db/pictures/stored-picture/ReadStoredPicture";

const PICTURE = new Blob(["x"], {type: "image/png"});

it("reads a picture and the date it was added", () => {
  expect(readStoredPicture({picture: PICTURE, addedAt: "2026-10-05T10:00:00.000Z"})).toEqual({
    picture: PICTURE,
    addedAt: "2026-10-05T10:00:00.000Z",
  });
});

it("reads a bare picture, kept before pictures were dated, with no date", () => {
  expect(readStoredPicture(PICTURE)).toEqual({picture: PICTURE, addedAt: ""});
});

it("gives no date to a record whose date is not text", () => {
  expect(readStoredPicture({picture: PICTURE, addedAt: 7})).toEqual({picture: PICTURE, addedAt: ""});
});

it.each([
  ["nothing", undefined],
  ["null", null],
  ["a number", 7],
  ["an object with no picture", {addedAt: "2026-10-05T10:00:00.000Z"}],
  ["a picture that is not a blob", {picture: "x", addedAt: ""}],
])("does not trust %s", (_name, stored) => {
  expect(readStoredPicture(stored)).toBeUndefined();
});
