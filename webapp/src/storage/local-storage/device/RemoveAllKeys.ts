const KEY_PREFIX = "flashcards.";

/** Removes everything this app keeps in localStorage, which is every key that starts `flashcards.`, and nothing another site or tool keeps. */
export function removeAllKeys(): void {
  try {
    const keys: string[] = [];

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);

      if (key?.startsWith(KEY_PREFIX)) {
        keys.push(key);
      }
    }

    for (const key of keys) {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error("The settings kept on this device could not be removed.", error);
  }
}
