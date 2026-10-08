/** A request the worker may answer itself, with the page's way of ending it. */
export interface WorkerFetchEvent extends Event {
  readonly request: Request;
  readonly respondWith: (response: Promise<Response>) => void;
}
