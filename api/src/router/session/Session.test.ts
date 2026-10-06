import {clearedSessionCookie} from "@src/router/session/cookie/ClearedSessionCookie";
import {hashSessionToken} from "@src/router/session/HashSessionToken";
import {randomToken} from "@src/router/session/RandomToken";
import {sessionCookie} from "@src/router/session/cookie/SessionCookie";
import {sessionTokenFrom} from "@src/router/session/SessionTokenFrom";

it("finds the token among other cookies", () => {
  expect(sessionTokenFrom("theme=dark; session=abc123; other=1")).toBe("abc123");
});

it("finds no token where there is no cookie, or nothing in it", () => {
  expect(sessionTokenFrom(undefined)).toBeUndefined();
  expect(sessionTokenFrom("session=")).toBeUndefined();
  expect(sessionTokenFrom("sessions=abc")).toBeUndefined();
});

it("sets a session cookie no script can read, that only travels securely, and not on other sites' requests", () => {
  const cookie = sessionCookie("token");

  expect(cookie).toContain("session=token;");
  expect(cookie).toContain("HttpOnly");
  expect(cookie).toContain("Secure");
  expect(cookie).toContain("SameSite=Lax");
});

it("ends the cookie with the same name and path, and no time left", () => {
  expect(clearedSessionCookie()).toContain("session=;");
  expect(clearedSessionCookie()).toContain("Max-Age=0");
});

it("hashes a token to the same 64 hex characters every time, and a different one for another token", async () => {
  expect(await hashSessionToken("a")).toMatch(/^[0-9a-f]{64}$/);
  expect(await hashSessionToken("a")).toBe(await hashSessionToken("a"));
  expect(await hashSessionToken("a")).not.toBe(await hashSessionToken("b"));
});

it("makes a different 43-character token each time", () => {
  expect(randomToken()).toMatch(/^[A-Za-z0-9_-]{43}$/);
  expect(randomToken()).not.toBe(randomToken());
});
