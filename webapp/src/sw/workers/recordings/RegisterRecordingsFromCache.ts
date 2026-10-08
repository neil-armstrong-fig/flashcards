import {partialResponseOf} from "@src/sw/workers/recordings/partial-response/PartialResponseOf";
import type {WorkerScope} from "@src/sw/workers/shared/types/WorkerScope";

/**
 * Recordings are not part of the build. The page fetches each one from the API (signed in only), keeps it in the browser's cache and
 * plays it from the address it was kept under: `audio/...` for the ones recorded ahead of time (`audio/recordings/EnsureRecording.ts`)
 * and `kept-audio/...` for what the learner added (`audio/kept/KeptAudioPath.ts`). The worker answers those two paths from the
 * cache, in parts where the player asks for parts, and nothing else answers for them, so a miss is an error. Only this app's own
 * origin: the API's `/api/audio/...` is another origin and must reach the network.
 */
export function registerRecordingsFromCache(scope: WorkerScope): void {
  scope.addEventListener("fetch", event => {
    if (isOwnRecording(event.request, scope.location.origin)) {
      event.respondWith(recordingFromCache(event.request));
    }
  });
}

function isOwnRecording(request: Request, ownOrigin: string): boolean {
  const {origin, pathname} = new URL(request.url);

  return (
    request.method === "GET" &&
    origin === ownOrigin &&
    (pathname.startsWith("/audio/") || pathname.startsWith("/kept-audio/"))
  );
}

async function recordingFromCache(request: Request): Promise<Response> {
  const whole = await caches.match(request.url);

  if (whole === undefined) {
    return Response.error();
  }

  return await partialResponseOf(request, whole);
}
