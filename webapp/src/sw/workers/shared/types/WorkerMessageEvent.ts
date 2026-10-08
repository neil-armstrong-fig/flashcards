/** A message sent from a page to the worker waiting behind the active release. */
export interface WorkerMessageEvent extends Event {
  readonly data: unknown;
}
