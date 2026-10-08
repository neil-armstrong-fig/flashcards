import {keepStoredSettingTimes} from "@src/storage/local-storage/setting-times/KeepStoredSettingTimes";
import {readStoredSettingTimes} from "@src/storage/local-storage/setting-times/ReadStoredSettingTimes";

it("keeps under the key devices already hold, so nothing a learner kept is lost", () => {
  keepStoredSettingTimes({a: 1});

  expect(localStorage.getItem("flashcards.setting-times.v1")).toBe('{"a":1}');
  expect(readStoredSettingTimes()).toEqual({a: 1});
});
