import {keepStoredAccount} from "@src/storage/local-storage/account/KeepStoredAccount";
import {readStoredAccount} from "@src/storage/local-storage/account/ReadStoredAccount";

it("keeps under the key devices already hold, so nothing a learner kept is lost", () => {
  keepStoredAccount({a: 1});

  expect(localStorage.getItem("flashcards.account.v1")).toBe('{"a":1}');
  expect(readStoredAccount()).toEqual({a: 1});
});
