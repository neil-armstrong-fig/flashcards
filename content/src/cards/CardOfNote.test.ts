import {cardOfNote} from "@flashcards/content/cards/CardOfNote";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

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

it("makes a pronunciation card of the spelling, unspoken, then the way it is said in hangul with the word spoken", () => {
  const card = cardOfNote(
    {
      id: "ko-pronunciation-jota",
      kind: "pronunciation",
      language: "ko",
      word: "좋다",
      meaning: "조타",
      romanisation: "jota",
    },
    "to-english",
  );

  expect(card).toMatchObject({front: "좋다", back: "[조타]", hint: "jota", backAudio: {language: "ko", text: "좋다"}});
  expect(card.frontAudio).toBeUndefined();
});

it("shows a pronunciation note's English translation in place of a romanisation, when it has one", () => {
  const card = cardOfNote(
    {
      id: "nl-pronunciation-bed",
      kind: "pronunciation",
      language: "nl",
      word: "bed",
      meaning: "bet",
      romanisation: "",
      translation: "bed",
    },
    "to-english",
  );

  expect(card).toMatchObject({back: "[bet]", hint: "bed", backAudio: {language: "nl", text: "bed"}});
});

it("makes a sounds-alike pair card that shows both words, says one, and picks that one out in bold with the answer", () => {
  const card = cardOfNote(
    {
      id: "ko-sounds-alike-bareuda-ppareuda-a",
      kind: "sounds-alike",
      language: "ko",
      word: "바르다",
      meaning: "바르다/빠르다",
      romanisation: "bareuda",
      soundSimilars: ["빠르다"],
    },
    "to-english",
  );

  expect(card).toMatchObject({
    front: "바르다/빠르다",
    back: "바르다/빠르다",
    emphasis: "바르다",
    hint: "bareuda",
    frontAudio: {language: "ko", text: "바르다"},
    backAudio: {language: "ko", text: "바르다"},
  });
});

it("makes a sheet music card of the staff alone, then the note's name with the note played", () => {
  const card = cardOfNote(
    {
      id: "music-treble-c4",
      kind: "sheet-music",
      language: "music",
      word: "C4",
      meaning: "",
      romanisation: "",
      notation: {clef: "treble", pitch: "C4"},
    },
    "to-english",
  );

  expect(card).toMatchObject({
    front: "",
    notation: {clef: "treble", pitch: "C4"},
    back: "C4",
    backAudio: {language: "music", text: "C4"},
  });
  expect(card.frontAudio).toBeUndefined();
});
