import {cardsOfDeck} from "@flashcards/content/cards/CardsOfDeck";
import {HIRAGANA_COMBINED_DECK} from "@flashcards/content/japanese/HiraganaCombinedDeck";
import {HIRAGANA_DECK} from "@flashcards/content/japanese/HiraganaDeck";
import {KATAKANA_COMBINED_DECK} from "@flashcards/content/japanese/KatakanaCombinedDeck";
import {KATAKANA_DECK} from "@flashcards/content/japanese/KatakanaDeck";
import {KATAKANA_FOREIGN_DECK} from "@flashcards/content/japanese/KatakanaForeignDeck";
import type {Deck} from "@flashcards/content/types/Deck";

const HIRAGANA = /^\p{Script=Hiragana}+$/u;
const KATAKANA = /^\p{Script=Katakana}+$/u;

const EVERY_DECK = [
  HIRAGANA_DECK,
  HIRAGANA_COMBINED_DECK,
  KATAKANA_DECK,
  KATAKANA_COMBINED_DECK,
  KATAKANA_FOREIGN_DECK,
];

it.each([
  ["hiragana", HIRAGANA_DECK, "ja-hiragana-", HIRAGANA, 71],
  ["combined hiragana", HIRAGANA_COMBINED_DECK, "ja-hiragana-", HIRAGANA, 33],
  ["katakana", KATAKANA_DECK, "ja-katakana-", KATAKANA, 71],
  ["combined katakana", KATAKANA_COMBINED_DECK, "ja-katakana-", KATAKANA, 33],
  ["katakana for foreign sounds", KATAKANA_FOREIGN_DECK, "ja-katakana-", KATAKANA, 23],
] as const)("teaches the %s, each a kana note of its own script", (_name, deck: Deck, prefix, script, count) => {
  expect(deck.notes).toHaveLength(count);
  expect(deck.language).toBe("ja");
  expect(deck.notes.every(note => note.kind === "kana" && note.language === "ja")).toBe(true);
  expect(deck.notes.every(note => note.id.startsWith(prefix))).toBe(true);
  expect(deck.notes.every(note => script.test(note.word))).toBe(true);
});

it("keeps the core decks to the 46 basic kana and the 25 with dakuten, and puts the rest in decks of their own", () => {
  expect(HIRAGANA_DECK.notes.map(note => note.meaning)).toEqual(KATAKANA_DECK.notes.map(note => note.meaning));
  expect(HIRAGANA_COMBINED_DECK.notes.map(note => note.meaning)).toEqual(
    KATAKANA_COMBINED_DECK.notes.map(note => note.meaning),
  );
  expect(HIRAGANA_COMBINED_DECK.notes.map(note => note.word).slice(0, 3)).toEqual(["きゃ", "きゅ", "きょ"]);
  expect(KATAKANA_FOREIGN_DECK.notes.map(note => note.word)).toContain("ファ");
});

it("gives every card of every deck, and every note, an id of its own, because progress is kept by id", () => {
  const notes = EVERY_DECK.flatMap(deck => deck.notes).map(note => note.id);
  const cards = EVERY_DECK.flatMap(deck => cardsOfDeck(deck)).map(card => card.id);

  expect(new Set(notes).size).toBe(231);
  expect(new Set(cards).size).toBe(462);
});

it("keeps the ids the notes had when there were two decks, so no learner's progress is lost", () => {
  expect(HIRAGANA_DECK.notes[0]?.id).toBe("ja-hiragana-a");
  expect(HIRAGANA_COMBINED_DECK.notes[0]?.id).toBe("ja-hiragana-kya");
  expect(KATAKANA_COMBINED_DECK.notes[0]?.id).toBe("ja-katakana-kya");
  expect(KATAKANA_FOREIGN_DECK.notes[0]?.id).toBe("ja-katakana-fa");
});

it("shows the sound of each kana in Latin letters, and has no romanisation to add", () => {
  expect(EVERY_DECK.every(deck => deck.notes.every(note => note.romanisation === ""))).toBe(true);
});

it("teaches the basic kana first, then the voiced ones", () => {
  const words = HIRAGANA_DECK.notes.map(note => note.word);

  expect(words[45]).toBe("ん");
  expect(words[46]).toBe("が");
  expect(words[70]).toBe("ぽ");
});

it("tells apart the kana that sound alike by their sound, as it does for を", () => {
  for (const deck of EVERY_DECK) {
    expect(new Set(deck.notes.map(note => note.meaning)).size).toBe(deck.notes.length);
  }

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

it("explains each katakana made for foreign sounds, and nothing else", () => {
  const explained = EVERY_DECK.flatMap(deck => deck.notes).filter(note => note.explanation !== undefined);

  expect(explained.map(note => note.word)).toEqual(KATAKANA_FOREIGN_DECK.notes.map(note => note.word));
  expect(explained.every(note => (note.explanation ?? "").length > 40)).toBe(true);
});

it("lists what each kana is heard as, in its own script, and nothing for the katakana for foreign sounds", () => {
  const sounds = (deck: Deck, word: string): readonly string[] | undefined => {
    return deck.notes.find(note => note.word === word)?.soundSimilars;
  };

  expect(sounds(HIRAGANA_DECK, "か")).toEqual(["が"]);
  expect(sounds(KATAKANA_DECK, "カ")).toEqual(["ガ"]);
  expect(sounds(HIRAGANA_COMBINED_DECK, "きゃ")).toEqual(["ぎゃ"]);
  expect(KATAKANA_FOREIGN_DECK.notes.every(note => note.soundSimilars === undefined)).toBe(true);
});

it("only ever lists a similar sound that is in the same deck, so the comparison can be heard from the deck being studied", () => {
  for (const deck of EVERY_DECK) {
    const words = new Set(deck.notes.map(note => note.word));

    for (const note of deck.notes) {
      expect((note.soundSimilars ?? []).every(similar => words.has(similar))).toBe(true);
    }
  }
});
