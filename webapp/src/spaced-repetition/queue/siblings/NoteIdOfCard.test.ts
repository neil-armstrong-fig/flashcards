import {noteIdOfCard} from "@src/spaced-repetition/queue/siblings/NoteIdOfCard";

it("is the part of a deck card's id before the direction", () => {
  expect(noteIdOfCard("ko-water/ko-to-en")).toBe("ko-water");
});

it("keeps a made card's whole note id", () => {
  expect(noteIdOfCard("ko-custom-1234-abcd/en-to-ko")).toBe("ko-custom-1234-abcd");
});
