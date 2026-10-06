import {apiRequest} from "@src/redux/api/ApiRequest";
import {okJson} from "@src/redux/api/OkJson";
import type {KeptNote} from "@src/redux/slices/account/types/KeptNote";

/** Changes the words of a card kept online, by its id. Throws where there is no such card. */
export async function editKeptNote(note: KeptNote): Promise<void> {
  await okJson(
    await apiRequest("/api/notes", {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(note),
    }),
  );
}
