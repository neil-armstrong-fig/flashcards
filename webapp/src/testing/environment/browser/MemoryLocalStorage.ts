/** What a browser's `localStorage` is to the app, held in memory: the part of it the app reads and writes. */
export class MemoryLocalStorage {
  private readonly items = new Map<string, string>();

  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.items.set(key, value);
  }
}
