import {audioFileOf} from "@src/audio/audio-file/AudioFileOf";
import type {AudioManifest} from "@language-learning/content/audio/types/AudioManifest";

const MANIFEST: AudioManifest = {
  ko: {
    물: {"female-normal": "ko/female-normal/aaaa.mp3", "male-slower": "ko/male-slower/bbbb.mp3"},
  },
  en: {
    water: {"female-normal": "en/female-normal/cccc.mp3"},
  },
};

it("finds the recording for the voice and speed asked for", () => {
  expect(audioFileOf(MANIFEST, {language: "ko", text: "물", voice: "male", speed: "slower"})).toBe(
    "ko/male-slower/bbbb.mp3",
  );
});

it("does not hand back another voice's recording when the one asked for is missing", () => {
  expect(audioFileOf(MANIFEST, {language: "ko", text: "물", voice: "male", speed: "normal"})).toBeUndefined();
});

it("has nothing for a text the manifest does not know", () => {
  expect(audioFileOf(MANIFEST, {language: "ko", text: "밥", voice: "female", speed: "normal"})).toBeUndefined();
});

it("gives the one English recording whatever voice and speed were chosen", () => {
  expect(audioFileOf(MANIFEST, {language: "en", text: "water", voice: "male", speed: "slower"})).toBe(
    "en/female-normal/cccc.mp3",
  );
});
