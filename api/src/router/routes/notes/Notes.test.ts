import {api} from "@src/testing/ApiHarness";

const ELEPHANT = {
  id: "ko-custom-1b4e28ba-2fa1-11d2-883f-0016d3cca427",
  word: "코끼리",
  meaning: "elephant",
  romanisation: "kokkiri",
};
const WATER = "ko-vocab-water";

it("starts with no notes", async () => {
  const cookie = await api.signIn();

  expect(await (await api.send("/api/notes", {cookie})).json()).toEqual({notes: []});
});

it("keeps a note for next time, oldest first", async () => {
  const cookie = await api.signIn();
  const second = {...ELEPHANT, id: "ko-custom-second", word: "기린", meaning: "giraffe", romanisation: "girin"};

  await api.send("/api/notes", {method: "POST", cookie, body: ELEPHANT});
  await api.send("/api/notes", {method: "POST", cookie, body: second});

  expect(await (await api.send("/api/notes", {cookie})).json()).toEqual({notes: [ELEPHANT, second]});
});

it("keeps a note once however often it is asked for", async () => {
  const cookie = await api.signIn();

  await api.send("/api/notes", {method: "POST", cookie, body: ELEPHANT});
  const again = await api.send("/api/notes", {method: "POST", cookie, body: ELEPHANT});

  expect(again.status).toBe(204);
  expect(await (await api.send("/api/notes", {cookie})).json()).toEqual({notes: [ELEPHANT]});
});

it.each([
  ["a word that is not Korean", {...ELEPHANT, word: "elephant"}],
  ["no meaning", {...ELEPHANT, meaning: ""}],
  ["a meaning with markup", {...ELEPHANT, meaning: "<b>elephant"}],
  ["a romanisation with a breve", {...ELEPHANT, romanisation: "kokkiŏri"}],
  ["an id that is not a custom note's", {...ELEPHANT, id: WATER}],
  ["an id with odd characters", {...ELEPHANT, id: "ko-custom-../x"}],
  ["an id that is too long", {...ELEPHANT, id: `ko-custom-${"a".repeat(60)}`}],
  ["no id", {word: "코끼리", meaning: "elephant", romanisation: "kokkiri"}],
])("refuses %s", async (_name, body) => {
  const cookie = await api.signIn();

  expect((await api.send("/api/notes", {method: "POST", cookie, body})).status).toBe(400);
  expect(await (await api.send("/api/notes", {cookie})).json()).toEqual({notes: []});
});

it("refuses a note from another site, and without a session", async () => {
  const cookie = await api.signIn();

  expect(
    (await api.send("/api/notes", {method: "POST", cookie, origin: "https://evil.example", body: ELEPHANT})).status,
  ).toBe(403);
  expect((await api.send("/api/notes", {method: "POST", body: ELEPHANT})).status).toBe(401);
});

it("shows an account only its own notes", async () => {
  const mine = await api.signIn();
  await api.send("/api/notes", {method: "POST", cookie: mine, body: ELEPHANT});

  const {testGoogle} = await import("@src/testing/google/TestGoogle");
  testGoogle.identity = {subject: "google-2", email: "me@example.com", emailVerified: true};
  const other = await api.signIn();

  expect(await (await api.send("/api/notes", {cookie: other})).json()).toEqual({notes: []});
});

it("deletes a note, and the similar words kept with it, and nothing else", async () => {
  const cookie = await api.signIn();
  await api.send("/api/notes", {method: "POST", cookie, body: ELEPHANT});
  await api.send("/api/similar", {method: "POST", cookie, body: {noteId: ELEPHANT.id, text: "고기리"}});
  await api.send("/api/similar", {method: "POST", cookie, body: {noteId: WATER, text: "볼"}});

  const removed = await api.send("/api/notes", {method: "DELETE", cookie, body: {id: ELEPHANT.id}});

  expect(removed.status).toBe(204);
  expect(await (await api.send("/api/notes", {cookie})).json()).toEqual({notes: []});
  expect(await (await api.send("/api/similar", {cookie})).json()).toEqual({words: {[WATER]: ["볼"]}});
});

it("is fine to delete a note that is not there", async () => {
  const cookie = await api.signIn();

  expect((await api.send("/api/notes", {method: "DELETE", cookie, body: {id: ELEPHANT.id}})).status).toBe(204);
});

it("refuses to delete with a body that is not a note's id, and from another site", async () => {
  const cookie = await api.signIn();

  expect((await api.send("/api/notes", {method: "DELETE", cookie, body: {id: WATER}})).status).toBe(400);
  expect(
    (await api.send("/api/notes", {method: "DELETE", cookie, origin: "https://evil.example", body: {id: ELEPHANT.id}}))
      .status,
  ).toBe(403);
});

it("does not delete another account's note", async () => {
  const mine = await api.signIn();
  await api.send("/api/notes", {method: "POST", cookie: mine, body: ELEPHANT});
  const {testGoogle} = await import("@src/testing/google/TestGoogle");
  testGoogle.identity = {subject: "google-2", email: "me@example.com", emailVerified: true};
  const other = await api.signIn();

  await api.send("/api/notes", {method: "DELETE", cookie: other, body: {id: ELEPHANT.id}});

  expect(await (await api.send("/api/notes", {cookie: mine})).json()).toEqual({notes: [ELEPHANT]});
});

it("changes a note's words, keeping its id, its place in the list and its similars", async () => {
  const cookie = await api.signIn();
  const second = {...ELEPHANT, id: "ko-custom-second", word: "기린", meaning: "giraffe", romanisation: "girin"};
  const whale = {...ELEPHANT, word: "고래", meaning: "whale", romanisation: "gorae"};
  await api.send("/api/notes", {method: "POST", cookie, body: ELEPHANT});
  await api.send("/api/notes", {method: "POST", cookie, body: second});
  await api.send("/api/similar", {method: "POST", cookie, body: {noteId: ELEPHANT.id, text: "고기리"}});

  const changed = await api.send("/api/notes", {method: "PUT", cookie, body: whale});

  expect(changed.status).toBe(204);
  expect(await (await api.send("/api/notes", {cookie})).json()).toEqual({notes: [whale, second]});
  expect(await (await api.send("/api/similar", {cookie})).json()).toEqual({words: {[ELEPHANT.id]: ["고기리"]}});
});

it("says a note is not found when asked to change one that is not there, and adds nothing", async () => {
  const cookie = await api.signIn();

  expect((await api.send("/api/notes", {method: "PUT", cookie, body: ELEPHANT})).status).toBe(404);
  expect(await (await api.send("/api/notes", {cookie})).json()).toEqual({notes: []});
});

it("refuses to change a note to words that are not allowed, from another site, and without a session", async () => {
  const cookie = await api.signIn();
  await api.send("/api/notes", {method: "POST", cookie, body: ELEPHANT});

  expect((await api.send("/api/notes", {method: "PUT", cookie, body: {...ELEPHANT, word: "elephant"}})).status).toBe(
    400,
  );
  expect(
    (await api.send("/api/notes", {method: "PUT", cookie, origin: "https://evil.example", body: ELEPHANT})).status,
  ).toBe(403);
  expect((await api.send("/api/notes", {method: "PUT", body: ELEPHANT})).status).toBe(401);
  expect(await (await api.send("/api/notes", {cookie})).json()).toEqual({notes: [ELEPHANT]});
});

it("does not change another account's note", async () => {
  const mine = await api.signIn();
  await api.send("/api/notes", {method: "POST", cookie: mine, body: ELEPHANT});
  const {testGoogle} = await import("@src/testing/google/TestGoogle");
  testGoogle.identity = {subject: "google-2", email: "me@example.com", emailVerified: true};
  const other = await api.signIn();

  const changed = await api.send("/api/notes", {
    method: "PUT",
    cookie: other,
    body: {...ELEPHANT, word: "고래", meaning: "whale"},
  });

  expect(changed.status).toBe(404);
  expect(await (await api.send("/api/notes", {cookie: mine})).json()).toEqual({notes: [ELEPHANT]});
});
