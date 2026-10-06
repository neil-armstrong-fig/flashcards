import {corsHeadersFor} from "@src/router/cors/CorsHeadersFor";
import {isForgedChange} from "@src/router/cors/IsForgedChange";
import {preflightHeaders} from "@src/router/cors/PreflightHeaders";

const SITE = "https://site.example";

it("answers the site's own origin with credentials allowed", () => {
  const headers = corsHeadersFor(SITE, [SITE]);

  expect(headers.get("Access-Control-Allow-Origin")).toBe(SITE);
  expect(headers.get("Access-Control-Allow-Credentials")).toBe("true");
});

it("grants nothing to an origin that is not listed, and never a wildcard", () => {
  const headers = corsHeadersFor("https://evil.example", [SITE]);

  expect(headers.get("Access-Control-Allow-Origin")).toBeNull();
  expect(headers.get("Access-Control-Allow-Credentials")).toBeNull();
});

it("varies on Origin, so a cache never hands one origin's answer to another", () => {
  expect(corsHeadersFor(SITE, [SITE]).get("Vary")).toBe("Origin");
});

it("does not let a longer address that merely starts like the site's through", () => {
  expect(corsHeadersFor("https://site.example.evil.example", [SITE]).get("Access-Control-Allow-Origin")).toBeNull();
});

it.each(["POST", "PUT", "PATCH", "DELETE"])("refuses a %s from another site, or from none", method => {
  expect(isForgedChange(method, "https://evil.example", [SITE])).toBe(true);
  expect(isForgedChange(method, undefined, [SITE])).toBe(true);
});

it("allows a POST from the site, and does not ask where a GET came from", () => {
  expect(isForgedChange("POST", SITE, [SITE])).toBe(false);
  expect(isForgedChange("GET", undefined, [SITE])).toBe(false);
});

it("lets the browser remember a preflight, and keeps the headers it was given", () => {
  const given = new Headers({"Access-Control-Allow-Origin": SITE});

  expect(preflightHeaders(given).get("Access-Control-Max-Age")).toBe("7200");
  expect(preflightHeaders(given).get("Access-Control-Allow-Origin")).toBe(SITE);
  expect(given.get("Access-Control-Max-Age")).toBeNull();
});
