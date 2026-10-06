import {DECK_STORAGE_KEY} from "@src/redux/slices/deck/storage/DeckStorageKey";
import {loadDeck} from "@src/redux/slices/deck/storage/LoadDeck";

const ELEPHANT = {id: "ko-custom-1", word: "코끼리", meaning: "elephant", romanisation: "kokkiri"};

function holding(stored: unknown): void {
  localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(stored));
}

it("loads the cards that were kept, as Korean notes", () => {
  holding({notes: [ELEPHANT]});
  expect(loadDeck().notes).toEqual([{...ELEPHANT, language: "ko"}]);
});

it("starts empty when nothing was kept", () => {
  expect(loadDeck().notes).toEqual([]);
});

it.each([
  ["a word that is not Korean", {...ELEPHANT, word: "elephant"}],
  ["no meaning", {...ELEPHANT, meaning: ""}],
  ["a romanisation with a breve", {...ELEPHANT, romanisation: "ŏ"}],
  ["an id that is not a custom note's", {...ELEPHANT, id: "ko-vocab-water"}],
  ["a number", 7],
  ["null", null],
])("drops a card with %s and keeps the rest", (_name, bad) => {
  holding({notes: [bad, ELEPHANT]});
  expect(loadDeck().notes).toEqual([{...ELEPHANT, language: "ko"}]);
});

it("keeps a card once however often it was kept", () => {
  holding({notes: [ELEPHANT, ELEPHANT]});
  expect(loadDeck().notes).toHaveLength(1);
});

it.each([
  ["not an object", 7],
  ["no notes", {}],
  ["notes that are not a list", {notes: "x"}],
  ["null", null],
])("does not trust %s", (_name, stored) => {
  holding(stored);
  expect(loadDeck().notes).toEqual([]);
});
