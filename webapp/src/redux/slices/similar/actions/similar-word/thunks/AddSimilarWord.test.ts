import {addSimilarWord} from "@src/redux/slices/similar/actions/similar-word/thunks/AddSimilarWord";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {selectSimilar} from "@src/redux/slices/similar/selectors/SelectSimilar";

it("keeps the word online with the note it was asked on, and offers it after the shipped ones", async () => {
  const {store, accountApi} = await openedStudyStore();

  expect(await store.dispatch(addSimilarWord("ko-vocab-water", "볼"))).toBe(true);

  expect(accountApi.kept).toEqual({"ko-vocab-water": ["볼"]});
  expect(selectSimilar(store.getState())?.words).toEqual(["불", "볼"]);
  expect(store.getState().similar).toMatchObject({adding: false, error: undefined});
});

it("keeps nothing, and says so, when the word could not be kept online", async () => {
  const {store, accountApi} = await openedStudyStore();
  accountApi.unreachable = true;
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  expect(await store.dispatch(addSimilarWord("ko-vocab-water", "볼"))).toBe(false);

  expect(selectSimilar(store.getState())?.words).toEqual(["불"]);
  expect(store.getState().similar.error).toBeDefined();
});
