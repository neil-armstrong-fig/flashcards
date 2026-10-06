import {speechCacheKey} from "@src/speech/cache/SpeechCacheKey";

it("is the same for the same word, voice and speed", () => {
  expect(speechCacheKey({language: "ko", text: "불", voice: "male", speed: "slower"})).toBe(
    speechCacheKey({language: "ko", text: "불", voice: "male", speed: "slower"}),
  );
});

it.each([
  ["language", {language: "en"}],
  ["word", {text: "볼"}],
  ["voice", {voice: "female"}],
  ["speed", {speed: "normal"}],
] as const)("differs when the %s does", (_name, change) => {
  expect(speechCacheKey({language: "ko", text: "불", voice: "male", speed: "slower", ...change})).not.toBe(
    speechCacheKey({language: "ko", text: "불", voice: "male", speed: "slower"}),
  );
});
