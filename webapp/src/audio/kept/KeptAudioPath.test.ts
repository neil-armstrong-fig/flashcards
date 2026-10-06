import {keptAudioPath} from "@src/audio/kept/KeptAudioPath";

it("names the language, the variant and the word", () => {
  expect(keptAudioPath({language: "ko", text: "불", variant: "male-slower"})).toBe(
    "kept-audio/ko/male-slower/%EB%B6%88.mp3",
  );
});

it("gives each word, each variant of it, and each language its own address", () => {
  const fire = keptAudioPath({language: "ko", text: "불", variant: "male-slower"});

  expect(fire).not.toBe(keptAudioPath({language: "ko", text: "볼", variant: "male-slower"}));
  expect(fire).not.toBe(keptAudioPath({language: "ko", text: "불", variant: "female-slower"}));
  expect(fire).not.toBe(keptAudioPath({language: "en", text: "불", variant: "male-slower"}));
});
