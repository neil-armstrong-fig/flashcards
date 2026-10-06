import {clearedOauthCookie} from "@src/router/sign-in/shared/oauth/ClearedOauthCookie";
import {oauthAttemptFrom} from "@src/router/sign-in/shared/oauth/OAuthAttemptFrom";
import {oauthCookie} from "@src/router/sign-in/shared/oauth/OAuthCookie";

const ATTEMPT = {state: "s", codeVerifier: "v", returnTo: "https://site.example/?a=b"};
const headerOf = (cookie: string): string => cookie.split(";")[0] ?? "";

it("reads back the attempt that was written, among other cookies", () => {
  expect(oauthAttemptFrom(`session=abc; ${headerOf(oauthCookie(ATTEMPT))}; theme=dark`)).toEqual(ATTEMPT);
});

it("finds no attempt where there is no cookie, or nothing in it", () => {
  expect(oauthAttemptFrom(undefined)).toBeUndefined();
  expect(oauthAttemptFrom("oauth=")).toBeUndefined();
});

it("finds no attempt in a cookie that is not one it wrote", () => {
  expect(oauthAttemptFrom("oauth=!!!")).toBeUndefined();
  expect(oauthAttemptFrom(`oauth=${btoa("not json")}`)).toBeUndefined();
  expect(oauthAttemptFrom(`oauth=${btoa(JSON.stringify({state: "s"}))}`)).toBeUndefined();
  expect(oauthAttemptFrom(`oauth=${btoa("null")}`)).toBeUndefined();
});

it("limits the attempt to the callback's path, out of reach of scripts", () => {
  expect(oauthCookie(ATTEMPT)).toContain("Path=/api/auth/google;");
  expect(oauthCookie(ATTEMPT)).toContain("HttpOnly");
  expect(clearedOauthCookie()).toContain("Max-Age=0");
});
