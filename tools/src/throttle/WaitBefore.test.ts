import {waitBefore} from "@src/throttle/WaitBefore";

it("lets the first request go at once", () => {
  expect(waitBefore(undefined, 3_300, 1_000)).toBe(0);
});

it("holds the next request until the interval has passed", () => {
  expect(waitBefore(1_000, 3_300, 1_000)).toBe(3_300);
});

it("waits only for what is left of the interval", () => {
  expect(waitBefore(1_000, 3_300, 2_000)).toBe(2_300);
});

it("does not wait when the interval has already passed", () => {
  expect(waitBefore(1_000, 3_300, 6_000)).toBe(0);
});
