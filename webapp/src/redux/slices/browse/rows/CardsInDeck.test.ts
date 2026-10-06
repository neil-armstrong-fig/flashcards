import {ALL_DECKS} from "@src/redux/slices/browse/rows/AllDecks";
import {cardsInDeck} from "@src/redux/slices/browse/rows/CardsInDeck";
import {selectCards} from "@src/redux/slices/deck/selectors/SelectCards";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";

it("keeps every card for all decks", async () => {
  const {store} = await openedStudyStore();
  const cards = selectCards(store.getState());

  expect(cardsInDeck(cards, ALL_DECKS)).toEqual(cards);
});

it("keeps only the cards studied in the deck", async () => {
  const {store} = await openedStudyStore();
  const cards = cardsInDeck(selectCards(store.getState()), {kind: "deck", deckId: "ja-hiragana"});

  expect(cards).toHaveLength(142);
  expect(cards.every(card => card.id.startsWith("ja-hiragana-"))).toBe(true);
});

it("keeps a card the learner made in the Korean starter deck", async () => {
  const cards = [{id: "ko-custom-1234/to-english"}, {id: "ja-hiragana-a/to-english"}] as never;

  expect(cardsInDeck(cards, {kind: "deck", deckId: "ko-starter"})).toEqual([{id: "ko-custom-1234/to-english"}]);
});
