import {keepStoredCardNotes} from "@src/storage/local-storage/card-notes/KeepStoredCardNotes";
import {loadCardNotes} from "@src/redux/slices/card-notes/persistence/LoadCardNotes";
import {MAXIMUM_NOTE_LENGTH} from "@src/redux/slices/card-notes/limits/MaximumNoteLength";

function holding(stored: unknown): void {
  keepStoredCardNotes(stored);
}

it("loads the notes that were kept", () => {
  holding({byCard: {a: "like a mule"}});
  expect(loadCardNotes().byCard).toEqual({a: "like a mule"});
});

it("starts empty when nothing was kept", () => {
  expect(loadCardNotes().byCard).toEqual({});
});

it("drops what is not a usable note and keeps the rest", () => {
  const stored = {byCard: {a: "kept", b: 7, c: "   ", d: "x".repeat(MAXIMUM_NOTE_LENGTH + 1)}};

  holding(stored);
  expect(loadCardNotes().byCard).toEqual({a: "kept"});
});

it.each([
  ["not an object", 7],
  ["no notes", {}],
  ["notes that are not an object", {byCard: "a"}],
  ["null", null],
])("does not trust %s", (_name, stored) => {
  holding(stored);
  expect(loadCardNotes().byCard).toEqual({});
});

it("loads when a note was written, and an empty text for a note kept before notes were dated", () => {
  const stored = {byCard: {a: "dated", b: "undated"}, addedAt: {a: "2026-10-05T10:00:00.000Z", c: "orphan"}};

  holding(stored);
  expect(loadCardNotes().addedAt).toEqual({a: "2026-10-05T10:00:00.000Z", b: ""});
});
