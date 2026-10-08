import type {WorkerScope} from "@src/sw/workers/shared/types/WorkerScope";

/**
 * The reminder to reach the daily goal. The push carries no message of its own (`docs/reminders.md`): the worker says the same thing
 * every time, and one reminder replaces the last rather than stacking. Tapping it brings the app forward, or opens it.
 */
export function registerReminderNotifications(scope: WorkerScope): void {
  scope.addEventListener("push", event => {
    event.waitUntil(
      scope.registration.showNotification("Flash Cards", {body: "You have flash cards to finish!", tag: "daily-goal"}),
    );
  });

  scope.addEventListener("notificationclick", event => {
    event.notification.close();
    event.waitUntil(openTheApp(scope));
  });
}

async function openTheApp(scope: WorkerScope): Promise<unknown> {
  const [open] = await scope.clients.matchAll({type: "window"});

  if (open) {
    return await open.focus();
  }

  return await scope.clients.openWindow("/");
}
