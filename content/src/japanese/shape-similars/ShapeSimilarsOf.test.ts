import {KANA} from "@flashcards/content/japanese/Kana";
import {HIRAGANA_SHAPE_PAIRS} from "@flashcards/content/japanese/shape-similars/HiraganaShapeSimilars";
import {KATAKANA_SHAPE_PAIRS} from "@flashcards/content/japanese/shape-similars/KatakanaShapeSimilars";
import {shapeSimilarsOf} from "@flashcards/content/japanese/shape-similars/ShapeSimilarsOf";

it("gives the character it is taken for and that character's sound", () => {
  expect(shapeSimilarsOf("シ")).toEqual([{character: "ツ", sound: "tsu"}]);
});

it("works from either side of a pair", () => {
  expect(shapeSimilarsOf("ツ")).toEqual([{character: "シ", sound: "shi"}]);
  expect(shapeSimilarsOf("ン")).toEqual([{character: "ソ", sound: "so"}]);
});

it("gives nothing for a character that is not commonly confused", () => {
  expect(shapeSimilarsOf("ア")).toEqual([]);
});

it("gives the hiragana a hiragana is taken for, with their sounds", () => {
  expect(shapeSimilarsOf("ぬ")).toEqual([{character: "め", sound: "me"}]);
  expect(shapeSimilarsOf("め")).toEqual([{character: "ぬ", sound: "nu"}]);
});

it("gives every one of three that are taken for one another, so わ, れ and ね each name the other two", () => {
  expect(shapeSimilarsOf("わ")).toEqual([
    {character: "れ", sound: "re"},
    {character: "ね", sound: "ne"},
  ]);
  expect(shapeSimilarsOf("れ")).toEqual([
    {character: "わ", sound: "wa"},
    {character: "ね", sound: "ne"},
  ]);
});

it("gives nothing for a hiragana that is not commonly confused", () => {
  expect(shapeSimilarsOf("あ")).toEqual([]);
});

it("only names katakana that the deck teaches, so every warning has a card behind it", () => {
  const taughtKatakana = new Set(KANA.map(kana => kana.katakana));
  const taughtHiragana = new Set(KANA.map(kana => kana.hiragana));

  expect(KATAKANA_SHAPE_PAIRS.flat().every(character => taughtKatakana.has(character))).toBe(true);
  expect(HIRAGANA_SHAPE_PAIRS.flat().every(character => taughtHiragana.has(character))).toBe(true);
});

it("never pairs a character with itself, or lists a pair twice", () => {
  const every = [...KATAKANA_SHAPE_PAIRS, ...HIRAGANA_SHAPE_PAIRS];
  const pairs = every.map(([first, second]) => [first, second].sort().join(""));

  expect(every.every(([first, second]) => first !== second)).toBe(true);
  expect(new Set(pairs).size).toBe(pairs.length);
});
