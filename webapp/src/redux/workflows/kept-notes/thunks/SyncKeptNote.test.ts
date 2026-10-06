import {noteAdded} from "@src/redux/slices/deck/DeckSlice";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {SHIPPED_CARD_COUNT} from "@src/testing/ShippedCardCount";
import {syncKeptNote} from "@src/redux/workflows/kept-notes/thunks/SyncKeptNote";
import type {KeptNote} from "@src/redux/slices/account/types/KeptNote";

const ELEPHANT: KeptNote = {id: "ko-custom-a", word: "코끼리", meaning: "elephant", romanisation: "kokkiri"};

it("adds a card kept online that is not here, studied both ways", async () => {
  const {store} = await openedStudyStore();

  store.dispatch(syncKeptNote(ELEPHANT));

  expect(store.getState().deck.notes).toEqual([{...ELEPHANT, language: "ko"}]);
  expect(store.getState().study.cardOrder.slice(SHIPPED_CARD_COUNT)).toEqual([
    "ko-custom-a/to-english",
    "ko-custom-a/from-english",
  ]);
});

it("adds nothing twice", async () => {
  const {store} = await openedStudyStore();

  store.dispatch(syncKeptNote(ELEPHANT));
  store.dispatch(syncKeptNote(ELEPHANT));

  expect(store.getState().deck.notes).toHaveLength(1);
  expect(store.getState().study.cardOrder).toHaveLength(SHIPPED_CARD_COUNT + 2);
});

it("takes the words changed on another device, keeping the card and its progress", async () => {
  const {store} = await openedStudyStore();
  store.dispatch(noteAdded({...ELEPHANT, language: "ko"}));
  store.dispatch(syncKeptNote(ELEPHANT));
  const before = store.getState().study.cards["ko-custom-a/to-english"];

  store.dispatch(syncKeptNote({...ELEPHANT, word: "고래", meaning: "whale", romanisation: "gorae"}));

  expect(store.getState().deck.notes).toEqual([
    {id: "ko-custom-a", language: "ko", word: "고래", meaning: "whale", romanisation: "gorae"},
  ]);
  expect(store.getState().study.cards["ko-custom-a/to-english"]).toBe(before);
});
