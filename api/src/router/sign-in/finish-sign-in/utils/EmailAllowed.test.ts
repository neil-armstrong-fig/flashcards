import {emailAllowed} from "@src/router/sign-in/finish-sign-in/utils/EmailAllowed";

it("lets in an email that is on the list, whatever its case", () => {
  expect(emailAllowed("Me@Example.com", true, "other@example.com, me@example.com")).toBe(true);
});

it.each([
  ["an email not on the list", "you@example.com", true, "me@example.com"],
  ["an email Google has not verified", "me@example.com", false, "me@example.com"],
  ["no email at all", undefined, true, "me@example.com"],
  ["an empty list", "me@example.com", true, ""],
  ["a missing list", "me@example.com", true, undefined],
  ["an address that merely contains one on the list", "xme@example.com", true, "me@example.com"],
])("turns away %s", (_name, email, verified, setting) => {
  expect(emailAllowed(email, verified, setting)).toBe(false);
});
