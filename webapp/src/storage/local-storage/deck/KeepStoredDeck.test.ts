import {keepStoredDeck} from "@src/storage/local-storage/deck/KeepStoredDeck";
import {readStoredDeck} from "@src/storage/local-storage/deck/ReadStoredDeck";

it("keeps under the key devices already hold, so nothing a learner kept is lost", () => {
  keepStoredDeck({a: 1});

  expect(localStorage.getItem("flashcards.deck.v1")).toBe('{"a":1}');
  expect(readStoredDeck()).toEqual({a: 1});
});
