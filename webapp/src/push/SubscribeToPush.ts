/**
 * Asks the learner to allow notifications and subscribes this device to the API's pushes. Gives back the address the push
 * service will deliver to, or nothing where this browser cannot push or the learner said no.
 */
export async function subscribeToPush(publicKey: string): Promise<string | undefined> {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    return undefined;
  }

  if ((await Notification.requestPermission()) !== "granted") {
    return undefined;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: keyBytes(publicKey),
  });

  return subscription.endpoint;
}

/** The bytes a push service wants for the server's public key, which the API hands over as base64url text. */
function keyBytes(publicKey: string): Uint8Array<ArrayBuffer> {
  const padded = publicKey
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(publicKey.length / 4) * 4, "=");

  return Uint8Array.from(atob(padded), character => character.charCodeAt(0));
}
