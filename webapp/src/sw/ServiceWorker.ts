import {cleanupOutdatedCaches, precacheAndRoute} from "workbox-precaching";
import {partialResponseOf} from "@src/sw/partial-response/PartialResponseOf";
import type {PrecacheEntry} from "workbox-precaching";

/** A message sent from a page to the worker waiting behind the active release. */
interface WorkerMessageEvent extends Event {
  readonly data: unknown;
}

/** An activate event, which can hold the worker in that phase until a promise settles. */
interface LifecycleEvent extends Event {
  readonly waitUntil: (promise: Promise<unknown>) => void;
}

/** A request the worker may answer itself, with the page's way of ending it. */
interface WorkerFetchEvent extends Event {
  readonly request: Request;
  readonly respondWith: (response: Promise<Response>) => void;
}

/**
 * The part of the worker's own global this file touches, and the precache list vite-plugin-pwa writes into it at build
 * time. Declared here rather than taken from the `WebWorker` lib, which cannot sit in the same program as the `DOM` lib
 * the rest of the app compiles against.
 */
interface WorkerScope {
  readonly __WB_MANIFEST: (string | PrecacheEntry)[];
  readonly clients: {readonly claim: () => Promise<void>};
  readonly location: {readonly origin: string};
  readonly skipWaiting: () => Promise<void>;
  readonly addEventListener: {
    (type: "activate", listener: (event: LifecycleEvent) => void): void;
    (type: "message", listener: (event: WorkerMessageEvent) => void): void;
    (type: "fetch", listener: (event: WorkerFetchEvent) => void): void;
  };
}

declare const self: WorkerScope;

/**
 * The app's service worker: it precaches the build so the app works offline. A new release waits until the page's update
 * prompt asks it to take over, so one coherent release is in use until the learner is ready.
 */
self.addEventListener("message", event => {
  if (isSkipWaitingMessage(event.data)) {
    void self.skipWaiting();
  }
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Recordings are not part of the build. The page fetches each one from the API (signed in only), keeps it in the browser's cache and
// plays it from the address it was kept under: `audio/...` for the ones recorded ahead of time (`audio/recordings/EnsureRecording.ts`)
// and `kept-audio/...` for what the learner added (`audio/kept/KeptAudioPath.ts`). The worker answers those two paths from the
// cache, in parts where the player asks for parts, and nothing else answers for them, so a miss is an error. Only this app's own
// origin: the API's `/api/audio/...` is another origin and must reach the network.
self.addEventListener("fetch", event => {
  if (isOwnRecording(event.request)) {
    event.respondWith(recordingFromCache(event.request));
  }
});

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

function isSkipWaitingMessage(message: unknown): boolean {
  return typeof message === "object" && message !== null && "type" in message && message.type === "SKIP_WAITING";
}

function isOwnRecording(request: Request): boolean {
  const {origin, pathname} = new URL(request.url);

  return (
    request.method === "GET" &&
    origin === self.location.origin &&
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
