import {speakTextsInOrder} from "@src/audio/speak/SpeakTextsInOrder";
import {testEnvironment} from "@src/testing/environment/TestEnvironment";

const NORMAL = {voice: "female", speed: "normal"} as const;

it("speaks the card's word, then a similar, from the recordings made ahead", () => {
  speakTextsInOrder(
    [],
    [
      {language: "ko", text: "물"},
      {language: "ko", text: "불"},
    ],
    NORMAL,
  );

  expect(testEnvironment.audio.played).toEqual(["audio/ko/female-normal/water.mp3", "audio/ko/female-normal/fire.mp3"]);
});

it("speaks a word the learner added from what was kept, in the voice and speed chosen", () => {
  speakTextsInOrder([{language: "ko", text: "볼"}], [{language: "ko", text: "볼"}], {voice: "male", speed: "slower"});

  expect(testEnvironment.audio.played).toEqual(["kept-audio/ko/male-slower/%EB%B3%BC.mp3"]);
});

it("skips a word it has no recording of", () => {
  speakTextsInOrder(
    [],
    [
      {language: "ko", text: "볼"},
      {language: "ko", text: "물"},
    ],
    NORMAL,
  );

  expect(testEnvironment.audio.played).toEqual(["audio/ko/female-normal/water.mp3"]);
});
