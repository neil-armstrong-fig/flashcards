/** Whether this browser can be pushed to: it needs notifications, a service worker and a push manager (an iPhone's browser has them only for an installed app). */
export function canPush(): boolean {
  return "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
}
