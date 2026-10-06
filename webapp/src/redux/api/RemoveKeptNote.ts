import {apiRequest} from "@src/redux/api/ApiRequest";
import {okJson} from "@src/redux/api/OkJson";

/** Deletes a card, and the similar words kept with it, online. */
export async function removeKeptNote(id: string): Promise<void> {
  await okJson(
    await apiRequest("/api/notes", {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({id}),
    }),
  );
}
