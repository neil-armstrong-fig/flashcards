import {clearAllStoredData} from "@src/storage/clear-all/ClearAllStoredData";
import {clearThisDevice} from "@src/react/audio/clear-device/ClearThisDevice";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {signedIn} from "@src/redux/slices/account/AccountSlice";

beforeEach(() => {
  vi.mocked(clearAllStoredData).mockClear();
});

it("removes what the app stores", async () => {
  const {store} = await openedStudyStore();

  await clearThisDevice(store.dispatch);

  expect(clearAllStoredData).toHaveBeenCalledTimes(1);
});

it("takes the recordings off the device", async () => {
  const {store, recordings} = await openedStudyStore();
  await recordings.ensure("audio/ko/female-normal/c2f16032c0b9c1ea.mp3");

  await clearThisDevice(store.dispatch);

  expect(recordings.kept.size).toBe(0);
});

it("does not sign the learner out", async () => {
  const {store} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));

  await clearThisDevice(store.dispatch);

  expect(store.getState().account.status).toBe("signedIn");
});
