const reported = new Set<string>();

/** Keeps `value` under `key` on this device. A refusal (quota, blocked storage) is reported once per key and then ignored: the learner carries on. */
export function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    if (reported.has(key)) {
      return;
    }

    reported.add(key);
    console.error(`"${key}" could not be kept on this device.`, error);
  }
}
