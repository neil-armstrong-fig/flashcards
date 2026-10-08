import {keepStoredCardNotes} from "@src/storage/local-storage/card-notes/KeepStoredCardNotes";
import {readStoredCardNotes} from "@src/storage/local-storage/card-notes/ReadStoredCardNotes";

it("keeps under the key devices already hold, so nothing a learner kept is lost", () => {
  keepStoredCardNotes({a: 1});

  expect(localStorage.getItem("flashcards.card-notes.v1")).toBe('{"a":1}');
  expect(readStoredCardNotes()).toEqual({a: 1});
});
