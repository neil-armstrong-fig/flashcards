import {speechRequestFrom} from "@src/router/routes/speech/speak-for-account/utils/SpeechRequestFrom";

const VALID = {language: "ko", text: "불", voice: "female", speed: "normal"};

it("accepts a Korean word with a voice and a speed", () => {
  expect(speechRequestFrom(VALID)).toEqual(VALID);
});

it("trims the word", () => {
  expect(speechRequestFrom({...VALID, text: " 불 "})?.text).toBe("불");
});

it("accepts an English meaning, and always asks for the one voice at normal speed", () => {
  expect(speechRequestFrom({language: "en", text: " elephant ", voice: "male", speed: "slower"})).toEqual({
    language: "en",
    text: "elephant",
    voice: "female",
    speed: "normal",
  });
});

it("accepts an English meaning without a voice or a speed", () => {
  expect(speechRequestFrom({language: "en", text: "elephant"})).toEqual({
    language: "en",
    text: "elephant",
    voice: "female",
    speed: "normal",
  });
});

it.each([
  ["not an object", "불"],
  ["null", null],
  ["no text", {language: "ko", voice: "female", speed: "normal"}],
  ["empty text", {...VALID, text: "  "}],
  ["English as Korean", {...VALID, text: "water"}],
  ["Korean as English", {...VALID, language: "en", text: "불"}],
  ["Korean with markup", {...VALID, text: "불<b>"}],
  ["a long Korean text", {...VALID, text: "가".repeat(13)}],
  ["a long English text", {language: "en", text: "a".repeat(41)}],
  ["English with markup", {language: "en", text: "<b>water"}],
  ["a voice that does not exist", {...VALID, voice: "robot"}],
  ["a speed that does not exist", {...VALID, speed: "glacial"}],
  ["a number as the text", {...VALID, text: 7}],
  ["no language", {text: "불", voice: "female", speed: "normal"}],
  ["a language that is not offered", {...VALID, language: "ja"}],
])("refuses %s", (_name, body) => {
  expect(speechRequestFrom(body)).toBeUndefined();
});
