import {apiRequest} from "@src/redux/api/ApiRequest";
import {okJson} from "@src/redux/api/OkJson";
import {readSyncAnswer} from "@src/redux/api/sync-with-api/utils/ReadSyncAnswer";
import type {SyncAnswer} from "@src/redux/api/types/SyncAnswer";
import type {SyncRequest} from "@src/redux/api/types/SyncRequest";

/** Sends what this device has done, chosen and made and asks for what has happened since the cursors it sends. What comes back is checked before it is believed (`readSyncAnswer`). */
export async function syncWithApi(request: SyncRequest): Promise<SyncAnswer> {
  const answer = readSyncAnswer(
    await okJson(
      await apiRequest("/api/sync", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(request),
      }),
    ),
  );

  if (answer === undefined) {
    throw new Error("The API did not answer the sync in a form that can be read.");
  }

  return answer;
}
