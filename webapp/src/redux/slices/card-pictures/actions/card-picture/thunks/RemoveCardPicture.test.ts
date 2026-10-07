import {addCardPicture} from "@src/redux/slices/card-pictures/actions/card-picture/thunks/AddCardPicture";
import {removeCardPicture} from "@src/redux/slices/card-pictures/actions/card-picture/thunks/RemoveCardPicture";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";

it("takes the picture off the card and out of the device's storage", async () => {
  const {store, pictures} = await openedStudyStore();
  await store.dispatch(addCardPicture(new File(["x"], "mule.png", {type: "image/png"})));

  await store.dispatch(removeCardPicture());

  expect(store.getState().cardPictures.byCard).toEqual({});
  expect(pictures.kept.size).toBe(0);
});

it("records that the picture was removed, to be sent online, and nothing when the card had none", async () => {
  const {store, records} = await openedStudyStore();
  const cardId = store.getState().study.session?.currentCardId ?? "";

  await store.dispatch(removeCardPicture());
  expect(records.kept).toEqual([]);

  await store.dispatch(addCardPicture(new File(["x"], "mule.png", {type: "image/png"})));
  await store.dispatch(removeCardPicture());

  expect(records.summary()).toEqual([`picture ${cardId} kept`, `picture ${cardId} removed`]);
});
