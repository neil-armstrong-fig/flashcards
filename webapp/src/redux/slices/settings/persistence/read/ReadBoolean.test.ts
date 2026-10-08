import {readBoolean} from "@src/redux/slices/settings/persistence/read/ReadBoolean";

it.each([true, false])("reads %s", stored => {
  expect(readBoolean(stored)).toBe(stored);
});

it.each([
  ["a string", "true"],
  ["a number", 1],
  ["nothing", undefined],
])("does not trust %s", (_name, stored) => {
  expect(readBoolean(stored)).toBeUndefined();
});
