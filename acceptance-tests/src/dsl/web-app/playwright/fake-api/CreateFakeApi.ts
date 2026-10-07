import type {Route} from "@playwright/test";
import {newFakeAccount} from "@src/dsl/web-app/playwright/fake-api/NewFakeAccount";
import {syncAnswer} from "@src/dsl/web-app/playwright/fake-api/SyncAnswer";
import type {FakeAccount} from "@src/dsl/web-app/playwright/fake-api/FakeAccount";

/** A few bytes the app keeps and the fake audio element "plays". Nothing decodes them, so they need not be a real recording. */
const AUDIO = Buffer.from([0x49, 0x44, 0x33]);

const SIGNED_IN_EMAIL = "learner@example.com";

/**
 * Stands in for the API (`api/`), so a spec needs neither the Worker running nor a real Google account, and never spends Azure's
 * allowance. It is a small server of its own, one per page: whether the learner has signed in, and the words they have asked
 * for, live here and survive the app being reloaded, as they would on the real one. Signing in is just visiting the sign-in
 * address, which sends the browser back where it came from.
 */
export function createFakeApi(account: FakeAccount = newFakeAccount()): (route: Route) => Promise<void> {
  // The learner has signed in already, as the specs need the app open; one about signing in signs out first.
  let signedIn = true;

  return async route => {
    const request = route.request();
    const url = new URL(request.url());
    const origin = request.headers()["origin"] ?? "*";
    const headers = {
      "access-control-allow-origin": origin,
      "access-control-allow-credentials": "true",
      "access-control-allow-methods": "GET, POST, PUT, PATCH, DELETE",
      "access-control-allow-headers": "Content-Type, If-Match",
      vary: "Origin",
    };

    if (request.method() === "OPTIONS") {
      await route.fulfill({status: 204, headers});

      return;
    }

    if (url.pathname === "/api/auth/google") {
      signedIn = true;
      await route.fulfill({status: 302, headers: {location: url.searchParams.get("return") ?? "/"}});

      return;
    }

    if (url.pathname === "/api/auth/logout") {
      signedIn = false;
      await route.fulfill({status: 204, headers});

      return;
    }

    if (!signedIn) {
      await route.fulfill({status: 401, headers});

      return;
    }

    if (url.pathname === "/api/me") {
      await route.fulfill({
        status: 200,
        headers: {...headers, "content-type": "application/json"},
        body: JSON.stringify({email: SIGNED_IN_EMAIL}),
      });

      return;
    }

    if (url.pathname.startsWith("/api/audio/") && request.method() === "GET") {
      await route.fulfill({status: 200, headers: {...headers, "content-type": "audio/mpeg"}, body: AUDIO});

      return;
    }

    if (url.pathname === "/api/sync" && request.method() === "POST") {
      await route.fulfill({
        status: 200,
        headers: {...headers, "content-type": "application/json"},
        body: JSON.stringify(syncAnswer(account, request.postDataJSON())),
      });

      return;
    }

    if (url.pathname.startsWith("/api/pictures/") && request.method() === "PUT") {
      const hash = url.pathname.slice("/api/pictures/".length);
      const bytes = request.postDataBuffer();

      if (bytes) {
        account.pictures[hash] = {bytes, type: request.headers()["content-type"] ?? "application/octet-stream"};
      }
      await route.fulfill({status: 204, headers});

      return;
    }

    if (url.pathname.startsWith("/api/pictures/") && request.method() === "GET") {
      const picture = account.pictures[url.pathname.slice("/api/pictures/".length)];

      if (!picture) {
        await route.fulfill({status: 404, headers});

        return;
      }
      await route.fulfill({status: 200, headers: {...headers, "content-type": picture.type}, body: picture.bytes});

      return;
    }

    if (url.pathname === "/api/speech") {
      await route.fulfill({status: 200, headers: {...headers, "content-type": "audio/mpeg"}, body: AUDIO});

      return;
    }

    await route.fulfill({status: 404, headers});
  };
}
