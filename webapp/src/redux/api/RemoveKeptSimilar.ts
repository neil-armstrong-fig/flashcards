import {apiRequest} from "@src/redux/api/ApiRequest";
import {okJson} from "@src/redux/api/OkJson";

/** Takes a similar word off a note, online. */
export async function removeKeptSimilar(noteId: string, text: string): Promise<void> {
  await okJson(
    await apiRequest("/api/similar", {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({noteId, text}),
    }),
  );
}
