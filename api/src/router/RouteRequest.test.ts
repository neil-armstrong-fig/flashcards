import {api, SITE_ORIGIN} from "@src/testing/ApiHarness";

it("answers a preflight from the site, with credentials allowed", async () => {
  const response = await api.send("/api/similar", {method: "OPTIONS"});

  expect(response.status).toBe(204);
  expect(response.headers.get("Access-Control-Allow-Origin")).toBe(SITE_ORIGIN);
  expect(response.headers.get("Access-Control-Allow-Credentials")).toBe("true");
});

it("answers 404 to anything that is not a route, and gives an unknown origin no CORS headers", async () => {
  const response = await api.send("/api/nothing", {origin: "https://evil.example"});

  expect(response.status).toBe(404);
  expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
});

it("refuses a change from another site, or none, before looking at the session", async () => {
  const cookie = await api.signIn();

  expect(
    (await api.send("/api/similar", {method: "POST", cookie, origin: "https://evil.example", body: {}})).status,
  ).toBe(403);
  expect((await api.send("/api/similar", {method: "POST", cookie, withoutOrigin: true, body: {}})).status).toBe(403);
});

it.each([
  ["/api/me", "GET"],
  ["/api/similar", "GET"],
  ["/api/notes", "GET"],
  ["/api/notes", "POST"],
  ["/api/notes", "DELETE"],
])("answers 401 to %s with no session", async (path, method) => {
  expect((await api.send(path, {method})).status).toBe(401);
});

it("answers 401 to the speech with no session, so only a signed-in account can spend the allowance", async () => {
  const response = await api.send("/api/speech", {
    method: "POST",
    body: {language: "ko", text: "불", voice: "female", speed: "normal"},
  });

  expect(response.status).toBe(401);
});

it("answers who is signed in", async () => {
  const cookie = await api.signIn();
  const response = await api.send("/api/me", {cookie});

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({email: "me@example.com"});
});
