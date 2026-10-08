import {newCardsPerDayChosen} from "@src/redux/slices/settings/SettingsSlice";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";

it("keeps a changed setting on the device, and the next store starts from it", async () => {
  (await openedStudyStore()).store.dispatch(newCardsPerDayChosen({deckId: "ko-starter", count: 7}));

  expect((await openedStudyStore()).store.getState().settings.deckLimits["ko-starter"]?.newCardsPerDay).toBe(7);
});

it("writes nothing until a setting changes", async () => {
  const setItem = vi.spyOn(localStorage, "setItem");

  await openedStudyStore();

  expect(setItem).not.toHaveBeenCalled();
});
