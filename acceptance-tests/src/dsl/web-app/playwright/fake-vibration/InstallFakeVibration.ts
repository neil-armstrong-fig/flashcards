/** What the fake vibration motor keeps on the page for the DSL to read back: the length of each buzz, in milliseconds. */
interface FakeVibration {
  readonly buzzes: number[];
}

declare global {
  interface Window {
    fakeVibration: FakeVibration;
  }
}

/**
 * Runs in the page before the app does, and replaces the phone's vibration motor: a buzz is written down instead of felt, so a
 * spec can tell that the app asked for one. It is serialised into the page, so it uses nothing from this file.
 */
export function installFakeVibration(): void {
  const buzzes: number[] = [];

  window.fakeVibration = {buzzes};

  Object.defineProperty(navigator, "vibrate", {
    configurable: true,
    value: (pattern: number): boolean => {
      buzzes.push(pattern);

      return true;
    },
  });
}
