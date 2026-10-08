/** An event the worker can be held in until a promise settles, such as an activate or a push. */
export interface LifecycleEvent extends Event {
  readonly waitUntil: (promise: Promise<unknown>) => void;
}
