import {speakText} from "@src/audio/speak/SpeakText";
import {testEnvironment} from "@src/testing/environment/TestEnvironment";

const NORMAL = {voice: "female", speed: "normal"} as const;

it("speaks a Korean word in the voice and at the speed chosen", () => {
  speakText([], {language: "ko", text: "물"}, {voice: "male", speed: "slower"});

  expect(testEnvironment.audio.played).toEqual(["audio/ko/male-slower/water.mp3"]);
});

it("speaks English in the one voice whatever voice and speed were chosen", () => {
  speakText([], {language: "en", text: "water"}, {voice: "male", speed: "slower"});

  expect(testEnvironment.audio.played).toEqual(["audio/en/female-normal/water.mp3"]);
});

it("speaks a word the learner added from what was kept", () => {
  speakText([{language: "ko", text: "볼"}], {language: "ko", text: "볼"}, {voice: "male", speed: "slower"});

  expect(testEnvironment.audio.played).toEqual(["kept-audio/ko/male-slower/%EB%B3%BC.mp3"]);
});

it("says nothing for a word the manifest has no recording of and nobody kept", () => {
  speakText([], {language: "ko", text: "집"}, NORMAL);

  expect(testEnvironment.audio.played).toEqual([]);
});
