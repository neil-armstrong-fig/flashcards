import {frequencyOf} from "@src/tone/FrequencyOf";

it("puts A4 at 440 hertz and middle C at about 261.63", () => {
  expect(frequencyOf("A4")).toBeCloseTo(440, 6);
  expect(frequencyOf("C4")).toBeCloseTo(261.6256, 3);
});

it("doubles for each octave", () => {
  expect(frequencyOf("C5")).toBeCloseTo((frequencyOf("C4") ?? 0) * 2, 6);
  expect(frequencyOf("E2")).toBeCloseTo(82.4069, 3);
});

it("has no frequency for a name that is not a natural note", () => {
  expect(frequencyOf("C#4")).toBeUndefined();
});
