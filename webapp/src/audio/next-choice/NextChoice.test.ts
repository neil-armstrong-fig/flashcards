import {nextChoice} from "@src/audio/next-choice/NextChoice";

const VOICES = ["female", "male"] as const;

it("gives the other of two choices", () => {
  expect(nextChoice(VOICES, "female")).toBe("male");
  expect(nextChoice(VOICES, "male")).toBe("female");
});

it("wraps round to the first after the last of several", () => {
  expect(nextChoice(["a", "b", "c"], "c")).toBe("a");
});
