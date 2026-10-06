import {runtime} from "@src/environment/Runtime";

/**
 * A request to the API with the session cookie sent along (`credentials: "include"`): the cookie is `SameSite=Lax`, so the app and the
 * API must share a registrable domain, which `localhost` does and `workers.dev` does not.
 */
export async function apiRequest(path: string, init: RequestInit = {}): Promise<Response> {
  return await fetch(`${runtime.apiOrigin}${path}`, {...init, credentials: "include"});
}
