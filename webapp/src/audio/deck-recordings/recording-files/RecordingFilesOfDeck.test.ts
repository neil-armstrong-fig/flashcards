import {recordingFilesOfDeck} from "@src/audio/deck-recordings/recording-files/RecordingFilesOfDeck";
import type {AudioManifest} from "@flashcards/content/audio/types/AudioManifest";
import type {Deck} from "@flashcards/content/types/Deck";

const MANIFEST: AudioManifest = {
  ko: {
    물: {"female-normal": "ko/female-normal/water.mp3", "male-slower": "ko/male-slower/water.mp3"},
    불: {"female-normal": "ko/female-normal/fire.mp3"},
  },
  en: {water: {"female-normal": "en/female-normal/water.mp3"}},
  ja: {あ: {"female-normal": "ja/female-normal/a.mp3"}},
};

const KOREAN: Deck = {
  id: "ko-test",
  name: "Test",
  language: "ko",
  notes: [
    {id: "ko-vocab-water", language: "ko", word: "물", meaning: "water", romanisation: "mul", soundSimilars: ["불"]},
  ],
};

const KANA: Deck = {
  id: "ja-test",
  name: "Test",
  language: "ja",
  notes: [{id: "ja-a", kind: "kana", language: "ja", word: "あ", meaning: "a", romanisation: ""}],
};

it("lists every version of the word, of what it is mistaken for, and of its English meaning", () => {
  expect(recordingFilesOfDeck(KOREAN, MANIFEST).sort()).toEqual([
    "en/female-normal/water.mp3",
    "ko/female-normal/fire.mp3",
    "ko/female-normal/water.mp3",
    "ko/male-slower/water.mp3",
  ]);
});

it("does not list the sound of a kana, which is shown and never spoken", () => {
  expect(recordingFilesOfDeck(KANA, MANIFEST)).toEqual(["ja/female-normal/a.mp3"]);
});

it("leaves out a word the manifest has no recording of, and lists a file once however often it is wanted", () => {
  const twice: Deck = {
    ...KOREAN,
    notes: [
      ...KOREAN.notes,
      {...KOREAN.notes[0]!, id: "ko-vocab-water-2"},
      {...KANA.notes[0]!, id: "x", language: "ko", word: "없다"},
    ],
  };

  expect(recordingFilesOfDeck(twice, MANIFEST)).toHaveLength(4);
});
