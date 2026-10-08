import {toneRecording} from "@src/tone/ToneRecording";

it("makes an MP3 of a note, which begins with a frame sync", () => {
  const bytes = toneRecording("C4");

  expect(bytes.length).toBeGreaterThan(5000);
  expect(bytes[0]).toBe(0xff);
  expect((bytes[1] ?? 0) & 0xe0).toBe(0xe0);
});

it("makes a different file for a different note", () => {
  expect(toneRecording("C4")).not.toEqual(toneRecording("D4"));
});

it("refuses a name that is not a natural note", () => {
  expect(() => toneRecording("H9")).toThrow('"H9" is not a natural note');
});
