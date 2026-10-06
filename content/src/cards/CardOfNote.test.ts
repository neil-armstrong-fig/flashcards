import {cardOfNote} from "@language-learning/content/cards/CardOfNote";
import type {VocabNote} from "@language-learning/content/types/VocabNote";

const water: VocabNote = {id: "ko-vocab-water", language: "ko", word: "물", meaning: "water", romanisation: "mul"};

it("asks for the English meaning of the word when going to English", () => {
  expect(cardOfNote(water, "to-english")).toEqual({
    id: "ko-vocab-water/to-english",
    noteId: "ko-vocab-water",
    direction: "to-english",
    front: "물",
    back: "water",
    frontAudio: {language: "ko", text: "물"},
    backAudio: {language: "en", text: "water"},
    hint: "mul",
  });
});

it("asks for the word from its English meaning when coming from English", () => {
  expect(cardOfNote(water, "from-english")).toMatchObject({
    id: "ko-vocab-water/from-english",
    front: "water",
    back: "물",
    hint: "mul",
  });
});

it("speaks the Korean word when it comes up, and the English when the answer is shown", () => {
  const card = cardOfNote(water, "to-english");

  expect(card.frontAudio).toEqual({language: "ko", text: "물"});
  expect(card.backAudio).toEqual({language: "en", text: "water"});
});

it("speaks the English when the card comes up, and the Korean word when the answer is shown, coming from English", () => {
  const card = cardOfNote(water, "from-english");

  expect(card.frontAudio).toEqual({language: "en", text: "water"});
  expect(card.backAudio).toEqual({language: "ko", text: "물"});
});

const KA: VocabNote = {id: "ja-hiragana-ka", kind: "kana", language: "ja", word: "か", meaning: "ka", romanisation: ""};

it("speaks only the kana, in Japanese, and never the Latin letters of its sound", () => {
  expect(cardOfNote(KA, "to-english")).toMatchObject({frontAudio: {language: "ja", text: "か"}, backAudio: undefined});
  expect(cardOfNote(KA, "from-english")).toMatchObject({
    front: "ka",
    back: "か",
    frontAudio: undefined,
    backAudio: {language: "ja", text: "か"},
  });
});
