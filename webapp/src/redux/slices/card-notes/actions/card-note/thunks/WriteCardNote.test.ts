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

it("records the note, dated with the clock, to be sent online, and records its removal when it is written empty", async () => {
  const {store, records} = await openedStudyStore();
  const cardId = store.getState().study.session?.currentCardId ?? "";

  await store.dispatch(writeCardNote("like a mule"));
  await store.dispatch(writeCardNote("   "));

  expect(records.kept).toEqual([
    {kind: "memory-note", id: cardId, at: TEST_NOW.toISOString(), deleted: false, payload: {text: "like a mule"}},
    {kind: "memory-note", id: cardId, at: TEST_NOW.toISOString(), deleted: true},
  ]);
});

it("records nothing for an empty note on a card that had none", async () => {
  const {store, records} = await openedStudyStore();

  await store.dispatch(writeCardNote(""));

  expect(records.kept).toEqual([]);
});
