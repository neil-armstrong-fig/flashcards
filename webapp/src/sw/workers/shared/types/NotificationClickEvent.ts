import type {LifecycleEvent} from "@src/sw/workers/shared/types/LifecycleEvent";

/** A tap on a notification the worker showed. */
export interface NotificationClickEvent extends LifecycleEvent {
  readonly notification: {readonly close: () => void};
}
