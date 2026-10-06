import {checkedCardWords} from "@src/redux/slices/deck/words/CheckedCardWords";
import type {VocabNote} from "@language-learning/content/types/VocabNote";

const ELEPHANT = {word: "코끼리", meaning: "elephant", romanisation: "kokkiri"};
const KEPT: VocabNote = {id: "ko-custom-1", language: "ko", ...ELEPHANT};

it("checks good words", () => {
  expect(checkedCardWords(ELEPHANT, [], undefined)).toEqual({kind: "checked", ...ELEPHANT});
});

it.each([
  ["a word that is not Korean", {...ELEPHANT, word: "elephant"}, "Type a Korean word, up to twelve characters."],
  ["no meaning", {...ELEPHANT, meaning: ""}, "Type what it means in English, up to forty letters."],
  ["no romanisation", {...ELEPHANT, romanisation: ""}, "Type how it is said in Latin letters, up to forty."],
])("refuses %s, saying why", (_name, words, message) => {
  expect(checkedCardWords(words, [], undefined)).toEqual({kind: "refused", message});
});

it("refuses a word another card already has", () => {
  expect(checkedCardWords(ELEPHANT, [KEPT], undefined)).toEqual({
    kind: "refused",
    message: "That word is already here.",
  });
});

it("lets a card keep its own word when it is the one being changed", () => {
  expect(checkedCardWords(ELEPHANT, [KEPT], KEPT.id)).toMatchObject({kind: "checked"});
});
