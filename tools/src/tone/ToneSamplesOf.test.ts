import {SAMPLE_RATE, toneSamplesOf} from "@src/tone/ToneSamplesOf";

it("lasts a second and a half at the sample rate", () => {
  expect(toneSamplesOf(440)).toHaveLength(SAMPLE_RATE * 1.5);
});

it("starts silent, is loudest near the start, and has died away by the end", () => {
  const samples = toneSamplesOf(440);
  const peakOf = (from: number, to: number): number => Math.max(...samples.slice(from, to).map(Math.abs));

  expect(samples[0]).toBe(0);
  expect(peakOf(0, 4410)).toBeGreaterThan(peakOf(samples.length - 4410, samples.length) * 10);
});

it("crosses zero as often as the pitch says: a 441 hertz tone, 441 times a second", () => {
  const samples = toneSamplesOf(441).slice(4410, 4410 + SAMPLE_RATE);
  let crossings = 0;

  for (let index = 1; index < samples.length; index += 1) {
    if ((samples[index - 1] ?? 0) < 0 !== (samples[index] ?? 0) < 0) {
      crossings += 1;
    }
  }

  expect(crossings).toBeGreaterThan(2 * 441 - 20);
  expect(crossings).toBeLessThan(2 * 441 + 20);
});

it("is the same bytes every time", () => {
  expect(toneSamplesOf(261.63)).toEqual(toneSamplesOf(261.63));
});
