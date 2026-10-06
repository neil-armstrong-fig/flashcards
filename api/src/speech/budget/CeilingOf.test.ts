import {ceilingOf, DEFAULT_MONTHLY_CHARACTER_CEILING} from "@src/speech/budget/CeilingOf";

it("reads a configured ceiling", () => {
  expect(ceilingOf("5000")).toBe(5000);
});

it.each([undefined, "", "lots", "-1", "0", "2.5"])("falls back to the default for %s", setting => {
  expect(ceilingOf(setting)).toBe(DEFAULT_MONTHLY_CHARACTER_CEILING);
});
