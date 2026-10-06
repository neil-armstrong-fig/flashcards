/** What is stored under `key`, as `unknown` until the caller has checked it. Missing, unreadable, blocked or invalid JSON is `undefined`. */
export function readJson(key: string): unknown {
  try {
    const stored = localStorage.getItem(key);

    if (stored === null) {
      return undefined;
    }

    return JSON.parse(stored) as unknown;
  } catch {
    return undefined;
  }
}
