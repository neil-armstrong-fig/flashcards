import {customNoteIdOf, isCustomNoteId} from "@src/redux/slices/deck/ids/CustomNoteId";

it("makes an id a custom note is known by", () => {
  expect(isCustomNoteId(customNoteIdOf("1b4e"))).toBe(true);
});

it("does not take a deck's own note for one the learner made", () => {
  expect(isCustomNoteId("ko-vocab-water")).toBe(false);
});
