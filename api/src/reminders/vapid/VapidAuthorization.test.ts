import {generateKeyPairSync} from "node:crypto";
import {vapidAuthorization} from "@src/reminders/vapid/VapidAuthorization";

const NOW = new Date("2026-10-01T19:00:00Z");

function base64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function bytesOf(text: string): Uint8Array<ArrayBuffer> {
  const padded = text
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(text.length / 4) * 4, "=");

  return Uint8Array.from(atob(padded), character => character.charCodeAt(0));
}

async function newKeys(): Promise<{publicKey: string; privateKey: string; verifying: CryptoKey}> {
  const pair = generateKeyPairSync("ec", {namedCurve: "prime256v1"});
  const {x = "", y = ""} = pair.publicKey.export({format: "jwk"});
  const {d = ""} = pair.privateKey.export({format: "jwk"});
  const point = new Uint8Array([4, ...bytesOf(x), ...bytesOf(y)]);

  return {
    publicKey: base64Url(point),
    privateKey: d,
    verifying: await crypto.subtle.importKey("raw", point, {name: "ECDSA", namedCurve: "P-256"}, false, ["verify"]),
  };
}

async function authorised(): Promise<{header: string; token: string; publicKey: string; verifying: CryptoKey}> {
  const {publicKey, privateKey, verifying} = await newKeys();
  const header = await vapidAuthorization({
    endpoint: "https://push.example.test/send/abc123",
    publicKey,
    privateKey,
    subject: "mailto:owner@example.com",
    now: NOW,
  });
  const token = /^vapid t=([^,]+), k=/.exec(header)?.[1] ?? "";

  return {header, token, publicKey, verifying};
}

it("names the public key beside the token", async () => {
  const {header, publicKey} = await authorised();

  expect(header.endsWith(`, k=${publicKey}`)).toBe(true);
});

it("says who the push is for, who sent it, and when the token ends", async () => {
  const {token} = await authorised();
  const claims: unknown = JSON.parse(new TextDecoder().decode(bytesOf(token.split(".")[1] ?? "")));

  expect(claims).toEqual({
    aud: "https://push.example.test",
    exp: Math.floor(NOW.getTime() / 1000) + 12 * 60 * 60,
    sub: "mailto:owner@example.com",
  });
});

it("signs the token so the public key can check it", async () => {
  const {token, verifying} = await authorised();
  const [header, claims, signature] = token.split(".");

  const valid = await crypto.subtle.verify(
    {name: "ECDSA", hash: "SHA-256"},
    verifying,
    bytesOf(signature ?? ""),
    new TextEncoder().encode(`${header}.${claims}`),
  );

  expect(valid).toBe(true);
});
