import type {LifecycleEvent} from "@src/sw/workers/shared/types/LifecycleEvent";
import type {NotificationClickEvent} from "@src/sw/workers/shared/types/NotificationClickEvent";
import type {OpenWindow} from "@src/sw/workers/shared/types/OpenWindow";
import type {PrecacheEntry} from "workbox-precaching";
import type {WorkerFetchEvent} from "@src/sw/workers/shared/types/WorkerFetchEvent";
import type {WorkerMessageEvent} from "@src/sw/workers/shared/types/WorkerMessageEvent";

/**
 * The part of the worker's own global the worker's files touch, and the precache list vite-plugin-pwa writes into it at build
 * time. Declared here rather than taken from the `WebWorker` lib, which cannot sit in the same program as the `DOM` lib
 * the rest of the app compiles against. `ServiceWorker.ts` declares `self` as this and hands it to each `register…` function.
 */
export interface WorkerScope {
  readonly __WB_MANIFEST: (string | PrecacheEntry)[];
  readonly clients: {
    readonly claim: () => Promise<void>;
    readonly matchAll: (options: {readonly type: "window"}) => Promise<readonly OpenWindow[]>;
    readonly openWindow: (url: string) => Promise<unknown>;
  };
  readonly registration: {
    readonly showNotification: (title: string, options: {readonly body: string; readonly tag: string}) => Promise<void>;
  };
  readonly location: {readonly origin: string};
  readonly skipWaiting: () => Promise<void>;
  readonly addEventListener: {
    (type: "activate", listener: (event: LifecycleEvent) => void): void;
    (type: "message", listener: (event: WorkerMessageEvent) => void): void;
    (type: "fetch", listener: (event: WorkerFetchEvent) => void): void;
    (type: "push", listener: (event: LifecycleEvent) => void): void;
    (type: "notificationclick", listener: (event: NotificationClickEvent) => void): void;
  };
}
