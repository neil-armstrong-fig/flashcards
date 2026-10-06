import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {signOutAndForgetRecordings} from "@src/react/audio/sign-out/SignOutAndForgetRecordings";
import {signedIn} from "@src/redux/slices/account/AccountSlice";

it("signs out, and the learner is shown as signed out", async () => {
  const {store, accountApi} = await openedStudyStore();
  accountApi.email = "me@example.com";
  store.dispatch(signedIn("me@example.com"));

  await signOutAndForgetRecordings(store.dispatch);

  expect(store.getState().account.status).toBe("signedOut");
  expect(accountApi.email).toBeUndefined();
});

it("takes the recordings off the device when signing out, since they are for a signed-in learner only", async () => {
  const {store, accountApi, recordings} = await openedStudyStore();
  accountApi.email = "me@example.com";
  store.dispatch(signedIn("me@example.com"));
  await recordings.ensure("audio/ko/female-normal/c2f16032c0b9c1ea.mp3");

  await signOutAndForgetRecordings(store.dispatch);

  expect(recordings.kept.size).toBe(0);
});

it("keeps what the learner made and their progress when signing out", async () => {
  const {store, accountApi} = await openedStudyStore();
  accountApi.email = "me@example.com";
  store.dispatch(signedIn("me@example.com"));
  const cards = store.getState().study.cards;

  await signOutAndForgetRecordings(store.dispatch);

  expect(store.getState().study.cards).toBe(cards);
});
