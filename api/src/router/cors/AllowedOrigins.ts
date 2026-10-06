import {listFrom} from "@src/router/cors/ListFrom";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

/** The origins allowed to call the API with credentials: the site, plus the dev server locally (`ALLOWED_ORIGINS`). */
export function allowedOrigins(): readonly string[] {
  return listFrom(workerEnvironment.ALLOWED_ORIGINS);
}
