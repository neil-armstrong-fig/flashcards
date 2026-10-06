import {apiRequest} from "@src/redux/api/ApiRequest";
import {okJson} from "@src/redux/api/OkJson";
import type {KeptNote} from "@src/redux/slices/account/types/KeptNote";

/** Keeps a card of the learner's own, online. */
export async function addKeptNote(note: KeptNote): Promise<void> {
  await okJson(
    await apiRequest("/api/notes", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(note),
    }),
  );
}
