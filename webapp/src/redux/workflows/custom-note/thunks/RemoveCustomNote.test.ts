import {noteWritten} from "@src/redux/slices/card-notes/CardNotesSlice";
import {picturesLoaded} from "@src/redux/slices/card-pictures/CardPicturesSlice";
import {SHIPPED_CARD_COUNT} from "@src/testing/ShippedCardCount";
import {addedCustomNote} from "@src/testing/AddedCustomNote";
import {addedSimilarWord} from "@src/testing/AddedSimilarWord";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {removeCustomNote} from "@src/redux/workflows/custom-note/thunks/RemoveCustomNote";
import {signedIn, signedOut} from "@src/redux/slices/account/AccountSlice";
import type {OpenedStudyStore} from "@src/testing/OpenedStudyStore";

const ELEPHANT = {word: "코끼리", meaning: "elephant", romanisation: "kokkiri"};
const ID = "ko-custom-test-1";

async function storeWithAnElephant(): Promise<OpenedStudyStore> {
  const opened = await openedStudyStore();

  opened.store.dispatch(signedIn("me@example.com"));
  await addedCustomNote(opened.store, ELEPHANT);

  return opened;
}

it("deletes the card online and here, with both of its directions and its similars", async () => {
  const {store, accountApi} = await storeWithAnElephant();
  await addedSimilarWord(store, ID, "고기리");

  expect(await store.dispatch(removeCustomNote(ID))).toBe(true);

  expect(accountApi.notes).toEqual([]);
  expect(store.getState().deck.notes).toEqual([]);
  expect(store.getState().study.cardOrder).toHaveLength(SHIPPED_CARD_COUNT);
  expect(Object.keys(store.getState().study.cards)).toHaveLength(SHIPPED_CARD_COUNT);
  expect(store.getState().similar.words[ID]).toBeUndefined();
});

it("takes the notes and pictures the learner put on its cards with it, and leaves other cards' alone", async () => {
  const {store, pictures} = await storeWithAnElephant();
  const [first, second] = [`${ID}/to-english`, `${ID}/from-english`];
  store.dispatch(noteWritten({cardId: first, text: "a big grey animal", addedAt: "2026-10-05T10:00:00.000Z"}));
  store.dispatch(noteWritten({cardId: "ko-vocab-water/to-english", text: "wet", addedAt: "2026-10-05T10:00:00.000Z"}));
  pictures.kept.set(second, "2026-10-05T10:00:00.000Z");
  pictures.kept.set("ko-vocab-water/to-english", "2026-10-05T10:00:00.000Z");
  await store.dispatch(picturesLoaded(await pictures.load()));

  await store.dispatch(removeCustomNote(ID));

  expect(store.getState().cardNotes.byCard).toEqual({"ko-vocab-water/to-english": "wet"});
  expect(Object.keys(store.getState().cardPictures.byCard)).toEqual(["ko-vocab-water/to-english"]);
  expect([...pictures.kept.keys()]).toEqual(["ko-vocab-water/to-english"]);
});

it("refuses to delete a card that ships with the deck", async () => {
  const {store, accountApi} = await storeWithAnElephant();

  expect(await store.dispatch(removeCustomNote("ko-vocab-water"))).toBe(false);
  expect(store.getState().study.cardOrder).toHaveLength(SHIPPED_CARD_COUNT + 2);
  expect(accountApi.notes).toHaveLength(1);
});

it("keeps the card when it could not be deleted online", async () => {
  const {store, accountApi} = await storeWithAnElephant();
  accountApi.unreachable = true;
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  expect(await store.dispatch(removeCustomNote(ID))).toBe(false);
  expect(store.getState().deck.notes).toHaveLength(1);
  expect(store.getState().deck.error).toBeDefined();
});

it("needs someone signed in", async () => {
  const {store} = await storeWithAnElephant();
  store.dispatch(signedOut());

  expect(await store.dispatch(removeCustomNote(ID))).toBe(false);
  expect(store.getState().deck.notes).toHaveLength(1);
});
