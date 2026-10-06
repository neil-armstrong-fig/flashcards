import {apiRequest} from "@src/redux/api/ApiRequest";
import {okJson} from "@src/redux/api/OkJson";

/** Ends the session on the API's side. */
export async function endApiSession(): Promise<void> {
  await okJson(await apiRequest("/api/auth/logout", {method: "POST"}));
}
