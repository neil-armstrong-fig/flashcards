import {apiRequest} from "@src/redux/api/ApiRequest";
import {okJson} from "@src/redux/api/OkJson";

/** The email of whoever is signed in, or nothing where nobody is. Throws where the API cannot be reached. */
export async function readSignedInEmail(): Promise<string | undefined> {
  const response = await apiRequest("/api/me");

  if (response.status === 401) {
    return undefined;
  }

  const body: unknown = await okJson(response);

  if (typeof body !== "object" || body === null || !("email" in body) || typeof body.email !== "string") {
    throw new Error("The API did not say who is signed in.");
  }

  return body.email;
}
