import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {refreshTime} from "@src/redux/slices/study/actions/session/thunks/RefreshTime";

it("brings the time the study state is measured against up to date", async () => {
  const {store} = await openedStudyStore();

  vi.setSystemTime(new Date("2026-10-26T10:00:00Z"));
  store.dispatch(refreshTime());

  expect(store.getState().study.now).toBe("2026-10-26T10:00:00.000Z");
});
