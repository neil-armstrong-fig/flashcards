import {writeCardNote} from "@src/redux/slices/card-notes/actions/card-note/thunks/WriteCardNote";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {TEST_NOW} from "@src/testing/time/TestNow";

it("writes the note on the card on screen and dates it with the clock", async () => {
  const {store} = await openedStudyStore();
  const cardId = store.getState().study.session?.currentCardId ?? "";

  store.dispatch(writeCardNote("like a mule"));

  expect(store.getState().cardNotes.byCard).toEqual({[cardId]: "like a mule"});
  expect(store.getState().cardNotes.addedAt).toEqual({[cardId]: TEST_NOW.toISOString()});
});
