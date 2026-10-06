import {readOneOf} from "@src/redux/slices/settings/storage/read/ReadOneOf";

const ITEMS = ["female", "male"] as const;

it("reads a value that is on the list", () => {
  expect(readOneOf("male", ITEMS)).toBe("male");
});

it.each([
  ["a word not on the list", "robot"],
  ["a number", 1],
  ["nothing", undefined],
  ["null", null],
])("does not trust %s", (_name, stored) => {
  expect(readOneOf(stored, ITEMS)).toBeUndefined();
});
