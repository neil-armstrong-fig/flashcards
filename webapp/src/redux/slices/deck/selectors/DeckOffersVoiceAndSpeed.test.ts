import {deckOffersVoiceAndSpeed} from "@src/redux/slices/deck/selectors/DeckOffersVoiceAndSpeed";

it("offers a voice and a speed for the decks of a language", () => {
  expect(deckOffersVoiceAndSpeed("ko-starter")).toBe(true);
  expect(deckOffersVoiceAndSpeed("ja-hiragana")).toBe(true);
});

it("offers none for the sheet music deck, whose notes have one tone each", () => {
  expect(deckOffersVoiceAndSpeed("music-notes")).toBe(false);
});

it("offers them where there is no deck to say otherwise", () => {
  expect(deckOffersVoiceAndSpeed(undefined)).toBe(true);
});
