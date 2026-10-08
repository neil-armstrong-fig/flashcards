import {meaningIsSpoken} from "@flashcards/content/cards/MeaningIsSpoken";
import type {VocabNote} from "@flashcards/content/types/VocabNote";

const NOTE: VocabNote = {id: "ko-vocab-water", language: "ko", word: "물", meaning: "water", romanisation: "mul"};

it("speaks the meaning of a word", () => {
  expect(meaningIsSpoken(NOTE)).toBe(true);
});

it("does not speak the sound of a kana, or the way a pronunciation is said", () => {
  expect(meaningIsSpoken({...NOTE, kind: "kana"})).toBe(false);
  expect(meaningIsSpoken({...NOTE, kind: "pronunciation"})).toBe(false);
});

it("does not speak both words of a sounds-alike pair, which are written for the eye", () => {
  expect(meaningIsSpoken({...NOTE, kind: "sounds-alike"})).toBe(false);
});
