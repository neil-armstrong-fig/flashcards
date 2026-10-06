import {clampToLimits} from "@src/redux/slices/settings/limits/ClampToLimits";

const limits = {min: 0, max: 10};

it("leaves a number within the limits alone", () => {
  expect(clampToLimits(4, limits)).toBe(4);
});

it("rounds to a whole number", () => {
  expect(clampToLimits(4.6, limits)).toBe(5);
});

it("stops at either end", () => {
  expect(clampToLimits(-3, limits)).toBe(0);
  expect(clampToLimits(99, limits)).toBe(10);
});
