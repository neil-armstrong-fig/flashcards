import {addCustomNote} from "@src/redux/workflows/custom-note/thunks/AddCustomNote";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {SHIPPED_CARD_COUNT} from "@src/testing/ShippedCardCount";

const ELEPHANT = {word: "코끼리", meaning: "elephant", romanisation: "kokkiri"};

it("keeps the card online and lists both of its directions as new", async () => {
  const {store, accountApi} = await openedStudyStore();

  expect(await store.dispatch(addCustomNote(ELEPHANT))).toBe(true);

  expect(accountApi.notes).toEqual([{id: "ko-custom-test-1", ...ELEPHANT}]);
  expect(store.getState().study.cardOrder.slice(SHIPPED_CARD_COUNT)).toEqual([
    "ko-custom-test-1/to-english",
    "ko-custom-test-1/from-english",
  ]);
  expect(store.getState().study.cards["ko-custom-test-1/to-english"]?.phase).toBe("new");
});

it("adds nothing, and says so, when the card could not be kept online", async () => {
  const {store, accountApi} = await openedStudyStore();
  accountApi.unreachable = true;
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  expect(await store.dispatch(addCustomNote(ELEPHANT))).toBe(false);

  expect(store.getState().deck.notes).toEqual([]);
  expect(store.getState().deck.error).toBeDefined();
  expect(store.getState().study.cardOrder).toHaveLength(SHIPPED_CARD_COUNT);
});
