import {keepStoredSettings} from "@src/storage/local-storage/settings/KeepStoredSettings";
import {readStoredSettings} from "@src/storage/local-storage/settings/ReadStoredSettings";

it("keeps under the key devices already hold, so nothing a learner kept is lost", () => {
  keepStoredSettings({a: 1});

  expect(localStorage.getItem("flashcards.settings.v1")).toBe('{"a":1}');
  expect(readStoredSettings()).toEqual({a: 1});
});
