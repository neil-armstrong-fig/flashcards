import {KANA} from "@language-learning/content/japanese/Kana";
import {SOUND_SIMILAR_GROUPS} from "@language-learning/content/japanese/sound-similars/SoundSimilarGroups";
import {soundSimilarsOf} from "@language-learning/content/japanese/sound-similars/SoundSimilarsOf";

function kana(romaji: string): (typeof KANA)[number] {
  const found = KANA.find(entry => entry.romaji === romaji);

  if (found === undefined) {
    throw new Error(`No kana ${romaji}`);
  }

  return found;
}

it("gives the voiced kana a plain one is heard as, in the script of the card", () => {
  expect(soundSimilarsOf(kana("ka"), "hiragana")).toEqual(["が"]);
  expect(soundSimilarsOf(kana("ka"), "katakana")).toEqual(["ガ"]);
});

it("gives both of the others where three are alike, as は, ば and ぱ are", () => {
  expect(soundSimilarsOf(kana("ha"), "hiragana")).toEqual(["ば", "ぱ"]);
  expect(soundSimilarsOf(kana("pa"), "hiragana")).toEqual(["は", "ば"]);
});

it("gives the kana that sounds exactly the same, which is worth knowing", () => {
  expect(soundSimilarsOf(kana("ji"), "hiragana")).toEqual(["し", "ぢ"]);
  expect(soundSimilarsOf(kana("o"), "hiragana")).toContain("を");
});

it("gives nothing for a kana nothing is mistaken for", () => {
  expect(soundSimilarsOf(kana("a"), "hiragana")).toEqual([]);
});

it("only names sounds that the deck teaches, so every one has a recording", () => {
  const sounds = new Set(KANA.map(entry => entry.romaji));

  expect(SOUND_SIMILAR_GROUPS.flat().every(sound => sounds.has(sound))).toBe(true);
});

it("never lists a kana as its own similar", () => {
  expect(KANA.every(entry => !soundSimilarsOf(entry, "hiragana").includes(entry.hiragana))).toBe(true);
});
