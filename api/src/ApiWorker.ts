import {missingSecrets} from "@src/env/MissingSecrets";
import {routeRequest} from "@src/router/RouteRequest";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

// Cloudflare requires the Worker module to be the default export.
export default {
  async fetch(request: Request): Promise<Response> {
    const missing = missingSecrets(workerEnvironment);

    if (missing.length > 0) {
      console.error(`The API is missing ${missing.join(" and ")}: set it with \`wrangler secret put\`.`);

      return new Response(null, {status: 500});
    }

    return await routeRequest(request);
  },
} satisfies ExportedHandler;
