import {cleanupOutdatedCaches, precacheAndRoute} from "workbox-precaching";
import {registerRecordingsFromCache} from "@src/sw/workers/recordings/RegisterRecordingsFromCache";
import {registerReleaseUpdates} from "@src/sw/workers/release/RegisterReleaseUpdates";
import {registerReminderNotifications} from "@src/sw/workers/reminders/RegisterReminderNotifications";
import type {WorkerScope} from "@src/sw/workers/shared/types/WorkerScope";

declare const self: WorkerScope;

/**
 * The app's service worker: it precaches the build so the app works offline, and the rest is one folder a subject, each registering
 * its own listeners: `release/` (a new release waits for the update prompt), `recordings/` (audio answered from the cache) and
 * `reminders/` (the daily-goal notification).
 */
registerReleaseUpdates(self);
registerRecordingsFromCache(self);
registerReminderNotifications(self);

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
