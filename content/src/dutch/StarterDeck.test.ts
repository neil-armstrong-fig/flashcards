import {cardsOfDeck} from "@flashcards/content/cards/CardsOfDeck";
import {STARTER_DECK} from "@flashcards/content/dutch/StarterDeck";

it("gives every note an id of its own, because progress is kept by id", () => {
  const ids = STARTER_DECK.notes.map(note => note.id);

  expect(new Set(ids).size).toBe(ids.length);
});

it("keeps every note id in the form that names its language and kind", () => {
  expect(STARTER_DECK.notes.every(note => note.id.startsWith("nl-vocab-"))).toBe(true);
});

it("gives every card an id of its own, one for each direction of each note", () => {
  const ids = cardsOfDeck(STARTER_DECK).map(card => card.id);

  expect(ids).toHaveLength(STARTER_DECK.notes.length * 2);
  expect(new Set(ids).size).toBe(ids.length);
});

it("has no romanisation to show, since Dutch is already in Latin letters", () => {
  expect(STARTER_DECK.notes.every(note => note.romanisation === "")).toBe(true);
});
