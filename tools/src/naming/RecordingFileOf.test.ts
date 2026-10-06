import {recordingFileOf} from "@src/naming/RecordingFileOf";

const WATER = {
  language: "ko",
  variant: "female-normal",
  text: "물",
  voiceName: "ko-KR-JiMinNeural",
  rate: "default",
} as const;

it("puts the recording in its language and variant folder", () => {
  expect(recordingFileOf(WATER)).toMatch(/^ko\/female-normal\/[0-9a-f]{16}\.mp3$/);
});

it("names the same recording the same way every time", () => {
  expect(recordingFileOf(WATER)).toBe(recordingFileOf({...WATER}));
});

it.each([
  ["the text", {text: "밥"}],
  ["the voice", {voiceName: "ko-KR-BongJinNeural"}],
  ["the rate", {rate: "-15%"}],
])("names a recording differently when %s changes", (_name, change) => {
  expect(recordingFileOf({...WATER, ...change})).not.toBe(recordingFileOf(WATER));
});
