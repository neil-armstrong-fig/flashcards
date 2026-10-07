import {routeRequest} from "@src/router/RouteRequest";

export const SITE_ORIGIN = "https://site.example";

interface Send {
  readonly method?: string;
  readonly cookie?: string;
  readonly origin?: string;
  /** Sends no `Origin` header at all, as something that is not a browser would. */
  readonly withoutOrigin?: boolean;
  readonly body?: unknown;
  /** Sends these bytes as they are, with this type, instead of JSON: a picture. */
  readonly bytes?: {readonly data: Uint8Array; readonly type: string};
}

/** Talks to the API as a browser on the site would: requests in, answers out, the cookies carried from one to the next by the test. */
export const api = {
  async send(
    path: string,
    {method = "GET", cookie, origin = SITE_ORIGIN, withoutOrigin = false, body, bytes}: Send = {},
  ): Promise<Response> {
    const headers = new Headers();

    if (cookie !== undefined) {
      headers.set("Cookie", cookie);
    }

    if (!withoutOrigin) {
      headers.set("Origin", origin);
    }

    if (bytes !== undefined) {
      headers.set("Content-Type", bytes.type);

      return await routeRequest(new Request(`https://api.example${path}`, {method, headers, body: bytes.data}));
    }

    if (body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    if (body === undefined) {
      return await routeRequest(new Request(`https://api.example${path}`, {method, headers}));
    }

    return await routeRequest(new Request(`https://api.example${path}`, {method, headers, body: JSON.stringify(body)}));
  },

  /** Signs in as the Google account `testGoogle` says, through the real start and callback routes, and returns the session cookie. */
  async signIn(): Promise<string> {
    const started = await api.send("/api/auth/google?return=" + encodeURIComponent(`${SITE_ORIGIN}/`));
    const attempt = cookieOf(started, "oauth");
    const state = new URL(started.headers.get("Location") ?? "").searchParams.get("state") ?? "";
    const finished = await api.send(`/api/auth/google/callback?code=a-code&state=${state}`, {cookie: attempt});

    return cookieOf(finished, "session");
  },
};

/** The `name=value` of a cookie an answer set, ready to send back, or an empty string where it set none. */
export function cookieOf(response: Response, name: string): string {
  const set = response.headers.getSetCookie().find(cookie => cookie.startsWith(`${name}=`));

  return set?.split(";")[0] ?? "";
}
