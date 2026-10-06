import {api} from "@src/testing/ApiHarness";

const WATER = "ko-vocab-water";

it("starts with no words", async () => {
  const cookie = await api.signIn();

  expect(await (await api.send("/api/similar", {cookie})).json()).toEqual({words: {}});
});

it("keeps a word with its note, in the order they were added, for next time", async () => {
  const cookie = await api.signIn();

  await api.send("/api/similar", {method: "POST", cookie, body: {noteId: WATER, text: "볼"}});
  await api.send("/api/similar", {method: "POST", cookie, body: {noteId: WATER, text: "벌"}});
  await api.send("/api/similar", {method: "POST", cookie, body: {noteId: "ko-vocab-rice", text: "방"}});

  expect(await (await api.send("/api/similar", {cookie})).json()).toEqual({
    words: {[WATER]: ["볼", "벌"], "ko-vocab-rice": ["방"]},
  });
});

it("keeps a word once however often it is asked for", async () => {
  const cookie = await api.signIn();

  await api.send("/api/similar", {method: "POST", cookie, body: {noteId: WATER, text: "볼"}});
  const again = await api.send("/api/similar", {method: "POST", cookie, body: {noteId: WATER, text: "볼"}});

  expect(again.status).toBe(204);
  expect(await (await api.send("/api/similar", {cookie})).json()).toEqual({words: {[WATER]: ["볼"]}});
});

it("refuses a word that is not Korean", async () => {
  const cookie = await api.signIn();

  expect((await api.send("/api/similar", {method: "POST", cookie, body: {noteId: WATER, text: "ball"}})).status).toBe(
    400,
  );
});

it("shows an account only its own words", async () => {
  const mine = await api.signIn();
  await api.send("/api/similar", {method: "POST", cookie: mine, body: {noteId: WATER, text: "볼"}});

  const {testGoogle} = await import("@src/testing/google/TestGoogle");
  testGoogle.identity = {subject: "google-2", email: "me@example.com", emailVerified: true};
  const other = await api.signIn();

  expect(await (await api.send("/api/similar", {cookie: other})).json()).toEqual({words: {}});
});

it("removes a word from a note, and only that word, for next time", async () => {
  const cookie = await api.signIn();
  await api.send("/api/similar", {method: "POST", cookie, body: {noteId: WATER, text: "볼"}});
  await api.send("/api/similar", {method: "POST", cookie, body: {noteId: WATER, text: "벌"}});

  const removed = await api.send("/api/similar", {method: "DELETE", cookie, body: {noteId: WATER, text: "볼"}});

  expect(removed.status).toBe(204);
  expect(await (await api.send("/api/similar", {cookie})).json()).toEqual({words: {[WATER]: ["벌"]}});
});

it("is fine to remove a word that is not there", async () => {
  const cookie = await api.signIn();

  expect((await api.send("/api/similar", {method: "DELETE", cookie, body: {noteId: WATER, text: "볼"}})).status).toBe(
    204,
  );
});

it("refuses to remove with a body that is not a word, and from another site", async () => {
  const cookie = await api.signIn();

  expect((await api.send("/api/similar", {method: "DELETE", cookie, body: {noteId: WATER, text: "ball"}})).status).toBe(
    400,
  );
  expect(
    (
      await api.send("/api/similar", {
        method: "DELETE",
        cookie,
        origin: "https://evil.example",
        body: {noteId: WATER, text: "볼"},
      })
    ).status,
  ).toBe(403);
});

it("does not remove another account's word", async () => {
  const mine = await api.signIn();
  await api.send("/api/similar", {method: "POST", cookie: mine, body: {noteId: WATER, text: "볼"}});
  const {testGoogle} = await import("@src/testing/google/TestGoogle");
  testGoogle.identity = {subject: "google-2", email: "me@example.com", emailVerified: true};
  const other = await api.signIn();

  await api.send("/api/similar", {method: "DELETE", cookie: other, body: {noteId: WATER, text: "볼"}});

  expect(await (await api.send("/api/similar", {cookie: mine})).json()).toEqual({words: {[WATER]: ["볼"]}});
});
