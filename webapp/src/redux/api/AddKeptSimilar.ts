import {apiRequest} from "@src/redux/api/ApiRequest";
import {okJson} from "@src/redux/api/OkJson";

/** Keeps a similar word with a note, online. */
export async function addKeptSimilar(noteId: string, text: string): Promise<void> {
  await okJson(
    await apiRequest("/api/similar", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({noteId, text}),
    }),
  );
}
