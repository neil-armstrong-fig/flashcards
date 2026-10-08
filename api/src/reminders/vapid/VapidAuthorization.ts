interface Props {
  /** The push service's address for the device. Only its origin goes into the token. */
  readonly endpoint: string;
  /** The server's public key: 65 bytes, base64url (what a browser is given to subscribe with). */
  readonly publicKey: string;
  /** The server's private key: the 32 bytes of the private scalar, base64url. */
  readonly privateKey: string;
  /** A way for the push service to reach the sender, such as `mailto:` an address. */
  readonly subject: string;
  readonly now: Date;
}

/** The token lasts twelve hours, the most RFC 8292 allows is twenty-four. */
const LIFETIME_IN_SECONDS = 12 * 60 * 60;

/** The `Authorization` header a push service wants to know a push comes from the server that was subscribed to (VAPID, RFC 8292): `vapid t=<signed token>, k=<public key>`. */
export async function vapidAuthorization({endpoint, publicKey, privateKey, subject, now}: Props): Promise<string> {
  const claims = {
    aud: new URL(endpoint).origin,
    exp: Math.floor(now.getTime() / 1000) + LIFETIME_IN_SECONDS,
    sub: subject,
  };
  const signed = `${base64Url(text({typ: "JWT", alg: "ES256"}))}.${base64Url(text(claims))}`;
  const signature = await crypto.subtle.sign(
    {name: "ECDSA", hash: "SHA-256"},
    await signingKey(publicKey, privateKey),
    new TextEncoder().encode(signed),
  );

  return `vapid t=${signed}.${base64Url(new Uint8Array(signature))}, k=${publicKey}`;
}

async function signingKey(publicKey: string, privateKey: string): Promise<CryptoKey> {
  const point = bytesOf(publicKey);

  // An uncompressed point is 0x04, then the two 32-byte coordinates.
  return await crypto.subtle.importKey(
    "jwk",
    {
      kty: "EC",
      crv: "P-256",
      x: base64Url(point.slice(1, 33)),
      y: base64Url(point.slice(33, 65)),
      d: privateKey,
    },
    {name: "ECDSA", namedCurve: "P-256"},
    false,
    ["sign"],
  );
}

function text(value: object): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(value));
}

function base64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function bytesOf(base64UrlText: string): Uint8Array {
  const padded = base64UrlText
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(base64UrlText.length / 4) * 4, "=");

  return Uint8Array.from(atob(padded), character => character.charCodeAt(0));
}
