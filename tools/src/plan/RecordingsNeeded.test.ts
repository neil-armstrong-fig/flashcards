import {recordingsNeeded} from "@src/plan/RecordingsNeeded";
import type {RecordingJob} from "@src/plan/types/RecordingJob";
import type {Deck} from "@flashcards/content/types/Deck";

const DECK: Deck = {
  id: "ko-test",
  name: "Test",
  language: "ko",
  notes: [
    {id: "ko-vocab-water", language: "ko", word: "물", meaning: "water", romanisation: "mul", soundSimilars: ["불"]},
    {id: "ko-vocab-rice", language: "ko", word: "밥", meaning: "rice", romanisation: "bap"},
  ],
};

it("needs four recordings of each Korean word", () => {
  const water = recordingsNeeded([DECK]).filter(job => job.text === "물");

  expect(water.map(job => job.variant).sort()).toEqual([
    "female-normal",
    "female-slower",
    "male-normal",
    "male-slower",
  ]);
});

it("uses the chosen Korean voices, and the slower rate only for slower", () => {
  const jobs = recordingsNeeded([DECK]);
  const find = (variant: string): RecordingJob | undefined => {
    return jobs.find(job => job.text === "물" && job.variant === variant);
  };

  expect(find("female-normal")).toMatchObject({voiceName: "ko-KR-JiMinNeural", rate: "default", locale: "ko-KR"});
  expect(find("male-slower")).toMatchObject({voiceName: "ko-KR-BongJinNeural", rate: "-15%"});
});

it("needs a word once however many decks or notes hold it", () => {
  const again: Deck = {...DECK, id: "ko-again"};

  expect(recordingsNeeded([DECK, again])).toHaveLength(14);
});

it("needs one English recording of each meaning, in the English voice at normal speed", () => {
  const english = recordingsNeeded([DECK]).filter(job => job.language === "en");

  expect(english).toHaveLength(2);
  expect(english[0]).toMatchObject({
    text: "water",
    variant: "female-normal",
    voiceName: "en-GB-SoniaNeural",
    rate: "default",
  });
});

it("needs the four recordings of each similar too", () => {
  const similar = recordingsNeeded([DECK]).filter(job => job.text === "불");

  expect(similar.map(job => job.variant).sort()).toEqual([
    "female-normal",
    "female-slower",
    "male-normal",
    "male-slower",
  ]);
});

it("gives every recording its own file", () => {
  const files = recordingsNeeded([DECK]).map(job => job.file);

  expect(new Set(files).size).toBe(files.length);
});

it("needs four recordings of a kana in the Japanese voices, and none for its Latin sound", () => {
  const kana: Deck = {
    id: "ja-test",
    name: "Kana",
    language: "ja",
    notes: [{id: "ja-hiragana-ka", kind: "kana", language: "ja", word: "か", meaning: "ka", romanisation: ""}],
  };
  const jobs = recordingsNeeded([kana]);

  expect(jobs).toHaveLength(4);
  expect(jobs.every(job => job.language === "ja" && job.text === "か")).toBe(true);
  expect(jobs.find(job => job.variant === "female-normal")).toMatchObject({
    voiceName: "ja-JP-MayuNeural",
    locale: "ja-JP",
  });
  expect(jobs.find(job => job.variant === "male-normal")).toMatchObject({voiceName: "ja-JP-NaokiNeural"});
});

it("needs four recordings of a pronunciation's spelling, and none for the way it is said", () => {
  const pronunciation: Deck = {
    id: "ko-test",
    name: "Pronunciation",
    language: "ko",
    notes: [
      {
        id: "ko-pronunciation-jota",
        kind: "pronunciation",
        language: "ko",
        word: "좋다",
        meaning: "조타",
        romanisation: "jota",
      },
    ],
  };
  const jobs = recordingsNeeded([pronunciation]);

  expect(jobs).toHaveLength(4);
  expect(jobs.every(job => job.language === "ko" && job.text === "좋다")).toBe(true);
});
