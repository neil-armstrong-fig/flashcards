import {TEST_NOW} from "@src/testing/time/TestNow";
import {addCustomNote} from "@src/redux/workflows/custom-note/thunks/AddCustomNote";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {SHIPPED_CARD_COUNT} from "@src/testing/ShippedCardCount";

const ELEPHANT = {word: "코끼리", meaning: "elephant", romanisation: "kokkiri"};

it("lists both of its directions as new, and records the card to be sent online", async () => {
  const {store, records} = await openedStudyStore();

  expect(await store.dispatch(addCustomNote(ELEPHANT))).toBe(true);

  expect(records.kept).toEqual([
    {
      kind: "note",
      id: "ko-custom-test-1",
      at: TEST_NOW.toISOString(),
      deleted: false,
      payload: ELEPHANT,
    },
  ]);
  expect(store.getState().study.cardOrder.slice(SHIPPED_CARD_COUNT)).toEqual([
    "ko-custom-test-1/to-english",
    "ko-custom-test-1/from-english",
  ]);
  expect(store.getState().study.cards["ko-custom-test-1/to-english"]?.phase).toBe("new");
});

it("adds the card without waiting for the API, so a card is made wherever the app can be reached", async () => {
  const {store, accountApi} = await openedStudyStore();
  accountApi.unreachable = true;

  expect(await store.dispatch(addCustomNote(ELEPHANT))).toBe(true);

  expect(store.getState().deck.notes).toHaveLength(1);
});

it("tells the sync there is something to send", async () => {
  const {store} = await openedStudyStore();

  await store.dispatch(addCustomNote(ELEPHANT));

  expect(store.getState().sync.localChanges).toBe(1);
});
