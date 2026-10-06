import {clearedSessionCookie} from "@src/router/session/cookie/ClearedSessionCookie";
import {deleteSession} from "@src/database/sessions/DeleteSession";
import {hashSessionToken} from "@src/router/session/HashSessionToken";
import {respondEmpty} from "@src/router/respond/RespondEmpty";
import {headerOf} from "@src/router/request/HeaderOf";
import {sessionTokenFrom} from "@src/router/session/SessionTokenFrom";

/**
 * `POST /api/auth/logout`: ends the session the request carries, and the cookie with it. Succeeds for a request that carries none:
 * somebody already signed out has nothing left to end, and telling them so would only be an error to show.
 */
export async function logOut(request: Request): Promise<Response> {
  const token = sessionTokenFrom(headerOf(request, "Cookie"));

  if (token !== undefined) {
    await deleteSession(await hashSessionToken(token));
  }

  const response = respondEmpty(204);

  response.headers.append("Set-Cookie", clearedSessionCookie());

  return response;
}
