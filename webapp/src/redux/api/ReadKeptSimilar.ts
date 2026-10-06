import {apiRequest} from "@src/redux/api/ApiRequest";
import {isKeptWords} from "@src/redux/slices/account/types/KeptWords";
import {okJson} from "@src/redux/api/OkJson";
import type {KeptWords} from "@src/redux/slices/account/types/KeptWords";

/** The similar words kept for whoever is signed in, by note. */
export async function readKeptSimilar(): Promise<KeptWords> {
  const body: unknown = await okJson(await apiRequest("/api/similar"));

  if (typeof body !== "object" || body === null || !("words" in body) || !isKeptWords(body.words)) {
    throw new Error("The API did not give the kept words in a form that can be read.");
  }

  return body.words;
}
