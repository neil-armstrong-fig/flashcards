import {accountReducer, signedIn, signedOut, unreachable} from "@src/redux/slices/account/AccountSlice";

it("starts not knowing who is signed in", () => {
  expect(accountReducer(undefined, {type: "unknown"})).toEqual({status: "unknown"});
});

it("knows who is signed in, and forgets them on signing out", () => {
  const state = accountReducer(undefined, signedIn("me@example.com"));

  expect(state).toEqual({status: "signedIn", email: "me@example.com"});
  expect(accountReducer(state, signedOut())).toEqual({status: "signedOut"});
});

it("remembers who was signed in when the API cannot be reached", () => {
  const state = accountReducer({status: "unknown", email: "me@example.com"}, unreachable());

  expect(state).toEqual({status: "unreachable", email: "me@example.com"});
});
