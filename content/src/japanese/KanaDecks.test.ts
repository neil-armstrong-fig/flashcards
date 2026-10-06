import {cardsOfDeck} from "@language-learning/content/cards/CardsOfDeck";
import {HIRAGANA_DECK} from "@language-learning/content/japanese/HiraganaDeck";
import {KATAKANA_DECK} from "@language-learning/content/japanese/KatakanaDeck";
import type {Deck} from "@language-learning/content/types/Deck";

const HIRAGANA = /^\p{Script=Hiragana}+$/u;
const KATAKANA = /^\p{Script=Katakana}+$/u;

it.each([
  ["hiragana", HIRAGANA_DECK, "ja-hiragana-", HIRAGANA, 104],
  ["katakana", KATAKANA_DECK, "ja-katakana-", KATAKANA, 127],
] as const)(
  "teaches the %s (46 basic, 25 with dakuten, 33 combined, and in katakana 23 for foreign sounds), each a kana note of its own script",
  (_name, deck: Deck, prefix, script, count) => {
    expect(deck.notes).toHaveLength(count);
    expect(deck.language).toBe("ja");
    expect(deck.notes.every(note => note.kind === "kana" && note.language === "ja")).toBe(true);
    expect(deck.notes.every(note => note.id.startsWith(prefix))).toBe(true);
    expect(deck.notes.every(note => script.test(note.word))).toBe(true);
  },
);

it("gives every card of both decks, and every note, an id of its own, because progress is kept by id", () => {
  const notes = [...HIRAGANA_DECK.notes, ...KATAKANA_DECK.notes].map(note => note.id);
  const cards = [...cardsOfDeck(HIRAGANA_DECK), ...cardsOfDeck(KATAKANA_DECK)].map(card => card.id);

  expect(new Set(notes).size).toBe(231);
  expect(new Set(cards).size).toBe(462);
});

it("shows the sound of each kana in Latin letters, the same in both decks, and has no romanisation to add", () => {
  expect(HIRAGANA_DECK.notes.map(note => note.meaning)).toEqual(
    KATAKANA_DECK.notes.slice(0, 104).map(note => note.meaning),
  );
  expect(HIRAGANA_DECK.notes.every(note => note.romanisation === "")).toBe(true);
});

it("teaches the basic kana first, then the voiced ones, then the combined ones", () => {
  const words = HIRAGANA_DECK.notes.map(note => note.word);

  expect(words[45]).toBe("ん");
  expect(words[46]).toBe("が");
  expect(words[70]).toBe("ぽ");
  expect(words[71]).toBe("きゃ");
  expect(words[103]).toBe("ぴょ");
});

it("tells apart the kana that sound alike by their sound, as it does for を", () => {
  const sounds = HIRAGANA_DECK.notes.map(note => note.meaning);

  expect(new Set(sounds).size).toBe(104);
  expect(new Set(KATAKANA_DECK.notes.map(note => note.meaning)).size).toBe(127);
  expect(HIRAGANA_DECK.notes.find(note => note.word === "ぢ")?.meaning).toBe("dji");
  expect(HIRAGANA_DECK.notes.find(note => note.word === "づ")?.meaning).toBe("dzu");
});

it("starts with the vowels, as the table does", () => {
  expect(HIRAGANA_DECK.notes.slice(0, 5).map(note => note.word)).toEqual(["あ", "い", "う", "え", "お"]);
  expect(KATAKANA_DECK.notes.slice(0, 5).map(note => note.word)).toEqual(["ア", "イ", "ウ", "エ", "オ"]);
});

it("warns about the shape of the kana that are commonly confused, and only those", () => {
  const warned = (deck: Deck): string[] => {
    return deck.notes.filter(note => (note.shapeSimilars ?? []).length > 0).map(note => note.word);
  };

  expect(warned(KATAKANA_DECK).sort()).toEqual(
    ["ウ", "ク", "ソ", "タ", "ツ", "ヌ", "ス", "ワ", "ン", "マ", "ム", "シ"].sort(),
  );
  expect(warned(HIRAGANA_DECK).sort()).toEqual(
    ["ぬ", "め", "わ", "れ", "ね", "る", "ろ", "は", "ほ", "さ", "ち"].sort(),
  );
});

it("explains each katakana made for foreign sounds, after the 104, and nothing else", () => {
  const explained = KATAKANA_DECK.notes.filter(note => note.explanation !== undefined);

  expect(explained.map(note => note.word)).toEqual(KATAKANA_DECK.notes.slice(104).map(note => note.word));
  expect(explained.map(note => note.word)).toContain("ファ");
  expect(explained.every(note => (note.explanation ?? "").length > 40)).toBe(true);
  expect(HIRAGANA_DECK.notes.every(note => note.explanation === undefined)).toBe(true);
});

it("lists what each kana is heard as, in its own script, and nothing for the extended katakana", () => {
  const sounds = (deck: Deck, word: string): readonly string[] | undefined => {
    return deck.notes.find(note => note.word === word)?.soundSimilars;
  };

  expect(sounds(HIRAGANA_DECK, "か")).toEqual(["が"]);
  expect(sounds(KATAKANA_DECK, "カ")).toEqual(["ガ"]);
  expect(KATAKANA_DECK.notes.slice(104).every(note => note.soundSimilars === undefined)).toBe(true);
});
