import {cardNotesReducer, noteRemoved, noteRenewed, noteWritten} from "@src/redux/slices/card-notes/CardNotesSlice";
import {INITIAL_CARD_NOTES_STATE} from "@src/redux/slices/card-notes/initial-state/InitialCardNotesState";
import {MAXIMUM_NOTE_LENGTH} from "@src/redux/slices/card-notes/limits/MaximumNoteLength";

const LATER = "2026-10-05T10:00:00.000Z";

it("keeps a note against its card, trimmed", () => {
  const state = cardNotesReducer(
    INITIAL_CARD_NOTES_STATE,
    noteWritten({cardId: "a", text: "  like a mule  ", addedAt: LATER}),
  );

  expect(state.byCard).toEqual({a: "like a mule"});
});

it("replaces the note a card already had", () => {
  const first = cardNotesReducer(INITIAL_CARD_NOTES_STATE, noteWritten({cardId: "a", text: "one", addedAt: LATER}));

  expect(cardNotesReducer(first, noteWritten({cardId: "a", text: "two", addedAt: LATER})).byCard).toEqual({a: "two"});
});

it("treats a note of only spaces as no note", () => {
  const first = cardNotesReducer(INITIAL_CARD_NOTES_STATE, noteWritten({cardId: "a", text: "one", addedAt: LATER}));

  expect(cardNotesReducer(first, noteWritten({cardId: "a", text: "   ", addedAt: LATER})).byCard).toEqual({});
});

it("cuts a note at the maximum length", () => {
  const state = cardNotesReducer(
    INITIAL_CARD_NOTES_STATE,
    noteWritten({cardId: "a", text: "x".repeat(MAXIMUM_NOTE_LENGTH + 10), addedAt: LATER}),
  );

  expect(state.byCard["a"]).toHaveLength(MAXIMUM_NOTE_LENGTH);
});

it("removes only the named card's note", () => {
  const both = cardNotesReducer(
    cardNotesReducer(INITIAL_CARD_NOTES_STATE, noteWritten({cardId: "a", text: "one", addedAt: LATER})),
    noteWritten({cardId: "b", text: "two", addedAt: LATER}),
  );

  expect(cardNotesReducer(both, noteRemoved("a")).byCard).toEqual({b: "two"});
});

it("dates a note, and forgets the date with the note", () => {
  const written = cardNotesReducer(INITIAL_CARD_NOTES_STATE, noteWritten({cardId: "a", text: "one", addedAt: LATER}));

  expect(written.addedAt).toEqual({a: LATER});
  expect(cardNotesReducer(written, noteRemoved("a")).addedAt).toEqual({});
});

it("renews the date of a note that exists, and ignores a card with none", () => {
  const written = cardNotesReducer(INITIAL_CARD_NOTES_STATE, noteWritten({cardId: "a", text: "one", addedAt: LATER}));
  const renewed = cardNotesReducer(written, noteRenewed({cardId: "a", addedAt: "2027-01-01T00:00:00.000Z"}));

  expect(renewed.addedAt).toEqual({a: "2027-01-01T00:00:00.000Z"});
  expect(cardNotesReducer(renewed, noteRenewed({cardId: "b", addedAt: LATER})).addedAt).toEqual({
    a: "2027-01-01T00:00:00.000Z",
  });
});
