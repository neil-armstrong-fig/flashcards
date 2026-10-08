/** One push subscription as the fake push service hands it out. */
interface FakePushSubscription {
  readonly endpoint: string;
}

declare global {
  interface Window {
    fakePush: {readonly asked: number};
  }
}

/**
 * Runs in the page before the app does, and replaces the browser's push service: a real one needs the network and a push
 * vendor, and a run reaches neither. The learner has allowed notifications, and subscribing hands back the same address every
 * time, kept across reloads as a browser would. It is serialised into the page, so it uses nothing from this file.
 */
export function installFakePush(): void {
  const SUBSCRIPTION_KEY = "fake-push-subscription";
  let asked = 0;

  window.fakePush = {
    get asked(): number {
      return asked;
    },
  };

  Object.defineProperty(Notification, "permission", {configurable: true, get: () => "granted"});
  Object.defineProperty(Notification, "requestPermission", {
    configurable: true,
    value: (): Promise<NotificationPermission> => {
      asked += 1;

      return Promise.resolve("granted");
    },
  });

  const subscription = (): FakePushSubscription | undefined => {
    const stored = localStorage.getItem(SUBSCRIPTION_KEY);

    if (stored === null) {
      return undefined;
    }

    return {endpoint: stored};
  };

  const pushManager = {
    getSubscription: (): Promise<unknown> => {
      const current = subscription();

      return Promise.resolve(current && fakeSubscription(current.endpoint));
    },
    subscribe: (): Promise<unknown> => {
      const endpoint = "https://push.example.test/send/learner-device";

      localStorage.setItem(SUBSCRIPTION_KEY, endpoint);

      return Promise.resolve(fakeSubscription(endpoint));
    },
  };

  function fakeSubscription(endpoint: string): unknown {
    return {
      endpoint,
      toJSON: () => ({endpoint}),
      unsubscribe: (): Promise<boolean> => {
        localStorage.removeItem(SUBSCRIPTION_KEY);

        return Promise.resolve(true);
      },
    };
  }

  // The real worker's registration stays, so what else needs it (a new release) works: only its push manager is the fake.
  Object.defineProperty(ServiceWorkerRegistration.prototype, "pushManager", {
    configurable: true,
    get: () => pushManager,
  });
}
