import type {WorkerScope} from "@src/sw/workers/shared/types/WorkerScope";

/**
 * A new release waits until the page's update prompt asks it to take over, so one coherent release is in use until the learner is
 * ready; once active, the worker takes over every open page.
 */
export function registerReleaseUpdates(scope: WorkerScope): void {
  scope.addEventListener("message", event => {
    if (isSkipWaitingMessage(event.data)) {
      void scope.skipWaiting();
    }
  });

  scope.addEventListener("activate", event => {
    event.waitUntil(scope.clients.claim());
  });
}

function isSkipWaitingMessage(message: unknown): boolean {
  return typeof message === "object" && message !== null && "type" in message && message.type === "SKIP_WAITING";
}
