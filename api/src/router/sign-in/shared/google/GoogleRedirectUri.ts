import {workerEnvironment} from "@src/env/WorkerEnvironment";

const LOCAL_APP_ORIGIN = "http://localhost:3000";
const LOCAL_API_ORIGIN = "http://localhost:8787";

/**
 * Where Google is told to send the person back: this API's own callback on whichever host the request arrived, the one registered
 * with Google, or the local proxy when the deployed API is serving the local app. Ordinary local API development gives it outright
 * (`GOOGLE_REDIRECT_URI`), since `wrangler dev` may report another host.
 */
export function googleRedirectUri(request: Request, returnTo: string): string {
  if (workerEnvironment.GOOGLE_REDIRECT_URI !== undefined) {
    return workerEnvironment.GOOGLE_REDIRECT_URI;
  }

  if (new URL(returnTo).origin === LOCAL_APP_ORIGIN) {
    return `${LOCAL_API_ORIGIN}/api/auth/google/callback`;
  }

  return `${new URL(request.url).origin}/api/auth/google/callback`;
}
