import {ACCOUNT_STORAGE_KEY} from "@src/redux/slices/account/storage/AccountStorageKey";
import {loadRememberedAccount} from "@src/redux/slices/account/storage/LoadRememberedAccount";

function holding(stored: unknown): void {
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(stored));
}

it("remembers who signed in, without yet knowing whether they still are", () => {
  holding({email: "me@example.com"});
  expect(loadRememberedAccount()).toEqual({
    status: "unknown",
    email: "me@example.com",
  });
});

it("remembers nobody when nothing was kept", () => {
  expect(loadRememberedAccount().email).toBeUndefined();
});

it.each([
  ["null", null],
  ["a number", 7],
  ["no email", {}],
  ["an email that is not text", {email: 7}],
  ["an empty email", {email: ""}],
])("does not trust %s", (_name, stored) => {
  holding(stored);
  expect(loadRememberedAccount().email).toBeUndefined();
});
