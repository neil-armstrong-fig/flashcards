import {audioUrlOf} from "@src/audio/speak/shared/utils/AudioUrlOf";

const KEPT = [
  {language: "ko", text: "코끼리"},
  {language: "en", text: "elephant"},
  {language: "ko", text: "물"},
] as const;

it("plays what the manifest names, even when the text is kept as well", () => {
  expect(audioUrlOf(KEPT, {language: "ko", text: "물", voice: "male", speed: "slower"})).toBe(
    "audio/ko/male-slower/water.mp3",
  );
});

it("plays a kept Korean text in the voice and speed chosen", () => {
  expect(audioUrlOf(KEPT, {language: "ko", text: "코끼리", voice: "male", speed: "slower"})).toBe(
    "kept-audio/ko/male-slower/%EC%BD%94%EB%81%BC%EB%A6%AC.mp3",
  );
});

it("plays a kept English text in its one voice whatever was chosen", () => {
  expect(audioUrlOf(KEPT, {language: "en", text: "elephant", voice: "male", speed: "slower"})).toBe(
    "kept-audio/en/female-normal/elephant.mp3",
  );
});

it("says nothing for a text that is neither in the manifest nor kept", () => {
  expect(audioUrlOf(KEPT, {language: "ko", text: "집", voice: "female", speed: "normal"})).toBeUndefined();
});

it("does not take a kept text in one language for the same letters in another", () => {
  expect(audioUrlOf(KEPT, {language: "en", text: "코끼리", voice: "female", speed: "normal"})).toBeUndefined();
});
