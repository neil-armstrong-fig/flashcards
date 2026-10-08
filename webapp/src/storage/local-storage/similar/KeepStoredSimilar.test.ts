import {keepStoredSimilar} from "@src/storage/local-storage/similar/KeepStoredSimilar";
import {readStoredSimilar} from "@src/storage/local-storage/similar/ReadStoredSimilar";

it("keeps under the key devices already hold, so nothing a learner kept is lost", () => {
  keepStoredSimilar({a: 1});

  expect(localStorage.getItem("flashcards.similar.v1")).toBe('{"a":1}');
  expect(readStoredSimilar()).toEqual({a: 1});
});
