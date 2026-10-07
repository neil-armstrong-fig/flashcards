import {addCardPicture} from "@src/redux/slices/card-pictures/actions/card-picture/thunks/AddCardPicture";
import {MAXIMUM_PICTURE_BYTES} from "@src/redux/slices/card-pictures/limits/MaximumPictureBytes";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {TEST_NOW} from "@src/testing/time/TestNow";

function aPicture(): File {
  return new File(["x"], "mule.png", {type: "image/png"});
}

it("keeps a picture against the card on screen and shows it by the address it was given", async () => {
  const {store, pictures} = await openedStudyStore();
  const cardId = store.getState().study.session?.currentCardId ?? "";

  await store.dispatch(addCardPicture(aPicture()));

  expect(store.getState().cardPictures.byCard).toEqual({[cardId]: `memory:${cardId}`});
  expect(pictures.kept.has(cardId)).toBe(true);
});

it("refuses a file that is not a picture, and keeps nothing", async () => {
  const {store, pictures} = await openedStudyStore();

  await store.dispatch(addCardPicture(new File(["x"], "notes.txt", {type: "text/plain"})));

  expect(store.getState().cardPictures.error).toBe("That file is not a picture.");
  expect(store.getState().cardPictures.byCard).toEqual({});
  expect(pictures.kept.size).toBe(0);
});

it("refuses a picture over the size limit", async () => {
  const {store, pictures} = await openedStudyStore();
  const huge = new File([new Uint8Array(MAXIMUM_PICTURE_BYTES + 1)], "huge.png", {type: "image/png"});

  await store.dispatch(addCardPicture(huge));

  expect(store.getState().cardPictures.error).toBe("That picture is too big: 5 MB at most.");
  expect(pictures.kept.size).toBe(0);
});

it("says so when the device could not keep it, and shows nothing", async () => {
  const {store, pictures} = await openedStudyStore();
  pictures.failing = true;
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  await store.dispatch(addCardPicture(aPicture()));

  expect(store.getState().cardPictures.error).toBe("That picture could not be kept on this device.");
  expect(store.getState().cardPictures.byCard).toEqual({});
});

it("forgets an earlier refusal once a picture is kept", async () => {
  const {store} = await openedStudyStore();
  await store.dispatch(addCardPicture(new File(["x"], "notes.txt", {type: "text/plain"})));

  await store.dispatch(addCardPicture(aPicture()));

  expect(store.getState().cardPictures.error).toBeUndefined();
});

it("dates the picture with the clock, so fading counts the answers that follow", async () => {
  const {store, pictures} = await openedStudyStore();
  const cardId = store.getState().study.session?.currentCardId ?? "";

  await store.dispatch(addCardPicture(aPicture()));

  expect(store.getState().cardPictures.addedAt).toEqual({[cardId]: TEST_NOW.toISOString()});
  expect(pictures.kept.get(cardId)).toBe(TEST_NOW.toISOString());
});

it("records the picture by its hash and type, dated with the clock, to be sent online", async () => {
  const {store, records} = await openedStudyStore();
  const cardId = store.getState().study.session?.currentCardId ?? "";

  await store.dispatch(addCardPicture(aPicture()));

  expect(records.kept).toEqual([
    {
      kind: "picture",
      id: cardId,
      at: TEST_NOW.toISOString(),
      deleted: false,
      payload: {hash: "1".padStart(64, "0"), type: "image/png"},
    },
  ]);
});

it("records nothing when the picture is refused", async () => {
  const {store, records} = await openedStudyStore();

  await store.dispatch(addCardPicture(new File(["x"], "notes.txt", {type: "text/plain"})));

  expect(records.kept).toEqual([]);
});
