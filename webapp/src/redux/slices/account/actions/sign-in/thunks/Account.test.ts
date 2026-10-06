import {loadAccount} from "@src/redux/slices/account/actions/sign-in/thunks/LoadAccount";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {signIn} from "@src/redux/slices/account/actions/sign-in/thunks/SignIn";

it("knows who is signed in once the API has said", async () => {
  const {store, accountApi} = await openedStudyStore();
  accountApi.email = "me@example.com";

  await store.dispatch(loadAccount());

  expect(store.getState().account).toEqual({status: "signedIn", email: "me@example.com"});
});

it("knows nobody is signed in when the API says so", async () => {
  const {store} = await openedStudyStore();

  await store.dispatch(loadAccount());

  expect(store.getState().account.status).toBe("signedOut");
});

it("marks it unreachable, and carries on, when the API cannot be reached", async () => {
  const {store, accountApi} = await openedStudyStore();
  accountApi.unreachable = true;
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  await store.dispatch(loadAccount());

  expect(store.getState().account.status).toBe("unreachable");
});

it("goes to Google to sign in", async () => {
  const {store, accountApi} = await openedStudyStore();

  store.dispatch(signIn());

  expect(accountApi.signInAsked).toBe(true);
});
