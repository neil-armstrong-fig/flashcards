/** The API and the browser's cache of recordings, in memory for a test: keeps them, writes down what was fetched, and can be told to fail. */
export class MemoryRecordingKeeper {
  readonly kept = new Set<string>();
  readonly fetched: string[] = [];
  failing = false;

  async ensure(path: string): Promise<boolean> {
    if (this.kept.has(path)) {
      return true;
    }

    if (this.failing) {
      return false;
    }

    this.fetched.push(path);
    this.kept.add(path);

    return true;
  }

  async countKept(paths: readonly string[]): Promise<number> {
    return paths.filter(path => this.kept.has(path)).length;
  }

  async forgetAll(): Promise<void> {
    this.kept.clear();
  }
}
