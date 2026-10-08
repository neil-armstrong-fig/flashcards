import {clearAllStoredData} from "@src/storage/clear-all/ClearAllStoredData";
import {clearStoredData} from "@src/redux/workflows/device/thunks/ClearStoredData";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";

beforeEach(() => {
  vi.mocked(clearAllStoredData).mockClear();
});

it("removes what the app keeps on this device", async () => {
  const {store} = await openedStudyStore();

  await store.dispatch(clearStoredData());

  expect(clearAllStoredData).toHaveBeenCalledTimes(1);
});
