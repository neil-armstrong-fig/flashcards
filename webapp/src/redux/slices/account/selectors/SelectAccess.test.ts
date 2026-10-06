import {selectAccess} from "@src/redux/slices/account/selectors/SelectAccess";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {signedIn, signedOut, unreachable} from "@src/redux/slices/account/AccountSlice";

it("is still checking until the API has said", async () => {
  const {store} = await openedStudyStore();

  expect(selectAccess(store.getState())).toBe("checking");
});

it("opens the app to someone signed in", async () => {
  const {store} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));

  expect(selectAccess(store.getState())).toBe("open");
});

it("shows the sign-in screen to someone signed out", async () => {
  const {store} = await openedStudyStore();
  store.dispatch(signedOut());

  expect(selectAccess(store.getState())).toBe("signIn");
});

it("keeps the app open offline for a device that has signed in before", async () => {
  const {store} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));
  store.dispatch(unreachable());

  expect(selectAccess(store.getState())).toBe("open");
});

it("does not open the app on a device that has never signed in and cannot reach the API", async () => {
  const {store} = await openedStudyStore();
  store.dispatch(unreachable());

  expect(selectAccess(store.getState())).toBe("unreachable");
});

it("closes the app again once signed out, even though it was open before", async () => {
  const {store} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));
  store.dispatch(signedOut());
  store.dispatch(unreachable());

  expect(selectAccess(store.getState())).toBe("unreachable");
});
