import {addCardPicture} from "@src/redux/slices/card-pictures/actions/card-picture/thunks/AddCardPicture";
import {removeMemoryAids} from "@src/redux/shared/memory-aids/actions/memory-aid/thunks/RemoveMemoryAids";
import {writeCardNote} from "@src/redux/slices/card-notes/actions/card-note/thunks/WriteCardNote";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";

it("takes both the note and the picture off the card on screen, and leaves other cards alone", async () => {
  const {store, pictures} = await openedStudyStore();
  store.dispatch(writeCardNote("like a mule"));
  await store.dispatch(addCardPicture(new File(["x"], "mule.png", {type: "image/png"})));
  pictures.kept.set("another-card", "2026-10-05T10:00:00.000Z");

  await store.dispatch(removeMemoryAids());

  expect(store.getState().cardNotes.byCard).toEqual({});
  expect(store.getState().cardPictures.byCard).toEqual({});
  expect([...pictures.kept.keys()]).toEqual(["another-card"]);
});

it("records the removal of the note and of the picture, to be sent online, and nothing for what the card did not have", async () => {
  const {store, records} = await openedStudyStore();
  const cardId = store.getState().study.session?.currentCardId ?? "";

  await store.dispatch(writeCardNote("like a mule"));
  await store.dispatch(removeMemoryAids());

  expect(records.summary()).toEqual([`memory-note ${cardId} kept`, `memory-note ${cardId} removed`]);
});
