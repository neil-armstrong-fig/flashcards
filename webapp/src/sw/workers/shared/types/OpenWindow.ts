/** A window of the app that is open. */
export interface OpenWindow {
  readonly focus: () => Promise<unknown>;
}
