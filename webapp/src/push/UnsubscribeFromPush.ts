/** Ends this device's push subscription, giving back the address it had, or nothing where it had none. */
export async function unsubscribeFromPush(): Promise<string | undefined> {
  if (!("serviceWorker" in navigator)) {
    return undefined;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    return undefined;
  }

  await subscription.unsubscribe();

  return subscription.endpoint;
}
