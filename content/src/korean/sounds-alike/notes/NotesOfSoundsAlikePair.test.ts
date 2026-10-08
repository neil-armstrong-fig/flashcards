import {notesOfSoundsAlikePair} from "@flashcards/content/korean/sounds-alike/notes/NotesOfSoundsAlikePair";
import type {SoundsAlikePair} from "@flashcards/content/korean/sounds-alike/types/SoundsAlikePair";

const PAIR: SoundsAlikePair = {
  id: "bareuda-ppareuda",
  first: {word: "바르다", romanisation: "bareuda"},
  second: {word: "빠르다", romanisation: "ppareuda"},
  explanation: "Plain and tense.",
};

it("makes a note for each word, each showing both words in the same order", () => {
  const [a, b] = notesOfSoundsAlikePair(PAIR);

  expect(a).toMatchObject({id: "ko-sounds-alike-bareuda-ppareuda-a", word: "바르다", meaning: "바르다/빠르다"});
  expect(b).toMatchObject({id: "ko-sounds-alike-bareuda-ppareuda-b", word: "빠르다", meaning: "바르다/빠르다"});
});

it("gives each note the other word as its similar, and its own romanisation", () => {
  const [a, b] = notesOfSoundsAlikePair(PAIR);

  expect(a).toMatchObject({soundSimilars: ["빠르다"], romanisation: "bareuda", kind: "sounds-alike"});
  expect(b).toMatchObject({soundSimilars: ["바르다"], romanisation: "ppareuda"});
});

it("gives both notes the pair's explanation", () => {
  expect(notesOfSoundsAlikePair(PAIR).map(note => note.explanation)).toEqual(["Plain and tense.", "Plain and tense."]);
});
