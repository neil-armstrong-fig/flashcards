import {expect, it} from "vitest";
import {fullHex} from "@src/dsl/web-app/playwright/full-hex/FullHex";

it("writes a three-digit colour out in full", () => {
  expect(fullHex("#0af")).toBe("#00aaff");
});

it("leaves a six-digit colour and anything else as it is", () => {
  expect(fullHex("#f4f7f6")).toBe("#f4f7f6");
  expect(fullHex("")).toBe("");
});
