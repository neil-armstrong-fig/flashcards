import type {Route} from "@playwright/test";

/** A few bytes the app keeps and the fake audio element "plays". Nothing decodes them, so they need not be a real recording. */
const AUDIO = Buffer.from([0x49, 0x44, 0x33]);

const SIGNED_IN_EMAIL = "learner@example.com";

interface Body {
  readonly noteId?: string;
  readonly text?: string;
}

/**
 * Stands in for the API (`api/`), so a spec needs neither the Worker running nor a real Google account, and never spends Azure's
 * allowance. It is a small server of its own, one per page: whether the learner has signed in, and the words they have asked
 * for, live here and survive the app being reloaded, as they would on the real one. Signing in is just visiting the sign-in
 * address, which sends the browser back where it came from.
 */
export function createFakeApi(): (route: Route) => Promise<void> {
  // The learner has signed in already, as the specs need the app open; one about signing in signs out first.
  let signedIn = true;
  const words: Record<string, string[]> = {};
  const notes: NoteBody[] = [];

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

    if (url.pathname === "/api/similar" && request.method() === "GET") {
      await route.fulfill({
        status: 200,
        headers: {...headers, "content-type": "application/json"},
        body: JSON.stringify({words}),
      });

      return;
    }

    if (url.pathname === "/api/similar" && request.method() === "POST") {
      const {noteId, text} = bodyOf(request.postDataJSON());

      if (noteId && text && !words[noteId]?.includes(text)) {
        words[noteId] = [...(words[noteId] ?? []), text];
      }
      await route.fulfill({status: 204, headers});

      return;
    }

    if (url.pathname === "/api/similar" && request.method() === "DELETE") {
      const {noteId, text} = bodyOf(request.postDataJSON());

      if (noteId && text) {
        words[noteId] = (words[noteId] ?? []).filter(word => word !== text);
      }
      await route.fulfill({status: 204, headers});

      return;
    }

    if (url.pathname.startsWith("/api/audio/") && request.method() === "GET") {
      await route.fulfill({status: 200, headers: {...headers, "content-type": "audio/mpeg"}, body: AUDIO});

      return;
    }

    if (url.pathname === "/api/notes" && request.method() === "GET") {
      await route.fulfill({
        status: 200,
        headers: {...headers, "content-type": "application/json"},
        body: JSON.stringify({notes}),
      });

      return;
    }

    if (url.pathname === "/api/notes" && request.method() === "POST") {
      const note = noteOf(request.postDataJSON());

      if (note && !notes.some(each => each.id === note.id)) {
        notes.push(note);
      }
      await route.fulfill({status: 204, headers});

      return;
    }

    if (url.pathname === "/api/notes" && request.method() === "PUT") {
      const note = noteOf(request.postDataJSON());
      const index = notes.findIndex(each => each.id === note?.id);

      if (!note || index < 0) {
        await route.fulfill({status: 404, headers});

        return;
      }
      notes[index] = note;
      await route.fulfill({status: 204, headers});

      return;
    }

    if (url.pathname === "/api/notes" && request.method() === "DELETE") {
      const {id} = idOf(request.postDataJSON());

      notes.splice(0, notes.length, ...notes.filter(each => each.id !== id));
      await route.fulfill({status: 204, headers});

      return;
    }

    if (url.pathname === "/api/speech") {
      await route.fulfill({status: 200, headers: {...headers, "content-type": "audio/mpeg"}, body: AUDIO});

      return;
    }

    await route.fulfill({status: 404, headers});
  };
}

/** What a request body said, where it said it, since a test double that trusts its input hides the mistakes it exists to find. */
function bodyOf(body: unknown): Body {
  if (typeof body !== "object" || body === null) {
    return {};
  }

  const {noteId, text} = body as Record<string, unknown>;

  return {
    noteId: typeof noteId === "string" ? noteId : undefined,
    text: typeof text === "string" ? text : undefined,
  };
}

interface NoteBody {
  readonly id: string;
  readonly word: string;
  readonly meaning: string;
  readonly romanisation: string;
}

function noteOf(body: unknown): NoteBody | undefined {
  if (typeof body !== "object" || body === null) {
    return undefined;
  }

  const {id, word, meaning, romanisation} = body as Record<string, unknown>;

  if (
    typeof id !== "string" ||
    typeof word !== "string" ||
    typeof meaning !== "string" ||
    typeof romanisation !== "string"
  ) {
    return undefined;
  }

  return {id, word, meaning, romanisation};
}

function idOf(body: unknown): {id?: string} {
  if (typeof body !== "object" || body === null) {
    return {};
  }

  const {id} = body as Record<string, unknown>;

  if (typeof id !== "string") {
    return {};
  }

  return {id};
}
