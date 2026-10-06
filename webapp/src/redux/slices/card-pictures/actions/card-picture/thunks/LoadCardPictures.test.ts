import {loadCardPictures} from "@src/redux/slices/card-pictures/actions/card-picture/thunks/LoadCardPictures";
import {addCardPicture} from "@src/redux/slices/card-pictures/actions/card-picture/thunks/AddCardPicture";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";

it("brings the pictures kept on the device into the store", async () => {
  const {store, pictures} = await openedStudyStore();
  pictures.kept.set("some-card", "2026-10-05T10:00:00.000Z");

  await store.dispatch(loadCardPictures());

  expect(store.getState().cardPictures.byCard).toEqual({"some-card": "memory:some-card"});
});

it("does not lose a picture added while the others were loading", async () => {
  const {store} = await openedStudyStore();
  const cardId = store.getState().study.session?.currentCardId ?? "";
  await store.dispatch(addCardPicture(new File(["x"], "mule.png", {type: "image/png"})));

  await store.dispatch(loadCardPictures());

  expect(store.getState().cardPictures.byCard[cardId]).toBe(`memory:${cardId}`);
});

it("counts the pictures as loaded even when the device could not be read", async () => {
  const {store, pictures} = await openedStudyStore();
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.spyOn(pictures, "load").mockRejectedValue(new Error("unreadable"));

  await store.dispatch(loadCardPictures());

  expect(store.getState().cardPictures.loaded).toBe(true);
});
