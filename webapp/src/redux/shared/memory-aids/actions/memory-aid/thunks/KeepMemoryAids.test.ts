import {addCardPicture} from "@src/redux/slices/card-pictures/actions/card-picture/thunks/AddCardPicture";
import {keepMemoryAids} from "@src/redux/shared/memory-aids/actions/memory-aid/thunks/KeepMemoryAids";
import {writeCardNote} from "@src/redux/slices/card-notes/actions/card-note/thunks/WriteCardNote";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {TEST_NOW} from "@src/testing/time/TestNow";

it("dates the note and the picture afresh and keeps them, here and on the device", async () => {
  const {store, pictures} = await openedStudyStore();
  const cardId = store.getState().study.session?.currentCardId ?? "";
  store.dispatch(writeCardNote("like a mule"));
  await store.dispatch(addCardPicture(new File(["x"], "mule.png", {type: "image/png"})));
  pictures.kept.set(cardId, "2020-01-01T00:00:00.000Z");

  await store.dispatch(keepMemoryAids());

  expect(store.getState().cardNotes.byCard).toEqual({[cardId]: "like a mule"});
  expect(store.getState().cardNotes.addedAt).toEqual({[cardId]: TEST_NOW.toISOString()});
  expect(store.getState().cardPictures.addedAt).toEqual({[cardId]: TEST_NOW.toISOString()});
  expect(pictures.kept.get(cardId)).toBe(TEST_NOW.toISOString());
});
