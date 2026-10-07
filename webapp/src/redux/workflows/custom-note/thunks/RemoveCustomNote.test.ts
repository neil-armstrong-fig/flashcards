import {noteWritten} from "@src/redux/slices/card-notes/CardNotesSlice";
import {picturesLoaded} from "@src/redux/slices/card-pictures/CardPicturesSlice";
import {SHIPPED_CARD_COUNT} from "@src/testing/ShippedCardCount";
import {addedCustomNote} from "@src/testing/AddedCustomNote";
import {addedSimilarWord} from "@src/testing/AddedSimilarWord";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {removeCustomNote} from "@src/redux/workflows/custom-note/thunks/RemoveCustomNote";
import {signedIn} from "@src/redux/slices/account/AccountSlice";
import type {OpenedStudyStore} from "@src/testing/OpenedStudyStore";

const ELEPHANT = {word: "코끼리", meaning: "elephant", romanisation: "kokkiri"};
const ID = "ko-custom-test-1";

async function storeWithAnElephant(): Promise<OpenedStudyStore> {
  const opened = await openedStudyStore();

  opened.store.dispatch(signedIn("me@example.com"));
  await addedCustomNote(opened.store, ELEPHANT);

  return opened;
}

it("deletes the card here, with both of its directions and its similars", async () => {
  const {store} = await storeWithAnElephant();
  await addedSimilarWord(store, ID, "고기리");

  expect(await store.dispatch(removeCustomNote(ID))).toBe(true);

  expect(store.getState().deck.notes).toEqual([]);
  expect(store.getState().study.cardOrder).toHaveLength(SHIPPED_CARD_COUNT);
  expect(Object.keys(store.getState().study.cards)).toHaveLength(SHIPPED_CARD_COUNT);
  expect(store.getState().similar.words[ID]).toBeUndefined();
});

it("records the removal of the card and of each similar kept with it, to be sent online", async () => {
  const {store, records} = await storeWithAnElephant();
  await addedSimilarWord(store, ID, "고기리");
  const before = records.kept.length;

  await store.dispatch(removeCustomNote(ID));

  expect(records.summary().slice(before)).toEqual([`note ${ID} removed`, `similar ${ID}|고기리 removed`]);
});

it("takes the notes and pictures the learner put on its cards with it, records their removal, and leaves other cards' alone", async () => {
  const {store, pictures, records} = await storeWithAnElephant();
  const [first, second] = [`${ID}/to-english`, `${ID}/from-english`];
  store.dispatch(noteWritten({cardId: first, text: "a big grey animal", addedAt: "2026-10-05T10:00:00.000Z"}));
  store.dispatch(noteWritten({cardId: "ko-vocab-water/to-english", text: "wet", addedAt: "2026-10-05T10:00:00.000Z"}));
  pictures.kept.set(second, "2026-10-05T10:00:00.000Z");
  pictures.kept.set("ko-vocab-water/to-english", "2026-10-05T10:00:00.000Z");
  await store.dispatch(picturesLoaded(await pictures.load()));
  const before = records.kept.length;

  await store.dispatch(removeCustomNote(ID));

  expect(store.getState().cardNotes.byCard).toEqual({"ko-vocab-water/to-english": "wet"});
  expect(Object.keys(store.getState().cardPictures.byCard)).toEqual(["ko-vocab-water/to-english"]);
  expect([...pictures.kept.keys()]).toEqual(["ko-vocab-water/to-english"]);
  expect(records.summary().slice(before)).toEqual([
    `note ${ID} removed`,
    `memory-note ${first} removed`,
    `picture ${second} removed`,
  ]);
});

it("refuses to delete a card that ships with the deck", async () => {
  const {store} = await storeWithAnElephant();

  expect(await store.dispatch(removeCustomNote("ko-vocab-water"))).toBe(false);
  expect(store.getState().study.cardOrder).toHaveLength(SHIPPED_CARD_COUNT + 2);
});
