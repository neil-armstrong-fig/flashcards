import {cardsOfDeck} from "@flashcards/content/cards/CardsOfDeck";
import {romanisationOf} from "@flashcards/shared/language/RomanisationOf";
import {STARTER_DECK} from "@flashcards/content/korean/StarterDeck";

it("gives every note an id of its own, because progress is kept by id", () => {
  const ids = STARTER_DECK.notes.map(note => note.id);

  expect(new Set(ids).size).toBe(ids.length);
});

it("keeps every note id in the form that names its language and kind", () => {
  expect(STARTER_DECK.notes.every(note => note.id.startsWith("ko-vocab-"))).toBe(true);
});

it("gives every card an id of its own, one for each direction of each note", () => {
  const ids = cardsOfDeck(STARTER_DECK).map(card => card.id);

  expect(ids).toHaveLength(STARTER_DECK.notes.length * 2);
  expect(new Set(ids).size).toBe(ids.length);
});

it("romanises every note as the Revised Romanization writes it, which is what the card form would suggest", () => {
  expect(STARTER_DECK.notes.map(note => romanisationOf(note.word))).toEqual(
    STARTER_DECK.notes.map(note => note.romanisation),
  );
});
