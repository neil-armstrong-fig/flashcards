import {api, cookieOf, SITE_ORIGIN} from "@src/testing/ApiHarness";
import {testDatabase} from "@src/database/testing/TestDatabase";
import {testGoogle} from "@src/testing/google/TestGoogle";

async function startedAttempt(): Promise<{attempt: string; state: string}> {
  const started = await api.send(`/api/auth/google?return=${encodeURIComponent(`${SITE_ORIGIN}/settings`)}`);

  return {
    attempt: cookieOf(started, "oauth"),
    state: new URL(started.headers.get("Location") ?? "").searchParams.get("state") ?? "",
  };
}

it("sends the person to Google asking for the code flow with openid and email, holding the attempt in a cookie", async () => {
  const started = await api.send("/api/auth/google");
  const url = new URL(started.headers.get("Location") ?? "");

  expect(started.status).toBe(302);
  expect(`${url.origin}${url.pathname}`).toBe("https://accounts.google.com/o/oauth2/v2/auth");
  expect(url.searchParams.get("scope")).toBe("openid email");
  expect(url.searchParams.get("code_challenge_method")).toBe("S256");
  expect(cookieOf(started, "oauth")).not.toBe("");
});

it("brings the person back to the page that asked, once signed in, with a session cookie", async () => {
  const {attempt, state} = await startedAttempt();

  const finished = await api.send(`/api/auth/google/callback?code=c&state=${state}`, {cookie: attempt});

  expect(finished.status).toBe(302);
  expect(finished.headers.get("Location")).toBe(`${SITE_ORIGIN}/settings`);
  expect(cookieOf(finished, "session")).not.toBe("");
  expect(testDatabase.sessionCount).toBe(1);
});

it("keeps one account for one Google account however often they sign in", async () => {
  const first = await api.signIn();
  const second = await api.signIn();

  expect(await (await api.send("/api/me", {cookie: first})).json()).toEqual(
    await (await api.send("/api/me", {cookie: second})).json(),
  );
});

it("turns away a Google account that is not on the allow-list, sending them back with no session", async () => {
  testGoogle.identity = {subject: "google-2", email: "stranger@example.com", emailVerified: true};
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  const {attempt, state} = await startedAttempt();

  const finished = await api.send(`/api/auth/google/callback?code=c&state=${state}`, {cookie: attempt});

  expect(finished.status).toBe(302);
  expect(cookieOf(finished, "session")).toBe("");
  expect(testDatabase.sessionCount).toBe(0);
});

it("turns away an email Google has not verified", async () => {
  testGoogle.identity = {subject: "google-1", email: "me@example.com", emailVerified: false};
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  const {attempt, state} = await startedAttempt();

  expect(
    cookieOf(await api.send(`/api/auth/google/callback?code=c&state=${state}`, {cookie: attempt}), "session"),
  ).toBe("");
});

it("refuses a callback with a state that is not the one the attempt started with", async () => {
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  const {attempt} = await startedAttempt();

  const finished = await api.send("/api/auth/google/callback?code=c&state=forged", {cookie: attempt});

  expect(cookieOf(finished, "session")).toBe("");
  expect(testDatabase.sessionCount).toBe(0);
});

it("refuses a callback that carries no attempt cookie, so is not one this API started", async () => {
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  expect((await api.send("/api/auth/google/callback?code=c&state=s")).status).toBe(400);
});

it("sends the person back signed out when Google refuses the code", async () => {
  testGoogle.refuses = true;
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  const {attempt, state} = await startedAttempt();

  const finished = await api.send(`/api/auth/google/callback?code=c&state=${state}`, {cookie: attempt});

  expect(finished.status).toBe(302);
  expect(cookieOf(finished, "session")).toBe("");
});

it("falls back to the site when asked to send the person somewhere else", async () => {
  const started = await api.send("/api/auth/google?return=https%3A%2F%2Fevil.example%2F");
  const attempt = cookieOf(started, "oauth");
  const state = new URL(started.headers.get("Location") ?? "").searchParams.get("state") ?? "";

  const finished = await api.send(`/api/auth/google/callback?code=c&state=${state}`, {cookie: attempt});

  expect(finished.headers.get("Location")).toBe(`${SITE_ORIGIN}/`);
});

it("ends the session on log out, so the cookie no longer works", async () => {
  const cookie = await api.signIn();

  const loggedOut = await api.send("/api/auth/logout", {method: "POST", cookie});

  expect(loggedOut.status).toBe(204);
  expect((await api.send("/api/me", {cookie})).status).toBe(401);
});

it("lets somebody who is not signed in log out without an error", async () => {
  expect((await api.send("/api/auth/logout", {method: "POST"})).status).toBe(204);
});

it("does not accept a session that has expired", async () => {
  const cookie = await api.signIn();

  vi.setSystemTime(new Date("2026-11-05T12:00:00Z"));

  expect((await api.send("/api/me", {cookie})).status).toBe(401);
});
